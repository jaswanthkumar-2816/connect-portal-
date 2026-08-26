import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Users, FileText, Star, CalendarCheck, Award,
  ArrowRight, TrendingUp, PlusCircle, Sparkles, Clock, Building2,
  CheckCircle2, ChevronRight, Settings, GitBranch, ShieldCheck,
  UserCheck, Layers
} from 'lucide-react';
import { getDashboardStats, getOpportunities, getApplications, getCompanyById } from '../../services/hiroService';
import { useAuthStore } from '../../store/authStore';
import type { DashboardStats, Opportunity, Application, Company } from '../../types';
import { formatDate } from '../../lib/utils';

/* ── Animated Counter ── */
function AnimCounter({ target, duration = 900 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{val}</span>;
}

/* ── Match Ring ── */
function MatchRing({ score }: { score: number }) {
  const isHigh = score >= 80;
  return (
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
        isHigh
          ? 'bg-[#06c006]/15 border border-[#06c006]/40 text-[#06c006]'
          : 'bg-black/5 dark:bg-white/10 border border-slate-300 dark:border-slate-700 text-[var(--color-muted)]'
      }`}
      style={{ fontFamily: 'Outfit, sans-serif' }}
    >
      {score}%
    </div>
  );
}

/* ── Time Greeting ── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'GOOD MORNING';
  if (h < 18) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

export default function Dashboard() {
  const user = useAuthStore(s => s.user);
  const [company, setCompany] = useState<Company | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [jobs, setJobs] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<'jobs' | 'apps' | 'pipeline'>('jobs');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const compId = user?.companyId || 'c1';
      const [comp, s, j, a] = await Promise.all([
        getCompanyById(compId),
        getDashboardStats(compId),
        getOpportunities(compId),
        getApplications(compId),
      ]);
      setCompany(comp);
      setStats(s);
      setJobs(j);
      setApplications(a);
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#06c006]/30 border-t-[#06c006] rounded-full animate-spin" />
          <p className="text-xs text-[var(--color-muted)] font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const activeJobs = jobs.filter(j => j.status === 'active');
  const companyDisplayName = (user as any)?.companyName || company?.name || 'Company Portal';
  const companyInitials = companyDisplayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const isNewCompany = jobs.length === 0;

  // Stage counts
  const stageApplied = applications.filter(a => a.status === 'applied').length;
  const stageReview = applications.filter(a => a.status === 'under-review').length;
  const stageShortlist = applications.filter(a => a.status === 'shortlisted').length;
  const stageInterview = applications.filter(a => a.status === 'interview').length;
  const stageHired = applications.filter(a => a.status === 'selected').length;

  return (
    <div className="max-w-7xl space-y-5 pb-16 font-sans text-[var(--color-text)]">

      {/* ── TOP HEADER BANNER ── */}
      <div
        className="p-5 rounded-2xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up"
        style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-xl bg-[#06c006]/15 border border-[#06c006]/30 flex items-center justify-center text-[#06c006] text-lg font-black flex-shrink-0"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {companyInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wider">
                {getGreeting()}, {user?.name?.split(' ')[0]}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#06c006]/15 text-[#06c006] border border-[#06c006]/30 inline-flex items-center gap-1">
                <ShieldCheck size={11} /> Verified Employer
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {companyDisplayName}
            </h1>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/industry/company"
            className="px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 text-[var(--color-text)] hover:border-[#06c006]"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
          >
            <Building2 size={14} /> Profile
          </Link>
          <Link
            to="/industry/create"
            className="hiero-btn-primary text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <PlusCircle size={15} /> Post Opportunity
          </Link>
        </div>
      </div>

      {/* ── NEW COMPANY SETUP STRIP ── */}
      {isNewCompany && (
        <div className="p-4 rounded-xl border border-dashed border-[#06c006]/50 bg-[#06c006]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-[#06c006] flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-[var(--color-text)]">Welcome to Connect-Portal!</p>
              <p className="text-[11px] text-[var(--color-muted)] font-medium">Post your first full-time job or internship opportunity to start receiving AI-matched candidate applications.</p>
            </div>
          </div>
          <Link to="/industry/create" className="hiero-btn-primary text-xs font-bold flex-shrink-0 inline-flex items-center gap-1.5">
            <PlusCircle size={14} /> Post Opportunity
          </Link>
        </div>
      )}

      {/* ── SIDE-BY-SIDE LAYOUT: 4 METRIC BOXES VERTICALLY ON LEFT SIDE, REST ON RIGHT SIDE ── */}
      <div className="grid lg:grid-cols-12 gap-5">

        {/* ── LEFT SIDE (3.5 / 12 = ~30%): 4 METRIC BOXES STEP BY STEP VERTICALLY ── */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider">Recruitment Metrics</span>
            <span className="text-[10px] text-[#06c006] font-bold">Step-by-Step</span>
          </div>

          {/* Metric 1: Active Roles */}
          <div
            className="p-4 rounded-2xl border transition-all hover:border-[#06c006]/50"
            style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wider">1. Active Roles</span>
              <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 border border-[var(--color-border)]">
                <Briefcase size={15} className="text-[var(--color-muted)]" />
              </div>
            </div>
            <div className="text-3xl font-black text-[var(--color-text)] font-['Outfit']">
              <AnimCounter target={activeJobs.length} />
            </div>
            <p className="text-[11px] text-[var(--color-muted)] mt-1 font-medium">Published opportunities</p>
          </div>

          {/* Metric 2: Applications */}
          <div
            className="p-4 rounded-2xl border transition-all hover:border-[#06c006]/50"
            style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wider">2. Applications</span>
              <div className="p-2 rounded-xl bg-[#06c006]/15 border border-[#06c006]/30">
                <FileText size={15} className="text-[#06c006]" />
              </div>
            </div>
            <div className="text-3xl font-black text-[var(--color-text)] font-['Outfit']">
              <AnimCounter target={stats.totalApplications} />
            </div>
            <p className="text-[11px] text-[#06c006] mt-1 font-medium">Received candidates</p>
          </div>

          {/* Metric 3: Shortlisted */}
          <div
            className="p-4 rounded-2xl border transition-all hover:border-[#06c006]/50"
            style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wider">3. Shortlisted</span>
              <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 border border-[var(--color-border)]">
                <Star size={15} className="text-[var(--color-muted)]" />
              </div>
            </div>
            <div className="text-3xl font-black text-[var(--color-text)] font-['Outfit']">
              <AnimCounter target={stats.shortlistedCandidates} />
            </div>
            <p className="text-[11px] text-[var(--color-muted)] mt-1 font-medium">Qualified candidates</p>
          </div>

          {/* Metric 4: Hires Made */}
          <div
            className="p-4 rounded-2xl border transition-all hover:border-[#06c006]/50"
            style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wider">4. Hires Made</span>
              <div className="p-2 rounded-xl bg-[#06c006]/15 border border-[#06c006]/30">
                <Award size={15} className="text-[#06c006]" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#06c006] font-['Outfit']">
              <AnimCounter target={stats.hires} />
            </div>
            <p className="text-[11px] text-[#06c006] mt-1 font-medium">Successful placements</p>
          </div>
        </div>

        {/* ── RIGHT SIDE (8.5 / 12 = ~70%): ALL OTHER CONTENT ── */}
        <div className="lg:col-span-8 space-y-4">

          {/* MAIN CONTENT TABBED BOX */}
          <div
            className="p-5 rounded-2xl border shadow-sm"
            style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
          >
            {/* Subnav Tabs */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                {[
                  { id: 'jobs', label: `Active Roles (${activeJobs.length})`, icon: Briefcase },
                  { id: 'apps', label: `Applications (${applications.length})`, icon: UserCheck },
                  { id: 'pipeline', label: 'Pipeline Funnel', icon: GitBranch },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-[#06c006] text-white shadow'
                        : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    <tab.icon size={13} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <Link
                to={activeTab === 'jobs' ? '/industry/jobs' : activeTab === 'apps' ? '/industry/applications' : '/industry/pipeline'}
                className="text-xs text-[#06c006] font-bold hover:underline hidden sm:inline-flex items-center gap-1"
              >
                View all <ChevronRight size={12} />
              </Link>
            </div>

            {/* TAB CONTENT 1: ACTIVE ROLES */}
            {activeTab === 'jobs' && (
              <div className="space-y-3">
                {activeJobs.length === 0 ? (
                  <div className="text-center py-10 rounded-xl border border-dashed border-[var(--color-border)] p-4" style={{ background: 'var(--color-surface-2)' }}>
                    <Briefcase size={28} className="mx-auto text-[var(--color-muted)] mb-2 opacity-50" />
                    <p className="text-xs font-bold text-[var(--color-text)]">No active roles published</p>
                    <p className="text-[11px] text-[var(--color-muted)] font-medium mt-1 mb-3">Post a role to start receiving applications.</p>
                    <Link to="/industry/create" className="hiero-btn-primary text-xs font-bold inline-flex items-center gap-1.5">
                      <PlusCircle size={13} /> Post Opportunity
                    </Link>
                  </div>
                ) : (
                  activeJobs.map(job => (
                    <div
                      key={job.id}
                      className="p-4 rounded-xl border flex items-center justify-between gap-4 transition-colors hover:border-[#06c006]/40"
                      style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-bold text-[var(--color-text)] truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            {job.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[var(--color-muted)] uppercase border border-[var(--color-border)]">
                            {job.type === 'internship' ? 'Internship' : 'Full-time'}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-muted)] font-medium flex items-center gap-2">
                          <span>{job.location}</span>
                          <span>·</span>
                          <span className="capitalize">{job.workMode}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs font-bold text-[#06c006] px-2.5 py-1 rounded-lg bg-[#06c006]/15 border border-[#06c006]/30">
                          {job.applicantsCount} apps
                        </span>
                        <Link
                          to={`/industry/jobs/${job.id}`}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-[var(--color-text)] border border-[var(--color-border)] hover:border-[#06c006]/50 transition-colors"
                          style={{ background: 'var(--color-card)' }}
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT 2: APPLICATIONS */}
            {activeTab === 'apps' && (
              <div className="space-y-3">
                {applications.length === 0 ? (
                  <div className="text-center py-10 rounded-xl border border-dashed border-[var(--color-border)] p-4" style={{ background: 'var(--color-surface-2)' }}>
                    <FileText size={28} className="mx-auto text-[var(--color-muted)] mb-2 opacity-50" />
                    <p className="text-xs font-bold text-[var(--color-text)]">No candidate applications received yet</p>
                  </div>
                ) : (
                  applications.slice(0, 5).map(app => {
                    const job = jobs.find(j => j.id === app.opportunityId);
                    return (
                      <div
                        key={app.id}
                        className="p-3.5 rounded-xl border flex items-center gap-3.5"
                        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                      >
                        <MatchRing score={app.matchScore} />
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/industry/candidate/${app.studentId}`}
                            className="text-xs font-bold text-[var(--color-text)] hover:text-[#06c006] transition-colors truncate block"
                          >
                            {job?.title || 'Applicant'}
                          </Link>
                          <p className="text-[11px] text-[var(--color-muted)] font-medium mt-0.5">
                            Applied {formatDate(app.appliedAt)}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[var(--color-muted)] border border-[var(--color-border)] capitalize">
                          {app.status.replace('-', ' ')}
                        </span>
                        <Link
                          to={`/industry/candidate/${app.studentId}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#06c006] bg-[#06c006]/15 border border-[#06c006]/30 hover:bg-[#06c006]/25 transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB CONTENT 3: PIPELINE FUNNEL */}
            {activeTab === 'pipeline' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { label: 'Applied', count: stageApplied },
                    { label: 'Review', count: stageReview },
                    { label: 'Shortlisted', count: stageShortlist },
                    { label: 'Interview', count: stageInterview },
                    { label: 'Hired', count: stageHired },
                  ].map(stage => (
                    <Link
                      key={stage.label}
                      to="/industry/pipeline"
                      className="p-3.5 rounded-xl border text-center transition-colors hover:border-[#06c006]/40"
                      style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                    >
                      <span className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-wider">{stage.label}</span>
                      <p className="text-xl font-black text-[var(--color-text)] font-['Outfit'] mt-1">{stage.count}</p>
                    </Link>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <Link to="/industry/pipeline" className="text-xs text-[#06c006] font-bold hover:underline inline-flex items-center gap-1">
                    Open Pipeline Board <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* TWO SIDE-BY-SIDE WIDGET BOXES BELOW MAIN TABBED CONTENT */}
          <div className="grid sm:grid-cols-2 gap-4">

            {/* PORTAL LINKS BOX */}
            <div
              className="p-5 rounded-2xl border space-y-3 shadow-sm"
              style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
            >
              <h3 className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider flex items-center gap-2">
                <Layers size={13} className="text-[#06c006]" /> Quick Navigation Links
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { to: '/industry/jobs', label: 'Jobs', icon: Briefcase },
                  { to: '/industry/create', label: 'Post Job', icon: PlusCircle },
                  { to: '/industry/applications', label: 'Applications', icon: FileText },
                  { to: '/industry/shortlisted', label: 'Shortlist', icon: Star },
                  { to: '/industry/pipeline', label: 'Pipeline', icon: GitBranch },
                  { to: '/industry/settings', label: 'Settings', icon: Settings },
                ].map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="p-2.5 rounded-xl border flex items-center gap-2 transition-all hover:border-[#06c006]/50 hover:bg-[#06c006]/5"
                    style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                  >
                    <item.icon size={14} className="text-[#06c006]" />
                    <span className="text-xs font-bold text-[var(--color-text)] truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* SKILLS DEMAND BOX */}
            <div
              className="p-5 rounded-2xl border space-y-3 shadow-sm"
              style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
            >
              <h3 className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={13} className="text-[#06c006]" /> Skills Demand
              </h3>

              <div className="space-y-2.5">
                {stats.topSkillsDemand.slice(0, 3).map((item) => (
                  <div key={item.skill}>
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="font-semibold text-[var(--color-text)]">{item.skill}</span>
                      <span className="font-bold text-[#06c006]">{item.percentage}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
