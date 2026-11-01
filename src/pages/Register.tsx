import { useState, useEffect } from 'react';
import { requestAccess } from '../services/accessService';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import Logo from '../components/ui/Logo';
import { ArrowRight, Check, Sun, Moon, Shield } from 'lucide-react';

export default function Register() {
  const [loaded, setLoaded] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');


  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!companyName.trim()) {
      setError('Company name is required.');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('A valid HR email is required.');
      return;
    }

    // This used to set a flag and tell people to send an email, so a company
    // asking to join depended on somebody noticing a message. The request is
    // recorded now and shows up in HIERO's queue.
    setSending(true);
    const res = await requestAccess(companyName.trim(), email.trim());
    setSending(false);
    if (!res.ok) {
      setError(res.error || 'Could not send your request. Try again shortly.');
      return;
    }
    setMessage(res.message || 'Thanks — your request is with the HIERO team.');
    setSubmitted(true);
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
        className={`hidden lg:flex flex-col justify-between w-[42%] p-12 relative overflow-hidden transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: isDark
            ? 'linear-gradient(160deg, rgba(6,192,6,0.08) 0%, rgba(0,40,20,0.2) 50%, rgba(9,9,16,1) 100%)'
            : 'linear-gradient(160deg, rgba(6,192,6,0.06) 0%, rgba(244,246,251,0.9) 50%, #ffffff 100%)',
          borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
        }}
      >
        <div className="relative z-10">
          <Link to="/"><Logo size="md" /></Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-black leading-tight" style={{ fontFamily: 'Outfit, sans-serif', color: isDark ? '#ffffff' : '#0f1117' }}>
              Register your <br />
              <span className="hiero-gradient-text">company account.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed max-w-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#475569' }}>
              Same two fields as sign-in. Your drives and inbox stay scoped to this company.
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            {['Company-scoped jobs and applies', 'Post a drive in one form', 'Shortlist writes back to the store'].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#06c006]/15 border border-[#06c006]/30 flex items-center justify-center flex-shrink-0 text-[#06c006]">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className="text-sm font-semibold" style={{ color: isDark ? 'rgba(255,255,255,0.75)' : '#334155' }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#06c006]/10 border border-[#06c006]/20 text-[11px] font-semibold text-[#06c006]">
            <Shield size={12} />
            Part of the HIERO ecosystem
          </div>
        </div>
      </div>

      <div className={`flex-1 flex items-center justify-center px-6 py-12 transition-all duration-700 delay-150 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/"><Logo size="lg" /></Link>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', color: isDark ? '#ffffff' : '#0f1117' }}>
              Request access
            </h1>
            <p className="mt-1.5 text-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#64748b' }}>
              Company name and HR email. SSO comes later.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : '#475569' }}>
                Company name
              </label>
              <input
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. LTM"
                className="hiero-input w-full px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  background: isDark ? '#0d0d18' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f1117',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1'}`,
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : '#475569' }}>
                HR email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="hr@company.com"
                className="hiero-input w-full px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  background: isDark ? '#0d0d18' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f1117',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1'}`,
                }}
              />
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            {submitted && !error && (
              <div
                className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(6,192,6,0.08)', border: '1px solid rgba(6,192,6,0.25)', color: '#06c006' }}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={sending || submitted}
              className="hiero-btn-primary w-full justify-center py-3.5 font-bold text-sm shadow-[0_0_20px_rgba(6,192,6,0.2)] flex items-center gap-2"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Request access <ArrowRight size={16} /></>
              )}
            </button>

            <p className="text-sm font-medium text-center" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#64748b' }}>
              Already registered?{' '}
              <Link to="/login" className="text-[#06c006] font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
