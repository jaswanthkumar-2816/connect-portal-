import type { ApplicationStatus } from '../types';

/** Phase 1.5 lightweight pipeline (no offer letter). */
export const PIPELINE_STAGES = ['applied', 'shortlisted', 'interview', 'selected'] as const;
export type PipelineStage = (typeof PIPELINE_STAGES)[number];

const NEXT_STAGE: Record<PipelineStage, PipelineStage | null> = {
  applied: 'shortlisted',
  shortlisted: 'interview',
  interview: 'selected',
  selected: null,
};

const ADVANCE_LABEL: Record<PipelineStage, string> = {
  applied: 'Shortlist',
  shortlisted: 'Interview',
  interview: 'Select',
  selected: 'Selected',
};

/** Collapse legacy under-review into Applied for Phase 1.5. */
export function toPipelineStage(status: ApplicationStatus | string | undefined): PipelineStage | 'rejected' {
  const v = String(status || 'applied').toLowerCase();
  if (v === 'rejected') return 'rejected';
  if (v === 'shortlisted') return 'shortlisted';
  if (v === 'interview') return 'interview';
  if (v === 'selected') return 'selected';
  return 'applied'; // applied | under-review | unknown
}

export function nextPipelineStage(status: ApplicationStatus | string | undefined): PipelineStage | null {
  const stage = toPipelineStage(status);
  if (stage === 'rejected') return null;
  return NEXT_STAGE[stage];
}

export function advanceStatusLabel(status: ApplicationStatus | string | undefined): string | null {
  const stage = toPipelineStage(status);
  if (stage === 'rejected' || stage === 'selected') return null;
  return ADVANCE_LABEL[stage];
}

export function matchesStatusFilter(
  status: ApplicationStatus | string | undefined,
  filter: string
): boolean {
  if (!filter || filter === 'all') return true;
  if (filter === 'rejected') return toPipelineStage(status) === 'rejected';
  if (filter === 'applied') {
    const s = String(status || '').toLowerCase();
    return s === 'applied' || s === 'under-review' || toPipelineStage(status) === 'applied';
  }
  return toPipelineStage(status) === filter;
}

export function formatDate(dateStr: string): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateStr);
}

export function getStatusColor(status: ApplicationStatus): string {
  switch (toPipelineStage(status)) {
    case 'applied': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    case 'shortlisted': return 'bg-hiero-green/15 text-hiero-green border-hiero-green/30';
    case 'interview': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    case 'selected': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'rejected': return 'bg-red-500/15 text-red-400 border-red-500/30';
    default: return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
  }
}

export function getStatusLabel(status: ApplicationStatus): string {
  const stage = toPipelineStage(status);
  if (stage === 'rejected') return 'Rejected';
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function getMatchScoreColor(score: number): string {
  if (score >= 85) return 'text-hiero-green';
  if (score >= 70) return 'text-yellow-400';
  if (score >= 50) return 'text-orange-400';
  return 'text-red-400';
}

export function getMatchScoreBg(score: number): string {
  if (score >= 85) return 'bg-hiero-green/15 border-hiero-green/30';
  if (score >= 70) return 'bg-yellow-400/15 border-yellow-400/30';
  if (score >= 50) return 'bg-orange-400/15 border-orange-400/30';
  return 'bg-red-400/15 border-red-400/30';
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getOpportunityTypeLabel(type?: string): string {
  switch (type) {
    case 'internship': return 'Internship';
    case 'full-time': return 'Full-time';
    case 'part-time': return 'Part-time';
    case 'contract': return 'Contract';
    case 'project': return 'Project';
    case 'apprenticeship': return 'Apprenticeship';
    default: return type ? type : 'Opportunity';
  }
}

export function getOpportunityTypeTagClass(type?: string): string {
  switch (type) {
    case 'internship': return 'tag-skill-purple';
    case 'project': return 'tag-skill-green';
    case 'apprenticeship': return 'tag-skill-gray';
    case 'part-time': return 'tag-skill-purple';
    case 'contract': return 'tag-skill-gray';
    case 'full-time':
    default: return 'tag-skill-blue';
  }
}

export function employmentTypeFor(type?: string): string {
  return getOpportunityTypeLabel(type);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
