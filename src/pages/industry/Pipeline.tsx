import { useEffect, useState } from 'react';
import { GitBranch, ChevronRight } from 'lucide-react';
import { getApplications, getOpportunities, getCandidates } from '../../services/hiroService';
import { useAuthStore } from '../../store/authStore';
import type { Application, Opportunity, Candidate, ApplicationStatus } from '../../types';

const COLUMNS: {
  id: ApplicationStatus; title: string;
  accent: string; bg: string; text: string;
}[] = [
  { id: 'applied',       title: 'Applied',       accent: '#3b82f6', bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  { id: 'under-review',  title: 'Under Review',  accent: '#f59e0b', bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  { id: 'shortlisted',   title: 'Shortlisted',   accent: '#06c006', bg: 'rgba(6,192,6,0.12)',   text: '#06c006' },
  { id: 'interview',     title: 'Interview',     accent: '#a855f7', bg: 'rgba(168,85,247,0.12)', text: '#a855f7' },
  { id: 'selected',      title: 'Selected',      accent: '#10b981', bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
];

const NEXT: Record<string, ApplicationStatus | null> = {
  applied: 'under-review',
  'under-review': 'shortlisted',
  shortlisted: 'interview',
  interview: 'selected',
  selected: null,
};

export default function Pipeline() {
  const user = useAuthStore(s => s.user);
  const [applications, setApplications] = useState<Application[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const compId = user?.companyId || 'c1';
    Promise.all([
      getApplications(compId),
      getOpportunities(compId),
      getCandidates(),
    ]).then(([a, o, c]) => {
      setApplications(a);
      setOpportunities(o);
      setCandidates(c);
      setLoading(false);
    });
  }, [user]);

  const move = (app: Application, status: ApplicationStatus) =>
    setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status } : a));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-[#06c006]/30 border-t-[#06c006] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-2xl font-black text-[var(--color-text)] flex items-center gap-2.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <GitBranch className="text-[#06c006]" size={22} />
          Recruitment Pipeline
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1 font-medium">Drag or move candidates through recruitment stages.</p>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-6 -mx-2 px-2">
        {COLUMNS.map((col, colIdx) => {
          const colApps = applications.filter(a => a.status === col.id);
          return (
            <div
              key={col.id}
              className="flex-1 min-w-[240px] max-w-[280px] flex flex-col animate-card-in"
              style={{ animationDelay: `${colIdx * 80}ms` }}
            >
              {/* Column header */}
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-t-2xl border-t-2"
                style={{
                  background: col.bg,
                  borderTopColor: col.accent,
                  borderLeft: `1px solid ${col.accent}30`,
                  borderRight: `1px solid ${col.accent}30`,
                }}
              >
                <span className="text-sm font-bold" style={{ color: col.text }}>{col.title}</span>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-md ml-auto"
                  style={{ background: `${col.accent}20`, color: col.text }}
                >
                  {colApps.length}
                </span>
              </div>

              {/* Cards */}
              <div
                className="flex-1 rounded-b-2xl p-2.5 space-y-2.5 min-h-[320px] border border-t-0"
                style={{
                  background: 'var(--color-surface-2)',
                  borderColor: 'var(--color-border)',
                }}
              >
                {colApps.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <div
                      className="w-8 h-8 rounded-xl mb-2 flex items-center justify-center opacity-40"
                      style={{ background: col.bg }}
                    >
                      <span style={{ color: col.text, fontSize: 16 }}>·</span>
                    </div>
                    <p className="text-[11px] text-[var(--color-muted)] font-medium">Empty</p>
                  </div>
                )}

                {colApps.map(app => {
                  const candidate = candidates.find(c => c.id === app.studentId);
                  const job = opportunities.find(o => o.id === app.opportunityId);
                  const next = NEXT[col.id];
                  const initials = candidate?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?';
                  const scoreColor = app.matchScore >= 85 ? '#06c006' : app.matchScore >= 70 ? '#f59e0b' : '#64748b';

                  return (
                    <div
                      key={app.id}
                      className="cp-card rounded-xl p-3.5 transition-all duration-200 group cursor-pointer border"
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Avatar */}
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
                          <p className="text-sm font-bold text-[var(--color-text)] truncate group-hover:text-[#06c006] transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            {candidate?.name || 'Unknown'}
                          </p>
                          <p className="text-[10px] text-[var(--color-muted)] truncate mt-0.5 font-medium">{job?.title}</p>
                        </div>
                        <span className="text-xs font-black flex-shrink-0" style={{ color: scoreColor, fontFamily: 'Outfit, sans-serif' }}>
                          {app.matchScore}%
                        </span>
                      </div>

                      {/* Move button */}
                      {next && (
                        <button
                          onClick={() => move(app, next)}
                          className="mt-2.5 w-full flex items-center justify-center gap-1 text-[11px] py-1.5 rounded-lg font-bold transition-all duration-200"
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
