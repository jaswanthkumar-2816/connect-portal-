import { useState } from 'react';
import { KeyRound, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// ============================================================
// First sign-in
// ============================================================
// An account created by HIERO — from an approved access request, or by the
// invite script — starts with a temporary password that was emailed in plain
// text. The server marks it mustChangePassword, but nothing ever asked, so
// companies kept the emailed password indefinitely.
//
// This stands in front of the portal until it is changed. It is not a
// dismissible prompt: a password sitting in an inbox is the weakest part of
// the whole sign-in, and the window where it matters is right now.

export default function ChangePassword() {
  const changePassword = useAuthStore(s => s.changePassword);
  const storeError = useAuthStore(s => s.error);
  const isLoading = useAuthStore(s => s.isLoading);
  const user = useAuthStore(s => s.user);

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (next.length < 10) {
      setError('Use at least 10 characters.');
      return;
    }
    if (next === current) {
      setError('That is the password you were sent. Choose a different one.');
      return;
    }
    if (next !== confirm) {
      setError('The two new passwords do not match.');
      return;
    }
    const ok = await changePassword(current, next);
    if (!ok) setError(useAuthStore.getState().error || 'Could not change the password.');
  };

  const field: React.CSSProperties = {
    background: 'var(--color-input-bg)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text)',
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5"
      style={{ background: 'var(--color-bg)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-7"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'var(--color-accent-bg)', border: '1px solid var(--color-accent-border)' }}
        >
          <KeyRound size={19} style={{ color: 'var(--color-accent)' }} />
        </div>

        <h1
          className="text-xl font-black mb-1.5"
          style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--color-text)' }}
        >
          Choose your own password
        </h1>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          {user?.companyName ? `${user.companyName} was ` : 'You were '}
          set up by HIERO with a temporary password. It was sent by email, so it should not stay in
          use.
        </p>

        <form onSubmit={submit} className="space-y-3.5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-muted)' }}>
              Password you were sent
            </label>
            <input
              type="password"
              value={current}
              onChange={e => setCurrent(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
              style={field}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-muted)' }}>
              New password
            </label>
            <input
              type="password"
              value={next}
              onChange={e => setNext(e.target.value)}
              autoComplete="new-password"
              placeholder="At least 10 characters"
              className="w-full rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
              style={field}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-muted)' }}>
              New password again
            </label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
              style={field}
            />
          </div>

          {(error || storeError) && (
            <p className="text-xs font-semibold" style={{ color: '#ff6b6b' }}>
              {error || storeError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all disabled:opacity-60"
            style={{ background: 'var(--color-accent)', color: '#04140a' }}
          >
            {isLoading && <Loader2 size={15} className="animate-spin" />}
            {isLoading ? 'Saving…' : 'Save and continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
