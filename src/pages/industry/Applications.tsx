import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  SlidersHorizontal,
  ArrowUpDown,
  GraduationCap,
  MapPin,
  Users,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Building2,
  Globe,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Award,
  BookOpen,
  Eye
} from 'lucide-react';
import { getApplications, getOpportunities, getCandidates, getColleges, type College } from '../../services/hiroService';
import { useAuthStore } from '../../store/authStore';
import { formatDate, getStatusLabel } from '../../lib/utils';
import PdfResumeModal from '../../components/ui/PdfResumeModal';
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
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [filterJob, setFilterJob] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'match' | 'recent'>('match');
  const [loading, setLoading] = useState(true);
  const [selectedAppForModal, setSelectedAppForModal] = useState<{ app: Application; candidate: Candidate | null; jobTitle: string } | null>(null);
  const [pdfResumeModalData, setPdfResumeModalData] = useState<{ app?: Application | null; candidate?: Candidate | null } | null>(null);
  const [selectedSource, setSelectedSource] = useState<'hiero' | 'bridge' | null>(null);

  useEffect(() => {
    let cancelled = false;
    const compId = user?.companyId || 'c1';
    Promise.all([
      getApplications(compId),
      getOpportunities(compId),
      getCandidates(),
      getColleges(),
    ])
      .then(([a, o, c, clg]) => {
        if (cancelled) return;
        setApplications(a);
        setOpportunities(o);
        setCandidates(c);
        setColleges(clg);
      })
      .catch(() => {
        if (cancelled) return;
        setApplications([]);
        setOpportunities([]);
        setCandidates([]);
        setColleges([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [user]);

  const isBridgeApp = (app: Application) => {
    if (app.source === 'hiero') return false;
    if (app.source === 'bridge') return true;
    if (app.studentId?.startsWith('STU-')) return true;
    if ((app.email || '').includes('@college.edu')) return true;
    if (app.campusName && (app.campusName.includes('Warangal') || app.campusName.includes('NITW'))) return true;
    return false;
  };

  const filtered = applications
    .filter(a => filterJob === 'all' || a.opportunityId === filterJob)
    .filter(a => filterStatus === 'all' || a.status === filterStatus)
    .filter(a => {
      if (!selectedSource) return true;
      if (selectedSource === 'bridge') {
        if (!isBridgeApp(a)) return false;
        if (selectedCollege) {
          return (
            a.campusName === selectedCollege.name ||
            (selectedCollege.code && a.campusName?.includes(selectedCollege.code)) ||
            (selectedCollege.name.includes('Warangal') && (a.campusName?.includes('Warangal') || !a.campusName))
          );
        }
        return true;
      }
      return !isBridgeApp(a);
    })
    .sort((a, b) =>
      sortBy === 'match'
        ? b.matchScore - a.matchScore
        : new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    );

  const hieroApps = applications.filter(a => !isBridgeApp(a));
  const bridgeApps = applications.filter(isBridgeApp);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          {selectedSource && !selectedCollege ? (
            <button
              onClick={() => {
                setSelectedSource(null);
                setSelectedCollege(null);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-[#06c006] mb-2 hover:underline cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Portals
            </button>
          ) : selectedSource === 'bridge' && selectedCollege ? (
            <button
              onClick={() => setSelectedCollege(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#06c006] mb-2 hover:underline cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Partner Colleges
            </button>
          ) : null}

          <h1 className="text-2xl font-black text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {selectedSource === 'hiero'
              ? 'HIERO Applications'
              : selectedSource === 'bridge' && selectedCollege
              ? `${selectedCollege.name} — Students`
              : selectedSource === 'bridge'
              ? 'HIERO Bridge — Partner Colleges'
              : 'Candidate Portals & Applications'}
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1 font-medium">
            {selectedSource === 'hiero'
              ? 'Applications from HIERO Student & AI Talent Platform'
              : selectedSource === 'bridge' && selectedCollege
              ? `Campus placement candidates from ${selectedCollege.name} (${selectedCollege.location || 'India'})`
              : selectedSource === 'bridge'
              ? 'Select an affiliated college to view verified student placement rosters'
              : 'Select a portal below to access candidate applications'}
          </p>
        </div>
      </div>

      {/* VIEW 1: Main Landing Screen (NO portal selected) -> 2 Large Side-by-Side Clean Option Cards */}
      {!selectedSource ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Option 1: HIERO */}
          <button
            onClick={() => {
              setSelectedSource('hiero');
              setSelectedCollege(null);
            }}
            className="w-full flex flex-col justify-between p-7 sm:p-8 rounded-3xl border transition-all duration-300 hiero-card-hover cursor-pointer group text-left relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(147, 51, 234, 0.08) 0%, var(--color-surface-2) 100%)',
              borderColor: 'rgba(147, 51, 234, 0.28)',
              minHeight: '190px',
            }}
          >
            <div className="flex items-start justify-between gap-4 w-full">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                <Sparkles size={28} />
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20 group-hover:bg-purple-500/20 transition-all">
                <span>Open Portal</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-black text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                HIERO
              </h2>
              <p className="text-sm text-[var(--color-muted)] font-medium mt-1 leading-relaxed">
                Direct Student & AI Skill Verified Talent Platform
              </p>
            </div>
          </button>

          {/* Option 2: HIERO Bridge */}
          <button
            onClick={() => {
              setSelectedSource('bridge');
              setSelectedCollege(null);
            }}
            className="w-full flex flex-col justify-between p-7 sm:p-8 rounded-3xl border transition-all duration-300 hiero-card-hover cursor-pointer group text-left relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(6, 192, 6, 0.08) 0%, var(--color-surface-2) 100%)',
              borderColor: 'rgba(6, 192, 6, 0.28)',
              minHeight: '190px',
            }}
          >
            <div className="flex items-start justify-between gap-4 w-full">
              <div className="w-14 h-14 rounded-2xl bg-[#06c006]/15 border border-[#06c006]/30 flex items-center justify-center text-[#06c006] flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                <GraduationCap size={28} />
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#06c006] bg-[#06c006]/10 px-3 py-1.5 rounded-full border border-[#06c006]/20 group-hover:bg-[#06c006]/20 transition-all">
                <span>Open Portal</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-black text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                HIERO Bridge
              </h2>
              <p className="text-sm text-[var(--color-muted)] font-medium mt-1 leading-relaxed">
                Campus Placement Drives & Institutional Records
              </p>
            </div>
          </button>
        </div>
      ) : selectedSource === 'bridge' && !selectedCollege ? (
        /* VIEW 2: HIERO Bridge Selected -> SHOW LIST OF CONNECTED COLLEGES */
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
              Affiliated Colleges & Institutions ({colleges.length})
            </span>
            <button
              onClick={() => setSelectedSource(null)}
              className="text-xs font-bold text-[#06c006] hover:underline"
            >
              ← Switch Portal
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {colleges.map(college => {
              const collegeApps = bridgeApps.filter(
                a =>
                  a.campusName === college.name ||
                  (college.code && a.campusName?.includes(college.code)) ||
                  (college.name.includes('Warangal') && (a.campusName?.includes('Warangal') || !a.campusName))
              );
              const coordinator = college.coordinators?.[0];

              return (
                <div
                  key={college.id}
                  onClick={() => setSelectedCollege(college)}
                  className="p-5 sm:p-6 rounded-3xl border transition-all duration-300 hiero-card-hover cursor-pointer group relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, rgba(6, 192, 6, 0.06) 0%, var(--color-surface-2) 100%)',
                    borderColor: 'rgba(6, 192, 6, 0.28)',
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-13 h-13 rounded-2xl bg-[#06c006]/15 border border-[#06c006]/30 flex items-center justify-center text-[#06c006] flex-shrink-0 group-hover:scale-105 transition-transform shadow-md">
                        <Building2 size={26} />
                      </div>
                      <div>
                        <div className="flex items-center flex-wrap gap-2">
                          <h2 className="text-lg font-black text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            {college.name}
                          </h2>
                          {college.tier && (
                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#06c006]/15 text-[#06c006] border border-[#06c006]/30">
                              {college.tier}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-muted)] font-medium mt-1.5">
                          {college.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={12} className="text-[#06c006]" /> {college.location}
                            </span>
                          )}
                          {coordinator && (
                            <span className="flex items-center gap-1">
                              <Award size={12} className="text-[#06c006]" /> TPO: {coordinator.name} ({coordinator.dept})
                            </span>
                          )}
                        </div>

                        {/* Department Pills */}
                        {college.departments && college.departments.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {college.departments.map(dept => (
                              <span
                                key={dept.id}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/20 dark:bg-white/5 border border-[var(--color-border)] text-[var(--color-text)]"
                              >
                                {dept.id} {dept.totalStudents ? `(${dept.totalStudents})` : ''}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--color-border)]">
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#06c006] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          View College Students <ChevronRight size={16} />
                        </span>
                        <div className="text-[11px] text-[var(--color-muted)] font-medium mt-0.5">
                          {collegeApps.length} active applications
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW 3: HIERO Direct OR Specific Bridge College Selected -> SHOW FILTER BAR & CANDIDATE APPLICATIONS */
        <div className="space-y-4">
          {/* Filter Bar */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal size={14} className="text-[var(--color-muted)] ml-1" />

              <select
                value={filterJob}
                onChange={e => setFilterJob(e.target.value)}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer"
                style={selectStyle}
              >
                <option value="all" style={{ background: 'var(--color-input-bg)', color: 'var(--color-text)' }}>All Jobs</option>
                {opportunities.map(o => (
                  <option key={o.id} value={o.id} style={{ background: 'var(--color-input-bg)', color: 'var(--color-text)' }}>
                    {o.title}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer"
                style={selectStyle}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s.value} value={s.value} style={{ background: 'var(--color-input-bg)', color: 'var(--color-text)' }}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setSortBy(sortBy === 'match' ? 'recent' : 'match')}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-200"
              style={{ ...selectStyle, color: '#06c006' }}
            >
              <ArrowUpDown size={12} />
              {sortBy === 'match' ? 'Best Match' : 'Most Recent'}
            </button>
          </div>

          {/* Applicant Cards List */}
          {filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed"
              style={{ background: 'var(--color-surface-3)', borderColor: 'var(--color-border)' }}
            >
              <GraduationCap size={36} className="text-[var(--color-muted)] mb-3 opacity-40" />
              <p className="text-sm font-bold text-[var(--color-muted)]">No applications found</p>
              <p className="text-xs text-[var(--color-muted)] mt-1 font-medium">
                Try adjusting your job or status filters above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  {selectedSource === 'hiero'
                    ? `HIERO Direct Applicants (${filtered.length})`
                    : `${selectedCollege?.name || 'Bridge Campus'} Students (${filtered.length})`}
                </h3>
                <button
                  onClick={() => {
                    if (selectedCollege) setSelectedCollege(null);
                    else setSelectedSource(null);
                  }}
                  className="text-xs font-bold text-[#06c006] hover:underline cursor-pointer"
                >
                  {selectedCollege ? '← Back to Colleges' : '← Switch Portal'}
                </button>
              </div>

              {filtered.map((app, i) => {
                const isFromBridge = isBridgeApp(app);
                const job = opportunities.find(o => o.id === app.opportunityId);
                const candidate = candidates.find(c => c.id === app.studentId) || null;
                const statusClass = `status-${app.status === 'under-review' ? 'review' : app.status}`;
                const jobTitle = app.jobTitle || job?.title || app.companyName || 'Software Engineer';

                return (
                  <div
                    key={app.id}
                    className="cp-card rounded-2xl p-4 hiero-card-hover animate-card-in group border"
                    style={{
                      animationDelay: `${i * 35}ms`,
                      borderColor: isFromBridge ? 'rgba(6, 192, 6, 0.18)' : 'rgba(147, 51, 234, 0.18)'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <MatchRing score={app.matchScore} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <button
                            onClick={() => setSelectedAppForModal({ app, candidate, jobTitle })}
                            className="font-bold text-[var(--color-text)] hover:text-[#06c006] transition-colors text-sm text-left cursor-pointer"
                          >
                            {candidate?.name || app.studentName || 'Campus applicant'}
                          </button>

                          {/* Source Tag Badge */}
                          {isFromBridge ? (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#06c006]/15 text-[#06c006] border border-[#06c006]/30 flex items-center gap-1">
                              <GraduationCap size={11} /> {app.campusName || 'Bridge Campus'}
                            </span>
                          ) : (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                              <Sparkles size={11} /> HIERO
                            </span>
                          )}

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg capitalize ${statusClass}`}>
                            {getStatusLabel(app.status)}
                          </span>

                          {app.cgpa != null && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#06c006]/12 text-[#06c006]">
                              CGPA {app.cgpa}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[var(--color-muted)] font-medium">
                          {app.campusName ? (
                            <span className="text-[var(--color-text)] font-semibold">{app.campusName} · </span>
                          ) : null}
                          {app.department ? `${app.department} · ` : ''}
                          Applied for <span className="text-[var(--color-text)] font-semibold">{jobTitle}</span>
                          {' · '}{formatDate(app.appliedAt)}
                        </p>

                        {(app.matchingSkills?.length ?? 0) > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {(app.matchingSkills ?? []).slice(0, 4).map(s => (
                              <span key={s.name} className="tag-skill-green">{s.name} {s.score}%</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quick actions */}
                      <div className="flex items-center gap-2 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                        <button
                          onClick={() => setPdfResumeModalData({ app, candidate })}
                          className="text-xs px-3 py-1.5 rounded-lg font-black transition-all bg-[#06c006] text-black hover:bg-[#06c006]/90 flex items-center gap-1.5 shadow-sm cursor-pointer"
                          title="View In-Page PDF Resume"
                        >
                          <FileText size={13} /> View Resume
                        </button>
                        <button
                          onClick={() => setSelectedAppForModal({ app, candidate, jobTitle })}
                          className="text-xs px-3 py-1.5 rounded-lg font-bold transition-all border text-[var(--color-text)] hover:text-[#06c006] flex items-center gap-1 cursor-pointer"
                          style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                        >
                          Summary
                        </button>
                        <Link
                          to={`/industry/candidate/${app.studentId || 'cand-1'}`}
                          className="text-xs px-3 py-1.5 rounded-lg font-bold transition-all border text-[var(--color-text)] cursor-pointer"
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
                  <button
                    onClick={() => {
                      setPdfResumeModalData({
                        app: selectedAppForModal.app,
                        candidate: selectedAppForModal.candidate
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#06c006] text-black hover:bg-[#06c006]/90 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <FileText size={13} /> View Full PDF
                  </button>
                  <button
                    onClick={() => setSelectedAppForModal(null)}
                    className="w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
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
                        {selectedAppForModal.app.campusName || selectedAppForModal.candidate?.headline || 'Campus applicant from HIERO Bridge'}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] text-slate-500 font-medium">
                        <span>📍 {selectedAppForModal.candidate?.location || 'Bangalore, India'}</span>
                        <span>✉️ {selectedAppForModal.candidate?.email || 'jaswanth@hiero.ai'}</span>
                        <span>📞 {selectedAppForModal.candidate?.phone || '+91 98765 43210'}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="inline-block px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        CGPA: {selectedAppForModal.app.cgpa || selectedAppForModal.candidate?.cgpa || 8.5} / 10
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
                        <strong className="text-slate-900 font-bold">{selectedAppForModal.app.campusName || selectedAppForModal.candidate?.education?.[0]?.institution || 'Campus Partner'}</strong> · <span className="text-slate-700">{selectedAppForModal.app.department || selectedAppForModal.candidate?.education?.[0]?.field || 'B.Tech'}</span>
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
                    {(() => {
                      const candidateProjects = selectedAppForModal.candidate?.projects;
                      const appProjects = (selectedAppForModal.app as any).projects;
                      const projectsToDisplay = (candidateProjects && candidateProjects.length > 0)
                        ? candidateProjects
                        : (appProjects && appProjects.length > 0)
                        ? appProjects.map((p: any) => ({
                            title: p.title || 'Technical Innovation Project',
                            description: p.description || (p.tech ? `Core Technologies: ${p.tech}` : 'Verified software engineering and algorithm implementation.'),
                            skills: Array.isArray(p.skills) ? p.skills : (p.tech ? p.tech.split(',').map((s: string) => s.trim()) : ['Python', 'SQL'])
                          }))
                        : [
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
                          ];

                      return (
                        <>
                          <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                            Key Technical Projects ({projectsToDisplay.length})
                          </h3>
                          <div className="space-y-2">
                            {projectsToDisplay.map((proj: any, idx: number) => (
                              <div key={idx} className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                                <div className="font-bold text-slate-900 text-[11px]">{proj.title}</div>
                                <p className="text-[10px] text-slate-600 leading-snug">{proj.description}</p>
                                {proj.skills && proj.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-1 pt-0.5">
                                    {proj.skills.map((sk: string) => (
                                      <span key={sk} className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[9px] font-semibold">
                                        {sk}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()}
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

      {/* In-page High-Fidelity PDF Resume Modal */}
      <PdfResumeModal
        isOpen={!!pdfResumeModalData}
        onClose={() => setPdfResumeModalData(null)}
        application={pdfResumeModalData?.app}
        candidate={pdfResumeModalData?.candidate}
      />
    </div>
  );
}
