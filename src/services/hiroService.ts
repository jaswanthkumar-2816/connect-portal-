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
  generateMatchResults,
} from '../data/demo';

// --- Simulate network delay ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const GATEWAY_URL = import.meta.env.VITE_HIERO_GATEWAY_URL || 'http://localhost:2816';
const PYTHON_BACKEND_URL = import.meta.env.VITE_PYTHON_BACKEND_URL || 'http://localhost:5050';

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
  await delay(300);
  const defaultCandidate: Candidate = {
    id: 'cand-1',
    name: 'Jaswanth Kumar',
    email: 'jaswanth@hiero.ai',
    phone: '+91 98765 43210',
    headline: 'Full Stack & AI Engineer | HIERO Skill Verified',
    location: 'Bangalore, India',
    resumeUrl: '/resumes/Jaswanth_Kumar_Resume_Master.pdf',
    aboutMe: 'High-caliber Full Stack & AI Engineer specializing in TypeScript, React, Python, and scalable machine learning micro-services.',
    skills: [
      { name: 'Python', competency: 95, verified: true, lastAssessedAt: '2026-08-20' },
      { name: 'React', competency: 92, verified: true, lastAssessedAt: '2026-08-18' },
      { name: 'TypeScript', competency: 90, verified: true, lastAssessedAt: '2026-08-15' },
      { name: 'SQL', competency: 88, verified: true, lastAssessedAt: '2026-08-10' },
    ],
    projects: [
      {
        title: 'HIERO AI Career & Skill Gateway',
        description: 'Built a multi-service routing architecture with real-time candidate verification and micro-curriculum engines.',
        skills: ['TypeScript', 'Node.js', 'Express', 'MongoDB']
      },
      {
        title: 'Neural Code Analyzer & Sandbox',
        description: 'Implemented AST code parser and execution sandbox for adaptive skill assessments.',
        skills: ['Python', 'PyTorch', 'Docker', 'REST APIs']
      }
    ],
    education: [
      { institution: 'IIT Madras', degree: 'B.Tech', field: 'Computer Science', startYear: 2022, endYear: 2026, cgpa: 9.2 }
    ],
    experience: [
      {
        company: 'TechNova AI Systems',
        role: 'Full Stack Engineering Intern',
        description: 'Developed reactive UI components, micro-services, and automated ML pipelines.',
        startDate: '2025-05',
        endDate: '2025-08',
        skills: ['Python', 'React', 'FastAPI', 'PostgreSQL']
      }
    ],
    certifications: [
      { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2025-11' }
    ],
    links: { github: 'https://github.com/jaswanthkumar-2816' },
    cgpa: 9.2,
    passingYear: 2026,
    score: 95,
    createdAt: '2026-08-20',
    authorizedSections: ['all']
  };
  return [defaultCandidate, ...demoCandidates];
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
  await delay(200);
  const list = await getCandidates();
  return list.find(c => c.id === id) ?? list[0] ?? null;
}

// --- Opportunity Operations ---
export async function getOpportunities(companyId?: string): Promise<Opportunity[]> {
  await delay(300);
  let liveBackendOpps: Opportunity[] = [];
  try {
    const res = await fetch(`${PYTHON_BACKEND_URL}/api/opportunities`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.opportunities) {
        liveBackendOpps.push(...data.opportunities);
      }
    }
  } catch (e) {}

  try {
    const res = await fetch(`${GATEWAY_URL}/api/opportunities`);
    if (res.ok) {
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
      companyName: companyName,
      logoUrl: logoUrl,
      companyDescription: '',
      location: newOpp.location
    };

    // 1. Sync to Hiero Gateway API (http://localhost:2816)
    try {
      await fetch(`${GATEWAY_URL}/api/opportunities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log(`✅ [HIERO Sync] Opportunity for "${companyName}" published to Hiero Gateway on port 2816`);
    } catch (err) {
      console.warn('⚠️ [HIERO Gateway Sync] Warning:', err);
    }

    // 2. Sync to Central Python Backend
    try {
      await fetch(`${PYTHON_BACKEND_URL}/api/opportunities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log(`✅ [Python Backend Sync] Opportunity for "${companyName}" published to Python Backend`);
    } catch (err) {
      console.warn('⚠️ [Python Backend Sync] Warning:', err);
    }
  } catch (err) {
    console.warn('⚠️ [HIERO Sync] Network fallback to local storage:', err);
  }

  return newOpp;
}

