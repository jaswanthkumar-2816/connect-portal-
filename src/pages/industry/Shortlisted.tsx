import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, GraduationCap, ChevronRight } from 'lucide-react';
import { getApplications, getOpportunities, getCandidates } from '../../services/hiroService';
import { useAuthStore } from '../../store/authStore';
import type { Application, Opportunity, Candidate } from '../../types';

export default function Shortlisted() {
  const user = useAuthStore(s => s.user);
  const [shortlisted, setShortlisted] = useState<{ app: Application; candidate: Candidate; job: Opportunity }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getApplications(user.companyId),
      getOpportunities(user.companyId),
      getCandidates(),
    ]).then(([apps, opps, cands]) => {
      const result = apps
        .filter(a => a.status === 'shortlisted')
        .map(a => ({
          app: a,
          candidate: cands.find(c => c.id === a.studentId)!,
          job: opps.find(o => o.id === a.opportunityId)!,
        }))
        .filter(r => r.candidate && r.job);
      setShortlisted(result);
      setLoading(false);
    });
  }, [user]);

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
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)] flex items-center gap-2.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <Star className="text-[#06c006]" size={22} />
            Shortlisted
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1 font-medium">{shortlisted.length} candidate{shortlisted.length !== 1 ? 's' : ''} shortlisted</p>
        </div>
      </div>

      {shortlisted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed"
          style={{ background: 'var(--color-surface-3)', borderColor: 'var(--color-border)' }}>
          <Star size={36} className="text-[var(--color-muted)] mb-3 opacity-40" />
          <p className="text-sm font-bold text-[var(--color-muted)]">No shortlisted candidates yet</p>
          <p className="text-xs text-[var(--color-muted)] mt-1 font-medium">Review applications and shortlist top matches.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shortlisted.map(({ app, candidate, job }, i) => {
            const initials = candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2);
            const scoreColor = app.matchScore >= 85 ? '#06c006' : app.matchScore >= 70 ? '#f59e0b' : '#64748b';
            return (
              <div
                key={app.id}
                className="cp-card rounded-2xl p-6 hiero-card-hover animate-card-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start gap-5">
                  {/* Avatar */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0"
                    style={{
                      background: 'rgba(6,192,6,0.12)',
                      border: '1px solid rgba(6,192,6,0.3)',
                      color: '#06c006',
                      fontFamily: 'Outfit, sans-serif',
                    }}
                  >
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          to={`/industry/candidate/${candidate.id}`}
                          className="text-lg font-bold text-[var(--color-text)] hover:text-[#06c006] transition-colors"
                          style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                          {candidate.name}
                        </Link>
                        <p className="text-sm text-[var(--color-muted)] font-medium mt-0.5">{candidate.headline}</p>
                      </div>
                      {/* Match Score */}
                      <div className="flex flex-col items-center text-center flex-shrink-0">
                        <div
                          className="text-2xl font-black"
                          style={{ color: scoreColor, fontFamily: 'Outfit, sans-serif' }}
                        >
                          {app.matchScore}%
                        </div>
                        <div className="text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wide">Match</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[var(--color-muted)] font-semibold">
                      <span className="flex items-center gap-1.5"><MapPin size={11} />{candidate.location}</span>
                      {candidate.education[0] && (
                        <span className="flex items-center gap-1.5"><GraduationCap size={11} />{candidate.education[0].institution}</span>
                      )}
                      <span>
                        Applied for: <span className="text-[var(--color-text)] font-semibold">{job.title}</span>
                      </span>
                    </div>

                    {/* Matching skills */}
                    {app.matchingSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {app.matchingSkills.slice(0, 5).map(s => (
                          <span key={s.name} className="tag-skill-green">{s.name} {s.score}%</span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                      <Link
                        to={`/industry/candidate/${candidate.id}`}
                        className="px-4 py-2 rounded-xl text-xs font-bold border text-[var(--color-text)] transition-all flex items-center gap-1"
                        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                      >
                        View Profile <ChevronRight size={13} />
                      </Link>
                      <button className="hiero-btn-primary text-xs px-4 py-2 font-bold shadow-[0_0_20px_rgba(6,192,6,0.2)]">
                        Move to Interview <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
