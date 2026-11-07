import { useCallback, useEffect, useState } from 'react';
import { ShieldCheck, Check, X, Mail, Building2, Clock, Loader2, Copy, Send, Trash2 } from 'lucide-react';
import {
  getAccessRequests,
  approveAccessRequest,
  rejectAccessRequest,
  resendCredentials,
  removeAccessRequest,
  type AccessRequest,
} from '../../services/accessService';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from '../../lib/utils';

// ============================================================
// Who gets into Connect
// ============================================================
// Approving here creates the company's account and emails them their sign-in
// details. That is the whole reason this page exists: the decision used to
// live in somebody's inbox and a script run by hand.
//
// Colours come from the theme tokens rather than from hardcoded white. This
// page was written dark-only, so on a light screen its heading was white on
// near-white and two of its three tabs could not be seen at all.

const TABS: { value: 'pending' | 'approved' | 'rejected'; label: string }[] = [
  { value: 'pending', label: 'Waiting' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  pending: { bg: 'rgba(251,191,36,0.14)', fg: '#b45309' },
  approved: { bg: 'var(--color-accent-bg)', fg: 'var(--color-accent)' },
  rejected: { bg: 'rgba(239,68,68,0.12)', fg: '#dc2626' },
};

const quietButton = {
  background: 'var(--color-surface-2)',
  color: 'var(--color-muted)',
  border: '1px solid var(--color-border)',
};

const accentButton = {
  background: 'var(--color-accent-bg)',
  color: 'var(--color-accent)',
  border: '1px solid var(--color-accent-border)',
};

const dangerButton = {
  background: 'rgba(239,68,68,0.1)',
  color: '#dc2626',
  border: '1px solid rgba(239,68,68,0.3)',
};

export default function AccessRequests() {
  const user = useAuthStore(s => s.user);
  const isAdmin = user?.accountRole === 'admin';

  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [rows, setRows] = useState<AccessRequest[]>([]);
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');
  const [rejecting, setRejecting] = useState<AccessRequest | null>(null);
  const [removing, setRemoving] = useState<AccessRequest | null>(null);
  const [sentTo, setSentTo] = useState('');
  const [removed, setRemoved] = useState('');
  const [note, setNote] = useState('');
  // Only ever set when the email failed, so the admin can pass the password
  // on by hand rather than leaving the company locked out.
  const [fallbackPassword, setFallbackPassword] = useState<{ email: string; password: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getAccessRequests(tab);
    setLoading(false);
    if (!res.ok) {
      setError(res.error || 'Could not load requests.');
      return;
    }
    setError('');
    setRows(res.requests);
    setPending(res.pending);
  }, [tab]);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShieldCheck size={34} className="mb-3" style={{ color: 'var(--color-muted-2)' }} />
        <p className="text-sm font-semibold" style={{ color: 'var(--color-text-dim)' }}>
          This area is for HIERO administrators
        </p>
        <p className="text-xs mt-1.5 max-w-sm" style={{ color: 'var(--color-muted)' }}>
          Your account can manage {user?.companyName || 'your company'}, but not decide which other
          companies get into Connect.
        </p>
      </div>
    );
  }

  const approve = async (row: AccessRequest) => {
    setBusyId(row.id);
    setError('');
    const res = await approveAccessRequest(row.id);
    setBusyId('');
    if (!res.ok) {
      setError(res.error || 'Could not approve this request.');
      return;
    }
    if (!res.emailed && res.temporaryPassword) {
      setFallbackPassword({ email: row.email, password: res.temporaryPassword });
    }
    load();
  };

  const resend = async (row: AccessRequest) => {
    setBusyId(row.id);
    setError('');
    const res = await resendCredentials(row.id);
    setBusyId('');
    if (!res.ok) {
      setError(res.error || 'Could not resend the credentials.');
      return;
    }
    if (!res.emailed && res.temporaryPassword) {
      setFallbackPassword({ email: row.email, password: res.temporaryPassword });
    } else {
      setError('');
      setSentTo(row.email);
      setTimeout(() => setSentTo(''), 6000);
    }
  };

  const confirmReject = async () => {
    if (!rejecting) return;
    setBusyId(rejecting.id);
    const res = await rejectAccessRequest(rejecting.id, note);
    setBusyId('');
    setRejecting(null);
    setNote('');
    if (!res.ok) {
      setError(res.error || 'Could not reject this request.');
      return;
    }
    load();
  };

  const confirmRemove = async () => {
    if (!removing) return;
    const target = removing;
    setBusyId(target.id);
    const res = await removeAccessRequest(target.id);
    setBusyId('');
    setRemoving(null);
    if (!res.ok) {
      setError(res.error || 'Could not remove this company.');
      return;
    }
    setError('');
    setRemoved(
      res.accountDisabled
        ? `${target.companyName} removed. Their sign-in no longer works.`
        : `${target.companyName} removed from the list.`
    );
    setTimeout(() => setRemoved(''), 7000);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between animate-slide-up">
        <div>
          <h1
            className="text-2xl font-black"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--color-text)' }}
          >
            Access requests
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            {pending === 0
              ? 'No companies waiting'
              : `${pending} compan${pending === 1 ? 'y' : 'ies'} waiting to be let in`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className="text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all"
            style={tab === t.value ? accentButton : quietButton}
          >
            {t.label}
            {t.value === 'pending' && pending > 0 ? ` · ${pending}` : ''}
          </button>
        ))}
      </div>

      {error && (
        <div
          className="text-xs font-semibold rounded-xl px-3 py-2"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#dc2626' }}
        >
          {error}
        </div>
      )}

      {sentTo && (
        <div className="text-xs font-semibold rounded-xl px-3 py-2" style={accentButton}>
          New sign-in details sent to {sentTo}. The previous password no longer works.
        </div>
      )}

      {removed && (
        <div className="text-xs font-semibold rounded-xl px-3 py-2" style={accentButton}>
          {removed}
        </div>
      )}

      {fallbackPassword && (
        <div
          className="rounded-2xl p-4"
          style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.35)' }}
        >
          <p className="text-xs font-bold mb-1.5" style={{ color: '#b45309' }}>
            The account was created, but the email did not send
          </p>
          <p className="text-xs mb-2.5" style={{ color: 'var(--color-text-dim)' }}>
            Pass these on yourself. They will not be shown again, and the password must be changed on
            first sign-in.
          </p>
          <div
            className="flex items-center justify-between gap-3 rounded-xl px-3 py-2"
            style={{ background: 'var(--color-surface-2)' }}
          >
            <code className="text-xs truncate" style={{ color: 'var(--color-text)' }}>
              {fallbackPassword.email} · {fallbackPassword.password}
            </code>
            <button
              onClick={() => navigator.clipboard?.writeText(fallbackPassword.password)}
              className="flex items-center gap-1 text-[11px] font-bold transition-colors flex-shrink-0"
              style={{ color: 'var(--color-muted)' }}
            >
              <Copy size={11} /> Copy
            </button>
          </div>
          <button
            onClick={() => setFallbackPassword(null)}
            className="text-[11px] font-bold transition-colors mt-2.5"
            style={{ color: 'var(--color-muted)' }}
          >
            Done
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 border-2 border-hiero-green/30 border-t-hiero-green rounded-full animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl"
          style={{ background: 'var(--color-surface-3)', border: '1px dashed var(--color-border)' }}
        >
          <Building2 size={34} className="mb-3" style={{ color: 'var(--color-muted-2)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
            Nothing {tab === 'pending' ? 'waiting' : tab}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {rows.map((row, i) => {
            const style = STATUS_STYLE[row.status] || STATUS_STYLE.pending;
            return (
              <div
                key={row.id}
                className="rounded-2xl p-4 hiero-card-hover animate-card-in"
                style={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  animationDelay: `${i * 45}ms`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                    style={{
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-muted)',
                    }}
                  >
                    {row.companyName.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-0.5">
                      <p className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                        {row.companyName}
                      </p>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-lg capitalize"
                        style={{ background: style.bg, color: style.fg }}
                      >
                        {row.status}
                      </span>
                    </div>
                    <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--color-text-dim)' }}>
                      <Mail size={11} /> {row.email}
                    </p>
                    <p className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color: 'var(--color-muted)' }}>
                      <Clock size={11} /> asked {formatDate(row.createdAt)}
                      {row.decidedBy ? ` · decided by ${row.decidedBy}` : ''}
                    </p>
                    {row.note && (
                      <p className="text-xs mt-1.5 italic" style={{ color: 'var(--color-muted)' }}>
                        “{row.note}”
                      </p>
                    )}
                  </div>

                  {row.status === 'approved' && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => resend(row)}
                        disabled={busyId === row.id}
                        title="Send the sign-in details again with a new password"
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all disabled:opacity-50"
                        style={quietButton}
                      >
                        {busyId === row.id ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                        {busyId === row.id ? 'Sending…' : 'Resend email'}
                      </button>
                      <button
                        onClick={() => setRemoving(row)}
                        disabled={busyId === row.id}
                        title="Remove this company and stop its sign-in"
                        aria-label={`Remove ${row.companyName}`}
                        className="flex items-center justify-center w-8 h-8 rounded-lg transition-all disabled:opacity-50"
                        style={quietButton}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}

                  {row.status === 'rejected' && (
                    <button
                      onClick={() => setRemoving(row)}
                      disabled={busyId === row.id}
                      title="Clear this off the list"
                      aria-label={`Remove ${row.companyName}`}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all disabled:opacity-50 flex-shrink-0"
                      style={quietButton}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  )}

                  {row.status === 'pending' && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setRejecting(row)}
                        disabled={busyId === row.id}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
                        style={quietButton}
                      >
                        <X size={12} className="inline -mt-0.5 mr-1" />
                        Reject
                      </button>
                      <button
                        onClick={() => approve(row)}
                        disabled={busyId === row.id}
                        className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all disabled:opacity-60"
                        style={accentButton}
                      >
                        {busyId === row.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                        {busyId === row.id ? 'Creating…' : 'Approve'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {rejecting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setRejecting(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-5"
            style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)' }}
            onClick={e => e.stopPropagation()}
          >
            <h3
              className="text-lg font-black mb-1"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--color-text)' }}
            >
              Reject {rejecting.companyName}?
            </h3>
            <p className="text-xs mb-4" style={{ color: 'var(--color-muted)' }}>
              If you give a reason it is emailed to them. Leave it empty and they are told nothing.
            </p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              placeholder="We could not verify this business — reply with your registration details and we will take another look."
              className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none resize-y mb-4"
              style={{
                background: 'var(--color-input-bg)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejecting(null)}
                className="text-xs px-3.5 py-2 rounded-xl font-semibold transition-all"
                style={quietButton}
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="text-xs px-4 py-2 rounded-xl font-bold transition-all"
                style={dangerButton}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {removing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setRemoving(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-5"
            style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)' }}
            onClick={e => e.stopPropagation()}
          >
            <h3
              className="text-lg font-black mb-1"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--color-text)' }}
            >
              Remove {removing.companyName}?
            </h3>

            {/* Say what actually happens. "Remove" that quietly leaves a
                working account is the kind of half-action someone only finds
                out about when the company signs in again. */}
            {removing.status === 'approved' ? (
              <>
                <p className="text-xs mb-3" style={{ color: 'var(--color-text-dim)' }}>
                  They come off this list, and <b>{removing.email} can no longer sign in</b>.
                </p>
                <p className="text-xs mb-4" style={{ color: 'var(--color-muted)' }}>
                  Their job posts and the people who applied to them are kept, so nothing is lost. If
                  you approve them again later, their sign-in comes back with a new password.
                </p>
              </>
            ) : (
              <p className="text-xs mb-4" style={{ color: 'var(--color-muted)' }}>
                This clears the row off the list. They never had an account, so there is nothing else
                to undo.
              </p>
            )}

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRemoving(null)}
                className="text-xs px-3.5 py-2 rounded-xl font-semibold transition-all"
                style={quietButton}
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                disabled={busyId === removing.id}
                className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-bold transition-all disabled:opacity-60"
                style={dangerButton}
              >
                {busyId === removing.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