export async function getOpportunityById(id: string): Promise<Opportunity | null> {
  await delay(200);
  const custom = getStoredCustomOpps().find(o => o.id === id);
  if (custom) return custom;
  return demoOpportunities.find(o => o.id === id) ?? null;
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

export async function getApplications(companyId?: string): Promise<Application[]> {
  await delay(300);
  const opps = await getOpportunities(companyId);
  const companyOppIds = opps.map(o => o.id);

  let backendApps: Application[] = [];
  
  // 1. Try Python Backend
  try {
    const pyRes = await fetch(`${PYTHON_BACKEND_URL}/api/applications`);
    if (pyRes.ok) {
      const pyData = await pyRes.json();
      if (pyData.success && pyData.applications) {
        backendApps.push(...pyData.applications.map((b: any) => ({
          id: b.id || `app-${Date.now()}`,
          opportunityId: b.opportunity_id || b.opportunityId,
          companyId: companyId || 'c1',
          companyName: b.company_name || b.companyName,
          studentId: b.student_id || b.studentId || 'cand-1',
          studentName: b.student_name || b.studentName || 'Jaswanth Kumar',
          status: b.status || 'applied',
          matchScore: b.match_score || b.matchScore || 92,
          appliedAt: b.applied_at || b.appliedAt || new Date().toISOString(),
          resumeUrl: b.resume_url || b.resumeUrl || '/resumes/jaswanth_resume.pdf',
          matchingSkills: [
            { name: 'Python', score: 95 },
            { name: 'React', score: 92 },
            { name: 'TypeScript', score: 90 }
          ],
          missingSkills: []
        })));
      }
    }
  } catch (e) {}

  // 2. Try Node Gateway (port 2816)
  try {
    const res = await fetch(`${GATEWAY_URL}/api/opportunities/applications`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.applications) {
        backendApps.push(...data.applications.map((b: any) => ({
          id: b.id || `app-${Date.now()}`,
          opportunityId: b.opportunityId,
          companyId: companyId || 'c1',
          companyName: b.companyName,
          studentId: b.studentId || 'cand-1',
          studentName: b.studentName || 'Jaswanth Kumar',
          status: b.status || 'applied',
          matchScore: b.matchScore || 92,
          appliedAt: b.appliedAt || new Date().toISOString(),
          resumeUrl: b.resumeUrl || '/resumes/jaswanth_resume.pdf',
          matchingSkills: [
            { name: 'Python', score: 95 },
            { name: 'React', score: 92 },
            { name: 'TypeScript', score: 90 }
          ],
          missingSkills: []
        })));
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

  const allApps = [...backendApps, ...customApps, ...demoApplications];
  const appMap = new Map();
  allApps.forEach(a => {
    if (a && a.id && !appMap.has(a.id)) {
      appMap.set(a.id, a);
    }
  });

  const merged = Array.from(appMap.values());
  if (!companyId) return merged;

  const filtered = merged.filter(a =>
    companyOppIds.includes(a.opportunityId) ||
    a.companyId === companyId ||
    (a as any).companyName ||
    a.id.startsWith('app-') ||
    a.opportunityId.startsWith('app-') ||
    a.opportunityId.startsWith('opp-') ||
    a.status === 'applied'
  );
  return filtered.length > 0 ? filtered : merged;
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

export async function getStudentApplications(studentId: string = 'cand-1'): Promise<Application[]> {
  await delay(250);
  const customApps = getStoredCustomApps();
  const allApps = [...customApps, ...demoApplications];
  return allApps.filter(a => a.studentId === studentId);
}

// --- Match Results ---
export async function getMatchResults(opportunityId: string): Promise<MatchResult[]> {
  await delay(400);
  return generateMatchResults(opportunityId);
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
