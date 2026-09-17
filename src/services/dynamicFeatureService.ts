// ============================================================
// Dynamic Feature & Capability Engine for Industry & Admin
// ============================================================
// Dynamically discovers and provides all portal features,
// operations, and contextual suggestions based on live data,
// active recruiter/company profile, and current route context.
// ============================================================

import {
  getCandidates,
  getOpportunities,
  getApplications,
  getColleges,
  getDashboardStats,
  type College,
} from './hiroService';
import { useAuthStore } from '../store/authStore';
import type { Candidate, Opportunity, Application } from '../types';

export interface DynamicFeatureAction {
  id: string;
  title: string;
  description: string;
  category: string;
  roleRequired: 'industry' | 'admin' | 'all';
  prompt: string;
  iconName: string;
  badge?: string;
  actionPayload?: {
    type: 'NAVIGATE' | 'COMMAND' | 'FILTER' | 'SEND_OFFER' | 'SHORTLIST';
    path?: string;
    data?: any;
  };
}

export interface DynamicFeatureCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badgeCount?: number;
  features: DynamicFeatureAction[];
}

export interface DynamicPortalContext {
  activeCompany: string;
  recruiterName: string;
  totalCandidates: number;
  totalOpportunities: number;
  totalApplications: number;
  totalShortlisted: number;
  totalColleges: number;
  topSkills: string[];
  topColleges: string[];
  recentCandidateNames: string[];
  activeJobTitles: string[];
  currentRoute: string;
}

/**
 * Fetches real-time live telemetry data from all portal modules.
 */
export async function getDynamicPortalContext(currentRoute = '/industry'): Promise<DynamicPortalContext> {
  const user = useAuthStore.getState().user;
  const companyId = user?.companyId || 'c1';
  const companyName = (user as any)?.companyName || (user?.name ? `${user.name}'s Company` : 'TechNova');
  const recruiterName = user?.name || 'Recruiter Lead';

  const [candidates, opportunities, applications, colleges] = await Promise.all([
    getCandidates().catch(() => [] as Candidate[]),
    getOpportunities(companyId).catch(() => [] as Opportunity[]),
    getApplications(companyId).catch(() => [] as Application[]),
    getColleges().catch(() => [] as College[]),
  ]);

  // Aggregate skills
  const skillSet = new Set<string>();
  candidates.forEach(c => {
    c.skills?.forEach(s => skillSet.add(s.name));
  });

  // Shortlisted count
  const shortlistedCount = applications.filter(a => a.status === 'shortlisted' || a.status === 'selected').length;

  return {
    activeCompany: companyName,
    recruiterName,
    totalCandidates: candidates.length,
    totalOpportunities: opportunities.length,
    totalApplications: applications.length,
    totalShortlisted: shortlistedCount,
    totalColleges: colleges.length,
    topSkills: Array.from(skillSet).slice(0, 8),
    topColleges: colleges.map(c => c.name).slice(0, 6),
    recentCandidateNames: candidates.map(c => c.name).slice(0, 6),
    activeJobTitles: opportunities.map(o => o.title).slice(0, 6),
    currentRoute,
  };
}

/**
 * Generates all dynamic features and operations available to Industries and Admins.
 */
