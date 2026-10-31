import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, ChevronRight, Inbox } from 'lucide-react';
import { getApplications, getOpportunities, updateApplicationStatus } from '../../services/hiroService';
import { useAuthStore } from '../../store/authStore';
import { matchesStatusFilter, nextPipelineStage, PIPELINE_STAGES, toPipelineStage } from '../../lib/utils';
import type { Application, Opportunity, ApplicationStatus } from '../../types';

const COLUMNS: {
  id: (typeof PIPELINE_STAGES)[number];
  title: string;
  accent: string;
  bg: string;
  text: string;
}[] = [
  { id: 'applied', title: 'Applied', accent: '#3b82f6', bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  { id: 'shortlisted', title: 'Shortlisted', accent: '#06c006', bg: 'rgba(6,192,6,0.12)', text: '#06c006' },
  { id: 'interview', title: 'Interview', accent: '#a855f7', bg: 'rgba(168,85,247,0.12)', text: '#a855f7' },
  { id: 'selected', title: 'Selected', accent: '#10b981', bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
];

/** Optional Kanban view — Inbox status filters are the Phase 1.5 primary path. */
export default function Pipeline() {
  const user = useAuthStore(s => s.user);
  const [applications, setApplications] = useState<Application[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.companyId) return;
    Promise.all([getApplications(user.companyId), getOpportunities(user.companyId)])
      .then(([a, o]) => {
        setApplications(a.filter(app => toPipelineStage(app.status) !== 'rejected'));
        setOpportunities(o);
      })
      .finally(() => setLoading(false));
  }, [user?.companyId]);

  const move = async (app: Application, status: ApplicationStatus) => {
    setBusyId(app.id);
    try {
      await updateApplicationStatus(app.id, status, app);
      setApplications(prev => prev.map(a => (a.id === app.id ? { ...a, status } : a)));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-[#06c006]/30 border-t-[#06c006] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 animate-slide-up">
        <div>
          <h1
            className="text-2xl font-black text-[var(--color-text)] flex items-center gap-2.5"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <GitBranch className="text-[#06c006]" size={22} />
            Pipeline
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1 font-medium">
            Applied → Shortlisted → Interview → Selected. Optional board — Inbox filters cover Phase 1.5.
          </p>
        </div>
        <Link
          to="/industry/applications"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#06c006]"
        >
          <Inbox size={14} /> Open Inbox
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 -mx-2 px-2">
        {COLUMNS.map((col, colIdx) => {
          const colApps = applications.filter(a => matchesStatusFilter(a.status, col.id));
          return (
            <div
              key={col.id}
              className="flex-1 min-w-[240px] max-w-[280px] flex flex-col animate-card-in"
              style={{ animationDelay: `${colIdx * 80}ms` }}
            >
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-t-2xl border-t-2"
                style={{
                  background: col.bg,
                  borderTopColor: col.accent,
                  borderLeft: `1px solid ${col.accent}30`,
                  borderRight: `1px solid ${col.accent}30`,
                }}
              >
                <span className="text-sm font-bold" style={{ color: col.text }}>
                  {col.title}
                </span>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-md ml-auto"
                  style={{ background: `${col.accent}20`, color: col.text }}
                >
                  {colApps.length}
                </span>
              </div>

              <div
                className="flex-1 rounded-b-2xl p-2.5 space-y-2.5 min-h-[320px] border border-t-0"
                style={{
                  background: 'var(--color-surface-2)',
                  borderColor: 'var(--color-border)',
                }}
              >
                {colApps.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <p className="text-[11px] text-[var(--color-muted)] font-medium">Empty</p>
                  </div>
                )}

                {colApps.map(app => {
                  const job = opportunities.find(o => o.id === app.opportunityId);
                  const next = nextPipelineStage(app.status);
                  const initials =
                    (app.studentName || '?')
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .slice(0, 2) || '?';
                  const score = app.matchScore;
                  const scoreColor =
                    typeof score === 'number' && score >= 85
                      ? '#06c006'
                      : typeof score === 'number' && score >= 70
                        ? '#f59e0b'
                        : '#64748b';

                  return (
                    <div
                      key={app.id}
                      className="cp-card rounded-xl p-3.5 transition-all duration-200 group border"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0"
                          style={{
                            background: `${col.accent}18`,
                            color: col.text,
                            fontFamily: 'Outfit, sans-serif',
                          }}
                        >
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-bold text-[var(--color-text)] truncate"
                            style={{ fontFamily: 'Outfit, sans-serif' }}
                          >
                            {app.studentName || 'Applicant'}
                          </p>
                          <p className="text-[10px] text-[var(--color-muted)] truncate mt-0.5 font-medium">
                            {app.jobTitle || job?.title || 'Drive'}
                          </p>
                        </div>
                        <span
                          className="text-xs font-black flex-shrink-0"
                          style={{ color: scoreColor, fontFamily: 'Outfit, sans-serif' }}
                        >
                          {typeof app.matchScore === 'number' ? `${app.matchScore}%` : '—'}
                        </span>
                      </div>

                      {next && (
                        <button
                          type="button"
                          disabled={busyId === app.id}
                          onClick={() => move(app, next)}
                          className="mt-2.5 w-full flex items-center justify-center gap-1 text-[11px] py-1.5 rounded-lg font-bold transition-all duration-200 disabled:opacity-40"
                          style={{
                            background: `${col.accent}12`,
                            color: col.text,
                            border: `1px solid ${col.accent}30`,
                          }}
                        >
                          Move to {COLUMNS.find(c => c.id === next)?.title}
                          <ChevronRight size={11} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
