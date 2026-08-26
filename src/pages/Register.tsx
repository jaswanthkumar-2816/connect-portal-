import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import Logo from '../components/ui/Logo';
import { ArrowRight, Eye, EyeOff, Check, Building2, User, Sun, Moon, Shield } from 'lucide-react';

const INDUSTRIES = [
  { value: '', label: 'Select industry' },
  { value: 'IT', label: 'Information Technology' },
  { value: 'Finance', label: 'Finance & Banking' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'E-commerce', label: 'E-commerce & Retail' },
  { value: 'AI/ML', label: 'AI & Machine Learning' },
  { value: 'Cloud', label: 'Cloud Computing' },
  { value: 'Other', label: 'Other' },
];

const SIZES = [
  { value: '', label: 'Select company size' },
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
];

function Field({
  label,
  isDark,
  error,
  ...props
}: {
  label: string;
  isDark: boolean;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-wider" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : '#475569' }}>
        {label}
      </label>
      <input
        {...props}
        className="hiero-input w-full px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium"
        style={{
          background: isDark ? '#0d0d18' : '#ffffff',
          color: isDark ? '#ffffff' : '#0f1117',
          border: `1px solid ${error ? '#ef4444' : isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1'}`,
        }}
      />
      {error && <p className="text-xs text-red-500 font-medium mt-1">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  isDark,
  error,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  isDark: boolean;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-wider" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : '#475569' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="hiero-input w-full px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium"
        style={{
          background: isDark ? '#0d0d18' : '#ffffff',
          color: isDark ? '#ffffff' : '#0f1117',
          border: `1px solid ${error ? '#ef4444' : isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1'}`,
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: isDark ? '#0d0d18' : '#ffffff', color: isDark ? '#ffffff' : '#0f1117' }}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 font-medium mt-1">{error}</p>}
    </div>
  );
}

const STEPS = [
  { id: 1, label: 'Account', icon: User },
  { id: 2, label: 'Company', icon: Building2 },
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    industry: '',
    size: '',
    website: '',
    location: '',
    recruiterName: '',
    designation: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const update = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.email) errs.email = 'Work email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Please enter a valid work email';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.companyName) errs.companyName = 'Company name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStep1 = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    const success = await register(formData);
    if (success) navigate('/industry');
  };

  return (
    <div
      className="min-h-screen flex relative transition-colors duration-300"
      style={{
        background: isDark ? '#090910' : '#f4f6fb',
        color: isDark ? '#ffffff' : '#0f1117',
      }}
    >
      {/* Top Right Theme Toggle */}
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

      {/* ── LEFT BRAND PANEL ── */}
      <div
        className={`hidden lg:flex flex-col justify-between w-[42%] p-12 relative overflow-hidden transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: isDark
            ? 'linear-gradient(160deg, rgba(6,192,6,0.08) 0%, rgba(0,40,20,0.2) 50%, rgba(9,9,16,1) 100%)'
            : 'linear-gradient(160deg, rgba(6,192,6,0.06) 0%, rgba(244,246,251,0.9) 50%, #ffffff 100%)',
          borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
        }}
      >
        {/* Subtle Ambient Grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(6,192,6,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(6,192,6,0.35) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Glow Orb */}
        <div
          className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full blur-[90px] animate-glow-pulse pointer-events-none"
          style={{ background: 'rgba(6,192,6,0.08)' }}
        />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link to="/"><Logo size="md" /></Link>
        </div>

        {/* Middle Brand Content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-black leading-tight" style={{ fontFamily: 'Outfit, sans-serif', color: isDark ? '#ffffff' : '#0f1117' }}>
              Build your team with <br />
              <span className="hiero-gradient-text">verified talent.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed max-w-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#475569' }}>
              Create your company profile and discover candidates matched to your requirements.
            </p>
          </div>

          {/* 3 Concise Benefits */}
          <div className="space-y-3.5 pt-2">
            {[
              'Skill-based candidate matching',
              'Structured job requirements',
              'Simple recruitment workflow',
            ].map((text, i) => (
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

        {/* Bottom Ecosystem Badge */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#06c006]/10 border border-[#06c006]/20 text-[11px] font-semibold text-[#06c006]">
            <Shield size={12} />
            Part of the HIERO ecosystem
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className={`flex-1 flex items-center justify-center px-6 py-12 transition-all duration-700 delay-150 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/"><Logo size="lg" /></Link>
          </div>

          {/* Step Indicator Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-bold tracking-wider uppercase mb-3" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : '#64748b' }}>
              <span>STEP {step} OF 2</span>
              <span className="text-[#06c006]">{step === 1 ? 'ACCOUNT SETUP' : 'COMPANY PROFILE'}</span>
            </div>

            <div className="flex items-center gap-3">
              {STEPS.map((s, i) => {
                const done = step > s.id;
                const active = step === s.id;
                return (
                  <div key={s.id} className="flex-1 flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 flex-shrink-0"
                      style={{
                        background: done ? '#06c006' : active ? 'rgba(6,192,6,0.15)' : isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                        border: `1px solid ${done ? '#06c006' : active ? 'rgba(6,192,6,0.4)' : isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1'}`,
                        color: done ? '#ffffff' : active ? '#06c006' : isDark ? 'rgba(255,255,255,0.4)' : '#64748b',
                        fontFamily: 'Outfit, sans-serif',
                      }}
                    >
                      {done ? <Check size={14} strokeWidth={3} /> : s.id}
                    </div>
                    <span className={`text-xs font-bold transition-colors ${active ? (isDark ? 'text-white' : 'text-slate-900') : done ? 'text-[#06c006]' : isDark ? 'text-white/30' : 'text-slate-400'}`}>
                      {s.label}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div
                        className="flex-1 h-0.5 mx-2 rounded-full transition-all duration-500"
                        style={{ background: step > 1 ? '#06c006' : isDark ? 'rgba(255,255,255,0.08)' : '#cbd5e1' }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Heading & Subtitle */}
          <div className="mb-6">
            <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', color: isDark ? '#ffffff' : '#0f1117' }}>
              {step === 1 ? 'Create your account' : 'Company profile'}
            </h1>
            <p className="mt-1.5 text-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#64748b' }}>
              {step === 1 ? 'Set up your recruiter account to continue.' : 'Tell us about your organization.'}
            </p>
          </div>

          {/* ── STEP 1: ACCOUNT SETUP ONLY ── */}
          {step === 1 ? (
            <div className="space-y-4 animate-fade-in">
              <Field
                label="Work Email"
                isDark={isDark}
                type="email"
                value={formData.email}
                onChange={e => update('email', e.target.value)}
                placeholder="name@company.com"
                error={errors.email}
              />

              <div className="relative">
                <Field
                  label="Password"
                  isDark={isDark}
                  type={showPass ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder="Minimum 6 characters"
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-9 transition-colors"
                  style={{ color: isDark ? 'rgba(255,255,255,0.4)' : '#64748b' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <Field
                label="Confirm Password"
                isDark={isDark}
                type="password"
                value={formData.confirmPassword}
                onChange={e => update('confirmPassword', e.target.value)}
                placeholder="Re-enter password"
                error={errors.confirmPassword}
              />

              <button
                onClick={handleStep1}
                className="hiero-btn-primary w-full justify-center py-3.5 mt-2 font-bold text-sm shadow-[0_0_20px_rgba(6,192,6,0.2)] transition-all cursor-pointer flex items-center gap-2"
              >
                Continue <ArrowRight size={16} />
              </button>

              <div className="pt-4 text-center">
                <p className="text-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#64748b' }}>
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#06c006] font-bold hover:underline transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            /* ── STEP 2: COMPANY PROFILE ── */
            <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
              <Field
                label="Company Name"
                isDark={isDark}
                value={formData.companyName}
                onChange={e => update('companyName', e.target.value)}
                placeholder="e.g. Acme Corp"
                error={errors.companyName}
              />

              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Industry"
                  isDark={isDark}
                  value={formData.industry}
                  onChange={e => update('industry', e.target.value)}
                  options={INDUSTRIES}
                />
                <SelectField
                  label="Company Size"
                  isDark={isDark}
                  value={formData.size}
                  onChange={e => update('size', e.target.value)}
                  options={SIZES}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Company Website"
                  isDark={isDark}
                  value={formData.website}
                  onChange={e => update('website', e.target.value)}
                  placeholder="https://company.com"
                />
                <Field
                  label="Location"
                  isDark={isDark}
                  value={formData.location}
                  onChange={e => update('location', e.target.value)}
                  placeholder="e.g. Bengaluru, India"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 rounded-xl font-bold transition-all text-sm cursor-pointer"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.06)' : '#ffffff',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1'}`,
                    color: isDark ? '#ffffff' : '#0f1117',
                  }}
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="hiero-btn-primary flex-1 justify-center py-3.5 font-bold text-sm shadow-[0_0_20px_rgba(6,192,6,0.2)] transition-all cursor-pointer flex items-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Create Company Profile <ArrowRight size={16} /></>
                  )}
                </button>
              </div>

              <div className="pt-2 text-center">
                <p className="text-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#64748b' }}>
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#06c006] font-bold hover:underline transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