export async function getDynamicFeatureCatalog(currentRoute = '/industry'): Promise<DynamicFeatureCategory[]> {
  const ctx = await getDynamicPortalContext(currentRoute);

  const topCand1 = ctx.recentCandidateNames[0] || 'Top Candidate';
  const topCand2 = ctx.recentCandidateNames[1] || 'Verified Applicant';
  const activeJob1 = ctx.activeJobTitles[0] || 'Software Engineer';
  const activeJob2 = ctx.activeJobTitles[1] || 'AI / ML Engineer';
  const topSkill1 = ctx.topSkills[0] || 'Python';
  const topSkill2 = ctx.topSkills[1] || 'React';
  const topCollege1 = ctx.topColleges[0] || 'NIT Warangal';
  const topCollege2 = ctx.topColleges[1] || 'IIT Hyderabad';

  return [
    {
      id: 'talent-sourcing',
      title: 'Talent Sourcing & Intelligence',
      description: `Search & filter among ${ctx.totalCandidates} verified student profiles across partner campuses.`,
      iconName: 'Users',
      badgeCount: ctx.totalCandidates,
      features: [
        {
          id: 'feat-filter-skill',
          title: `Filter by ${topSkill1} & ${topSkill2}`,
          description: `Find top scoring students proficient in ${topSkill1} (>85%).`,
          category: 'talent-sourcing',
          roleRequired: 'all',
          prompt: `Find candidates with ${topSkill1} > 85% and ${topSkill2}`,
          iconName: 'Sparkles',
          badge: `${topSkill1} > 85%`,
        },
        {
          id: 'feat-filter-college',
          title: `Source from ${topCollege1}`,
          description: `Show verified batch candidates from ${topCollege1}.`,
          category: 'talent-sourcing',
          roleRequired: 'all',
          prompt: `Show campus candidates from ${topCollege1}`,
          iconName: 'GraduationCap',
          badge: 'Campus Drive',
        },
        {
          id: 'feat-cgpa-filter',
          title: 'High Academic Merit Filter',
          description: 'Filter candidates with CGPA > 8.5 and strong project portfolios.',
          category: 'talent-sourcing',
          roleRequired: 'all',
          prompt: 'Find candidates with CGPA > 8.5',
          iconName: 'Award',
          badge: 'CGPA > 8.5',
        },
        {
          id: 'feat-view-applications',
          title: 'Applications & Resume Viewer',
          description: `Inspect ${ctx.totalApplications} applicant dossiers with in-page A4 PDF resumes.`,
          category: 'talent-sourcing',
          roleRequired: 'all',
          prompt: 'Go to applications',
          iconName: 'FileText',
          actionPayload: { type: 'NAVIGATE', path: '/industry/applications' },
        },
      ],
    },
    {
      id: 'job-management',
      title: 'Job & Internship Management',
      description: `Manage ${ctx.totalOpportunities} active postings, criteria, and campus distribution.`,
      iconName: 'Briefcase',
      badgeCount: ctx.totalOpportunities,
      features: [
        {
          id: 'feat-post-job',
          title: 'Create New Opportunity',
          description: 'Draft and publish a new full-time role or internship opening with interactive wizard.',
          category: 'job-management',
          roleRequired: 'industry',
          prompt: 'Create new opportunity',
          iconName: 'PlusCircle',
          badge: 'Interactive Wizard',
        },
        {
          id: 'feat-view-jobs',
          title: 'View Active Opportunities',
          description: `Manage listings, view applicant counts, and close or edit vacancies (${ctx.totalOpportunities} active).`,
          category: 'job-management',
          roleRequired: 'all',
          prompt: 'Go to jobs',
          iconName: 'Briefcase',
          actionPayload: { type: 'NAVIGATE', path: '/industry/jobs' },
        },
        {
          id: 'feat-match-job',
          title: `Match Talent for ${activeJob1}`,
          description: `Execute AI match scoring for "${activeJob1}" against live student pool.`,
          category: 'job-management',
          roleRequired: 'industry',
          prompt: `Show best matching candidates for ${activeJob1}`,
          iconName: 'Target',
          badge: 'AI Match',
        },
      ],
    },
    {
      id: 'shortlist-hiring',
      title: 'Shortlisting & Selection Offers',
      description: `Review ${ctx.totalShortlisted} shortlisted students and dispatch official selection offers.`,
      iconName: 'Star',
      badgeCount: ctx.totalShortlisted,
      features: [
        {
          id: 'feat-shortlist-top',
          title: `Shortlist ${topCand1}`,
          description: `Move ${topCand1} into shortlisted pool for ${activeJob1}.`,
          category: 'shortlist-hiring',
          roleRequired: 'industry',
          prompt: `Shortlist ${topCand1} for ${activeJob1}`,
          iconName: 'Star',
          badge: '1-Click Shortlist',
        },
        {
          id: 'feat-send-offer',
          title: `Send Selection Notice to ${topCand1}`,
          description: `Generate formal offer letter and notify campus placement office & student portal.`,
          category: 'shortlist-hiring',
          roleRequired: 'industry',
          prompt: `Send selection notice to ${topCand1}`,
          iconName: 'CheckCircle2',
          badge: 'Offer Dispatch',
        },
        {
          id: 'feat-view-shortlisted',
          title: 'Open Shortlisted Candidates Tab',
          description: 'View candidates marked for interview, download rosters, and manage offer letters.',
          category: 'shortlist-hiring',
          roleRequired: 'all',
          prompt: 'Go to shortlisted',
          iconName: 'ListOrdered',
          actionPayload: { type: 'NAVIGATE', path: '/industry/shortlisted' },
        },
      ],
    },
    {
      id: 'pipeline-funnel',
      title: 'Hiring Pipeline & Review Stages',
      description: 'Progress candidates through Screening, Technical Interview, HR Round, and Offer Extended.',
      iconName: 'GitBranch',
      features: [
        {
          id: 'feat-open-pipeline',
          title: 'Interactive Pipeline Kanban',
          description: 'Drag & drop candidates across recruitment stages with live status sync.',
          category: 'pipeline-funnel',
          roleRequired: 'all',
          prompt: 'Go to pipeline',
          iconName: 'LayoutGrid',
          actionPayload: { type: 'NAVIGATE', path: '/industry/pipeline' },
        },
        {
          id: 'feat-advance-candidate',
          title: `Advance ${topCand2} to Technical Round`,
          description: 'Transition applicant to technical evaluation and schedule coding test.',
          category: 'pipeline-funnel',
          roleRequired: 'industry',
          prompt: `Move ${topCand2} to technical interview round`,
          iconName: 'ArrowRightCircle',
          badge: 'Pipeline Action',
        },
      ],
    },
    {
      id: 'campus-network',
      title: 'Campus & Institutional Network',
      description: `Collaborate with ${ctx.totalColleges} premier universities, NITs, IITs, and BITS campuses.`,
      iconName: 'Landmark',
      badgeCount: ctx.totalColleges,
      features: [
        {
          id: 'feat-view-colleges',
          title: 'Partner Institutions Directory',
          description: `Review student rosters and departments across ${topCollege1}, ${topCollege2}, and more.`,
          category: 'campus-network',
          roleRequired: 'all',
          prompt: 'Show connected partner universities and colleges',
          iconName: 'Building',
          badge: `${ctx.totalColleges} Campuses`,
        },
        {
          id: 'feat-campus-drive',
          title: `Launch Drive at ${topCollege1}`,
          description: `Initiate priority campus drive and notify ${topCollege1} placement coordinator.`,
          category: 'campus-network',
          roleRequired: 'industry',
          prompt: `Show campus candidates from ${topCollege1}`,
          iconName: 'Send',
          badge: 'Campus Drive',
        },
      ],
    },
    {
      id: 'recruitment-analytics',
      title: 'Recruitment Analytics & Reports',
      description: 'Real-time telemetry, conversion rates, skill heatmaps, and downloadable intelligence reports.',
      iconName: 'BarChart3',
      features: [
        {
          id: 'feat-today-summary',
          title: "Today's Recruitment Summary",
          description: 'Real-time breakdown of applications, shortlists, interview conversion, and active roles.',
          category: 'recruitment-analytics',
          roleRequired: 'all',
          prompt: "Summarize today's recruitment stats",
          iconName: 'PieChart',
          badge: 'Live KPI',
        },
        {
          id: 'feat-skill-demand',
          title: 'Top Demanded Skills Matrix',
          description: 'Compare job requirements against verified student skill competencies in the talent pool.',
          category: 'recruitment-analytics',
          roleRequired: 'all',
          prompt: 'What are the top skills in demand across our jobs?',
          iconName: 'Flame',
          badge: 'Skill Matrix',
        },
        {
          id: 'feat-dashboard-view',
          title: 'Open Executive Dashboard',
          description: 'View full graphics, telemetry cards, and placement charts.',
          category: 'recruitment-analytics',
          roleRequired: 'all',
          prompt: 'Go to dashboard',
          iconName: 'LayoutDashboard',
          actionPayload: { type: 'NAVIGATE', path: '/industry' },
        },
      ],
    },
    {
      id: 'ai-intelligence',
      title: 'AI JD Intelligence & Skill Extraction',
      description: 'Extract technical requirements, frameworks, and experience levels from unstructured text.',
      iconName: 'FileCode2',
      features: [
        {
          id: 'feat-extract-fullstack',
          title: 'Extract Fullstack Stack from JD',
          description: 'Parse frontend, backend, databases, and DevOps competencies from raw text.',
          category: 'ai-intelligence',
          roleRequired: 'all',
          prompt: 'Extract skills from JD: Senior Fullstack Engineer with React, Node.js, TypeScript, Docker, AWS, PostgreSQL, REST APIs',
          iconName: 'Cpu',
          badge: 'AI Parser',
        },
        {
          id: 'feat-extract-ai',
          title: 'Extract AI / ML Engineering Stack',
          description: 'Extract PyTorch, LangChain, Vector Databases, Python, and cloud infrastructure.',
          category: 'ai-intelligence',
          roleRequired: 'all',
          prompt: 'Extract skills from JD: AI Engineer with Python, PyTorch, LangChain, Vector DBs, FastAPI, Docker, Cloud DevOps',
          iconName: 'Terminal',
          badge: 'AI Parser',
        },
      ],
    },
    {
      id: 'admin-enterprise',
      title: 'Company Branding & Admin Settings',
      description: `Configure ${ctx.activeCompany} profile, recruiter details, and integration endpoints.`,
      iconName: 'Settings',
      features: [
        {
          id: 'feat-company-profile',
          title: `${ctx.activeCompany} Profile & Branding`,
          description: `Update company logo, website, description, and ${ctx.recruiterName}'s designation.`,
          category: 'admin-enterprise',
          roleRequired: 'industry',
          prompt: 'Go to company',
          iconName: 'Building2',
          actionPayload: { type: 'NAVIGATE', path: '/industry/company' },
        },
        {
          id: 'feat-portal-settings',
          title: 'Portal Settings & API Gateway',
          description: 'Configure Hiero Gateway URL, Python AI backend, sound effects, and notifications.',
          category: 'admin-enterprise',
          roleRequired: 'admin',
          prompt: 'Go to settings',
          iconName: 'Sliders',
          actionPayload: { type: 'NAVIGATE', path: '/industry/settings' },
        },
        {
          id: 'feat-toggle-theme',
          title: 'Toggle Dark / Light Portal Theme',
          description: 'Switch visual theme contrast for optimal recruiter comfort.',
          category: 'admin-enterprise',
          roleRequired: 'all',
          prompt: 'Toggle Dark / Light Theme',
          iconName: 'SunMoon',
          badge: 'Appearance',
        },
      ],
    },
  ];
}

