import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, SlidersHorizontal, ArrowUpDown, Mail, Download, X, Loader2, Check, Mic } from 'lucide-react';
import {
  getApplications,
  getOpportunities,
  getCandidates,
  updateApplicationStatus,
  composeInterviewEmail,
  sendCandidateMail,
  openResume,
  createInterviewInvite,
} from '../../services/hiroService';
import { useAuthStore } from '../../store/authStore';
import { formatDate, getStatusLabel } from '../../lib/utils';
import type { Application, Opportunity, Candidate } from '../../types';
import InterviewReport from '../../components/candidates/InterviewReport';
import InterviewQr from '../../components/candidates/InterviewQr';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'applied', label: 'Applied' },
  { value: 'under-review', label: 'Under Review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'selected', label: 'Selected' },
  { value: 'rejected', label: 'Rejected' },
];

// Most roles are not scored against a skill profile — a salon manager is read
// off their resume, not off a percentage. Show initials there instead of a
// number: 0% reads as a rejection and a made-up score is worse.
function MatchRing({ score, name }: { score?: number; name?: string }) {
  if (score === undefined || score === null) {
    const initials = (name || '?')
      .split(/\s+/)
      .map(w => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
    return (
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
        style={{
          background: 'var(--color-surface-2)',
          border: '1.5px solid var(--color-border)',
          color: 'var(--color-muted)',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}
      >
        {initials}
      </div>
    );
  }
  const color = score >= 85 ? 'var(--color-accent)' : score >= 70 ? '#fbbf24' : '#64748b';
  const bg = score >= 85 ? 'var(--color-accent-bg)' : score >= 70 ? 'rgba(251,191,36,0.1)' : 'rgba(100,116,139,0.1)';
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
      style={{ background: bg, border: `1.5px solid ${color}35`, color, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {score}%
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'var(--color-surface-2)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text)',
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-wider t-muted mb-1.5">
      {children}
    </label>
  );
}

// Sending the invite is the end of the loop, so the recruiter sees the exact
// text before it goes. Date and venue are separate fields because those are
// the two things that actually change between candidates.
function InterviewMailModal({
  app,
  job,
  recruiterName,
  companyName,
  onClose,
  onSent,
}: {
  app: Application;
  job?: Opportunity | null;
  recruiterName?: string;
  companyName?: string;
  onClose: () => void;
  onSent: (updated: Application) => void;
}) {
  const [when, setWhen] = useState('');
  const [where, setWhere] = useState('');
  // On by default: the whole point of the AI interview is that the candidate
  // can do it now, without a slot being agreed first.
  const [withInterview, setWithInterview] = useState(true);
  const [interviewUrl, setInterviewUrl] = useState('');
  const [linkBusy, setLinkBusy] = useState(false);
  const [touchedBody, setTouchedBody] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  // The message box grows to fit what is in it. A fixed-height textarea
  // inside a scrolling panel gives you two scrollbars and a last line sliced
  // through the middle — the recruiter cannot see their own email.
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [body]);

  const prettyWhen = when
    ? new Date(when).toLocaleString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', hour12: true,
      })
    : '';

  // Keep the draft in step with the fields until the recruiter edits it
  // themselves — after that it is their text, not ours.
  // The link is created once, when it is first wanted. Asking for it again
  // would retire the one already in the draft.
  useEffect(() => {
    if (!withInterview || interviewUrl || linkBusy) return;
    setLinkBusy(true);
    // The job goes with the request: the interview service writes the
    // questions from the role, the skills asked for and the post itself,
    // so a stylist and a receptionist are not asked the same ten things.
    createInterviewInvite(app.id, { app, job, companyName }).then(res => {
      setLinkBusy(false);
      if (res.ok && res.url) setInterviewUrl(res.url);
      else setError(res.error || 'Could not create the interview link.');
    });
  }, [withInterview, interviewUrl, linkBusy, app, job, companyName]);

  useEffect(() => {
    const draft = composeInterviewEmail({
      app, job, recruiterName, companyName, when: prettyWhen, where,
      interviewUrl: withInterview ? interviewUrl : '',
    });
    setSubject(prev => (touchedBody && prev ? prev : draft.subject));
    if (!touchedBody) setBody(draft.body);
  }, [app, job, recruiterName, companyName, prettyWhen, where, touchedBody, withInterview, interviewUrl]);

  const send = async () => {
    setError('');
    if (!app.email) {
      setError('This application has no email address on it.');
      return;
    }
    setSending(true);
    const res = await sendCandidateMail({
      kind: 'interview',
      applicationId: app.id,
      opportunityId: app.opportunityId,
      to: app.email,
      subject,
      body,
      scheduledAt: when || undefined,
    });
    setSending(false);
    if (!res.ok) {
      setError(res.error || 'The mail could not be sent.');
      return;
    }
    onSent({ ...app, ...(res.application || {}), status: 'interview' });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      {/* Header and footer are pinned and only the middle scrolls. Scrolling
          the whole box took the title and the Send button off screen, and on
          a short window the top was simply clipped. */}
      <div
        className="w-full max-w-xl max-h-[92vh] rounded-2xl flex flex-col overflow-hidden"
        style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)' }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="flex items-start justify-between gap-3 px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div className="min-w-0">
            <h3 className="text-base font-black t-strong" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Interview invitation
            </h3>
            <p className="text-xs t-muted mt-0.5 truncate">
              To {app.studentName || 'candidate'} · <span className="t-dim">{app.email}</span>
            </p>
          </div>
          <button onClick={onClose} className="t-muted hover:t-strong transition-colors flex-shrink-0 -mr-1">
            <X size={18} />
          </button>
        </div>

        {/* min-h-0 matters: a flex child defaults to min-height:auto, so it
            refuses to shrink below its content and the box grew past
            max-h-[92vh] — centring then pushed the header off the top of the
            screen. */}
        <div className="flex-1 min-h-0 relative flex flex-col">
        {/* flex-1 + min-h-0 again, not h-full: a percentage height resolves
            against the parent's declared height, and this parent's is auto,
            so h-full silently became content height and nothing scrolled. */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">

        <label
          className="flex items-start gap-2.5 mb-3 p-3 rounded-xl cursor-pointer"
          style={{ background: 'var(--color-accent-bg)', border: '1px solid var(--color-accent-border)' }}
        >
          <input
            type="checkbox"
            checked={withInterview}
            onChange={e => setWithInterview(e.target.checked)}
            className="mt-0.5 accent-[var(--color-accent)]"
          />
          <span className="text-xs leading-relaxed t-dim">
            <b className="t-strong">Include an AI interview link</b>
            <br />
            Questions written from this job post, answered out loud. Works once, expires in a week.
            {linkBusy && (
              <>
                <br />
                <span className="t-muted">Writing the questions for this role…</span>
              </>
            )}
            {interviewUrl && !linkBusy && (
              <>
                <br />
                <span className="text-hiero-green font-semibold">Link ready</span>
              </>
            )}
          </span>
        </label>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <FieldLabel>{withInterview ? 'Meet after (optional)' : 'Date & time'}</FieldLabel>
            <input
              type="datetime-local"
              value={when}
              onChange={e => setWhen(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <FieldLabel>Where</FieldLabel>
            <input
              type="text"
              value={where}
              onChange={e => setWhere(e.target.value)}
              placeholder="Shop address, or a video call link"
              className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
              style={inputStyle}
            />
          </div>
        </div>

        {withInterview && interviewUrl && <InterviewQr url={interviewUrl} />}

        <div className="mb-3">
          <FieldLabel>Subject</FieldLabel>
          <input
            type="text"
            value={subject}
            onChange={e => { setSubject(e.target.value); setTouchedBody(true); }}
            className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
            style={inputStyle}
          />
        </div>

        <div className="mb-3">
          <FieldLabel>Message</FieldLabel>
          <textarea
            ref={bodyRef}
            value={body}
            onChange={e => { setBody(e.target.value); setTouchedBody(true); }}
            rows={1}
            className="w-full rounded-xl px-3 py-2.5 focus:outline-none resize-none leading-relaxed block"
            style={{ ...inputStyle, fontSize: '13px', overflow: 'hidden' }}
          />
        </div>

        {error && (
          <div
            className="text-xs font-semibold rounded-xl px-3 py-2 mb-3"
            style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.3)', color: '#ff6b6b' }}
          >
            {error}
          </div>
        )}

        </div>
        {/* Text that carries on past the panel fades out. Cut square, it
            reads as a rendering fault rather than as more to scroll. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-7"
          style={{ background: 'linear-gradient(to bottom, rgba(14,14,24,0), var(--color-bg-2))' }}
        />
        </div>

        <div
          className="flex items-center justify-between gap-3 px-5 py-3.5 flex-shrink-0"
          style={{ background: 'var(--color-bg-2)', borderTop: '1px solid var(--color-border)' }}
        >
          <p className="text-[11px] t-muted leading-snug">
            Sent from the HIERO mailbox; replies come back to your address.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-xs px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap"
              style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}
            >
              Cancel
            </button>
            <button
              onClick={send}
              disabled={sending}
              className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-bold transition-all disabled:opacity-60 whitespace-nowrap flex-shrink-0"
              style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent)', border: '1px solid var(--color-accent-border)' }}
            >
              {sending ? <Loader2 size={13} className="animate-spin" /> : <Mail size={13} />}
              {sending ? 'Sending…' : 'Send invitation'}
            </button>
          </div>
        </div>
      </div>
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
  const [sortBy, setSortBy] = useState<'match' | 'recent'>('recent');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [resumeError, setResumeError] = useState('');
  const [resumeView, setResumeView] = useState<{ href: string; name: string } | null>(null);
  const [reportFor, setReportFor] = useState<Application | null>(null);
  const [mailFor, setMailFor] = useState<Application | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getApplications(user.companyId),
      getOpportunities(user.companyId),
      getCandidates(),
    ]).then(([a, o, c]) => {
      setApplications(a);
      setOpportunities(o);
      setCandidates(c);
      setLoading(false);
    });
  }, [user]);

  const filtered = useMemo(
    () =>
      applications
        .filter(a => filterJob === 'all' || a.opportunityId === filterJob)
        .filter(a => filterStatus === 'all' || a.status === filterStatus)
        .sort((a, b) =>
          sortBy === 'match'
            ? (b.matchScore ?? -1) - (a.matchScore ?? -1)
            : new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
        ),
    [applications, filterJob, filterStatus, sortBy]
  );

  const replace = (updated: Application) =>
    setApplications(prev => prev.map(a => (a.id === updated.id ? { ...a, ...updated } : a)));

  // The file sits behind the recruiter's token, so it is fetched rather than
  // linked, then handed to a new tab as a blob.
  const viewResume = async (app: Application) => {
    setResumeError('');
    setBusyId(app.id);
    const res = await openResume(app.resumeUrl);
    setBusyId('');
    if (!res.ok || !res.href) {
      setResumeError(res.error || 'Could not open that resume.');
      return;
    }
    // Shown in the portal rather than a new tab: a popup opened after an
    // await is blocked by the browser, and reading the CV is the main thing
    // the recruiter came here to do — it should not cost a tab.
    setResumeView({ href: res.href, name: app.studentName || 'Resume' });
  };

  const closeResume = () => {
    if (resumeView) URL.revokeObjectURL(resumeView.href);
    setResumeView(null);
  };

  const shortlist = async (app: Application) => {
    setBusyId(app.id);
    try {
      const updated = await updateApplicationStatus(app.id, 'shortlisted', app);
      replace({ ...app, ...updated, status: 'shortlisted' });
    } finally {
      setBusyId('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-hiero-green/30 border-t-hiero-green rounded-full animate-spin" />
      </div>
    );
  }

  const selectStyle = {
    background: 'var(--color-surface-2)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-dim)',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-2xl font-black t-strong" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Applications</h1>
          <p className="text-sm t-muted mt-1">{filtered.length} application{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-surface-2)' }}>
        <SlidersHorizontal size={14} className="t-muted" />

        <select
          value={filterJob}
          onChange={e => setFilterJob(e.target.value)}
          className="rounded-xl px-3 py-1.5 text-sm font-medium focus:outline-none cursor-pointer"
          style={selectStyle}
        >
          <option value="all">All Jobs</option>
          {opportunities.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="rounded-xl px-3 py-1.5 text-sm font-medium focus:outline-none cursor-pointer"
          style={selectStyle}
        >
          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <button
          onClick={() => setSortBy(sortBy === 'match' ? 'recent' : 'match')}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:t-strong"
          style={{ ...selectStyle, color: 'rgba(0,255,102,0.8)' }}
        >
          <ArrowUpDown size={13} />
          {sortBy === 'match' ? 'Best Match' : 'Most Recent'}
        </button>
      </div>

      {resumeError && (
        <div
          className="text-xs font-semibold rounded-xl px-3 py-2"
          style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.3)', color: '#ff6b6b' }}
        >
          {resumeError}
        </div>
      )}

      {/* Application List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
          style={{ background: 'var(--color-surface-3)', border: '1px dashed var(--color-border)' }}>
          <FileText size={36} className="t-faint mb-3" />
          <p className="text-sm font-medium t-muted">No applications found</p>
          <p className="text-xs t-faint mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((app, i) => {
            const job = opportunities.find(o => o.id === app.opportunityId);
            const candidate = candidates.find(c => c.id === app.studentId);
            // The applicant's own details are on the application. Resolving
            // only through the campus directory is what used to turn every
            // direct applicant into "Unknown Candidate".
            const name = candidate?.name || app.studentName || app.email || 'Unknown Candidate';
            const resume = app.resumeUrl;
            const statusClass = `status-${app.status === 'under-review' ? 'review' : app.status}`;
            const mailed = app.interviewMailSentAt || app.selectionNotifiedAt;

            return (
              <div
                key={app.id}
                className="rounded-2xl p-4 hiero-card-hover animate-card-in group"
                style={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-surface-2)',
                  animationDelay: `${i * 45}ms`,
                }}
              >
                <div className="flex items-center gap-4">
                  <MatchRing score={app.matchScore} name={name} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <Link
                        to={`/industry/candidate/${app.studentId}`}
                        className="font-bold t-strong hover:text-hiero-green transition-colors text-sm"
                      >
                        {name}
                      </Link>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg capitalize ${statusClass}`}>
                        {getStatusLabel(app.status)}
                      </span>
                      {mailed && (
                        <span className="flex items-center gap-1 text-[10px] font-bold t-muted">
                          <Check size={10} /> mailed {formatDate(mailed)}
                        </span>
                      )}
                    </div>

                    {/* Contact details — this is what the salon owner needs to
                        act on, so it sits on the row, not behind a click. */}
                    <p className="text-xs t-muted">
                      {app.email || 'No email'}
                      {app.phone ? <span className="t-muted"> · {app.phone}</span> : null}
                    </p>

                    <p className="text-xs t-muted mt-0.5">
                      Applied for <span className="t-dim font-medium">{job?.title || app.jobTitle || 'Unknown'}</span>
                      {' · '}{formatDate(app.appliedAt)}
                    </p>

                    {app.matchingSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {app.matchingSkills.slice(0, 4).map(s => (
                          <span key={s.name} className="tag-skill-green">{s.name}{s.score ? ` ${s.score}%` : ''}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {resume ? (
                      <button
                        onClick={() => viewResume(app)}
                        disabled={busyId === app.id}
                        className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all disabled:opacity-60"
                        style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent)', border: '1px solid var(--color-accent-border)' }}
                      >
                        <FileText size={12} /> {busyId === app.id ? 'Opening…' : 'View resume'}
                      </button>
                    ) : (
                      <span className="text-[11px] t-faint px-2">No resume</span>
                    )}

                    <Link
                      to={`/industry/candidate/${app.studentId}`}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                      style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}
                    >
                      View
                    </Link>

                    {app.status !== 'shortlisted' && app.status !== 'selected' && app.status !== 'interview' && (
                      <button
                        onClick={() => shortlist(app)}
                        disabled={busyId === app.id}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
                        style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}
                      >
                        {busyId === app.id ? 'Saving…' : 'Shortlist'}
                      </button>
                    )}

                    {/* The way in to the interview result. It used to appear
                        only when the application carried an interviewInvite,
                        which the gateway used to stamp — the interview runs on
                        its own service now and stamps nothing, so a recruiter
                        who had sent an interview had no way to open what came
                        back. Having sent the mail is enough to offer it; the
                        report itself says whether they have taken it yet. */}
                    {(app.interviewInvite || app.interviewMailSentAt || app.status === 'interview') && (
                      <button
                        onClick={() => setReportFor(app)}
                        title="See how the interview went"
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold transition-all"
                        style={
                          app.interviewInvite?.status === 'started'
                            ? { background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }
                            : { background: 'var(--color-surface-2)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }
                        }
                      >
                        <Mic size={12} />
                        {app.interviewInvite?.status === 'started' ? 'Interview taken' : 'Interview'}
                      </button>
                    )}

                    <button
                      onClick={() => setMailFor(app)}
                      disabled={!app.email}
                      title={app.email ? 'Send an interview invitation' : 'No email on this application'}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold transition-all disabled:opacity-40"
                      style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}
                    >
                      <Mail size={12} /> Interview mail
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {resumeView && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={closeResume}
        >
          <div
            className="w-full max-w-5xl h-[94vh] rounded-2xl flex flex-col overflow-hidden"
            style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={15} className="text-hiero-green flex-shrink-0" />
                <p className="text-sm font-bold t-strong truncate">{resumeView.name}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={resumeView.href}
                  download={`${resumeView.name.replace(/\s+/g, '_')}.pdf`}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold transition-all"
                  style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent)', border: '1px solid var(--color-accent-border)' }}
                >
                  <Download size={12} /> Download
                </a>
                <button onClick={closeResume} className="t-muted hover:t-strong transition-colors p-1">
                  <X size={18} />
                </button>
              </div>
            </div>
            {/* The browser's own PDF chrome was taking a third of the panel
                for a thumbnail strip and a toolbar, and rendering the page at
                its native size — so a resume opened small, cropped, and
                surrounded by furniture. These fragment options turn the
                viewer's panes off and fit the page to the width available,
                which is the whole job here: read the CV. */}
            <iframe
              src={`${resumeView.href}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
              title={`Resume — ${resumeView.name}`}
              className="flex-1 w-full"
              style={{ border: 'none', background: '#fff' }}
            />
          </div>
        </div>
      )}

      {reportFor && (
        <InterviewReport app={reportFor} onClose={() => setReportFor(null)} />
      )}

      {mailFor && (
        <InterviewMailModal
          app={mailFor}
          job={opportunities.find(o => o.id === mailFor.opportunityId) || null}
          recruiterName={user?.name}
          companyName={user?.companyName}
          onClose={() => setMailFor(null)}
          onSent={updated => {
            replace(updated);
            setMailFor(null);
          }}
        />
      )}
    </div>
  );
}
