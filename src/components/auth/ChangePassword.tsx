import { useState } from 'react';
import { KeyRound, Loader2, Eye, EyeOff } from 'lucide-react';
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

// A password box you can read back. Someone copying a password out of an
// email gets it wrong often enough that hiding it is the thing that causes
// the failed sign-in, not the thing that prevents one.
function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder?: string;
}) {
  const [shown, setShown] = useState(false);
  return (
    <div>
      <label
        className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
        style={{ color: 'var(--color-muted)' }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={shown ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full rounded-xl pl-3.5 pr-11 py-2.5 text-sm focus:outline-none"
          style={{
            background: 'var(--color-input-bg)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
        />
        <button
          type="button"
          onClick={() => setShown(v => !v)}
          aria-label={shown ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          title={shown ? 'Hide' : 'Show'}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: 'var(--color-muted)' }}
        >
          {shown ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

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
          <PasswordField
            label="Password you were sent"
            value={current}
            onChange={setCurrent}
            autoComplete="current-password"
          />

          <PasswordField
            label="New password"
            value={next}
            onChange={setNext}
            autoComplete="new-password"
            placeholder="At least 10 characters"
          />

          <PasswordField
            label="New password again"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
          />

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
