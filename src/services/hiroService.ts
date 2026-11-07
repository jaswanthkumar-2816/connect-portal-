// ============================================================
// HieroConnect — HIERO Integration Service
// ============================================================
// This is the abstraction layer between HieroConnect and HIERO.
// Currently returns demo data. When the real HIERO API is ready,
// replace the implementation below with actual API calls.
// ============================================================

import type {
  Candidate,
  Application,
  DashboardStats,
  MatchResult,
  Opportunity,
  Company,
  SkillRequirement,
  PracticeAttempt,
  PracticeRecord,
  PracticeSkillTrend,
} from '../types';
import { getAuthToken } from '../store/authStore';
import { GATEWAY_URL, INTERVIEW_API_URL } from '../lib/endpoints';
import { candidateInterviewUrl } from '../lib/interviewLink';
import {
  demoCandidates,
  demoApplications,
  demoDashboardStats,
  demoCompanies,
  demoOpportunities,
  bridgeCandidates,
  generateMatchResults,
} from '../data/demo';

// --- Simulate network delay ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const PYTHON_BACKEND_URL = import.meta.env.VITE_PYTHON_BACKEND_URL || 'http://localhost:5050';
const BRIDGE_URL = import.meta.env.VITE_BRIDGE_URL || 'http://localhost:2410';
const CONNECT_API_KEY = import.meta.env.VITE_CONNECT_API_KEY || '';

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { ...(extra || {}) };
  // When the gateway is reached over an ngrok tunnel, a plain browser request
  // gets ngrok's warning page instead of the API response. The header opts
  // out of it; on any other host it is simply ignored.
  headers['ngrok-skip-browser-warning'] = 'true';
  // The signed-in recruiter's token identifies the company to the gateway.
  // It takes precedence over the shared API key, which says nothing about
  // who is asking.
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (CONNECT_API_KEY) {
    headers.Authorization = `Bearer ${CONNECT_API_KEY}`;
  }
  if (CONNECT_API_KEY) {
    headers['x-api-key'] = CONNECT_API_KEY;
  }
  return headers;
}

/**
 * The interview service, which is not the gateway and does not take the
 * recruiter's gateway token. It authenticates the portal itself with the
 * shared key — these are recruiter-side routes, and the candidate-side ones
 * are reached from interviewService with a token instead.
 */
async function fetchInterviewApi(
  path: string,
  ms: number,
  init?: RequestInit
): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  const token = getAuthToken();
  try {
    return await fetch(`${INTERVIEW_API_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        // The recruiter's own token, which the interview service checks with
        // the gateway. Never the shared API key: anything in a VITE_
        // variable is compiled into the bundle every candidate downloads,
        // and these routes mint interviews and return assessments.
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: controller.signal,
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWithTimeout(url: string, ms = 2500, init?: RequestInit): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const headers = authHeaders(init?.headers as Record<string, string> | undefined);
    return await fetch(url, { ...init, headers, signal: controller.signal });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function currentCompany(): { id?: string; name?: string } {
  try {
    const u = JSON.parse(localStorage.getItem('hc_user') || 'null');
    return { id: u?.companyId, name: u?.companyName };
  } catch {
    return {};
  }
}

function sameCompanyName(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function opportunityBelongsToCompany(o: any, companyId?: string, companyName?: string): boolean {
  if (companyId && o?.companyId && o.companyId === companyId) return true;
  if (sameCompanyName(o?.companyName || o?.company, companyName)) return true;
  return false;
}

function withCompanyFields(o: any) {
  if (!o) return null;
  return {
    ...o,
    id: o.id || o._id || o.opportunityId || o.oppId,
    companyId: o.companyId || o.company_id || '',
    companyName: o.companyName || o.company_name || o.company || '',
  };
}

function parseMatchScore(raw: any): number | undefined {
  const v = raw?.match_score ?? raw?.matchScore;
  if (v === null || v === undefined || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function asSkillChips(raw: any): { name: string; score: number }[] {
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : [];
  return arr.map((s: any) => {
    if (typeof s === 'string') return s.trim() ? { name: s.trim(), score: 0 } : null;
    const name = String(s?.name || s?.skill || '').trim();
    if (!name) return null;
    const score = typeof s.score === 'number' ? s.score : (typeof s.competency === 'number' ? s.competency : 0);
    return { name, score };
  }).filter(Boolean) as { name: string; score: number }[];
}

function normalizeAppStatus(status: any): Application['status'] {
  const v = String(status || '').toLowerCase().replace(/[_\s]+/g, '-');
  if (v.includes('short')) return 'shortlisted';
  if (v.includes('reject')) return 'rejected';
  if (v.includes('select') || v === 'hired') return 'selected';
  if (v.includes('interview')) return 'interview';
  if (v.includes('review')) return 'under-review';
  if (v === 'applied' || v === 'under-review' || v === 'shortlisted' || v === 'interview' || v === 'selected' || v === 'rejected') {
    return v as Application['status'];
  }
  return 'applied';
}

export interface College {
  id: string;
  name: string;
  code?: string;
  location?: string;
  tier?: string;
  currentBatch?: string;
  departments?: { id: string; name: string; code?: string; totalStudents?: number }[];
  coordinators?: { id: string; name: string; email: string; dept: string }[];
  totalStudents?: number;
  totalApplications?: number;
}

export async function getColleges(): Promise<College[]> {
  try {
    const res = await fetchWithTimeout(`${BRIDGE_URL}/api/connect/colleges`, 3000);
    if (res?.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.colleges) && data.colleges.length > 0) {
        return data.colleges;
      }
    }
  } catch (e) {}

  return [
    {
      id: 'NITW-IN',
      name: 'National Institute of Technology, Warangal',
      code: 'NITW-IN',
      location: 'Warangal, Telangana, India',
      tier: 'Tier-1 Premier Autonomous Institution',
      currentBatch: '2022-2026',
      departments: [
        { id: 'CSE', name: 'Computer Science & Engineering', code: 'CSE', totalStudents: 140 },
        { id: 'AIML', name: 'Artificial Intelligence & Machine Learning', code: 'AIML', totalStudents: 75 },
        { id: 'IT', name: 'Information Technology', code: 'IT', totalStudents: 80 },
        { id: 'ECE', name: 'Electronics & Communication Engineering', code: 'ECE', totalStudents: 120 },
        { id: 'MECH', name: 'Mechanical Engineering', code: 'MECH', totalStudents: 90 }
      ],
      coordinators: [
        { id: 'COORD-01', name: 'Dr. Ramesh Kulkarni', email: 'ramesh.tpo@college.edu', dept: 'Head of Placement' }
      ],
      totalStudents: 10,
      totalApplications: 10,
    },
    {
      id: 'IITH-IN',
      name: 'Indian Institute of Technology, Hyderabad',
      code: 'IITH-IN',
      location: 'Kandi, Sangareddy, Telangana, India',
      tier: 'Institute of National Importance (Tier-1)',
      currentBatch: '2022-2026',
      departments: [
        { id: 'CSE', name: 'Computer Science & Engineering', code: 'CSE', totalStudents: 120 },
        { id: 'AI', name: 'Department of Artificial Intelligence', code: 'AI', totalStudents: 60 },
        { id: 'EE', name: 'Electrical Engineering', code: 'EE', totalStudents: 90 }
      ],
      coordinators: [
        { id: 'COORD-02', name: 'Prof. S. Rajagopalan', email: 'rajagopalan.tpo@iith.ac.in', dept: 'Dean of Industrial Relations' }
      ],
      totalStudents: 10,
      totalApplications: 10,
    },
    {
      id: 'BITS-PILANI',
      name: 'Birla Institute of Technology and Science, Pilani',
      code: 'BITS-PILANI',
      location: 'Pilani, Rajasthan & Hyderabad Campus, India',
      tier: 'Premier Deemed University & Institution of Eminence',
      currentBatch: '2022-2026',
      departments: [
        { id: 'CS', name: 'Computer Science', code: 'CS', totalStudents: 180 },
        { id: 'EEE', name: 'Electrical & Electronics', code: 'EEE', totalStudents: 150 },
        { id: 'DS', name: 'Data Science & FinTech', code: 'DS', totalStudents: 85 }
      ],
      coordinators: [
        { id: 'COORD-03', name: 'Dr. Manish Kumar', email: 'manish.tpo@pilani.bits-pilani.ac.in', dept: 'Chief Placement Officer' }
      ],
      totalStudents: 10,
      totalApplications: 10,
    },
    {
      id: 'NITK-IN',
      name: 'National Institute of Technology, Surathkal',
      code: 'NITK-IN',
      location: 'Mangalore, Karnataka, India',
      tier: 'Institute of National Importance (Tier-1)',
      currentBatch: '2022-2026',
      departments: [
        { id: 'CSE', name: 'Computer Science & Engineering', code: 'CSE', totalStudents: 135 },
        { id: 'IT', name: 'Information Technology', code: 'IT', totalStudents: 85 },
        { id: 'AIML', name: 'Artificial Intelligence', code: 'AIML', totalStudents: 65 }
      ],
      coordinators: [
        { id: 'COORD-04', name: 'Dr. Vijayendra Kumar', email: 'vijayendra.tpo@nitk.edu.in', dept: 'Head, Career Development Centre' }
      ],
      totalStudents: 10,
      totalApplications: 10,
    },
    {
      id: 'DTU-DELHI',
      name: 'Delhi Technological University',
      code: 'DTU-DELHI',
      location: 'Rohini, New Delhi, India',
      tier: 'Premier State Technical University',
      currentBatch: '2022-2026',
      departments: [
        { id: 'CSE', name: 'Computer Science & Engineering', code: 'CSE', totalStudents: 220 },
        { id: 'IT', name: 'Information Technology', code: 'IT', totalStudents: 140 },
        { id: 'SE', name: 'Software Engineering', code: 'SE', totalStudents: 110 }
      ],
      coordinators: [
        { id: 'COORD-05', name: 'Prof. Rajesh Rohilla', email: 'rajesh.tpo@dtu.ac.in', dept: 'Head, Training & Placement' }
      ],
      totalStudents: 10,
      totalApplications: 10,
    }
  ];
}

function skillNames(skills?: { name: string }[] | string[]): string[] {
  if (!skills) return [];
  return skills
    .map(s => (typeof s === 'string' ? s : s?.name))
    .filter((n): n is string => Boolean(n));
}

// In-memory + LocalStorage custom opportunity store helper
function getStoredCustomOpps(): Opportunity[] {
  try {
    const s = localStorage.getItem('hc_custom_opportunities');
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function saveCustomOpp(opp: Opportunity) {
  try {
    const list = getStoredCustomOpps();
    list.unshift(opp);
    localStorage.setItem('hc_custom_opportunities', JSON.stringify(list));
  } catch {
    // ignore
  }
}

// --- Candidate Operations ---
export async function getCandidates(): Promise<Candidate[]> {
  try {
    const res = await fetchWithTimeout(`${BRIDGE_URL}/api/connect/candidates`, 3000);
    if (res?.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.candidates) && data.candidates.length > 0) {
        const liveCandidates: Candidate[] = data.candidates.map((c: any) => ({
          id: c.id || c.regNo,
          name: c.name,
          email: c.email,
          phone: c.phone || '+91-9876543210',
          avatar: c.avatar,
          headline: `${c.department || 'CSE'} Final Year • ${c.campusName || c.collegeName || 'Tier-1 Partner College'}`,
          bio: `Verified collegiate engineering candidate with expertise in ${(c.skills || []).slice(0, 3).join(', ')}.`,
          location: c.campusLocation || 'India',
          skills: (c.skills || []).map((s: string) => ({
            name: s,
            competency: Math.min(95, Math.max(75, Math.floor((c.cgpa || 8) * 10))),
            verified: true,
            lastAssessedAt: new Date().toISOString()
          })),
          projects: (c.projects || []).map((p: any) => ({
            title: p.title,
            tech: p.tech,
            link: p.link,
            url: p.link
          })),
          education: [{
            institution: c.campusName || c.collegeName || 'National Institute of Technology, Warangal',
            degree: 'Bachelor of Technology',
            field: c.department || 'Computer Science',
            startYear: 2022,
            endYear: 2026,
            cgpa: c.cgpa
          }],
          experience: [],
          resumeUrl: c.resumeUrl || `https://hiero.io/resumes/${c.regNo || c.id}.pdf`,
          hieroScore: Math.min(99, Math.round((c.cgpa || 8.0) * 10 + 6)),
          availability: 'Immediate (2026 Batch)',
          preferredWorkMode: 'hybrid',
          preferredLocations: ['Bengaluru', 'Hyderabad'],
          createdAt: c.academicYear ? '2026-08-01' : new Date().toISOString(),
          campusName: c.campusName || c.collegeName,
          cgpa: c.cgpa,
          department: c.department,
          placementStatus: c.placementStatus,
          verificationStatus: c.verificationStatus || 'Verified'
        }));
        return liveCandidates;
      }
    }
  } catch (e) {
    // fallback to demo data
  }
  await delay(150);
  return [...demoCandidates, ...bridgeCandidates];
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
  await delay(100);
  const list = await getCandidates();
  const found = list.find(c => c.id === id || (c as any).studentId === id || (c as any).regNo === id);
  if (found) return found;

  // No `?? list[0]`. That fallback handed back whoever happened to be first
  // in the directory whenever a lookup missed — so opening a direct
  // applicant, who is not in the campus directory at all, showed a different
  // person's name, email, phone, CGPA and practice record as if it were
  // theirs. A miss is a miss.
  //
  // A direct applicant does have a profile; it just lives on the application
  // they sent rather than in the directory.
  const apps = await getApplications();
  const app = apps.find(
    a => a.studentId === id || String(a.email || '').toLowerCase() === String(id).toLowerCase()
  );
  if (!app) return null;

  const profile: any = (app as any).profile || {};
  const skills: string[] = Array.isArray(profile.skills) ? profile.skills : [];

  return {
    id: app.studentId || String(app.email || ''),
    name: app.studentName || profile.fullName || String(app.email || 'Applicant'),
    email: app.email || profile.email || '',
    phone: app.phone || profile.phone || '',
    location: profile.city || '',
    headline: profile.headline || app.jobTitle || '',
    about: profile.about || profile.experienceSummary || '',
    skills: skills.map((name: string) => ({ name, score: 0, category: 'required' })),
    resumeUrl: app.resumeUrl || '',
    education: [],
    experience: [],
    projects: [],
    appliedVia: 'application',
  } as unknown as Candidate;
}


