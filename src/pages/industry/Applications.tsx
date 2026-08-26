import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { getApplications, getOpportunities, getCandidates } from '../../services/hiroService';
import { useAuthStore } from '../../store/authStore';
import { formatDate, getStatusLabel } from '../../lib/utils';
import type { Application, Opportunity, Candidate } from '../../types';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'applied', label: 'Applied' },
  { value: 'under-review', label: 'Under Review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'selected', label: 'Selected' },
  { value: 'rejected', label: 'Rejected' },
];

function MatchRing({ score }: { score: number }) {
  const color = score >= 85 ? '#06c006' : score >= 70 ? '#f59e0b' : '#64748b';
  const bg = score >= 85 ? 'rgba(6,192,6,0.12)' : score >= 70 ? 'rgba(245,158,11,0.12)' : 'rgba(100,116,139,0.12)';
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
      style={{ background: bg, border: `1.5px solid ${color}35`, color, fontFamily: 'Outfit, sans-serif' }}
    >
      {score}%
    </div>
  );
}

export default function Applications() {
  const user = useAuthStore(s => s.user);
  const [applications, setApplications] = useState<Application[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filterJob, setFilterJob] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'match' | 'recent'>('match');
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

  const filtered = applications
    .filter(a => filterJob === 'all' || a.opportunityId === filterJob)
    .filter(a => filterStatus === 'all' || a.status === filterStatus)
    .sort((a, b) =>
      sortBy === 'match'
        ? b.matchScore - a.matchScore
        : new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-[#06c006]/30 border-t-[#06c006] rounded-full animate-spin" />
      </div>
    );
  }

  const selectStyle = {
    background: 'var(--color-surface-2)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text)',
  };

  const [selectedAppForModal, setSelectedAppForModal] = useState<{ app: Application; candidate: Candidate | null; jobTitle: string } | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>Applications</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1 font-medium">{filtered.length} application{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl border"
        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
        <SlidersHorizontal size={14} className="text-[var(--color-muted)]" />

        <select
          value={filterJob}
          onChange={e => setFilterJob(e.target.value)}
          className="rounded-xl px-3 py-1.5 text-sm font-semibold focus:outline-none cursor-pointer"
          style={selectStyle}
        >
          <option value="all" style={{ background: 'var(--color-input-bg)', color: 'var(--color-text)' }}>All Jobs</option>
          {opportunities.map(o => <option key={o.id} value={o.id} style={{ background: 'var(--color-input-bg)', color: 'var(--color-text)' }}>{o.title}</option>)}
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="rounded-xl px-3 py-1.5 text-sm font-semibold focus:outline-none cursor-pointer"
          style={selectStyle}
        >
          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value} style={{ background: 'var(--color-input-bg)', color: 'var(--color-text)' }}>{s.label}</option>)}
        </select>

        <button
          onClick={() => setSortBy(sortBy === 'match' ? 'recent' : 'match')}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-bold transition-all duration-200"
          style={{ ...selectStyle, color: '#06c006' }}
        >
          <ArrowUpDown size={13} />
          {sortBy === 'match' ? 'Best Match' : 'Most Recent'}
        </button>
      </div>

      {/* Application List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed"
          style={{ background: 'var(--color-surface-3)', borderColor: 'var(--color-border)' }}>
          <FileText size={36} className="text-[var(--color-muted)] mb-3 opacity-40" />
          <p className="text-sm font-bold text-[var(--color-muted)]">No applications found</p>
          <p className="text-xs text-[var(--color-muted)] mt-1 font-medium">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((app, i) => {
            const job = opportunities.find(o => o.id === app.opportunityId);
            const candidate = candidates.find(c => c.id === app.studentId) || (candidates.length > 0 ? candidates[0] : null);
            const statusClass = `status-${app.status === 'under-review' ? 'review' : app.status}`;
            const jobTitle = job?.title || (app as any).companyName || 'Software Engineer';

            return (
              <div
                key={app.id}
                className="cp-card rounded-2xl p-4 hiero-card-hover animate-card-in group"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                <div className="flex items-center gap-4">
                  <MatchRing score={app.matchScore} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <button
                        onClick={() => setSelectedAppForModal({ app, candidate, jobTitle })}
                        className="font-bold text-[var(--color-text)] hover:text-[#06c006] transition-colors text-sm text-left"
                      >
                        {candidate?.name || (app as any).studentName || 'Jaswanth Kumar'}
                      </button>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg capitalize ${statusClass}`}>
                        {getStatusLabel(app.status)}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-muted)] font-medium">
                      Applied for <span className="text-[var(--color-text)] font-semibold">{jobTitle}</span>
                      {' · '}{formatDate(app.appliedAt)}
                    </p>
                    {app.matchingSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {app.matchingSkills.slice(0, 4).map(s => (
                          <span key={s.name} className="tag-skill-green">{s.name} {s.score}%</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center gap-2 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                    <button
                      onClick={() => setSelectedAppForModal({ app, candidate, jobTitle })}
                      className="text-xs px-3 py-1.5 rounded-lg font-bold transition-all border text-[#06c006] border-[#06c006]/30 bg-[#06c006]/10 flex items-center gap-1"
                    >
                      View Summary
                    </button>
                    <Link
                      to={`/industry/candidate/${app.studentId || 'cand-1'}`}
                      className="text-xs px-3 py-1.5 rounded-lg font-bold transition-all border text-[var(--color-text)]"
                      style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                    >
                      Full Profile
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recruiter Right-Side Slide-Over Resume & A4 Document Panel */}
      {selectedAppForModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setSelectedAppForModal(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div
              className="w-screen max-w-xl bg-[var(--color-surface-1)] border-l border-[var(--color-border)] shadow-2xl flex flex-col z-50 animate-slide-left"
              onClick={e => e.stopPropagation()}
            >
              {/* Slide-over Header */}
              <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-2)]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {selectedAppForModal.candidate?.name || (selectedAppForModal.app as any).studentName || 'Jaswanth Kumar'}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#06c006]/20 text-[#06c006] border border-[#06c006]/30">
                      {selectedAppForModal.app.matchScore}% Match
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-muted)] font-medium mt-0.5">
                    Role Applied: <strong className="text-[var(--color-text)]">{selectedAppForModal.jobTitle}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={selectedAppForModal.app.resumeUrl || selectedAppForModal.candidate?.resumeUrl || '/resumes/Jaswanth_Kumar_Resume_Master.pdf'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#06c006] text-black hover:bg-[#06c006]/90 transition-all flex items-center gap-1 shadow-sm"
                  >
                    Open PDF ↗
                  </a>
                  <button
                    onClick={() => setSelectedAppForModal(null)}
                    className="w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Scrollable Content Container */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-black/5 dark:bg-white/[0.01]">
                {/* Uploaded File Bar */}
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText size={18} className="text-purple-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-[var(--color-text)]">Uploaded Resume Document</div>
                      <div className="text-xs font-mono font-bold text-[#06c006] truncate">
                        📄 {selectedAppForModal.app.resumeUrl?.split('/').pop() || selectedAppForModal.candidate?.resumeUrl?.split('/').pop() || 'Jaswanth_Kumar_Resume_Master.pdf'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[#06c006]/20 text-[#06c006] px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                    Apply Now Document
                  </span>
                </div>

                {/* Minimal A4 Size Resume Document Sheet */}
                <div className="bg-white text-slate-900 shadow-2xl border border-slate-200 rounded-xl p-6 text-xs space-y-4 font-sans max-w-full mx-auto" style={{ minHeight: '620px' }}>
                  {/* A4 Resume Document Header */}
                  <div className="border-b border-slate-300 pb-3 flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {(selectedAppForModal.candidate?.name || (selectedAppForModal.app as any).studentName || 'JASWANTH KUMAR').toUpperCase()}
                      </h1>
                      <p className="text-slate-600 font-medium text-[11px] mt-0.5">
                        {selectedAppForModal.candidate?.headline || 'Full Stack & AI Engineer | HIERO Skill Verified'}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] text-slate-500 font-medium">
                        <span>📍 {selectedAppForModal.candidate?.location || 'Bangalore, India'}</span>
                        <span>✉️ {selectedAppForModal.candidate?.email || 'jaswanth@hiero.ai'}</span>
                        <span>📞 {selectedAppForModal.candidate?.phone || '+91 98765 43210'}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="inline-block px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        CGPA: {selectedAppForModal.candidate?.cgpa || 9.2} / 10
                      </span>
                      <div className="text-[9px] text-slate-400 font-semibold mt-1">Batch 2026</div>
                    </div>
                  </div>

                  {/* Academic Profile */}
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-1.5">
                      Academic Education & Credentials
                    </h3>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <strong className="text-slate-900 font-bold">IIT Madras</strong> · <span className="text-slate-700">B.Tech in Computer Science</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">CGPA: {selectedAppForModal.candidate?.cgpa || 9.2}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Duration: 2022 – 2026 · Class Rank Top 5%</div>
                  </div>

                  {/* Verified Skill Competency */}
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                      Verified Technical Skills Matrix
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {(selectedAppForModal.candidate?.skills || [
                        { name: 'Python', competency: 95 },
                        { name: 'React', competency: 92 },
                        { name: 'TypeScript', competency: 90 },
                        { name: 'SQL', competency: 88 }
                      ]).map(s => (
                        <div key={s.name} className="flex items-center justify-between bg-slate-50 border border-slate-200 px-2.5 py-1 rounded">
                          <span className="font-semibold text-slate-800 text-[11px]">{s.name}</span>
                          <span className="font-bold text-emerald-600 text-[10px]">{s.competency}% Verified</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Projects Summary */}
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                      Key Technical Projects ({selectedAppForModal.candidate?.projects?.length || 2})
                    </h3>
                    <div className="space-y-2">
                      {(selectedAppForModal.candidate?.projects || [
                        {
                          title: 'HIERO AI Career & Skill Gateway',
                          description: 'Built a multi-service routing architecture with real-time candidate verification and micro-curriculum engines.',
                          skills: ['TypeScript', 'Node.js', 'Express', 'MongoDB']
                        },
                        {
                          title: 'Neural Code Analyzer & Sandbox',
                          description: 'Implemented AST code parser and execution sandbox for adaptive skill assessments.',
                          skills: ['Python', 'PyTorch', 'Docker', 'REST APIs']
                        }
                      ]).map((proj, idx) => (
                        <div key={idx} className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                          <div className="font-bold text-slate-900 text-[11px]">{proj.title}</div>
                          <p className="text-[10px] text-slate-600 leading-snug">{proj.description}</p>
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {proj.skills.map(sk => (
                              <span key={sk} className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[9px] font-semibold">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Work Experience */}
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                      Work Experience & Internships
                    </h3>
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center">
                        <strong className="text-slate-900 text-[11px]">Full Stack Engineering Intern</strong>
                        <span className="text-[10px] text-slate-500 font-medium">May 2025 – Aug 2025</span>
                      </div>
                      <div className="text-[10px] text-emerald-800 font-bold">TechNova AI Systems</div>
                      <p className="text-[10px] text-slate-600 leading-snug">
                        Developed reactive UI components, micro-services, and automated ML pipelines.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-2)] flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedAppForModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border text-[var(--color-muted)]"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  Close
                </button>

                <Link
                  to={`/industry/candidate/${selectedAppForModal.candidate?.id || selectedAppForModal.app.studentId || 'cand-1'}`}
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#06c006] text-black hover:bg-[#06c006]/90 transition-all flex items-center gap-1 shadow-md"
                >
                  View Candidate Full Profile →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
