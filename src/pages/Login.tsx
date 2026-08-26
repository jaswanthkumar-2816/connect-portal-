import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import Logo from '../components/ui/Logo';
import { ArrowRight, Eye, EyeOff, Shield, Zap, Users, Target, Sun, Moon } from 'lucide-react';

const BRAND_FEATURES = [
  { icon: Target, text: 'Skill-based candidate matching' },
  { icon: Zap, text: '3x faster screening process' },
  { icon: Users, text: '10,000+ verified candidates' },
  { icon: Shield, text: 'Secure, trusted platform' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const { login, isLoading } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (success) navigate('/industry');
    else setError('Invalid credentials. Use any email/password for demo.');
  };

  return (
    <div
      className="min-h-screen flex relative transition-colors duration-300"
      style={{
        background: isDark ? '#090910' : '#f4f6fb',
        color: isDark ? '#ffffff' : '#0f1117',
      }}
    >
      {/* Top right theme toggle */}
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
          {isDark ? (
            <Sun size={18} className="text-amber-400" />
          ) : (
            <Moon size={18} className="text-slate-900" />
          )}
        </button>
      </div>

      {/* Left: Brand panel */}
      <div
        className={`hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: isDark
            ? 'linear-gradient(160deg, rgba(6,192,6,0.08) 0%, rgba(0,40,20,0.2) 50%, rgba(9,9,16,1) 100%)'
            : 'linear-gradient(160deg, rgba(6,192,6,0.06) 0%, rgba(244,246,251,0.9) 50%, #ffffff 100%)',
          borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
        }}
      >
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(6,192,6,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(6,192,6,0.35) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Glow orb */}
        <div
          className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full blur-[100px] animate-glow-pulse"
          style={{ background: 'rgba(6,192,6,0.1)' }}
        />

        {/* Top logo */}
        <div className="relative z-10">
          <Link to="/"><Logo size="md" /></Link>
        </div>

        {/* Middle content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-black leading-tight" style={{ fontFamily: 'Outfit, sans-serif', color: isDark ? '#ffffff' : '#0f1117' }}>
              Find the right talent,<br />
              <span className="hiero-gradient-text">faster than ever.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed max-w-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#475569' }}>
              HieroConnect uses skill intelligence to surface candidates who truly match your requirements.
            </p>
          </div>

          <div className="space-y-3">
            {BRAND_FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(6,192,6,0.1)',
                    border: '1px solid rgba(6,192,6,0.25)',
                  }}
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

        {/* Bottom stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[['500+', 'Companies'], ['10K+', 'Candidates'], ['94%', 'Match Rate']].map(([val, lbl]) => (
            <div
              key={lbl}
              className="text-center p-3 rounded-xl backdrop-blur-md"
              style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                boxShadow: isDark ? 'none' : '0 4px 15px rgba(0,0,0,0.04)',
              }}
            >
              <div className="text-xl font-black text-[#06c006]" style={{ fontFamily: 'Outfit, sans-serif' }}>{val}</div>
              <div className="text-[10px] font-medium mt-0.5" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : '#64748b' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Form */}
      <div className={`flex-1 flex items-center justify-center px-6 py-12 transition-all duration-700 delay-150 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/"><Logo size="lg" /></Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black" style={{ fontFamily: 'Outfit, sans-serif', color: isDark ? '#ffffff' : '#0f1117' }}>Welcome back</h1>
            <p className="mt-2 text-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#64748b' }}>Sign in to your recruiter account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#475569' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="hr@company.com"
                className="hiero-input"
                style={{
                  background: isDark ? '#0d0d18' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f1117',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1'}`,
                }}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#475569' }}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="hiero-input pr-11"
                  style={{
                    background: isDark ? '#0d0d18' : '#ffffff',
                    color: isDark ? '#ffffff' : '#0f1117',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1'}`,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: isDark ? 'rgba(255,255,255,0.4)' : '#64748b' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
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
              className="hiero-btn-primary w-full justify-center mt-2 py-3.5 font-bold shadow-[0_0_20px_rgba(6,192,6,0.2)]"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#64748b' }}>
              Don't have an account?{' '}
              <Link to="/register" className="text-[#06c006] font-bold hover:underline transition-colors">
                Register your company
              </Link>
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0' }} />
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : '#94a3b8' }}>demo</span>
              <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0' }} />
            </div>
            <p
              className="text-[11px] font-medium px-4 py-2.5 rounded-xl"
              style={{
                background: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
                color: isDark ? 'rgba(255,255,255,0.4)' : '#64748b',
              }}
            >
              Use any email + password to sign in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