// --- Opportunity Operations ---
export async function getOpportunities(companyId?: string): Promise<Opportunity[]> {
  await delay(300);
  let liveBackendOpps: Opportunity[] = [];
  try {
    const res = await fetchWithTimeout(`${PYTHON_BACKEND_URL}/api/opportunities`);
    if (res?.ok) {
      const data = await res.json();
      if (data.success && data.opportunities) {
        liveBackendOpps.push(...data.opportunities);
      }
    }
  } catch (e) {}

  try {
    const res = await fetchWithTimeout(`${GATEWAY_URL}/api/opportunities`);
    if (res?.ok) {
      const data = await res.json();
      if (data.success && data.opportunities) {
        liveBackendOpps.push(...data.opportunities);
      }
    }
  } catch (e) {}

  const custom = getStoredCustomOpps();
  const oppMap = new Map();
  [...liveBackendOpps, ...custom].forEach(o => {
    const normalized = withCompanyFields(o);
    if (!normalized?.id) return;
    const prev = oppMap.get(normalized.id);
    oppMap.set(
      normalized.id,
      prev
        ? {
            ...prev,
            ...normalized,
            companyId: normalized.companyId || prev.companyId,
            companyName: normalized.companyName || prev.companyName,
          }
        : normalized
    );
  });

  const allOpps = Array.from(oppMap.values());
  const scopeId = companyId || currentCompany().id;
  const scopeName = currentCompany().name;
  if (scopeId || scopeName) {
    return allOpps.filter(o => opportunityBelongsToCompany(o, scopeId, scopeName));
  }
  return allOpps;
}

export async function getAllOpportunities(): Promise<Opportunity[]> {
  return getOpportunities();
}

