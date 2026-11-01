// ============================================================
// HieroConnect — TypeScript Types
// ============================================================

// --- Auth & Users ---
export type UserRole = 'industry';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  /** What this account is inside Connect, from the signed token: an ordinary
   *  company recruiter, or a HIERO admin who can let companies in. */
  accountRole?: 'recruiter' | 'admin';
  /** The company's trade, used to shape what it is offered when posting. */
  industry?: Industry;
  companyId: string;
  companyName?: string;
  designation: string;
  phone: string;
}

// --- Company ---
export type CompanySize = '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';

export interface Company {
  id: string;
  name: string;
  email: string;
  industry: string;
  size: CompanySize;
  location: string;
  website: string;
  description: string;
  logo?: string;
  logoUrl?: string;
  recruiter: RecruiterInfo;
  createdAt: string;
}

export interface RecruiterInfo {
  name: string;
  designation: string;
  phone: string;
  email: string;
}

// --- Opportunities (Jobs, Internships, Projects, Apprenticeships) ---
// Connect started on campus hiring, so these were the four shapes a campus
// drive takes. A salon, a shop or a clinic hires in different ones, and being
// offered "Internship — fixed-term campus / fresher role" for a salon manager
// is the product telling them it is not for them.
export type OpportunityType =
  | 'full-time'
  | 'part-time'
  | 'internship'
  | 'apprenticeship'
  | 'contract'
  | 'project';

/** What kind of business this company is. Decides which job shapes and
 *  examples it is offered. */
export type Industry =
  | 'general'
  | 'salon'
  | 'retail'
  | 'hospitality'
  | 'healthcare'
  | 'education'
  | 'manufacturing'
  | 'technology';
export type WorkMode = 'on-site' | 'hybrid' | 'remote';
export type OpportunityStatus = 'active' | 'draft' | 'closed';

export interface SkillRequirement {
  name: string;
  importance: 'high' | 'medium' | 'low';
  category: 'required' | 'preferred';
}

export interface Opportunity {
  id: string;
  companyId: string;
  companyName?: string;
  logoUrl?: string;
  type: OpportunityType;
  title: string;
  department: string;
  description: string;
  requiredSkills: SkillRequirement[];
  preferredSkills: SkillRequirement[];
  eligibility: string;
  location: string;
  workMode: WorkMode;
  employmentType: string;
  salary: string;
  deadline: string;
  status: OpportunityStatus;
  applicantsCount: number;
  shortlistedCount: number;
  createdAt: string;
}

// --- Candidates (from HIERO) ---
export interface CandidateSkill {
  name: string;
  competency: number; // 0-100
  verified: boolean;
  lastAssessedAt: string;
}

export interface CandidateProject {
  title: string;
  description?: string;
  skills?: string[];
  url?: string;
  tech?: string;
  link?: string;
}

export interface CandidateEducation {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
  cgpa?: number;
}

export interface CandidateExperience {
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  skills: string[];
}

export interface CandidateCertification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  headline: string;
  location: string;
  skills: CandidateSkill[];
  projects: CandidateProject[];
  education: CandidateEducation[];
  experience: CandidateExperience[];
  certifications: CandidateCertification[];
  resumeUrl?: string;
  aboutMe?: string;
  cgpa?: number;
  passingYear?: number;
  score?: number;
  links?: any;
  hieroAssessments?: HieroAssessment[];
  authorizedSections: string[]; // which sections company can view
  createdAt?: string;
}

export interface HieroAssessment {
  skill: string;
  score: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'master';
  assessedAt: string;
}

// --- Applications ---
export type ApplicationStatus =
  | 'applied'
  | 'under-review'
  | 'shortlisted'
  | 'interview'
  | 'selected'
  | 'rejected';

export interface Application {
  id: string;
  opportunityId: string;
  oppId?: string;
  studentId: string;
  companyId?: string;
  companyName?: string;
  studentName?: string;
  resumeUrl?: string;
  matchScore?: number;
  hieroVerified?: boolean;
  matchingSkills: { name: string; score: number }[];
  missingSkills?: { name: string }[];
  skillsMatch?: { matched: string[]; missing: string[] };
  skillGaps?: { name: string; required: number; candidate: number }[];
  status: ApplicationStatus;
  appliedAt: string;
  notes?: string;
  campusName?: string;
  campusLocation?: string;
  cgpa?: number;
  department?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  source?: 'bridge' | 'hiero' | 'demo';
  projects?: { title: string; description?: string; skills?: string[]; tech?: string; link?: string; url?: string }[];
  portfolioUrl?: string;
  selectionNotifiedAt?: string;
  /** Stamped by the gateway when a recruiter mail actually goes out. */
  interviewMailSentAt?: string;
  rejectionNotifiedAt?: string;
  lastContactedAt?: string;
  lastMailSubject?: string;
  /** The slot offered in the interview invitation, if one was given. */
  interviewAt?: string;
  /** Original filename of the uploaded resume. */
  resumeName?: string;
  /** Set once a recruiter sends an AI interview against this application. */
  interviewInvite?: {
    jti: string;
    status: 'sent' | 'started' | 'completed';
    sentAt?: string;
    sentBy?: string;
    startedAt?: string | null;
    expiresAt?: string;
  };
  student_id?: string;
  student_name?: string;
  opportunity_id?: string;
  match_score?: number;
  applied_at?: string;
  resume_url?: string;
  campus_name?: string;
  [key: string]: any;
}

// --- Shortlist ---
export interface ShortlistEntry {
  opportunityId: string;
  studentId: string;
  recruiterId: string;
  status: ApplicationStatus;
  notes: string;
  addedAt: string;
}

// --- Skill Extraction ---
export interface SkillExtractionResult {
  jobId: string;
  coreSkills: SkillRequirement[];
  additionalSkills: SkillRequirement[];
  rawText: string;
  extractedAt: string;
}

// --- Dashboard Stats ---
export interface DashboardStats {
  activeJobs: number;
  activeInternships: number;
  totalApplications: number;
  shortlistedCandidates: number;
  interviews: number;
  hires: number;
  topSkillsDemand: { skill: string; percentage: number }[];
}

// --- Match Result ---
export interface MatchResult {
  candidateId: string;
  overallScore: number;
  skillMatches: { name: string; score: number; meetsRequired: boolean }[];
  matchExplanation: string;
  strengths: string[];
  gaps: string[];
}

// --- Practice Record (HIERO interview sessions a student ran before applying) ---
// Mirrors the fields HIERO's InterviewSession model already stores: scorecard /
// evaluation scores out of 10, the skills each session evaluated, and what the
// student was told to improve. Scores are kept on HIERO's 0-10 scale.
export interface PracticeSkillTrend {
  name: string;
  first: number;
  latest: number;
}

export interface PracticeAttempt {
  sessionId: string;
  attempt: number;
  role: string;
  overallScore: number;
  technicalScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  completedAt: string;
  skills: { name: string; score: number }[];
  areasToImprove: string[];
}

export interface PracticeRecord {
  studentId: string;
  role: string;
  attempts: PracticeAttempt[];
  firstScore: number;
  latestScore: number;
  bestScore: number;
  firstAt: string;
  latestAt: string;
  skills: PracticeSkillTrend[];
  // Areas flagged on an early attempt that no longer appear on the latest one.
  resolved: string[];
  // Still flagged on the most recent attempt.
  outstanding: string[];
}
