import { useCallback, useEffect, useState } from 'react';
import { ShieldCheck, Check, X, Mail, Building2, Clock, Loader2, Copy } from 'lucide-react';
import {
  getAccessRequests,
  approveAccessRequest,
  rejectAccessRequest,
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

const TABS: { value: 'pending' | 'approved' | 'rejected'; label: string }[] = [
  { value: 'pending', label: 'Waiting' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  pending: { bg: 'rgba(251,191,36,0.12)', fg: '#fbbf24' },
  approved: { bg: 'rgba(0,255,102,0.12)', fg: '#00FF66' },
  rejected: { bg: 'rgba(255,107,107,0.1)', fg: '#ff8f8f' },
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
        <ShieldCheck size={34} className="text-white/15 mb-3" />
        <p className="text-sm font-semibold text-white/50">This area is for HIERO administrators</p>
        <p className="text-xs text-white/30 mt-1.5 max-w-sm">
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

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between animate-slide-up">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Access requests
          </h1>
          <p className="text-sm text-white/35 mt-1">
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
            style={
              tab === t.value
                ? { background: 'rgba(0,255,102,0.12)', color: '#00FF66', border: '1px solid rgba(0,255,102,0.3)' }
                : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {t.label}
            {t.value === 'pending' && pending > 0 ? ` · ${pending}` : ''}
          </button>
        ))}
      </div>

      {error && (
        <div
          className="text-xs font-semibold rounded-xl px-3 py-2"
          style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.3)', color: '#ff6b6b' }}
        >
          {error}
        </div>
      )}

      {fallbackPassword && (
        <div
          className="rounded-2xl p-4"
          style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.3)' }}
        >
          <p className="text-xs font-bold text-[#fbbf24] mb-1.5">
            The account was created, but the email did not send
          </p>
          <p className="text-xs text-white/60 mb-2.5">
            Pass these on yourself. They will not be shown again, and the password must be changed on
            first sign-in.
          </p>
          <div
            className="flex items-center justify-between gap-3 rounded-xl px-3 py-2"
            style={{ background: 'rgba(0,0,0,0.3)' }}
          >
            <code className="text-xs text-white/85 truncate">
              {fallbackPassword.email} · {fallbackPassword.password}
            </code>
            <button
              onClick={() => navigator.clipboard?.writeText(fallbackPassword.password)}
              className="flex items-center gap-1 text-[11px] font-bold text-white/60 hover:text-white transition-colors flex-shrink-0"
            >
              <Copy size={11} /> Copy
            </button>
          </div>
          <button
            onClick={() => setFallbackPassword(null)}
            className="text-[11px] font-bold text-white/40 hover:text-white/70 transition-colors mt-2.5"
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
          style={{ background: 'rgba(14,14,24,0.5)', border: '1px dashed rgba(255,255,255,0.08)' }}
        >
          <Building2 size={34} className="text-white/15 mb-3" />
          <p className="text-sm font-medium text-white/30">Nothing {tab === 'pending' ? 'waiting' : tab}</p>
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
                  background: 'rgba(14,14,24,0.7)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  animationDelay: `${i * 45}ms`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                  >
                    {row.companyName.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-0.5">
                      <p className="font-bold text-white/90 text-sm">{row.companyName}</p>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-lg capitalize"
                        style={{ background: style.bg, color: style.fg }}
                      >
                        {row.status}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 flex items-center gap-1.5">
                      <Mail size={11} /> {row.email}
                    </p>
                    <p className="text-xs text-white/30 mt-0.5 flex items-center gap-1.5">
                      <Clock size={11} /> asked {formatDate(row.createdAt)}
                      {row.decidedBy ? ` · decided by ${row.decidedBy}` : ''}
                    </p>
                    {row.note && <p className="text-xs text-white/40 mt-1.5 italic">“{row.note}”</p>}
                  </div>

                  {row.status === 'pending' && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setRejecting(row)}
                        disabled={busyId === row.id}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
                        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <X size={12} className="inline -mt-0.5 mr-1" />
                        Reject
                      </button>
                      <button
                        onClick={() => approve(row)}
                        disabled={busyId === row.id}
                        className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all disabled:opacity-60"
                        style={{ background: 'rgba(0,255,102,0.12)', color: '#00FF66', border: '1px solid rgba(0,255,102,0.3)' }}
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
            style={{ background: '#0e0e18', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-black text-white mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Reject {rejecting.companyName}?
            </h3>
            <p className="text-xs text-white/40 mb-4">
              If you give a reason it is emailed to them. Leave it empty and they are told nothing.
            </p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              placeholder="We could not verify this business — reply with your registration details and we will take another look."
              className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none resize-y mb-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)' }}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejecting(null)}
                className="text-xs px-3.5 py-2 rounded-xl font-semibold transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="text-xs px-4 py-2 rounded-xl font-bold transition-all"
                style={{ background: 'rgba(255,107,107,0.12)', color: '#ff8f8f', border: '1px solid rgba(255,107,107,0.3)' }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