export async function createOpportunity(
  data: Partial<Opportunity>,
  companyId: string
): Promise<Opportunity> {
  await delay(400);
  const newOpp: Opportunity = {
    id: `j-${Date.now()}`,
    companyId,
    companyName: data.companyName || currentCompany().name,
    type: data.type || 'internship',
    title: data.title || 'Software Developer Intern',
    department: data.department || 'Engineering',
    description: data.description || '',
    requiredSkills: data.requiredSkills || [],
    preferredSkills: data.preferredSkills || [],
    eligibility: data.eligibility || 'B.Tech/BE',
    location: data.location || 'Bangalore, India',
    workMode: data.workMode || 'hybrid',
    employmentType: data.employmentType || (
      data.type === 'project' ? 'Project'
        : data.type === 'apprenticeship' ? 'Apprenticeship'
          : data.type === 'full-time' ? 'Full-time'
            : 'Internship'
    ),
    salary: data.salary || '₹25,000/mo',
    deadline: data.deadline || '2026-10-30',
    status: 'active',
    applicantsCount: 0,
    shortlistedCount: 0,
    createdAt: new Date().toISOString().split('T')[0],
  };
  saveCustomOpp(newOpp);

  // Sync with Hiero Gateway API (http://localhost:2816)
  try {
    let companyName = newOpp.companyName || data.companyName || currentCompany().name || '';
    if (!companyName) {
      try {
        const storedComps = JSON.parse(localStorage.getItem('hc_custom_companies') || '[]');
        const foundCustom = storedComps.find((c: any) => c.id === companyId);
        if (foundCustom && foundCustom.name) companyName = foundCustom.name;
      } catch (e) {}
    }
    if (!companyName) {
      const foundDemo = demoCompanies.find(c => c.id === companyId);
      if (foundDemo && foundDemo.name) companyName = foundDemo.name;
    }
    if (!companyName) companyName = 'Verified HR Partner';

    let logoUrl = (data as any).logoUrl || '';
    if (!logoUrl) {
      try {
        const storedComps = JSON.parse(localStorage.getItem('hc_custom_companies') || '[]');
        const foundCustom = storedComps.find((c: any) => c.id === companyId || (c.name && c.name.toLowerCase() === companyName.toLowerCase()));
        if (foundCustom && foundCustom.logoUrl) logoUrl = foundCustom.logoUrl;
      } catch (e) {}
    }
    if (!logoUrl) {
      try {
        const uStr = localStorage.getItem('hc_user');
        if (uStr) {
          const uObj = JSON.parse(uStr);
          if (uObj.logoUrl) logoUrl = uObj.logoUrl;
        }
      } catch (e) {}
    }

    (newOpp as any).logoUrl = logoUrl;
    (newOpp as any).companyName = companyName;

    const payload = {
      ...newOpp,
      companyName,
      company: companyName,
      logoUrl,
      companyDescription: '',
      location: newOpp.location,
      ctc: newOpp.salary,
      salary: newOpp.salary,
    };

    const postJson = (url: string, body: unknown) =>
      fetchWithTimeout(url, 8000, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

    const bridgePayload = {
      ...payload,
      requiredSkills: skillNames(newOpp.requiredSkills),
      preferredSkills: skillNames(newOpp.preferredSkills),
    };

    // Fan-out so the same job appears on HIERO (2816) and Bridge (2410).
    const [hieroRes, bridgeRes, hubRes] = await Promise.all([
      postJson(`${GATEWAY_URL}/api/opportunities`, payload),
      postJson(`${BRIDGE_URL}/api/connect/opportunities/publish`, bridgePayload),
      postJson(`${PYTHON_BACKEND_URL}/api/opportunities`, payload),
    ]);

    if (hieroRes?.ok) {
      console.log(`✅ Published "${newOpp.title}" to HIERO Gateway (2816)`);
    } else {
      console.warn('⚠️ HIERO Gateway (2816) did not accept the opportunity');
    }

    if (bridgeRes?.ok) {
      console.log(`✅ Published "${newOpp.title}" to HIERO Bridge (2410)`);
    } else {
      console.warn('⚠️ HIERO Bridge (2410) did not accept the opportunity');
    }

    if (hubRes?.ok) {
      console.log(`✅ Stored "${newOpp.title}" on Python hub (5050)`);
    } else {
      console.warn('⚠️ Python hub (5050) did not accept the opportunity');
    }
  } catch (err) {
    console.warn('⚠️ [HIERO Sync] Network fallback to local storage:', err);
  }

  return newOpp;
}

export async function getOpportunityById(id: string): Promise<Opportunity | null> {
  await delay(150);
  const custom = getStoredCustomOpps().find(o => o.id === id);
  if (custom) return custom;
  const demo = demoOpportunities.find(o => o.id === id);
  if (demo) return demo;
  try {
    const all = await getOpportunities();
    return all.find(o => o.id === id) || all.find(o => o.title === id) || null;
  } catch {
    return null;
  }
}

// Helper to get custom applications stored in localStorage
function getStoredCustomApps(): Application[] {
  try {
    const s = localStorage.getItem('hc_custom_applications');
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function saveCustomApp(app: Application) {
  try {
    const list = getStoredCustomApps();
    list.unshift(app);
    localStorage.setItem('hc_custom_applications', JSON.stringify(list));
  } catch {
    // ignore
  }
}

function upsertCustomApp(app: Application): Application {
  const list = getStoredCustomApps();
  const idx = list.findIndex(a =>
    a.id === app.id ||
    (a.studentId && app.studentId && a.studentId === app.studentId && a.opportunityId === app.opportunityId)
  );
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...app, id: list[idx].id };
    try {
      localStorage.setItem('hc_custom_applications', JSON.stringify(list));
    } catch { /* ignore */ }
    return list[idx];
  }
  saveCustomApp(app);
  return app;
}

export function isCampusApplicant(entry: {
  source?: string;
  campusName?: string;
  studentId?: string;
  id?: string;
  email?: string;
}): boolean {
  const id = String(entry.studentId || entry.id || '');
  const email = String(entry.email || '').toLowerCase();
  return (
    entry.source === 'bridge' ||
    Boolean(entry.campusName) ||
    id.startsWith('STU-') ||
    email.includes('@college.edu')
  );
}

function bridgeStatusOf(status: Application['status']): string {
  if (status === 'selected') return 'Selected';
  if (status === 'interview') return 'Interview';
  if (status === 'rejected') return 'Rejected';
  if (status === 'shortlisted') return 'Shortlisted';
  if (status === 'applied' || status === 'under-review') return 'Applied';
  return 'Applied';
}

function statusNotes(status: Application['status']): string {
  if (status === 'shortlisted') return 'Shortlisted by recruiter in Connect.';
  if (status === 'interview') return 'Moved to Interview in Connect.';
  if (status === 'selected') return 'Selected by recruiter in Connect.';
  if (status === 'rejected') return 'Rejected by recruiter in Connect.';
  if (status === 'applied' || status === 'under-review') return 'Marked Applied in Connect.';
  return `Status set to ${status} in Connect.`;
}

export async function notifyCampusAdmin(payload: Record<string, unknown>): Promise<boolean> {
  const bridgeRes = await fetchWithTimeout(`${BRIDGE_URL}/api/connect/recruiter/decisions`, 6000, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (payload.applicationId) {
    await fetchWithTimeout(`${BRIDGE_URL}/api/connect/applications/${payload.applicationId}/status`, 4000, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: payload.bridgeStatus || bridgeStatusOf((payload.status as Application['status']) || 'shortlisted'),
        notes: payload.notes,
      }),
    });
  }
  await fetchWithTimeout(`${GATEWAY_URL}/api/opportunities/applications/status`, 4000, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return Boolean(bridgeRes?.ok);
}

function mapIncomingApp(b: any, companyId?: string, sourceHint?: Application['source']): Application {
  const matchingSkills = asSkillChips(b.matchingSkills || b.skillsMatch?.matched || b.skills);
  const missingFromGaps = Array.isArray(b.skillGaps)
    ? b.skillGaps.map((g: any) => ({ name: String(g?.name || g || '').trim() })).filter((g: { name: string }) => g.name)
    : [];
  const missingFromMatch = Array.isArray(b.skillsMatch?.missing)
    ? b.skillsMatch.missing.map((n: any) => ({ name: String(n).trim() })).filter((g: { name: string }) => g.name)
    : [];
  const missingSkills = asSkillChips(b.missingSkills).map(s => ({ name: s.name }))
    .concat(missingFromGaps, missingFromMatch);

  const resolvedSource: Application['source'] =
    (b.source as Application['source']) ||
    sourceHint ||
    (b.campusName || b.campus_name || b.college?.name ? 'bridge' : 'hiero');

  return {
    id: b.id || b._id || `app-${Date.now()}`,
    opportunityId: b.opportunity_id || b.opportunityId || b.oppId || '',
    // Never fall back to the company that is *asking*. Older records carry no
    // companyId, and stamping the viewer's id on them made every recruiter's
    // inbox show every other company's applicants — names, emails, resumes.
    // Ownership is resolved from the opportunity instead, further down.
    companyId: b.companyId || b.company_id || undefined,
    companyName: b.company_name || b.companyName || b.company,
    studentId: b.student_id || b.studentId || b.student?.id || '',
    studentName: b.student_name || b.studentName || b.student?.name,
    email: b.email || b.student?.email,
    phone: b.phone || b.student?.phone,
    cgpa: b.cgpa || b.student?.cgpa,
    department: b.department || b.student?.department,
    campusName:
      b.campusName ||
      b.campus_name ||
      b.collegeName ||
      b.college_name ||
      b.college?.name ||
      b.student?.campusName ||
      b.student?.collegeName ||
      b.student?.college?.name,
    campusLocation:
      b.campusLocation ||
      b.campus_location ||
      b.college?.location ||
      b.student?.campusLocation ||
      b.student?.college?.location,
    jobTitle: b.jobTitle || b.job_title || b.opportunity?.title,
    status: normalizeAppStatus(b.status),
    matchScore: parseMatchScore(b),
    appliedAt: b.applied_at || b.appliedAt || new Date().toISOString(),
    resumeUrl: b.resume_url || b.resumeUrl || b.student?.resumeUrl,
    matchingSkills,
    missingSkills,
    skillsMatch: b.skillsMatch,
    skillGaps: b.skillGaps,
    hieroVerified: Boolean(b.verified || b.hieroVerified || b.hiero_verified),
    notes: b.notes,
    source: resolvedSource,
    projects: b.projects || b.student?.projects,
    portfolioUrl:
      b.portfolioUrl ||
      b.portfolio_url ||
      b.digitalPortfolioUrl ||
      b.student?.portfolioUrl ||
      b.student?.portfolio_url,
    // Whether an interview has been sent, started or taken. The mapper builds
    // an explicit object, so anything not named here is dropped — and without
    // this the inbox could not tell which applications had an interview out.
    interviewInvite: b.interviewInvite,
    interviewMailSentAt: b.interviewMailSentAt,
  };
}

