import type { Industry, OpportunityType } from '../types';

// ============================================================
// What a business is offered when it posts
// ============================================================
// Connect's post form grew out of campus hiring, so every company was shown
// "Internship — fixed-term campus / fresher role" and asked for a job title
// like "Software Development Intern". A salon hiring a manager is told, in
// the first thing it reads, that this product is for somebody else.
//
// The trade decides which job shapes are offered and what the examples look
// like. Nothing is removed from the system — a salon can still post a
// contract role — it is the order and the wording that change.

export interface TypeOption {
  id: OpportunityType;
  label: string;
  hint: string;
}

export interface IndustryProfile {
  label: string;
  types: TypeOption[];
  /** Shown in the title, description and pay fields. */
  example: { title: string; description: string; salary: string; skills: string; eligibility: string };
}

const FULL_TIME: TypeOption = { id: 'full-time', label: 'Full-time', hint: 'Permanent, full hours' };
const PART_TIME: TypeOption = { id: 'part-time', label: 'Part-time', hint: 'Fixed days or shifts' };
const CONTRACT: TypeOption = { id: 'contract', label: 'Contract', hint: 'Fixed term or seasonal' };
const TRAINEE: TypeOption = { id: 'apprenticeship', label: 'Trainee', hint: 'Learns on the job' };
const INTERNSHIP: TypeOption = { id: 'internship', label: 'Internship', hint: 'Student or fresher placement' };
const PROJECT: TypeOption = { id: 'project', label: 'Project', hint: 'One piece of work, freelance' };

export const INDUSTRIES: Record<Industry, IndustryProfile> = {
  salon: {
    label: 'Salon & beauty',
    types: [FULL_TIME, PART_TIME, TRAINEE, CONTRACT],
    example: {
      title: 'e.g. Salon Manager, Senior Stylist, Beautician',
      description: 'What they will run day to day, the hours, and who they work with.',
      salary: '₹25,000 – 32,000 / month',
      skills: 'Salon management, Customer service, Billing, Hair colouring',
      eligibility: 'Any graduate or 12th pass, 2+ years in a salon',
    },
  },
  retail: {
    label: 'Retail & shops',
    types: [FULL_TIME, PART_TIME, TRAINEE, CONTRACT],
    example: {
      title: 'e.g. Store Manager, Cashier, Sales Associate',
      description: 'Daily responsibilities, shop timings, and what a good day looks like.',
      salary: '₹18,000 – 25,000 / month',
      skills: 'Billing, Stock handling, Customer service, Visual merchandising',
      eligibility: '12th pass or graduate, retail experience preferred',
    },
  },
  hospitality: {
    label: 'Hotels & restaurants',
    types: [FULL_TIME, PART_TIME, CONTRACT, TRAINEE],
    example: {
      title: 'e.g. Restaurant Manager, Chef, Front Desk Executive',
      description: 'Shifts, covers per service, and the team they will work alongside.',
      salary: '₹20,000 – 30,000 / month',
      skills: 'Guest handling, POS billing, Food safety, Team supervision',
      eligibility: 'Hotel management or equivalent experience',
    },
  },
  healthcare: {
    label: 'Clinics & healthcare',
    types: [FULL_TIME, PART_TIME, CONTRACT, TRAINEE],
    example: {
      title: 'e.g. Clinic Administrator, Staff Nurse, Lab Technician',
      description: 'Patient load, shift pattern, and any registration you require.',
      salary: '₹22,000 – 35,000 / month',
      skills: 'Patient care, Appointment scheduling, Record keeping',
      eligibility: 'Relevant qualification and registration',
    },
  },
  education: {
    label: 'Schools & institutes',
    types: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP],
    example: {
      title: 'e.g. Academic Coordinator, Maths Faculty, Lab Assistant',
      description: 'Subjects, teaching hours, and the age group they will handle.',
      salary: '₹25,000 – 40,000 / month',
      skills: 'Lesson planning, Classroom management, Subject expertise',
      eligibility: 'Post-graduate in the subject, B.Ed preferred',
    },
  },
  manufacturing: {
    label: 'Manufacturing & plants',
    types: [FULL_TIME, CONTRACT, TRAINEE, PART_TIME],
    example: {
      title: 'e.g. Production Supervisor, Machine Operator, QC Inspector',
      description: 'Shift pattern, line or machine, and the safety standards you hold.',
      salary: '₹20,000 – 32,000 / month',
      skills: 'Machine operation, Quality control, Safety compliance',
      eligibility: 'ITI / Diploma, or equivalent shop-floor experience',
    },
  },
  technology: {
    label: 'Technology',
    types: [FULL_TIME, INTERNSHIP, PROJECT, CONTRACT],
    example: {
      title: 'e.g. Backend Engineer, Data Analyst',
      description: 'Role, responsibilities, and what you are hiring for.',
      salary: '12–16 LPA',
      skills: 'React, Python, SQL',
      eligibility: 'B.Tech / BE / MCA, or equivalent experience',
    },
  },
  general: {
    label: 'Something else',
    types: [FULL_TIME, PART_TIME, CONTRACT, TRAINEE, INTERNSHIP, PROJECT],
    example: {
      title: 'e.g. Operations Manager, Accountant',
      description: 'The role, the hours, and what the person will be responsible for.',
      salary: '₹25,000 / month',
      skills: 'The skills you will actually judge applicants on',
      eligibility: 'Who you will consider — qualifications or experience',
    },
  },
};

export function profileFor(industry?: Industry | string): IndustryProfile {
  const key = String(industry || 'general') as Industry;
  return INDUSTRIES[key] || INDUSTRIES.general;
}

/** For the sign-up form and settings — ordered, with 'general' last. */
export const INDUSTRY_CHOICES: { id: Industry; label: string }[] = [
  ...(Object.keys(INDUSTRIES) as Industry[])
    .filter(key => key !== 'general')
    .map(id => ({ id, label: INDUSTRIES[id].label })),
  { id: 'general' as Industry, label: INDUSTRIES.general.label },
];
