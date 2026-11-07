import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// ============================================================
// HIERO admin — sign in with a PIN
// ============================================================
// No email, no password. There is one admin area and one person who opens
// it, so a username field only ever held the same value.
//
// The PIN is never checked here. It goes to the gateway, which holds it and
// counts wrong tries; a PIN compared in the browser would be a PIN published
// in the browser.

const LENGTH = 4;

export default function AdminLogin() {
  const adminPinLogin = useAuthStore(s => s.adminPinLogin);
  const isLoading = useAuthStore(s => s.isLoading);
  const error = useAuthStore(s => s.error);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const navigate = useNavigate();

  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''));
  const boxes = useRef<Array<HTMLInputElement | null>>([]);
  const submitted = useRef(false);

  useEffect(() => { boxes.current[0]?.focus(); }, []);

  // Already signed in as the admin: there is nothing to ask for.
  if (isAuthenticated && user?.accountRole === 'admin') {
    return <Navigate to="/admin/access" replace />;
  }

  const submit = async (pin: string) => {
    if (submitted.current) return;
    submitted.current = true;
    const ok = await adminPinLogin(pin);
    submitted.current = false;
    if (ok) {
      navigate('/admin/access', { replace: true });
    } else {
      // Clear the boxes rather than leaving a wrong PIN to be edited —
      // retyping it is quicker than finding which digit was wrong.
      setDigits(Array(LENGTH).fill(''));
      boxes.current[0]?.focus();
    }
  };

  const put = (index: number, value: string) => {
    const typed = value.replace(/\D/g, '');
    if (!typed) return;

    const next = [...digits];
    // A pasted PIN fills the row from wherever the cursor is.
    for (let i = 0; i < typed.length && index + i < LENGTH; i += 1) {
      next[index + i] = typed[i];
    }
    setDigits(next);

    const filled = Math.min(index + typed.length, LENGTH - 1);
    boxes.current[filled]?.focus();

    const pin = next.join('');
    if (pin.length === LENGTH && !next.includes('')) submit(pin);
  };

  const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (next[index]) {
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        next[index - 1] = '';
        setDigits(next);
        boxes.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      boxes.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < LENGTH - 1) {
      boxes.current[index + 1]?.focus();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5"
      style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <div className="w-full max-w-sm text-center">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'var(--color-accent-bg)', border: '1px solid var(--color-accent-border)' }}
        >
          <ShieldCheck size={22} style={{ color: 'var(--color-accent)' }} />
        </div>

        <h1 className="text-xl font-black mb-1.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          HIERO Admin
        </h1>
        <p className="text-sm mb-7" style={{ color: 'var(--color-muted)' }}>
          Enter your PIN to open the admin area.
        </p>

        <div className="flex items-center justify-center gap-3 mb-5">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={el => { boxes.current[i] = el; }}
              value={digit}
              onChange={e => put(i, e.target.value)}
              onKeyDown={e => onKeyDown(i, e)}
              onFocus={e => e.target.select()}
              disabled={isLoading}
              type="password"
              inputMode="numeric"
              autoComplete="one-time-code"
              aria-label={`PIN digit ${i + 1}`}
              maxLength={LENGTH}
              className="w-14 h-16 rounded-2xl text-center text-2xl font-black focus:outline-none transition-all disabled:opacity-50"
              style={{
                background: 'var(--color-card)',
                border: `1.5px solid ${digit ? 'var(--color-accent-border)' : 'var(--color-border)'}`,
                color: 'var(--color-text)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            />
          ))}
        </div>

        <div className="h-10 flex items-center justify-center">
          {isLoading ? (
            <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-muted)' }}>
              <Loader2 size={14} className="animate-spin" /> Checking…
            </span>
          ) : error ? (
            <p
              className="text-xs font-semibold rounded-xl px-3 py-2"
              style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.3)', color: '#ff6b6b' }}
            >
              {error}
            </p>
          ) : null}
        </div>

        <p className="text-[11px] mt-5" style={{ color: 'var(--color-muted)' }}>
          This area decides which companies get into Connect. Wrong PINs lock it
          for half an hour.
        </p>
      </div>
    </div>
  );
}
