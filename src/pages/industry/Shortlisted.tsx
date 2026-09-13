import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, GraduationCap, ChevronRight, Star, CheckCircle2, X } from 'lucide-react';
import { getApplications, getOpportunities, getCandidates, sendSelectionNotice, isCampusApplicant, composeSelectionEmail } from '../../services/hiroService';
import { useAuthStore } from '../../store/authStore';
import type { Application, Opportunity, Candidate } from '../../types';

function fallbackCandidate(app: Application): Candidate {
  return {
    id: app.studentId || app.id,
    name: app.studentName || 'Candidate',
    email: app.email || '',
    phone: app.phone,
    headline: [app.department, app.campusName].filter(Boolean).join(' · ') || app.jobTitle || 'Shortlisted talent',
    location: app.campusLocation || 'India',
    skills: (app.matchingSkills || []).map(s => ({
      name: s.name,
      competency: s.score,
      verified: true,
      lastAssessedAt: app.appliedAt,
    })),
    projects: [],
    education: app.campusName ? [{
      institution: app.campusName,
      degree: 'B.Tech',
      field: app.department || 'Computer Science',
      startYear: 2022,
      endYear: 2026,
      cgpa: app.cgpa,
    }] : [],
    experience: [],
    certifications: [],
    resumeUrl: app.resumeUrl,
    cgpa: app.cgpa,
    authorizedSections: ['all'],
  };
}

function fallbackJob(app: Application): Opportunity {
  return {
    id: app.opportunityId,
    companyId: app.companyId || '',
    companyName: app.companyName,
    type: 'full-time',
    title: app.jobTitle || 'Opportunity',
    department: app.department || '',
    description: '',
    requiredSkills: [],
    preferredSkills: [],
    eligibility: '',
    location: app.campusLocation || '',
    workMode: 'hybrid',
    employmentType: 'Full-time',
    salary: '',
    deadline: '',
    status: 'active',
    applicantsCount: 0,
    shortlistedCount: 0,
    createdAt: app.appliedAt,
  };
}

