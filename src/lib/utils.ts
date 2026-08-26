import type { ApplicationStatus } from '../types';

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
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
  switch (status) {
    case 'applied': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    case 'under-review': return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
    case 'shortlisted': return 'bg-hiero-green/15 text-hiero-green border-hiero-green/30';
    case 'interview': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    case 'selected': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'rejected': return 'bg-red-500/15 text-red-400 border-red-500/30';
    default: return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
  }
}

export function getStatusLabel(status: ApplicationStatus): string {
  return status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