async function fetchAllLiveOpportunities(): Promise<Opportunity[]> {
  const live: Opportunity[] = [];
  try {
    const res = await fetchWithTimeout(`${GATEWAY_URL}/api/opportunities`, 4000);
    if (res?.ok) {
      const data = await res.json();
      const list = data?.opportunities || data?.data || (Array.isArray(data) ? data : []);
      if (Array.isArray(list)) live.push(...list.map(withCompanyFields).filter(Boolean));
    }
  } catch {}
  try {
    const res = await fetchWithTimeout(`${PYTHON_BACKEND_URL}/api/opportunities`, 3000);
    if (res?.ok) {
      const data = await res.json();
      const list = data?.opportunities || data?.data || (Array.isArray(data) ? data : []);
      if (Array.isArray(list)) live.push(...list.map(withCompanyFields).filter(Boolean));
    }
  } catch {}
  return live as Opportunity[];
}

function extractApplicationsArray(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.applications)) return data.applications;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.results)) return data.results;
  return [];
}

export async function getApplications(companyId?: string): Promise<Application[]> {
  await delay(200);
  const scopeId = companyId || currentCompany().id;
  const scopeName = currentCompany().name;

  // Company-scoped jobs (for inbox) + full live catalog (to resolve Hiero apps that lack companyId)
  const [scopedOpps, liveOpps] = await Promise.all([
    getOpportunities(scopeId),
    fetchAllLiveOpportunities(),
  ]);
  const customOpps = getStoredCustomOpps();
  const oppById = new Map<string, any>();
  [...liveOpps, ...customOpps, ...scopedOpps].forEach(o => {
    if (o?.id) oppById.set(o.id, { ...oppById.get(o.id), ...o });
  });

  const companyOppIds = new Set(
    [...oppById.values()]
      .filter(o => opportunityBelongsToCompany(o, scopeId, scopeName))
      .map(o => o.id)
  );
  // Also include explicitly scoped list (in case live fetch missed local-only posts)
  scopedOpps.forEach(o => companyOppIds.add(o.id));

  let backendApps: Application[] = [];

  // Bridge campus applications
  try {
    const br = await fetchWithTimeout(`${BRIDGE_URL}/api/connect/applications`, 4000);
    if (br?.ok) {
      const brData = await br.json();
      extractApplicationsArray(brData).forEach((b: any) => {
        backendApps.push(mapIncomingApp(b, scopeId, 'bridge'));
      });
    }
  } catch {}

  // Python hub
  try {
    const pyRes = await fetchWithTimeout(`${PYTHON_BACKEND_URL}/api/applications`, 4000);
    if (pyRes?.ok) {
      const pyData = await pyRes.json();
      extractApplicationsArray(pyData).forEach((b: any) => {
        backendApps.push(mapIncomingApp(b, scopeId, 'hiero'));
      });
    }
  } catch {}

  // HIERO Gateway (2816) — primary student applies
  try {
    const res = await fetchWithTimeout(`${GATEWAY_URL}/api/opportunities/applications`, 5000);
    if (res?.ok) {
      const data = await res.json();
      extractApplicationsArray(data).forEach((b: any) => {
        backendApps.push(mapIncomingApp(b, scopeId, 'hiero'));
      });
    }
  } catch {}

  // Enrich from opportunity so Hiero apps without companyId still scope correctly
  backendApps = backendApps.map(a => {
    const opp = a.opportunityId ? oppById.get(a.opportunityId) : null;
    if (!opp) return a;
    return {
      ...a,
      companyId: a.companyId || opp.companyId,
      companyName: a.companyName || opp.companyName || opp.company,
      jobTitle: a.jobTitle || opp.title,
    };
  });

  const customApps = getStoredCustomApps().map(a => ({
    ...a,
    source: a.source || 'hiero',
  }));

  const allApps = [...backendApps, ...customApps];
  const appMap = new Map<string, Application>();
  const keyOf = (a: Application) => a.id || `${a.studentId}::${a.opportunityId}`;
  allApps.forEach(a => {
    if (!a) return;
    const key = keyOf(a);
    if (!key) return;
    const prev = appMap.get(key) || (a.studentId && a.opportunityId ? appMap.get(`${a.studentId}::${a.opportunityId}`) : undefined);
    const mergedApp: Application = prev
      ? {
          ...prev,
          ...a,
          id: prev.id || a.id,
          source:
            a.source === 'hiero' || prev.source === 'hiero'
              ? 'hiero'
              : (a.source || prev.source),
          matchScore: a.matchScore ?? prev.matchScore,
          matchingSkills: (a.matchingSkills?.length ? a.matchingSkills : prev.matchingSkills) || [],
          skillsMatch: a.skillsMatch || prev.skillsMatch,
          companyId: a.companyId || prev.companyId,
          companyName: a.companyName || prev.companyName,
        }
      : a;
    appMap.set(key, mergedApp);
  });

  const merged = Array.from(appMap.values());

  return merged.filter(a => {
    if (!scopeId && !scopeName) return true;
    if (scopeId && a.companyId && a.companyId === scopeId) return true;
    if (sameCompanyName(a.companyName, scopeName)) return true;
    if (a.opportunityId && companyOppIds.has(a.opportunityId)) return true;
    // Resolve via live opp ownership when app only has opportunityId
    const opp = a.opportunityId ? oppById.get(a.opportunityId) : null;
    if (opp && opportunityBelongsToCompany(opp, scopeId, scopeName)) return true;
    return false;
  });
}

export async function getApplicationsByOpportunity(opportunityId: string): Promise<Application[]> {
  const allApps = await getApplications();
  return allApps.filter(a => a.opportunityId === opportunityId);
}

export async function updateApplicationStatus(
  id: string,
  status: Application['status'],
  current?: Application
): Promise<Application> {
  const existing = getStoredCustomApps().find(a => a.id === id);
  const notes = statusNotes(status);
  const updated = upsertCustomApp({
    ...(existing || {
      id,
      opportunityId: current?.opportunityId || '',
      studentId: current?.studentId || '',
      matchingSkills: current?.matchingSkills || [],
      appliedAt: current?.appliedAt || new Date().toISOString(),
    }),
    ...(current || {}),
    id,
    status,
    notes,
  });

  const bridgeStatus = bridgeStatusOf(status);
  const payload = {
    applicationId: id,
    status,
    bridgeStatus,
    notes: updated.notes,
    studentId: updated.studentId,
    opportunityId: updated.opportunityId,
    studentName: updated.studentName,
    jobTitle: updated.jobTitle,
    companyName: updated.companyName,
  };

  await Promise.all([
    fetchWithTimeout(`${BRIDGE_URL}/api/connect/applications/${id}/status`, 4000, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: bridgeStatus, notes: updated.notes }),
    }),
    fetchWithTimeout(`${GATEWAY_URL}/api/opportunities/applications/status`, 4000, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    fetchWithTimeout(`${PYTHON_BACKEND_URL}/api/applications/${id}/status`, 4000, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes: updated.notes }),
    }),
    fetchWithTimeout(`${PYTHON_BACKEND_URL}/api/applications/status`, 4000, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  ]);

  // Campus notify on shortlist only — offer / congratulations mail is Phase 2
  if (status === 'shortlisted' && isCampusApplicant(updated)) {
    await notifyCampusAdmin({
      ...payload,
      email: updated.email,
      campusName: updated.campusName,
      resumeUrl: updated.resumeUrl,
      matchScore: updated.matchScore,
    });
  }

  return updated;
}

// Student application submission (connects Student Portal -> Industry HR Portal)
export async function applyToOpportunity(params: {
  opportunityId: string;
  studentId?: string;
  matchScore?: number;
}): Promise<Application> {
  await delay(350);
  const opp = await getOpportunityById(params.opportunityId);
  
  const newApp: Application = {
    id: `app-${Date.now()}`,
    opportunityId: params.opportunityId,
    companyId: opp?.companyId,
    studentId: params.studentId || 'cand-1', // Jaswanth / Default Student
    status: 'applied',
    matchScore: params.matchScore || Math.floor(Math.random() * 20) + 80, // 80%-99%
    appliedAt: new Date().toISOString(),
    resumeUrl: '/resumes/jaswanth_resume.pdf',
    matchingSkills: [
      { name: 'Python', score: 95 },
      { name: 'React', score: 92 },
      { name: 'TypeScript', score: 90 },
    ],
    skillsMatch: {
      matched: opp?.requiredSkills?.map(s => s.name) || ['React', 'TypeScript', 'Node.js'],
      missing: ['Kubernetes'],
    },
  };

  saveCustomApp(newApp);

  // Increment applicantsCount on custom opportunity if present
  try {
    const opps = getStoredCustomOpps();
    const targetIdx = opps.findIndex(o => o.id === params.opportunityId);
    if (targetIdx >= 0) {
      opps[targetIdx].applicantsCount = (opps[targetIdx].applicantsCount || 0) + 1;
      localStorage.setItem('hc_custom_opportunities', JSON.stringify(opps));
    }
  } catch {}

  return newApp;
}

