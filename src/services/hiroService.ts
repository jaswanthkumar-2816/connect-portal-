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
} from '../types';
import {
  demoCandidates,
  demoApplications,
  demoDashboardStats,
  demoCompanies,
  demoOpportunities,
  bridgeCandidates,
  bridgeApplications,
  generateMatchResults,
} from '../data/demo';

// --- Simulate network delay ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const GATEWAY_URL = import.meta.env.VITE_HIERO_GATEWAY_URL || 'http://localhost:2816';
const PYTHON_BACKEND_URL = import.meta.env.VITE_PYTHON_BACKEND_URL || 'http://localhost:5050';
const BRIDGE_URL = import.meta.env.VITE_BRIDGE_URL || 'http://localhost:2410';

async function fetchWithTimeout(url: string, ms = 2500, init?: RequestInit): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
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
  await delay(150);
  return [...demoCandidates, ...bridgeCandidates];
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
  await delay(100);
  const list = await getCandidates();
  return list.find(c => c.id === id || (c as any).studentId === id || (c as any).regNo === id) ?? list[0] ?? null;
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
  const demo = demoOpportunities;
  const oppMap = new Map();
  [...liveBackendOpps, ...custom, ...demo].forEach(o => {
    if (o && o.id && !oppMap.has(o.id)) {
      oppMap.set(o.id, o);
    }
  });

  const allOpps = Array.from(oppMap.values());
  if (companyId) {
    const filtered = allOpps.filter(o => o.companyId === companyId);
    return filtered.length > 0 ? filtered : allOpps;
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
    type: data.type || 'internship',
    title: data.title || 'Software Developer Intern',
    department: data.department || 'Engineering',
    description: data.description || '',
    requiredSkills: data.requiredSkills || [],
    preferredSkills: data.preferredSkills || [],
    eligibility: data.eligibility || 'B.Tech/BE',
    location: data.location || 'Bangalore, India',
    workMode: data.workMode || 'hybrid',
    employmentType: data.employmentType || (data.type === 'internship' ? 'Internship' : 'Full-time'),
    salary: data.salary || '₹25,000/mo',
    deadline: data.deadline || '2026-10-30',
    status: 'active',
    applicantsCount: 0,
    shortlistedCount: 0,
    createdAt: new Date().toISOString().split('T')[0],
  };
  demoOpportunities.unshift(newOpp);
  saveCustomOpp(newOpp);

  // Sync with Hiero Gateway API (http://localhost:2816)
  try {
    let companyName = (data as any).companyName || '';
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
  return 'Under Review';
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

function mapIncomingApp(b: any, companyId?: string): Application {
  const skillsRaw = b.matchingSkills || b.skills || [];
  const matchingSkills = (Array.isArray(skillsRaw) ? skillsRaw : []).map((s: any) => (
    typeof s === 'string' ? { name: s, score: b.matchScore || 85 } : { name: s.name, score: s.score || s.competency || 85 }
  )).filter((s: any) => s.name);

  return {
    id: b.id || `app-${Date.now()}`,
    opportunityId: b.opportunity_id || b.opportunityId || b.oppId || '',
    companyId: b.companyId || companyId || 'c1',
    companyName: b.company_name || b.companyName,
    studentId: b.student_id || b.studentId || 'cand-1',
    studentName: b.student_name || b.studentName || b.student?.name,
    email: b.email || b.student?.email,
    phone: b.phone || b.student?.phone,
    cgpa: b.cgpa || b.student?.cgpa,
    department: b.department || b.student?.department,
    campusName: b.campusName || b.campus_name || b.college?.name || b.student?.campusName,
    campusLocation: b.campusLocation || b.college?.location || b.student?.campusLocation,
    jobTitle: b.jobTitle || b.opportunity?.title,
    status: b.status === 'Sent to Recruiter' ? 'shortlisted' : (b.status || 'applied'),
    matchScore: b.match_score || b.matchScore || 88,
    appliedAt: b.applied_at || b.appliedAt || new Date().toISOString(),
    resumeUrl: b.resume_url || b.resumeUrl || b.student?.resumeUrl,
    matchingSkills: matchingSkills.length ? matchingSkills : [{ name: 'Python', score: 90 }],
    notes: b.notes,
    source: b.source || 'bridge',
    projects: b.projects || b.student?.projects,
  };
}

export async function getApplications(companyId?: string): Promise<Application[]> {
  await delay(300);
  const opps = await getOpportunities(companyId);
  const companyOppIds = opps.map(o => o.id);

  let backendApps: Application[] = [];
  
  // 0. Pull campus applications from HIERO Bridge (2410)
  try {
    const br = await fetchWithTimeout(`${BRIDGE_URL}/api/connect/applications`, 4000);
    if (br?.ok) {
      const brData = await br.json();
      if (brData.success && Array.isArray(brData.applications)) {
        backendApps.push(...brData.applications.map((b: any) => mapIncomingApp(b, companyId)));
      }
    }
  } catch (e) {}

  // 1. Try Python Backend
  try {
    const pyRes = await fetchWithTimeout(`${PYTHON_BACKEND_URL}/api/applications`);
    if (pyRes?.ok) {
      const pyData = await pyRes.json();
      if (pyData.success && pyData.applications) {
        backendApps.push(...pyData.applications.map((b: any) => mapIncomingApp(b, companyId)));
      }
    }
  } catch (e) {}

  // 2. Try Node Gateway (port 2816)
  try {
    const res = await fetchWithTimeout(`${GATEWAY_URL}/api/opportunities/applications`);
    if (res?.ok) {
      const data = await res.json();
      if (data.success && data.applications) {
        backendApps.push(...data.applications.map((b: any) => mapIncomingApp(b, companyId)));
      }
    }
  } catch (e) {}

  const customApps = getStoredCustomApps().map((a: any) => ({
    ...a,
    studentId: a.studentId || 'cand-1',
    matchingSkills: a.matchingSkills || [
      { name: 'Python', score: 95 },
      { name: 'React', score: 92 },
      { name: 'TypeScript', score: 90 }
    ],
    missingSkills: a.missingSkills || []
  }));

  const enrichedDemoApps: Application[] = demoApplications.map(d => {
    const cand = demoCandidates.find(c => c.id === d.studentId);
    const opp = demoOpportunities.find(o => o.id === d.opportunityId);
    return {
      ...d,
      studentName: d.studentName || cand?.name || 'HIERO Candidate',
      email: d.email || cand?.email,
      phone: d.phone || cand?.phone,
      cgpa: d.cgpa || cand?.cgpa || cand?.education?.[0]?.cgpa,
      department: d.department || cand?.education?.[0]?.field || 'Computer Science',
      campusName: d.campusName || cand?.education?.[0]?.institution || 'IIT Bombay',
      campusLocation: d.campusLocation || cand?.location || 'India',
      jobTitle: d.jobTitle || opp?.title || 'Software Engineer',
      source: 'hiero',
      resumeUrl: d.resumeUrl || cand?.resumeUrl || '/resumes/Jaswanth_Kumar_Resume_Master.pdf',
    };
  });

  const allApps = [...backendApps, ...enrichedDemoApps, ...bridgeApplications, ...customApps];
  const appMap = new Map<string, Application>();
  const keyOf = (a: Application) => a.id || `${a.studentId}::${a.opportunityId}`;
  allApps.forEach(a => {
    if (!a) return;
    const key = keyOf(a);
    if (!key) return;
    const prev = appMap.get(key) || (a.studentId && a.opportunityId ? appMap.get(`${a.studentId}::${a.opportunityId}`) : undefined);
    appMap.set(key, prev ? { ...prev, ...a, id: prev.id || a.id } : a);
  });

  const merged = Array.from(appMap.values());
  return merged;
}

export async function getApplicationsByOpportunity(opportunityId: string): Promise<Application[]> {
  await delay(200);
  const customApps = getStoredCustomApps();
  const allApps = [...customApps, ...demoApplications];
  return allApps.filter(a => a.opportunityId === opportunityId);
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

  // Calculate top skills demand
  const skillCount: Record<string, number> = {};
  opps.forEach(o => {
    o.requiredSkills?.forEach(s => {
      skillCount[s.name] = (skillCount[s.name] || 0) + 1;
    });
  });

  let topSkillsDemand = Object.entries(skillCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([skill, count]) => ({
      skill,
      percentage: Math.min(95, Math.max(60, Math.round((count / Math.max(1, opps.length)) * 100))),
    }));

  if (topSkillsDemand.length === 0) {
    topSkillsDemand = [
      { skill: 'Python', percentage: 92 },
      { skill: 'React', percentage: 88 },
      { skill: 'SQL', percentage: 85 },
      { skill: 'Machine Learning', percentage: 78 },
    ];
  }

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