/**
 * Dynamically generates context-aware quick action pills based on active page and live data.
 */
export async function getDynamicQuickPills(currentRoute = '/industry'): Promise<{ label: string; prompt: string; iconName: string }[]> {
  const ctx = await getDynamicPortalContext(currentRoute);

  const topCand = ctx.recentCandidateNames[0] || 'Top Candidate';
  const activeJob = ctx.activeJobTitles[0] || 'Software Engineer';
  const topSkill = ctx.topSkills[0] || 'Python';
  const topCollege = ctx.topColleges[0] || 'NIT Warangal';

  // Contextual by route
  if (currentRoute.includes('application')) {
    return [
      { label: `Filter ${topSkill} > 85%`, prompt: `Find candidates with ${topSkill} > 85%`, iconName: 'Users' },
      { label: `Filter ${topCollege}`, prompt: `Show campus candidates from ${topCollege}`, iconName: 'GraduationCap' },
      { label: `Shortlist ${topCand}`, prompt: `Shortlist ${topCand}`, iconName: 'Star' },
      { label: 'CGPA > 8.5 Filter', prompt: 'Find candidates with CGPA > 8.5', iconName: 'Award' },
      { label: "Today's Stats", prompt: "Summarize today's recruitment stats", iconName: 'BarChart3' },
    ];
  }

  if (currentRoute.includes('job')) {
    return [
      { label: 'Create New Opportunity', prompt: 'Create new opportunity', iconName: 'PlusCircle' },
      { label: `Match for ${activeJob}`, prompt: `Show best matching candidates for ${activeJob}`, iconName: 'Target' },
      { label: 'Extract JD Skills', prompt: 'Extract skills from JD: AI Fullstack Engineer with React, Python, FastAPI, Docker, Cloud AWS', iconName: 'FileCode2' },
      { label: 'Go to Applications', prompt: 'Go to applications', iconName: 'FileText' },
    ];
  }

  if (currentRoute.includes('shortlisted')) {
    return [
      { label: `Send Offer to ${topCand}`, prompt: `Send selection notice to ${topCand}`, iconName: 'CheckCircle2' },
      { label: 'Open Hiring Pipeline', prompt: 'Go to pipeline', iconName: 'GitBranch' },
      { label: "Today's Summary", prompt: "Summarize today's recruitment stats", iconName: 'BarChart3' },
      { label: `Campus Drive (${topCollege})`, prompt: `Show campus candidates from ${topCollege}`, iconName: 'GraduationCap' },
    ];
  }

  if (currentRoute.includes('pipeline')) {
    return [
      { label: `Move ${topCand} to Tech Interview`, prompt: `Move ${topCand} to technical interview round`, iconName: 'ArrowRightCircle' },
      { label: 'View Shortlisted Tab', prompt: 'Go to shortlisted', iconName: 'Star' },
      { label: 'Go to Dashboard', prompt: 'Go to dashboard', iconName: 'LayoutDashboard' },
      { label: 'Recruiter Stats', prompt: "Summarize today's recruitment stats", iconName: 'BarChart3' },
    ];
  }

  // Default Dashboard / General
  return [
    { label: "Today's Stats", prompt: "Summarize today's recruitment stats", iconName: 'BarChart3' },
    { label: `Find ${topSkill} Talent`, prompt: `Find candidates with ${topSkill} > 85%`, iconName: 'Users' },
    { label: 'Create Opportunity', prompt: 'Create new opportunity', iconName: 'Briefcase' },
    { label: `Shortlist ${topCand}`, prompt: `Shortlist ${topCand}`, iconName: 'Star' },
    { label: `Campuses (${ctx.totalColleges})`, prompt: 'Show connected partner universities and colleges', iconName: 'Landmark' },
    { label: 'Go to Pipeline', prompt: 'Go to pipeline', iconName: 'Compass' },
  ];
}