export async function shortlistCandidate(params: {
  candidate: Candidate;
  job: Opportunity;
  matchScore?: number;
  matchingSkills?: { name: string; score: number }[];
  companyId?: string;
  companyName?: string;
  existing?: Application | null;
  shortlist?: boolean;
}): Promise<Application> {
  const candidate = params.candidate;
  const job = params.job;
  const campusSource = isCampusApplicant({
    source: params.existing?.source,
    campusName: params.existing?.campusName,
    studentId: candidate.id,
    email: candidate.email || params.existing?.email,
  });
  const campusName = params.existing?.campusName || (campusSource ? candidate.education?.[0]?.institution : undefined);
  const status: Application['status'] = params.shortlist === false ? 'under-review' : 'shortlisted';
  const app = upsertCustomApp({
    id: params.existing?.id || `app-sl-${candidate.id}-${job.id}`,
    opportunityId: job.id,
    studentId: candidate.id,
    companyId: params.companyId || job.companyId,
    companyName: params.companyName || job.companyName,
    studentName: candidate.name,
    email: candidate.email || params.existing?.email,
    phone: candidate.phone || params.existing?.phone,
    cgpa: candidate.cgpa || candidate.education?.[0]?.cgpa || params.existing?.cgpa,
    department: candidate.education?.[0]?.field || params.existing?.department,
    campusName: campusSource ? campusName : params.existing?.campusName,
    campusLocation: params.existing?.campusLocation || candidate.location,
    jobTitle: job.title,
    resumeUrl: candidate.resumeUrl || params.existing?.resumeUrl,
    matchScore: params.matchScore ?? params.existing?.matchScore ?? 80,
    matchingSkills: params.matchingSkills?.map(s => ({ name: s.name, score: s.score })) || params.existing?.matchingSkills || [],
    status,
    appliedAt: params.existing?.appliedAt || new Date().toISOString(),
    source: campusSource ? 'bridge' : (params.existing?.source || 'hiero'),
    notes: status === 'shortlisted' ? 'Shortlisted by recruiter in Connect.' : params.existing?.notes,
    selectionNotifiedAt: params.existing?.selectionNotifiedAt,
  });

  if (status === 'shortlisted' && isCampusApplicant(app)) {
    await notifyCampusAdmin({
      applicationId: params.existing?.id || app.id,
      studentId: candidate.id,
      opportunityId: job.id,
      studentName: candidate.name,
      email: app.email,
      phone: app.phone,
      cgpa: app.cgpa,
      department: app.department,
      campusName: app.campusName,
      campusLocation: app.campusLocation,
      jobTitle: job.title,
      companyName: app.companyName || job.companyName,
      matchScore: app.matchScore,
      skills: (candidate.skills || []).map(s => s.name),
      resumeUrl: app.resumeUrl,
      status: 'shortlisted',
      bridgeStatus: 'Shortlisted',
      notes: `Recruiter shortlisted ${candidate.name} for ${job.title}.`,
    });
  }

  return app;
}

// ============================================================
// Candidate mail
// ============================================================
// The portal composes; the gateway sends. Mail credentials never reach the
// browser, and the gateway stamps the application so the inbox shows what
// was sent and when.

/** Resumes are stored on the gateway and come back as a gateway-relative
 *  path. The portal runs on its own origin, so it needs the absolute URL. */
export function resumeHref(url?: string): string {
  if (!url) return '';
  if (/^(https?:|blob:|data:)/i.test(url)) return url;
  return `${GATEWAY_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

/**
 * Fetch a resume as a blob the browser can open.
 *
 * The file is behind the recruiter's token now — a candidate's CV is not
 * public just because somebody has the link. An <a href> cannot send an
 * Authorization header, so the portal fetches the bytes and opens those
 * instead. The caller revokes the URL when the tab is done with it.
 */
export async function openResume(url?: string): Promise<{ ok: boolean; href?: string; error?: string }> {
  if (!url) return { ok: false, error: 'This application has no resume on it.' };
  const res = await fetchWithTimeout(resumeHref(url), 20000);
  if (!res) return { ok: false, error: 'Cannot reach the HIERO gateway.' };
  if (res.status === 401) return { ok: false, error: 'Your session expired. Sign in again.' };
  if (res.status === 403) return { ok: false, error: 'This resume was not sent to your company.' };
  if (!res.ok) return { ok: false, error: 'That resume is no longer on the server.' };
  const blob = await res.blob();
  return { ok: true, href: URL.createObjectURL(blob) };
}

export function composeInterviewEmail(params: {
  app: Application;
  job?: Opportunity | null;
  companyName?: string;
  recruiterName?: string;
  when?: string;
  where?: string;
  interviewUrl?: string;
}): { to: string; subject: string; body: string } {
  const { app, job } = params;
  const company = params.companyName || app.companyName || job?.companyName || 'our team';
  const recruiter = params.recruiterName || 'Recruiting Team';
  const name = app.studentName || 'there';
  const role = app.jobTitle || job?.title || 'the role';
  const when = params.when?.trim();
  const where = params.where?.trim();

  // With a link, the interview IS the invitation — the candidate can do it
  // now, from their phone, without scheduling anything. Without one, this is
  // an ordinary invitation to come in.
  const online = params.interviewUrl
    ? `Please complete a short interview first — about 10 minutes, answered out loud:

${params.interviewUrl}

You can take it once, so start when you are somewhere quiet. It works on a phone.

`
    : '';

  const inPerson = params.interviewUrl
    ? (when || where
        ? `${when ? `We would then like to meet you: ${when}\n` : ''}${where ? `Where: ${where}\n` : ''}\n`
        : '')
    : `${when ? `When: ${when}` : 'When: we will confirm a slot with you shortly'}
${where ? `Where: ${where}` : 'Where: to be confirmed'}

`;

  return {
    to: app.email || '',
    subject: `Interview invitation — ${role} at ${company}`,
    body: `Dear ${name},

Thank you for applying for the ${role} role at ${company}. We would like to take your application forward.

${online}${inPerson}If you have any questions, just reply to this email.

We look forward to hearing from you.

Regards,
${recruiter}
${company}`,
  };
}

/** A score is never reported on its own — "why" is what makes it arguable. */
export interface ScoreLine {
  score: number | null;
  why: string;
}

/** A positive or a concern, with the thing in the answers that led to it. */
export interface ReportPoint {
  point: string;
  evidence: string;
}

export interface InterviewReport {
  sessionStatus: string;
  completedAt: string | null;
  questionsAsked: number;
  questionsAnswered: number;
  overall: number | null;
  /** How the overall score was arrived at. */
  overallWhy: string;
  scores: Record<string, ScoreLine>;
  strengths: ReportPoint[];
  concerns: ReportPoint[];
  /** Whether they fit this role, argued rather than asserted. */
  fit: { verdict: string; reasoning: string };
  recommendation: string;
  summary: string;
}

/**
 * Create the candidate's interview link for an application.
 *
 * The job goes with it: role, employer, the skills the recruiter asked for
 * and the text of the post. That is what the interview service writes the
 * questions from, so a salon hiring a stylist and a clinic hiring a
 * receptionist do not get the same ten questions.
 *
 * The link is signed by the interview service, expires in a week, works
 * once, and points at /interview/:token in this portal.
 */
export async function createInterviewInvite(
  applicationId: string,
  context?: { app?: Application; job?: Opportunity | null; companyName?: string }
): Promise<{ ok: boolean; url?: string; error?: string }> {
  const { app, job } = context || {};
  const skills = [
    ...(job?.requiredSkills || []),
    ...(job?.preferredSkills || []),
  ].map(s => s.name);

  const res = await fetchInterviewApi('/api/interview/invite', 60000, {
    method: 'POST',
    body: JSON.stringify({
      applicationId,
      candidateName: app?.studentName || '',
      role: app?.jobTitle || job?.title || '',
      companyName: context?.companyName || app?.companyName || job?.companyName || '',
      skills: skills.length ? skills : (app?.matchingSkills || []).map(s => s.name),
      description: job?.description || '',
    }),
  });

  if (!res) return { ok: false, error: 'Cannot reach the interview service.' };
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    if (res.status === 401) {
      return { ok: false, error: 'The interview service rejected this portal\u2019s key.' };
    }
    return { ok: false, error: data?.error || 'Could not create the interview link.' };
  }
  // The service builds the link on PORTAL_URL, which is right for the mail
  // it will be pasted into but wrong when the portal is being reached on a
  // tunnel or a preview build. Rebuilding it here keeps the candidate on the
  // origin they are actually going to open.
  return { ok: true, url: candidateInterviewUrl(data.url) };
}

/** The recruiter's view of a finished interview: scores and words only. */
export async function getInterviewReport(
  applicationId: string
): Promise<{ state: string; report: InterviewReport | null }> {
  const res = await fetchInterviewApi(
    `/api/interview/report/${encodeURIComponent(applicationId)}`,
    30000
  );
  if (!res || !res.ok) return { state: 'none', report: null };
  const data = await res.json().catch(() => null);
  if (!data?.success) return { state: 'none', report: null };
  return { state: data.state || 'none', report: data.report || null };
}

export async function sendCandidateMail(params: {
  kind: 'interview' | 'selection' | 'rejection' | 'message';
  applicationId?: string;
  opportunityId?: string;
  to: string;
  subject: string;
  body: string;
  scheduledAt?: string;
}): Promise<{ ok: boolean; error?: string; application?: Application }> {
  // Sending is slow: the gateway opens an SMTP connection to Gmail and waits
  // for it, and on a host that sleeps when idle the first request also pays
  // for waking up. Twenty seconds was not enough, and the portal reported it
  // as "cannot reach the gateway" — which sent people looking for an outage
  // that was not happening.
  const res = await fetchWithTimeout(`${GATEWAY_URL}/api/connect/mail/send`, 90000, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res) {
    // A timeout is not a failure. The gateway may well have sent it, so do
    // not invite a second send that would reach the candidate twice.
    return {
      ok: false,
      error: 'No answer from HIERO yet. The mail may still have gone out — check before sending again.',
    };
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    return { ok: false, error: data?.error || 'The mail could not be sent.' };
  }
  return { ok: true, application: data.application || undefined };
}

export function composeSelectionEmail(params: {
  app: Application;
  candidate: Candidate;
  job: Opportunity;
  recruiterName?: string;
  companyName?: string;
}): { to: string; subject: string; body: string } {
  const { app, candidate, job } = params;
  const company = params.companyName || app.companyName || job.companyName || 'our company';
  const recruiter = params.recruiterName || 'Recruiting Team';
  const name = candidate.name || app.studentName || 'Candidate';
  const role = app.jobTitle || job.title;
  const campusNote = isCampusApplicant(app)
    ? ' Your college placement office has also been notified.'
    : '';
  return {
    to: candidate.email || app.email || '',
    subject: `Congratulations — you've been selected for ${role}`,
    body: `Dear ${name},

We are pleased to inform you that you have been selected for the ${role} role at ${company}.

Our team will share joining / next-step details shortly.${campusNote}

Congratulations again.

Regards,
${recruiter}
${company}`,
  };
}

