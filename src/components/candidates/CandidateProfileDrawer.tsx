import { useEffect, useState } from 'react';
import {
  BadgeCheck,
  ExternalLink,
  FileText,
  GraduationCap,
  MapPin,
  X,
  FolderGit2,
  Sparkles,
} from 'lucide-react';
import { formatDate, getStatusLabel, getStatusColor, advanceStatusLabel, toPipelineStage } from '../../lib/utils';
import type { Application, PracticeRecord as PracticeRecordData } from '../../types';
import { getPracticeRecord } from '../../services/hiroService';
import PracticeRecord from './PracticeRecord';

function ScoreBadge({ score }: { score?: number }) {
  if (score === undefined || score === null || Number.isNaN(Number(score))) {
    return <span className="text-sm font-bold text-[var(--color-muted)]">—</span>;
  }
  const n = Number(score);
  const color = n >= 85 ? '#06c006' : n >= 70 ? '#f59e0b' : '#64748b';
  return (
    <span className="text-2xl font-black" style={{ color, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {Math.round(n)}%
    </span>
  );
}

function matchedSkills(app: Application): { name: string; score?: number }[] {
  const fromChips = (app.matchingSkills || []).map(s => ({ name: s.name, score: s.score }));
  const fromMatch = (app.skillsMatch?.matched || []).map(name => ({ name }));
  const seen = new Set<string>();
  return [...fromChips, ...fromMatch].filter(s => {
    const key = s.name.toLowerCase();
    if (!s.name || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function gapSkills(app: Application): { name: string; detail?: string }[] {
  const fromMissing = (app.missingSkills || []).map(s => ({ name: s.name }));
  const fromMatch = (app.skillsMatch?.missing || []).map(name => ({ name }));
  const fromGaps = (app.skillGaps || []).map(g => ({
    name: g.name,
    detail: typeof g.required === 'number' ? `need ${g.required}% · have ${g.candidate ?? 0}%` : undefined,
  }));
  const seen = new Set<string>();
  return [...fromGaps, ...fromMissing, ...fromMatch].filter(s => {
    const key = s.name.toLowerCase();
    if (!s.name || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

interface CandidateProfileDrawerProps {
  app: Application | null;
  jobTitle?: string;
  onClose: () => void;
  onAdvance?: (app: Application) => void;
  onReject?: (app: Application) => void;
  busy?: boolean;
}

export default function CandidateProfileDrawer({
  app,
  jobTitle,
  onClose,
  onAdvance,
  onReject,
  busy,
}: CandidateProfileDrawerProps) {
  useEffect(() => {
    if (!app) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [app, onClose]);

  const studentId = app?.studentId || app?.student_id;
  const practiceRole = app?.jobTitle;
  const [practice, setPractice] = useState<PracticeRecordData | null>(null);
  const [practiceLoading, setPracticeLoading] = useState(false);

  useEffect(() => {
    if (!studentId) {
      setPractice(null);
      setPracticeLoading(false);
      return;
    }
    let cancelled = false;
    setPractice(null);
    setPracticeLoading(true);
    getPracticeRecord(studentId, practiceRole)
      .then(record => {
        if (!cancelled) setPractice(record);
      })
      .catch(() => {
        if (!cancelled) setPractice(null);
      })
      .finally(() => {
        if (!cancelled) setPracticeLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [studentId, practiceRole]);

  if (!app) return null;

  const verified = Boolean(app.hieroVerified || app.verified);
  const matched = matchedSkills(app);
  const gaps = gapSkills(app);
  const projects = Array.isArray(app.projects) ? app.projects : [];
  const portfolioUrl = app.portfolioUrl || app.portfolio_url;
  const title = jobTitle || app.jobTitle || 'Opportunity';

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        type="button"
        aria-label="Close profile"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <aside
        className="relative h-full w-full max-w-md flex flex-col shadow-2xl animate-slide-left"
        style={{
          background: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label={`${app.studentName || 'Candidate'} profile`}
      >
        <header className="flex items-start gap-3 px-5 py-4 border-b flex-shrink-0" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-[var(--color-text)] truncate" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {app.studentName || 'Applicant'}
              </h2>
              {verified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#06c006] px-2 py-0.5 rounded-lg bg-[#06c006]/10 border border-[#06c006]/25">
                  <BadgeCheck size={12} /> Hiero Verified
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-[var(--color-muted)] mt-0.5 truncate">{title}</p>
            {app.email && <p className="text-[11px] text-[var(--color-muted)] font-medium mt-1 truncate">{app.email}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3 border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Match score</p>
              <div className="mt-1"><ScoreBadge score={app.matchScore} /></div>
              <p className="text-[10px] text-[var(--color-muted)] mt-1 font-medium">Server score · not invented</p>
            </div>
            <div className="rounded-xl p-3 border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]">CGPA</p>
              <p className="text-2xl font-black text-[var(--color-text)] mt-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {typeof app.cgpa === 'number' ? app.cgpa.toFixed(2) : '—'}
              </p>
              <p className="text-[10px] text-[var(--color-muted)] mt-1 font-medium">
                <span className={`inline-flex px-2 py-0.5 rounded-md border ${getStatusColor(app.status)}`}>
                  {getStatusLabel(app.status)}
                </span>
              </p>
            </div>
          </section>

          <PracticeRecord record={practice} loading={practiceLoading} />

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-2 flex items-center gap-1.5">
              <GraduationCap size={13} /> Came from college
            </h3>
            <div className="rounded-xl p-3 border space-y-2" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
              {app.campusName || app.collegeName ? (
                <>
                  <div className="flex items-start gap-2">
                    <GraduationCap size={16} className="text-[#06c006] mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[var(--color-text)]">{app.campusName || app.collegeName}</p>
                      {(app.campusLocation || app.department) && (
                        <p className="text-xs text-[var(--color-muted)] font-medium flex items-center gap-1 mt-0.5">
                          <MapPin size={11} />
                          {[app.department, app.campusLocation].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="inline-flex text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-[#06c006]/10 text-[#06c006] border border-[#06c006]/25">
                    Campus / college applicant
                  </span>
                </>
              ) : (
                <p className="text-xs text-[var(--color-muted)] font-medium">
                  No college on this apply payload. Bridge campus applies usually include campus name.
                </p>
              )}
              <p className="text-[11px] text-[var(--color-muted)] font-medium">Applied {formatDate(app.appliedAt)}</p>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-2 flex items-center gap-1.5">
              <Sparkles size={13} /> Verified skills
            </h3>
            {matched.length ? (
              <div className="flex flex-wrap gap-1.5">
                {matched.map(s => (
                  <span key={s.name} className="tag-skill-green inline-flex items-center gap-1">
                    {s.name}
                    {typeof s.score === 'number' && s.score > 0 && (
                      <span className="opacity-70">{Math.round(s.score)}%</span>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--color-muted)] font-medium">No verified matched skills on this apply payload.</p>
            )}
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-2">Skill gaps</h3>
            {gaps.length ? (
              <div className="space-y-1.5">
                {gaps.map(g => (
                  <div
                    key={g.name}
                    className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 border"
                    style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-2)' }}
                  >
                    <span className="text-sm font-semibold text-[var(--color-text)]">{g.name}</span>
                    {g.detail && <span className="text-[10px] font-medium text-[var(--color-muted)]">{g.detail}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--color-muted)] font-medium">No skill gaps reported on this apply.</p>
            )}
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-2 flex items-center gap-1.5">
              <FolderGit2 size={13} /> Projects / portfolio
            </h3>
            {portfolioUrl && (
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#06c006] mb-3"
              >
                Digital portfolio <ExternalLink size={13} />
              </a>
            )}
            {projects.length ? (
              <div className="space-y-2">
                {projects.map((p, i) => {
                  const link = p.url || p.link;
                  return (
                    <div
                      key={`${p.title}-${i}`}
                      className="rounded-xl p-3 border"
                      style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-[var(--color-text)]">{p.title || 'Project'}</p>
                        {link && (
                          <a href={link} target="_blank" rel="noreferrer" className="text-[#06c006] flex-shrink-0">
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                      {p.description && (
                        <p className="text-xs text-[var(--color-muted)] font-medium mt-1 leading-relaxed">{p.description}</p>
                      )}
                      {(p.skills?.length || p.tech) && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(p.skills || (p.tech ? [p.tech] : [])).map(s => (
                            <span key={s} className="tag-skill-gray">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : !portfolioUrl ? (
              <p className="text-xs text-[var(--color-muted)] font-medium">No projects on this Hiero apply payload.</p>
            ) : null}
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-2 flex items-center gap-1.5">
              <FileText size={13} /> Resume
            </h3>
            {app.resumeUrl ? (
              <a
                href={app.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-[#06c006]/15 text-[#06c006] border border-[#06c006]/30"
              >
                Open resume <ExternalLink size={14} />
              </a>
            ) : (
              <p className="text-xs text-[var(--color-muted)] font-medium">No resume URL on this apply.</p>
            )}
          </section>
        </div>

        <footer className="flex-shrink-0 px-5 py-4 border-t flex gap-2" style={{ borderColor: 'var(--color-border)' }}>
          {advanceStatusLabel(app.status) && (
            <button
              type="button"
              disabled={busy || !onAdvance}
              onClick={() => onAdvance?.(app)}
              className="flex-1 px-3 py-2.5 rounded-xl text-sm font-bold bg-[#06c006]/15 text-[#06c006] border border-[#06c006]/30 disabled:opacity-40"
            >
              {advanceStatusLabel(app.status)}
            </button>
          )}
          {toPipelineStage(app.status) !== 'rejected' && toPipelineStage(app.status) !== 'selected' && (
            <button
              type="button"
              disabled={busy || !onReject}
              onClick={() => onReject?.(app)}
              className="flex-1 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 border border-red-500/30 disabled:opacity-40"
            >
              Reject
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
}
