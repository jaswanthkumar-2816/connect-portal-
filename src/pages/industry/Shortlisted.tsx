import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ExternalLink } from 'lucide-react';
import { getApplications, getOpportunities, updateApplicationStatus } from '../../services/hiroService';
import { useAuthStore } from '../../store/authStore';
import {
  advanceStatusLabel,
  getStatusColor,
  getStatusLabel,
  nextPipelineStage,
  toPipelineStage,
} from '../../lib/utils';
import type { Application, Opportunity, ApplicationStatus } from '../../types';

export default function Shortlisted() {
  const user = useAuthStore(s => s.user);
  const [rows, setRows] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.companyId) return;
    Promise.all([getApplications(user.companyId), getOpportunities(user.companyId)])
      .then(([apps, opps]) => {
        setRows(
          apps.filter(a => {
            const stage = toPipelineStage(a.status);
            return stage === 'shortlisted' || stage === 'interview' || stage === 'selected';
          })
        );
        setJobs(opps);
      })
      .finally(() => setLoading(false));
  }, [user?.companyId]);

  const titleOf = (app: Application) =>
    app.jobTitle || jobs.find(j => j.id === app.opportunityId)?.title || 'Drive';

  const setStatus = async (app: Application, status: ApplicationStatus) => {
    setBusyId(app.id);
    await updateApplicationStatus(app.id, status, app);
    setRows(prev =>
      prev
        .map(a => (a.id === app.id ? { ...a, status } : a))
        .filter(a => {
          const stage = toPipelineStage(a.status);
          return stage === 'shortlisted' || stage === 'interview' || stage === 'selected';
        })
    );
    setBusyId(null);
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Shortlisted
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1 font-medium">
            Shortlisted → Interview → Selected for {user?.companyName || 'your company'}. Offer mail is Phase 2.
          </p>
        </div>
        <Link to="/industry/applications?status=shortlisted" className="text-sm font-bold text-[#06c006]">
          Filter in Inbox
        </Link>
      </div>

      {rows.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed"
          style={{ background: 'var(--color-surface-3)', borderColor: 'var(--color-border)' }}
        >
          <Star size={36} className="text-[var(--color-muted)] mb-3 opacity-40" />
          <p className="text-sm font-bold text-[var(--color-muted)]">No shortlisted applies</p>
          <Link to="/industry/applications" className="text-[#06c006] text-sm font-bold mt-2">
            Open Inbox
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(app => {
            const advanceLabel = advanceStatusLabel(app.status);
            const next = nextPipelineStage(app.status);
            return (
              <div
                key={app.id}
                className="cp-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[var(--color-text)]">{app.studentName || 'Applicant'}</p>
                  <p className="text-sm text-[var(--color-muted)] font-medium">{titleOf(app)}</p>
                </div>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(app.status)}`}
                >
                  {getStatusLabel(app.status)}
                </span>
                <div className="text-sm font-black text-[#06c006]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {typeof app.matchScore === 'number' ? `${Math.round(app.matchScore)}%` : '—'}
                </div>
                {app.resumeUrl && (
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#06c006]"
                  >
                    Resume <ExternalLink size={12} />
                  </a>
                )}
                {advanceLabel && next && (
                  <button
                    type="button"
                    disabled={busyId === app.id}
                    onClick={() => setStatus(app, next)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#06c006]/15 text-[#06c006] border border-[#06c006]/30 disabled:opacity-40"
                  >
                    {advanceLabel}
                  </button>
                )}
                {toPipelineStage(app.status) !== 'selected' && (
                  <button
                    type="button"
                    disabled={busyId === app.id}
                    onClick={() => setStatus(app, 'rejected')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 border border-red-500/30 disabled:opacity-40"
                  >
                    Reject
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