export default function Shortlisted() {
  const user = useAuthStore(s => s.user);
  const [shortlisted, setShortlisted] = useState<{ app: Application; candidate: Candidate; job: Opportunity }[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [compose, setCompose] = useState<{
    row: { app: Application; candidate: Candidate; job: Opportunity };
    to: string;
    subject: string;
    body: string;
  } | null>(null);
  const [bulkProgress, setBulkProgress] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; title: string; detail?: string } | null>(null);

  const load = async () => {
    if (!user) return;
    const [apps, opps, cands] = await Promise.all([
      getApplications(user.companyId),
      getOpportunities(user.companyId),
      getCandidates(),
    ]);
    const result = apps
      .filter(a => a.status === 'shortlisted' || a.status === 'selected')
      .map(a => ({
        app: a,
        candidate: cands.find(c => c.id === a.studentId) || fallbackCandidate(a),
        job: opps.find(o => o.id === a.opportunityId || o.title === a.jobTitle) || fallbackJob(a),
      }));
    setShortlisted(result);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user]);

  const openCompose = (row: { app: Application; candidate: Candidate; job: Opportunity }) => {
    const draft = composeSelectionEmail({
      app: row.app,
      candidate: row.candidate,
      job: row.job,
      recruiterName: user?.name,
      companyName: (user as { companyName?: string } | null)?.companyName || row.job.companyName,
    });
    setNotice(null);
    setCompose({ row, ...draft });
  };

  const showSentBanner = (title: string, detail?: string) => {
    setBanner({ type: 'success', title, detail });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.setTimeout(() => setBanner(null), 8000);
  };

  const handleSendSelection = async () => {
    if (!compose || sendingId) return;
    const { row } = compose;
    setSendingId(row.app.id);
    try {
      const updated = await sendSelectionNotice({
        app: row.app,
        candidate: { ...row.candidate, email: compose.to || row.candidate.email },
        job: row.job,
        recruiterName: user?.name,
        companyName: (user as { companyName?: string } | null)?.companyName || row.job.companyName,
        subject: compose.subject,
        body: compose.body,
      });
      setShortlisted(prev => prev.map(item =>
        item.app.id === row.app.id ? { ...item, app: updated } : item
      ));
      const campus = isCampusApplicant(updated)
        ? ' College admin portal has been updated with this candidate.'
        : '';
      setNotice(`${row.candidate.name} has been marked as selected. Email recorded.${campus}`);
      setCompose(null);
      showSentBanner('Email is sent', `Congratulations mail sent to ${row.candidate.name}.${campus}`);
    } catch {
      setNotice('Could not send the selection notice. Please try again.');
    } finally {
      setSendingId(null);
    }
  };

  const pendingBulk = shortlisted.filter(row => !row.app.selectionNotifiedAt && row.app.status !== 'selected');
  const bulkTargets = pendingBulk.length > 0 ? pendingBulk : shortlisted;

  const handleSendAll = async () => {
    if (sendingId) return;
    setSendingId('all');
    setNotice(null);
    setBanner(null);
    const companyName = (user as { companyName?: string } | null)?.companyName;
    let sent = 0;
    let campus = 0;
    const nextRows = [...shortlisted];
    try {
      for (let i = 0; i < bulkTargets.length; i++) {
        const row = bulkTargets[i];
        setBulkProgress(`Sending ${i + 1} of ${bulkTargets.length}…`);
        const updated = await sendSelectionNotice({
          app: row.app,
          candidate: row.candidate,
          job: row.job,
          recruiterName: user?.name,
          companyName: companyName || row.job.companyName,
        });
        sent += 1;
        if (isCampusApplicant(updated)) campus += 1;
        const idx = nextRows.findIndex(r => r.app.id === row.app.id);
        if (idx >= 0) nextRows[idx] = { ...nextRows[idx], app: updated };
        setShortlisted([...nextRows]);
      }
      setNotice(
        `Congratulations mail sent to ${sent} shortlisted student${sent !== 1 ? 's' : ''}.` +
        (campus ? ` ${campus} campus record${campus !== 1 ? 's' : ''} pushed to the college admin portal.` : '')
      );
      showSentBanner(
        'Email is sent',
        `Congratulations mail sent to all ${sent} shortlisted student${sent !== 1 ? 's' : ''}.` +
        (campus ? ` College admin portal updated for ${campus} campus applicant${campus !== 1 ? 's' : ''}.` : '')
      );
    } catch {
      setNotice('Could not send congratulations mail to everyone. Try again.');
    } finally {
      setSendingId(null);
      setBulkProgress(null);
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
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)] flex items-center gap-2.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <Star className="text-[#06c006]" size={22} />
            Shortlisted
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1 font-medium">{shortlisted.length} candidate{shortlisted.length !== 1 ? 's' : ''} shortlisted</p>
        </div>
        {shortlisted.length > 0 && (
          <button
            onClick={handleSendAll}
            disabled={Boolean(sendingId)}
            className="hiero-btn-primary text-sm font-bold px-4 py-2.5 flex items-center gap-2 shadow-[0_0_20px_rgba(6,192,6,0.2)] disabled:opacity-70"
          >
            <Mail size={16} />
            {sendingId === 'all' ? (bulkProgress || 'Sending…') : 'Send congratulations mail'}
          </button>
        )}
      </div>

      {banner && (
        <div
          className={`rounded-2xl border px-4 py-3.5 flex items-start gap-3 animate-slide-up ${
            banner.type === 'success'
              ? 'bg-[#06c006]/12 border-[#06c006]/40'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          <CheckCircle2
            size={22}
            className={`flex-shrink-0 mt-0.5 ${banner.type === 'success' ? 'text-[#06c006]' : 'text-red-500'}`}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {banner.title}
            </p>
            {banner.detail && (
              <p className="text-xs text-[var(--color-muted)] font-medium mt-0.5">{banner.detail}</p>
            )}
          </div>
          <button
            onClick={() => setBanner(null)}
            className="p-1 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)]"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {notice && !banner && (
        <div className="rounded-xl border border-[#06c006]/30 bg-[#06c006]/10 px-4 py-3 text-sm font-medium text-[var(--color-text)]">
          {notice}
        </div>
      )}

      {shortlisted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed"
          style={{ background: 'var(--color-surface-3)', borderColor: 'var(--color-border)' }}>
          <Star size={36} className="text-[var(--color-muted)] mb-3 opacity-40" />
          <p className="text-sm font-bold text-[var(--color-muted)]">No shortlisted candidates yet</p>
          <p className="text-xs text-[var(--color-muted)] mt-1 font-medium">Shortlist matches and they will show up here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shortlisted.map(({ app, candidate, job }, i) => {
            const initials = (candidate.name || 'C').split(' ').map(n => n[0]).join('').slice(0, 2);
            const scoreColor = app.matchScore >= 85 ? '#06c006' : app.matchScore >= 70 ? '#f59e0b' : '#64748b';
            const campus = isCampusApplicant(app);
            const selected = app.status === 'selected' || Boolean(app.selectionNotifiedAt);
            return (
              <div
                key={app.id}
                className="cp-card rounded-2xl p-6 hiero-card-hover animate-card-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start gap-5">
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
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {campus && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#06c006]/12 text-[#06c006]">
                              {app.campusName || 'Campus applicant'}
                            </span>
                          )}
                          {selected && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400">
                              Selected
                            </span>
                          )}
                        </div>
                      </div>
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
                      {candidate.education?.[0] && (
                        <span className="flex items-center gap-1.5"><GraduationCap size={11} />{candidate.education[0].institution}</span>
                      )}
                      <span>
                        Applied for: <span className="text-[var(--color-text)] font-semibold">{job.title}</span>
                      </span>
                    </div>

                    {(app.matchingSkills?.length ?? 0) > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {app.matchingSkills.slice(0, 5).map(s => (
                          <span key={s.name} className="tag-skill-green">{s.name} {s.score}%</span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                      <Link
                        to={`/industry/candidate/${candidate.id}`}
                        className="px-4 py-2 rounded-xl text-xs font-bold border text-[var(--color-text)] transition-all flex items-center gap-1"
                        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                      >
                        View Profile <ChevronRight size={13} />
                      </Link>
                      <button
                        onClick={() => openCompose({ app, candidate, job })}
                        className={`hiero-btn-primary text-xs px-4 py-2 font-bold shadow-[0_0_20px_rgba(6,192,6,0.2)] flex items-center gap-1.5 ${
                          selected ? 'opacity-90' : ''
                        }`}
                      >
                        {selected ? <CheckCircle2 size={13} /> : <Mail size={13} />}
                        {selected ? 'Selection sent' : 'Send selection email'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {compose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCompose(null)} />
          <div
            className="relative w-full max-w-lg rounded-2xl border shadow-2xl p-5"
            style={{ background: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
          >
            <h2 className="text-lg font-black text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Send selection email
            </h2>
            <p className="text-xs text-[var(--color-muted)] font-medium mt-1">
              Review the message, then send. Campus applicants are also pushed to the college admin portal.
            </p>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wide">To</span>
                <input
                  value={compose.to}
                  onChange={e => setCompose({ ...compose, to: e.target.value })}
                  className="mt-1 w-full rounded-xl px-3 py-2 text-sm font-medium border outline-none"
                  style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  placeholder="candidate@college.edu"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wide">Subject</span>
                <input
                  value={compose.subject}
                  onChange={e => setCompose({ ...compose, subject: e.target.value })}
                  className="mt-1 w-full rounded-xl px-3 py-2 text-sm font-medium border outline-none"
                  style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wide">Message</span>
                <textarea
                  value={compose.body}
                  onChange={e => setCompose({ ...compose, body: e.target.value })}
                  rows={9}
                  className="mt-1 w-full rounded-xl px-3 py-2 text-sm font-medium border outline-none resize-none leading-relaxed"
                  style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                />
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setCompose(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border"
                style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendSelection}
                disabled={Boolean(sendingId)}
                className="hiero-btn-primary text-xs px-4 py-2 font-bold flex items-center gap-1.5"
              >
                <Mail size={13} />
                {sendingId ? 'Sending…' : 'Send email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