export async function sendSelectionNotice(params: {
  app: Application;
  candidate: Candidate;
  job: Opportunity;
  recruiterName?: string;
  companyName?: string;
  subject?: string;
  body?: string;
}): Promise<Application> {
  const { app, candidate, job } = params;
  const company = params.companyName || app.companyName || job.companyName || 'our company';
  const recruiter = params.recruiterName || 'Recruiting Team';
  const email = candidate.email || app.email || '';
  const name = candidate.name || app.studentName || 'Candidate';
  const role = app.jobTitle || job.title;

  const updated = upsertCustomApp({
    ...app,
    status: 'selected',
    studentName: name,
    email: email || app.email,
    jobTitle: role,
    selectionNotifiedAt: new Date().toISOString(),
    notes: `Selection email sent${email ? ` to ${email}` : ''}.`,
  });

  if (isCampusApplicant(updated)) {
    await notifyCampusAdmin({
      applicationId: app.id,
      studentId: candidate.id || app.studentId,
      opportunityId: job.id || app.opportunityId,
      studentName: name,
      email,
      phone: candidate.phone || app.phone,
      cgpa: candidate.cgpa || app.cgpa,
      department: app.department,
      campusName: app.campusName,
      campusLocation: app.campusLocation,
      jobTitle: role,
      companyName: company,
      matchScore: app.matchScore,
      skills: (candidate.skills || []).map(s => s.name),
      resumeUrl: candidate.resumeUrl || app.resumeUrl,
      status: 'selected',
      bridgeStatus: 'Selected',
      notes: `Recruiter selected ${name} for ${role} at ${company}. Placement cell notified.`,
      recruiterName: recruiter,
    });
  }

  return updated;
}

export async function getStudentApplications(studentId: string = 'cand-1'): Promise<Application[]> {
  await delay(250);
  const customApps = getStoredCustomApps();
  const allApps = [...customApps, ...demoApplications];
  return allApps.filter(a => a.studentId === studentId);
}

// --- Match Results ---
const SKILL_ALIASES: Record<string, string> = {
  ml: 'machine learning',
  'machine learning': 'machine learning',
  'artificial intelligence': 'machine learning',
  ai: 'machine learning',
  tf: 'tensorflow',
  tensorflow: 'tensorflow',
  keras: 'tensorflow',
  pytorch: 'pytorch',
  'scikit-learn': 'scikit-learn',
  sklearn: 'scikit-learn',
  nlp: 'nlp',
  'natural language processing': 'nlp',
  cv: 'computer vision',
  'computer vision': 'computer vision',
  llm: 'llms',
  llms: 'llms',
  rag: 'rag',
  js: 'javascript',
  javascript: 'javascript',
  ts: 'typescript',
  typescript: 'typescript',
  reactjs: 'react',
  'react.js': 'react',
  react: 'react',
  node: 'node.js',
  nodejs: 'node.js',
  'node.js': 'node.js',
  postgres: 'postgresql',
  postgresql: 'postgresql',
  mysql: 'sql',
  sql: 'sql',
  'rest apis': 'rest apis',
  rest: 'rest apis',
  api: 'rest apis',
  restful: 'rest apis',
  docker: 'docker',
  k8s: 'kubernetes',
  kubernetes: 'kubernetes',
  aws: 'aws',
  git: 'git',
  github: 'git',
  python: 'python',
};

