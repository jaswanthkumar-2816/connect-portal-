import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import Logo from '../components/ui/Logo';
import { ArrowRight, Shield, Inbox, Briefcase, Sun, Moon, Eye, EyeOff, Loader2 } from 'lucide-react';

const BRAND_FEATURES = [
  { icon: Briefcase, text: 'Post a drive to the shared store' },
  { icon: Inbox, text: 'See live applies with server match scores' },
  { icon: Shield, text: 'Shortlist or reject — status writes back' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const { login, isLoading } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      setStatusText('');
      return;
    }

    setProgress(15);
    setStatusText('Connecting to gateway...');

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 40) {
          setStatusText('Connecting to gateway...');
          return prev + 5;
        }
        if (prev < 68) {
          setStatusText('Verifying credentials...');
          return prev + 3;
        }
        if (prev < 88) {
          setStatusText('Securing session...');
          return prev + 1.8;
        }
        if (prev < 96) {
          setStatusText('Waking cloud server...');
          return prev + 0.6;
        }
        return prev;
      });
    }, 350);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Enter your work email and password.');
      return;
    }
    const success = await login(email.trim(), password);
    if (success) {
      setProgress(100);
      setStatusText('Verified!');
      setTimeout(() => {
        const isAdmin = useAuthStore.getState().user?.accountRole === 'admin';
        navigate(isAdmin ? '/admin/access' : '/industry/applications');
      }, 350);
    } else {
      setProgress(0);
      setStatusText('');
      // The store holds the server's own wording, which distinguishes bad
      // credentials from a disabled account or an unreachable gateway.
      setError(useAuthStore.getState().error || 'Could not sign in.');
    }
  };

  return (
    <div
      className="min-h-screen flex relative transition-colors duration-300"
      style={{
        background: isDark ? '#090910' : '#f4f6fb',
        color: isDark ? '#ffffff' : '#0f1117',
      }}
    >
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm"
          style={{
            background: isDark ? 'rgba(255,255,255,0.08)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1'}`,
          }}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
        >
          {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-900" />}
        </button>
      </div>

      <div
        className={`hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: isDark
            ? 'linear-gradient(160deg, rgba(6,192,6,0.08) 0%, rgba(0,40,20,0.2) 50%, rgba(9,9,16,1) 100%)'
            : 'linear-gradient(160deg, rgba(6,192,6,0.06) 0%, rgba(244,246,251,0.9) 50%, #ffffff 100%)',
          borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(6,192,6,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(6,192,6,0.35) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
        <div
          className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full blur-[100px] animate-glow-pulse"
          style={{ background: 'rgba(6,192,6,0.1)' }}
        />

        <div className="relative z-10">
          <Link to="/"><Logo size="md" /></Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-black leading-tight" style={{ fontFamily: 'Outfit, sans-serif', color: isDark ? '#ffffff' : '#0f1117' }}>
              Post a drive.<br />
              <span className="hiero-gradient-text">See real applies.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed max-w-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#475569' }}>
              Connect is the HR inbox for campus drives — publish once, shortlist from live applications.
            </p>
          </div>

          <div className="space-y-3">
            {BRAND_FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(6,192,6,0.1)', border: '1px solid rgba(6,192,6,0.25)' }}
                >
                  <f.icon size={14} className="text-[#06c006]" />
                </div>
                <span className="text-sm font-semibold" style={{ color: isDark ? 'rgba(255,255,255,0.65)' : '#334155' }}>
                  {f.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : '#64748b' }}>
            One company account. Jobs and applies stay scoped to you.
          </p>
        </div>
      </div>

      <div className={`flex-1 flex items-center justify-center px-6 py-12 transition-all duration-700 delay-150 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/"><Logo size="lg" /></Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black" style={{ fontFamily: 'Outfit, sans-serif', color: isDark ? '#ffffff' : '#0f1117' }}>HR sign in</h1>
            <p className="mt-2 text-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#64748b' }}>
              Accounts are created by HIERO. There is no public signup.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#475569' }}>Work email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="hr@company.com"
                autoComplete="username"
                className="hiero-input"
                style={{
                  background: isDark ? '#0d0d18' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f1117',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1'}`,
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#475569' }}>Password</label>
              {/* Readable on request. The password most people type here is
                  one they are copying out of an email, and hiding it is what
                  causes the failed sign-in rather than what prevents one. */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="hiero-input"
                  style={{
                    background: isDark ? '#0d0d18' : '#ffffff',
                    color: isDark ? '#ffffff' : '#0f1117',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1'}`,
                    paddingRight: '2.75rem',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide' : 'Show'}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                  style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#64748b' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="px-4 py-3 rounded-xl text-sm text-red-500 font-medium"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="hiero-btn-primary relative overflow-hidden w-full justify-center mt-2 py-3.5 font-bold shadow-[0_0_20px_rgba(6,192,6,0.2)] flex items-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-black/15 dark:bg-black/25 transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(100, Math.round(progress))}%` }}
                  />
                  <span className="relative z-10 flex items-center gap-2 text-sm font-black text-black">
                    <Loader2 size={16} className="animate-spin text-black" />
                    <span>{statusText || 'Signing in...'}</span>
                    <span className="font-mono text-xs bg-black/15 px-1.5 py-0.5 rounded">
                      {Math.min(100, Math.round(progress))}%
                    </span>
                  </span>
                </>
              ) : (
                <>Continue <ArrowRight size={16} /></>
              )}
            </button>

            {isLoading && progress > 30 && (
              <p
                className="text-[11px] text-center font-medium animate-fade-in mt-2"
                style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#64748b' }}
              >
                Connecting to HIERO secure gateway — server may be waking up.
              </p>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#64748b' }}>
              Need an account?{' '}
              <Link to="/register" className="text-[#06c006] font-bold hover:underline transition-colors">
                Request access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
