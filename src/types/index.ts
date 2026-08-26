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
  companyId: string;
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

// --- Opportunities (Jobs & Internships) ---
export type OpportunityType = 'full-time' | 'internship';
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
  description: string;
  skills: string[];
  url?: string;
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
  studentId: string;
  companyId?: string;
  companyName?: string;
  studentName?: string;
  resumeUrl?: string;
  matchScore: number;
  matchingSkills: { name: string; score: number }[];
  missingSkills?: { name: string }[];
  skillsMatch?: { matched: string[]; missing: string[] };
  skillGaps?: { name: string; required: number; candidate: number }[];
  status: ApplicationStatus;
  appliedAt: string;
  notes?: string;
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