function normalizeSkillName(name?: string): string {
  const raw = (name || '').toLowerCase().trim().replace(/[^a-z0-9+.# ]/g, ' ').replace(/\s+/g, ' ');
  return SKILL_ALIASES[raw] || raw;
}

function normalizeJobSkills(skills?: SkillRequirement[] | string[] | string): SkillRequirement[] {
  if (!skills) return [];
  const list = typeof skills === 'string'
    ? skills.split(/[,|/]/).map(s => s.trim()).filter(Boolean)
    : Array.isArray(skills) ? skills : [];
  return list.map(s =>
    typeof s === 'string'
      ? { name: s, importance: 'high' as const, category: 'required' as const }
      : s
  ).filter(s => s?.name);
}

function candidateSkillMap(candidate: Candidate): Map<string, number> {
  const map = new Map<string, number>();
  const bump = (name: string, score: number) => {
    const key = normalizeSkillName(name);
    if (!key) return;
    map.set(key, Math.max(map.get(key) || 0, Math.round(score)));
  };

  (candidate.skills || []).forEach(s => bump(s.name, s.competency || 0));
  (candidate.projects || []).forEach(p => (p.skills || []).forEach(s => bump(s, 74)));
  (candidate.experience || []).forEach(e => (e.skills || []).forEach(s => bump(s, 70)));
  return map;
}

function skillScoreFor(reqName: string, catalog: Map<string, number>): number {
  const key = normalizeSkillName(reqName);
  if (catalog.has(key)) return catalog.get(key) as number;
  for (const [cand, score] of catalog) {
    if (cand.length < 5 || key.length < 5) continue;
    if (key.includes(cand) || cand.includes(key)) return Math.round(score * 0.85);
  }
  return 0;
}

function candidateFromApplication(a: Application): Candidate {
  return {
    id: a.studentId || a.id,
    name: a.studentName || 'Campus applicant',
    email: a.email || '',
    phone: a.phone,
    headline: [a.department, a.campusName].filter(Boolean).join(' · ') || 'HIERO Bridge applicant',
    location: a.campusLocation || 'India',
    skills: (a.matchingSkills || []).map(s => ({
      name: s.name,
      competency: s.score,
      verified: true,
      lastAssessedAt: a.appliedAt,
    })),
    projects: (a.projects || []).map(p => ({
      title: p.title,
      description: p.description || p.tech || '',
      skills: p.skills || [],
    })),
    education: [{
      institution: a.campusName || 'Campus Partner',
      degree: 'B.Tech',
      field: a.department || 'Computer Science',
      startYear: 2022,
      endYear: 2026,
      cgpa: a.cgpa,
    }],
    experience: [],
    certifications: [],
    resumeUrl: a.resumeUrl,
    cgpa: a.cgpa,
    authorizedSections: ['all'],
  };
}

function weightedAverage(items: { score: number; weight: number }[]): number {
  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  if (!totalWeight) return 0;
  return items.reduce((sum, i) => sum + i.score * i.weight, 0) / totalWeight;
}

function scoreAgainstJob(candidate: Candidate, job: Opportunity, appScore?: number): MatchResult {
  const required = normalizeJobSkills(job.requiredSkills);
  const preferred = normalizeJobSkills(job.preferredSkills);
  const jobSkills = [
    ...required.map(s => ({ ...s, category: 'required' as const })),
    ...preferred.map(s => ({ ...s, category: s.category || 'preferred' as const })),
  ];
  const catalogSkills = jobSkills.length
    ? jobSkills
    : [{ name: 'Python', importance: 'high' as const, category: 'required' as const }];

  const candSkills = candidateSkillMap(candidate);
  const skillMatches = catalogSkills.map(req => {
    const score = skillScoreFor(req.name, candSkills);
    return {
      name: req.name,
      score,
      meetsRequired: req.category !== 'required' || score >= 60,
    };
  });

  const requiredMatches = skillMatches.filter((_, i) => catalogSkills[i].category === 'required');
  const preferredMatches = skillMatches.filter((_, i) => catalogSkills[i].category !== 'required');
  const requiredPool = requiredMatches.length ? requiredMatches : skillMatches;
  const matchedRequired = requiredPool.filter(s => s.score >= 50);
  const coverage = matchedRequired.length / Math.max(1, requiredPool.length);
  const qualityItems = requiredPool.filter(s => s.score > 0).map(s => ({
    score: s.score,
    weight: 1,
  }));
  const quality = qualityItems.length ? weightedAverage(qualityItems) : 0;
  const preferredQuality = preferredMatches.filter(s => s.score > 0);
  const preferredBonus = preferredMatches.length
    ? (preferredQuality.reduce((sum, s) => sum + s.score, 0) / preferredMatches.length) * 0.12
    : 0;

  let overallScore = Math.round(coverage * 48 + quality * 0.5 + preferredBonus);

  if (candidate.cgpa && candidate.cgpa >= 8) overallScore += 3;
  else if (candidate.cgpa && candidate.cgpa >= 7.5) overallScore += 1;

  if (typeof appScore === 'number' && appScore > 0) {
    overallScore = Math.round(overallScore * 0.85 + appScore * 0.15);
  }

  overallScore = Math.min(99, Math.max(1, overallScore));

  const requiredNames = required.length ? required : catalogSkills.filter(s => s.category === 'required');
  const matchedCount = skillMatches.filter(s => s.meetsRequired && requiredNames.some(r => r.name === s.name)).length;
  const totalRequired = Math.max(1, requiredNames.length);
  const strengths = skillMatches.filter(s => s.score >= 80).map(s => `${s.name} (${s.score}%)`);
  const gaps = skillMatches.filter(s => s.score < 60).map(s => `${s.name} (${s.score}%)`);

  let matchExplanation = '';
  if (matchedCount >= totalRequired) {
    matchExplanation = `Strong alignment with required skills for ${job.title}.`;
  } else {
    matchExplanation = `Aligns with ${matchedCount} of ${totalRequired} required skills${gaps.length ? `. Gaps: ${gaps.join(', ')}` : '.'}`;
  }
  if (candidate.cgpa) matchExplanation += ` Campus CGPA ${candidate.cgpa}/10.`;

  return {
    candidateId: candidate.id,
    overallScore,
    skillMatches,
    matchExplanation,
    strengths,
    gaps,
  };
}

export async function getMatchResults(opportunityId: string): Promise<MatchResult[]> {
  await delay(250);
  const job = await getOpportunityById(opportunityId);
  const [candidates, apps] = await Promise.all([
    getCandidates(),
    getApplications(),
  ]);

  const relatedApps = apps.filter(a =>
    a.opportunityId === opportunityId ||
    (job && a.jobTitle && a.jobTitle === job.title)
  );

  const pool: Candidate[] = [
    ...relatedApps.map(candidateFromApplication),
    ...candidates,
  ];

  const seen = new Set<string>();
  const unique = pool.filter(c => {
    if (!c?.id || seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  if (!job) {
    return generateMatchResults(opportunityId);
  }

  return unique
    .map(c => {
      const app = relatedApps.find(a => a.studentId === c.id || a.id === c.id);
      return scoreAgainstJob(c, job, app?.matchScore);
    })
    .sort((a, b) => b.overallScore - a.overallScore);
}

// --- Dashboard ---
export async function getDashboardStats(companyId: string): Promise<DashboardStats> {
  await delay(300);
  const opps = await getOpportunities(companyId);
  const apps = await getApplications(companyId);

  const activeJobs = opps.filter(o => o.type === 'full-time' && o.status === 'active').length;
  const activeInternships = opps.filter(o => o.type === 'internship' && o.status === 'active').length;
  const totalApplications = apps.length;
  const shortlistedCandidates = apps.filter(a => a.status === 'shortlisted' || a.status === 'selected').length;
  const interviews = apps.filter(a => a.status === 'interview').length;
  const hires = apps.filter(a => a.status === 'selected').length;

  // What skills your own job posts ask for, and how many of them ask.
  //
  // Two things were wrong here. A skill arrives either as a string or as
  // { name }, depending on whether the post came through the portal or the
  // API — reading .name on a string gave a row labelled "undefined". And the
  // share was clamped between 60 and 95, so a skill on every single post
  // showed as 95% and one on a third showed as 60%: numbers that looked
  // precise and meant nothing.
  const skillCount: Record<string, number> = {};
  opps.forEach(o => {
    (o.requiredSkills || []).forEach((raw: unknown) => {
      const name = typeof raw === 'string' ? raw : (raw as { name?: string })?.name;
      const skill = String(name || '').trim();
      if (!skill) return;
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
  });

  // No invented fallback. A salon with no skills on its posts was being shown
  // Python, React and SQL as its own hiring demand.
  const topSkillsDemand = Object.entries(skillCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([skill, count]) => ({
      skill,
      percentage: Math.round((count / Math.max(1, opps.length)) * 100),
    }));

  return {
    activeJobs,
    activeInternships,
    totalApplications,
    shortlistedCandidates,
    interviews,
    hires,
    topSkillsDemand,
  };
}

// --- Company ---
export async function getCompanyById(id: string): Promise<Company | null> {
  await delay(200);
  const foundDemo = demoCompanies.find(c => c.id === id);
  if (foundDemo) return foundDemo;

  try {
    const s = localStorage.getItem('hc_custom_companies');
    if (s) {
      const customList: Company[] = JSON.parse(s);
      const foundCustom = customList.find(c => c.id === id);
      if (foundCustom) return foundCustom;
    }
  } catch {}

  // Check stored user for matching custom company name
  try {
    const userStr = localStorage.getItem('hc_user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      if (userObj.companyName) {
        return {
          id,
          name: userObj.companyName,
          email: userObj.email || 'contact@enterprise.com',
          industry: 'Information Technology',
          size: '11-50',
          location: 'Bangalore, India',
          website: `https://${userObj.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          description: `${userObj.companyName} is connected with HIERO for verified campus recruitment.`,
          recruiter: {
            name: userObj.name || 'HR Manager',
            designation: userObj.designation || 'Talent Lead',
            phone: userObj.phone || '+91 98765 43210',
            email: userObj.email || 'recruiter@enterprise.com',
          },
          createdAt: new Date().toISOString().split('T')[0],
        };
      }
    }
  } catch {}

  // Default fallback
  return {
    id,
    name: 'Verified HR Partner',
    email: 'contact@enterprise.com',
    industry: 'Information Technology',
    size: '11-50',
    location: 'Bangalore, India',
    website: 'https://enterprise.com',
    description: 'Enterprise organization connected with HIERO for verified campus recruitment.',
    recruiter: {
      name: 'Talent Lead',
      designation: 'HR Manager',
      phone: '+91 98765 43210',
      email: 'recruiter@enterprise.com',
    },
    createdAt: new Date().toISOString().split('T')[0],
  };
}

export async function updateCompanyProfile(id: string, updates: Partial<Company>): Promise<Company> {
  await delay(300);
  const current = (await getCompanyById(id)) || {
    id,
    name: updates.name || 'Enterprise Organization',
    email: updates.email || 'contact@enterprise.com',
    industry: updates.industry || 'Information Technology',
    size: (updates.size as any) || '11-50',
    location: updates.location || 'Bangalore, India',
    website: updates.website || 'https://enterprise.com',
    description: updates.description || '',
    recruiter: {
      name: 'Talent Lead',
      designation: 'HR Manager',
      phone: '+91 98765 43210',
      email: updates.email || 'recruiter@enterprise.com',
    },
    createdAt: new Date().toISOString().split('T')[0],
  };

  const updated: Company = {
    ...current,
    ...updates,
  };

  const demoIdx = demoCompanies.findIndex(c => c.id === id);
  if (demoIdx >= 0) {
    demoCompanies[demoIdx] = updated;
  }

  try {
    const s = localStorage.getItem('hc_custom_companies');
    let customList: Company[] = s ? JSON.parse(s) : [];
    const idx = customList.findIndex(c => c.id === id);
    if (idx >= 0) {
      customList[idx] = updated;
    } else {
      customList.push(updated);
    }
    localStorage.setItem('hc_custom_companies', JSON.stringify(customList));
  } catch {
    // ignore
  }

  return updated;
}

// --- Skill Extraction (Mock) ---
export async function extractSkillsFromJD(jdText: string): Promise<{
  coreSkills: SkillRequirement[];
  additionalSkills: SkillRequirement[];
}> {
  await delay(2000); // Simulate AI processing

  // Simple keyword-based extraction for demo
  const keywords: Record<string, string[]> = {
    'Python': ['python', 'django', 'flask', 'fastapi'],
    'JavaScript': ['javascript', 'js', 'node', 'express'],
    'React': ['react', 'reactjs', 'react.js', 'jsx', 'tsx'],
    'TypeScript': ['typescript', 'ts'],
    'SQL': ['sql', 'mysql', 'postgresql', 'database'],
    'AWS': ['aws', 'amazon web services', 'cloud'],
    'Docker': ['docker', 'container'],
    'Kubernetes': ['kubernetes', 'k8s'],
    'Machine Learning': ['machine learning', 'ml', 'ai', 'artificial intelligence'],
    'Git': ['git', 'github', 'version control'],
    'Node.js': ['node.js', 'nodejs', 'node'],
    'CSS': ['css', 'tailwind', 'scss', 'sass'],
    'Java': ['java', 'spring'],
    'C++': ['c++', 'cpp'],
    'TensorFlow': ['tensorflow', 'keras'],
    'PyTorch': ['pytorch'],
    'Linux': ['linux', 'ubuntu', 'centos'],
    'REST APIs': ['rest', 'api', 'restful'],
  };

  const lowerJD = jdText.toLowerCase();
  const foundSkills: { name: string; importance: 'high' | 'medium' | 'low'; category: 'required' | 'preferred' }[] = [];

  for (const [skill, terms] of Object.entries(keywords)) {
    if (terms.some(term => lowerJD.includes(term))) {
      foundSkills.push({
        name: skill,
        importance: terms.some(t => lowerJD.includes(t)) ? 'high' : 'medium',
        category: 'required',
      });
    }
  }

  // If no skills found, return some defaults
  if (foundSkills.length === 0) {
    return {
      coreSkills: [
        { name: 'Python', importance: 'high', category: 'required' },
        { name: 'SQL', importance: 'high', category: 'required' },
      ],
      additionalSkills: [
        { name: 'AWS', importance: 'medium', category: 'preferred' },
        { name: 'Docker', importance: 'low', category: 'preferred' },
      ],
    };
  }

  const core = foundSkills.slice(0, Math.ceil(foundSkills.length * 0.6));
  const additional = foundSkills.slice(Math.ceil(foundSkills.length * 0.6)).map(s => ({
    ...s,
    category: 'preferred' as const,
  }));

  return { coreSkills: core, additionalSkills: additional };
}

// ============================================================
// Practice record — the interview sessions a student ran on HIERO
// before applying. HIERO already stores these (InterviewSession:
// scorecard, evaluation, questions[].skill, answers[].evaluationScore);
// it just has no recruiter-facing route yet, so this returns null
// until one exists. Shape-tolerant on purpose: it accepts either a
// summarised record or the raw sessions and folds them here.
// ============================================================

function firstNumber(...values: unknown[]): number | undefined {
  for (const v of values) {
    const n = Number(v);
    if (v !== null && v !== undefined && v !== '' && Number.isFinite(n)) return n;
  }
  return undefined;
}

// Join questions to answers on the question index so each session yields a
// score per skill, averaged when a skill was asked about more than once.
function sessionSkillScores(session: any): { name: string; score: number }[] {
  const questions = Array.isArray(session?.questions) ? session.questions : [];
  const answers = Array.isArray(session?.answers) ? session.answers : [];
  const scoreByIndex = new Map<number, number>();
  answers.forEach((a: any) => {
    const idx = Number(a?.questionIndex);
    const score = firstNumber(a?.evaluationScore);
    if (Number.isFinite(idx) && score !== undefined) scoreByIndex.set(idx, score);
  });

  const totals = new Map<string, { sum: number; count: number }>();
  questions.forEach((q: any) => {
    const name = String(q?.skill || '').trim();
    const score = scoreByIndex.get(Number(q?.index));
    if (!name || score === undefined) return;
    const prev = totals.get(name) || { sum: 0, count: 0 };
    totals.set(name, { sum: prev.sum + score, count: prev.count + 1 });
  });

  return Array.from(totals.entries()).map(([name, t]) => ({
    name,
    score: Math.round((t.sum / t.count) * 10) / 10,
  }));
}

function toPracticeAttempt(session: any, attempt: number): PracticeAttempt | null {
  const card = session?.scorecard || {};
  const evaluation = session?.evaluation || {};
  const overallScore = firstNumber(card.overallScore, evaluation.overallScore);
  if (overallScore === undefined) return null;

  const areas = [
    ...(Array.isArray(card.areasToImprove) ? card.areasToImprove : []),
    ...(Array.isArray(evaluation.weaknesses) ? evaluation.weaknesses : []),
  ]
    .map((a: unknown) => String(a || '').trim())
    .filter(Boolean);

  return {
    sessionId: String(session?.sessionId || session?._id || `s-${attempt}`),
    attempt,
    role: String(session?.jobRole || session?.role || 'Practice interview'),
    overallScore,
    technicalScore: firstNumber(card.technicalScore, evaluation.technicalScore),
    communicationScore: firstNumber(card.communicationScore, evaluation.communicationScore),
    problemSolvingScore: firstNumber(card.problemSolvingScore, evaluation.problemSolvingScore),
    completedAt: String(session?.completedAt || session?.createdAt || ''),
    skills: sessionSkillScores(session),
    areasToImprove: Array.from(new Set(areas)),
  };
}

function summarisePractice(studentId: string, sessions: any[]): PracticeRecord | null {
  const completed = sessions.filter(
    s => !s?.status || String(s.status).toUpperCase() === 'COMPLETED'
  );
  const ordered = completed
    .slice()
    .sort(
      (a, b) =>
        new Date(a?.completedAt || a?.createdAt || 0).getTime() -
        new Date(b?.completedAt || b?.createdAt || 0).getTime()
    );

  const attempts = ordered
    .map((s, i) => toPracticeAttempt(s, i + 1))
    .filter((a): a is PracticeAttempt => a !== null)
    .map((a, i) => ({ ...a, attempt: i + 1 }));

  if (!attempts.length) return null;

  const first = attempts[0];
  const latest = attempts[attempts.length - 1];

  // A skill's trend is its score on the earliest attempt that covered it
  // against its score on the most recent one that did.
  const trendMap = new Map<string, PracticeSkillTrend>();
  attempts.forEach(a => {
    a.skills.forEach(s => {
      const key = s.name.toLowerCase();
      const prev = trendMap.get(key);
      if (prev) prev.latest = s.score;
      else trendMap.set(key, { name: s.name, first: s.score, latest: s.score });
    });
  });

  const outstanding = latest.areasToImprove;
  const outstandingKeys = new Set(outstanding.map(a => a.toLowerCase()));
  const resolved = Array.from(
    new Set(
      attempts
        .slice(0, -1)
        .flatMap(a => a.areasToImprove)
        .filter(a => !outstandingKeys.has(a.toLowerCase()))
    )
  );

  return {
    studentId,
    role: latest.role,
    attempts,
    firstScore: first.overallScore,
    latestScore: latest.overallScore,
    bestScore: Math.max(...attempts.map(a => a.overallScore)),
    firstAt: first.completedAt,
    latestAt: latest.completedAt,
    skills: Array.from(trendMap.values()),
    resolved,
    outstanding,
  };
}

// Off by default. Set VITE_DEMO_PRACTICE=true to render a sample record while
// HIERO's recruiter-facing practice route does not exist yet — useful for
// screenshots and design review, never for a real recruiter.
const DEMO_PRACTICE = import.meta.env.VITE_DEMO_PRACTICE === 'true';

function demoPracticeRecord(studentId: string, role?: string): PracticeRecord {
  const jobRole = role || 'Backend Developer';
  return {
    studentId,
    role: jobRole,
    attempts: [
      {
        sessionId: 'demo-1',
        attempt: 1,
        role: jobRole,
        overallScore: 5.2,
        completedAt: '2026-10-09',
        skills: [{ name: 'SQL', score: 4.0 }, { name: 'REST APIs', score: 6.0 }],
        areasToImprove: ['Rushed through joins without explaining the plan', 'Vague on error handling'],
      },
      {
        sessionId: 'demo-2',
        attempt: 2,
        role: jobRole,
        overallScore: 6.8,
        completedAt: '2026-10-17',
        skills: [{ name: 'SQL', score: 6.5 }, { name: 'REST APIs', score: 7.5 }],
        areasToImprove: ['Vague on error handling'],
      },
      {
        sessionId: 'demo-3',
        attempt: 3,
        role: jobRole,
        overallScore: 8.1,
        completedAt: '2026-10-24',
        skills: [{ name: 'SQL', score: 8.0 }, { name: 'REST APIs', score: 9.0 }],
        areasToImprove: ['Still light on system design trade-offs'],
      },
    ],
    firstScore: 5.2,
    latestScore: 8.1,
    bestScore: 8.1,
    firstAt: '2026-10-09',
    latestAt: '2026-10-24',
    skills: [
      { name: 'SQL', first: 4.0, latest: 8.0 },
      { name: 'REST APIs', first: 6.0, latest: 9.0 },
      { name: 'Data structures', first: 5.5, latest: 7.0 },
    ],
    resolved: ['Rushed through joins without explaining the plan', 'Vague on error handling'],
    outstanding: ['Still light on system design trade-offs'],
  };
}

export async function getPracticeRecord(
  studentId: string,
  role?: string
): Promise<PracticeRecord | null> {
  if (!studentId) return null;

  // The gateway only releases a practice record to a company the student
  // actually applied to, so the company must travel with the request.
  const company = currentCompany();
  const params = new URLSearchParams();
  if (role) params.set('role', role);
  if (company.id) params.set('companyId', company.id);
  if (company.name) params.set('companyName', company.name);
  const query = params.toString() ? `?${params.toString()}` : '';
  const url = `${GATEWAY_URL}/api/opportunities/practice/${encodeURIComponent(studentId)}${query}`;

  const demo = () => (DEMO_PRACTICE ? demoPracticeRecord(studentId, role) : null);

  const res = await fetchWithTimeout(url, 4000);
  if (!res?.ok) return demo();

  let data: any;
  try {
    data = await res.json();
  } catch {
    return demo();
  }

  // Already summarised upstream — trust it, but only if it carries attempts.
  if (data?.record?.attempts?.length) return data.record as PracticeRecord;

  const sessions = Array.isArray(data)
    ? data
    : data?.sessions || data?.history || data?.interviews || [];
  if (!Array.isArray(sessions) || !sessions.length) return demo();

  return summarisePractice(studentId, sessions) || demo();
}