/**
 * Generates dynamic suggested next steps for any assistant response.
 */
export async function getDynamicSuggestedPrompts(
  lastIntentType: string,
  lastCandidateName?: string,
  lastJobTitle?: string,
  currentRoute = '/industry'
): Promise<string[]> {
  const ctx = await getDynamicPortalContext(currentRoute);
  const targetCand = lastCandidateName || ctx.recentCandidateNames[0] || 'Candidate';
  const targetJob = lastJobTitle || ctx.activeJobTitles[0] || 'Software Engineer';
  const targetSkill = ctx.topSkills[0] || 'Python';
  const targetCollege = ctx.topColleges[0] || 'NIT Warangal';

  if (lastIntentType === 'shortlist_candidate') {
    return [
      `Send selection notice to ${targetCand}`,
      'Go to shortlisted candidates',
      'Open Hiring Pipeline',
      `Find more candidates with ${targetSkill} > 85%`,
    ];
  }

  if (lastIntentType === 'search_candidates') {
    return [
      `Shortlist ${targetCand}`,
      `Show campus candidates from ${targetCollege}`,
      'Find candidates with CGPA > 8.5',
      'Go to applications',
    ];
  }

  if (lastIntentType === 'create_job') {
    return [
      `Show best matching candidates for ${targetJob}`,
      'Go to jobs',
      'Go to applications',
      "Summarize today's recruitment stats",
    ];
  }

  if (lastIntentType === 'send_offer') {
    return [
      'Go to shortlisted candidates',
      'Open Hiring Pipeline',
      "Summarize today's recruitment stats",
      `Shortlist ${ctx.recentCandidateNames[1] || 'next candidate'}`,
    ];
  }

  if (lastIntentType === 'analytics_summary') {
    return [
      `Find candidates with ${targetSkill} > 85%`,
      'Show connected partner universities and colleges',
      'Create new opportunity',
      'Go to pipeline',
    ];
  }

  // Default dynamic suggestions
  return [
    "Today's recruitment stats",
    `Find ${targetSkill} talent (>85%)`,
    `Shortlist ${targetCand}`,
    `Show candidates from ${targetCollege}`,
  ];
}
