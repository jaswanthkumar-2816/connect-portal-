import { create } from 'zustand';

export type CgpaOp = '>' | '>=' | '<' | '<=' | '=';

export interface InboxCriteria {
  label: string;
  sourcePrompt?: string;
  cgpa?: { op: CgpaOp; value: number };
  minMatchScore?: number;
  skills?: string[];
  campus?: string;
  status?: string;
}

interface InboxFilterState {
  criteria: InboxCriteria | null;
  animateToken: number;
  setCriteria: (criteria: InboxCriteria | null) => void;
  applyFromPrompt: (prompt: string) => InboxCriteria;
  clear: () => void;
}

function parseCgpa(prompt: string): InboxCriteria['cgpa'] | undefined {
  const m = prompt.match(
    /cgpa\s*(>=|<=|>|<|=|above|over|at\s+least|below|under|less\s+than|more\s+than)?\s*(\d+(?:\.\d+)?)/i
  );
  if (!m) return undefined;
  const rawOp = (m[1] || '>=').toLowerCase();
  const value = Number(m[2]);
  if (!Number.isFinite(value)) return undefined;

  let op: CgpaOp = '>=';
  if (rawOp === '>' || rawOp.includes('more') || rawOp === 'above' || rawOp === 'over') op = '>';
  else if (rawOp === '>=' || rawOp.includes('least')) op = '>=';
  else if (rawOp === '<' || rawOp.includes('less') || rawOp === 'below' || rawOp === 'under') op = '<';
  else if (rawOp === '<=') op = '<=';
  else if (rawOp === '=') op = '=';

  return { op, value };
}

function parseMinMatch(prompt: string): number | undefined {
  const m =
    prompt.match(/(?:match(?:\s*score)?|score)\s*(?:>=|>|above|over|at\s+least)?\s*(\d{1,3})\s*%?/i) ||
    prompt.match(/>\s*(\d{1,3})\s*%/);
  if (!m) return undefined;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : undefined;
}

function parseSkills(prompt: string): string[] {
  const known = [
    'python', 'react', 'typescript', 'javascript', 'java', 'sql', 'node', 'node.js',
    'aws', 'docker', 'kubernetes', 'machine learning', 'tensorflow', 'pytorch', 'fastapi',
  ];
  const lower = prompt.toLowerCase();
  return known.filter(s => lower.includes(s)).map(s =>
    s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').replace('Node.js', 'Node.js')
  );
}

function parseCampus(prompt: string): string | undefined {
  const m = prompt.match(/(?:from|at|campus|college|university)\s+([a-z0-9 .,&'-]{2,40})/i);
  if (!m) {
    if (/warangal|nitw/i.test(prompt)) return 'Warangal';
    if (/hyderabad|iith/i.test(prompt)) return 'Hyderabad';
    return undefined;
  }
  return m[1].trim().replace(/\s+(with|and|who|cgpa|skill).*$/i, '');
}

function buildLabel(c: Omit<InboxCriteria, 'label' | 'sourcePrompt'>): string {
  const parts: string[] = [];
  if (c.cgpa) parts.push(`CGPA ${c.cgpa.op} ${c.cgpa.value}`);
  if (c.minMatchScore != null) parts.push(`Match ≥ ${c.minMatchScore}%`);
  if (c.skills?.length) parts.push(`Skills: ${c.skills.join(', ')}`);
  if (c.campus) parts.push(`Campus: ${c.campus}`);
  if (c.status) parts.push(`Status: ${c.status}`);
  return parts.length ? parts.join(' · ') : 'Orbit criteria';
}

export function parseInboxCriteriaFromPrompt(prompt: string): InboxCriteria {
  const cgpa = parseCgpa(prompt);
  const minMatchScore = parseMinMatch(prompt);
  const skills = parseSkills(prompt);
  const campus = parseCampus(prompt);
  const status = /shortlist/i.test(prompt) && !/wizard/i.test(prompt) ? undefined : undefined;
  const base = {
    cgpa,
    minMatchScore,
    skills: skills.length ? skills : undefined,
    campus,
    status,
  };
  return {
    ...base,
    label: buildLabel(base),
    sourcePrompt: prompt.trim(),
  };
}

export function cgpaPasses(cgpa: number | undefined, rule?: InboxCriteria['cgpa']): boolean {
  if (!rule) return true;
  if (cgpa === undefined || cgpa === null || Number.isNaN(Number(cgpa))) return false;
  const v = Number(cgpa);
  switch (rule.op) {
    case '>': return v > rule.value;
    case '>=': return v >= rule.value;
    case '<': return v < rule.value;
    case '<=': return v <= rule.value;
    case '=': return Math.abs(v - rule.value) < 0.01;
    default: return true;
  }
}

export function applicationMatchesCriteria(app: {
  cgpa?: number;
  matchScore?: number;
  matchingSkills?: { name: string }[];
  skillsMatch?: { matched?: string[] };
  campusName?: string;
  department?: string;
  studentName?: string;
}, criteria: InboxCriteria | null): boolean {
  if (!criteria) return true;
  if (!cgpaPasses(app.cgpa, criteria.cgpa)) return false;
  if (criteria.minMatchScore != null) {
    if (typeof app.matchScore !== 'number' || app.matchScore < criteria.minMatchScore) return false;
  }
  if (criteria.skills?.length) {
    const hay = [
      ...(app.matchingSkills || []).map(s => s.name),
      ...(app.skillsMatch?.matched || []),
    ].join(' ').toLowerCase();
    const ok = criteria.skills.some(s => hay.includes(s.toLowerCase()));
    if (!ok) return false;
  }
  if (criteria.campus) {
    const campus = `${app.campusName || ''} ${app.department || ''}`.toLowerCase();
    if (!campus.includes(criteria.campus.toLowerCase())) return false;
  }
  return true;
}

export const useInboxFilterStore = create<InboxFilterState>((set) => ({
  criteria: null,
  animateToken: 0,

  setCriteria: (criteria) => set({ criteria, animateToken: Date.now() }),

  applyFromPrompt: (prompt) => {
    const criteria = parseInboxCriteriaFromPrompt(prompt);
    set({ criteria, animateToken: Date.now() });
    return criteria;
  },

  clear: () => set({ criteria: null }),
}));
