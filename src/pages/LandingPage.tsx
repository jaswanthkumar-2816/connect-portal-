import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ArrowRightCircle, Sun, Moon } from 'lucide-react';
import Logo from '../components/ui/Logo';
import { useThemeStore } from '../store/themeStore';

export default function LandingPage() {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div
      className="min-h-screen flex flex-col justify-between relative overflow-x-hidden transition-colors duration-300"
      style={{
        background: isDark ? '#090910' : '#f4f6fb',
        color: isDark ? '#ffffff' : '#000000',
      }}
    >

      {/* ── Background Watermark, Dots & Smoke Atmosphere (Fixed on Scroll) ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Background Dot Matrix Pattern */}
        <div className="bg-dots-pattern" />

        {/* Left-to-Right Smoke Layers */}
        <div className="smoke-layer-1" />
        <div className="smoke-layer-2" />

        {/* CONNECT Word Logo Background Watermark */}
        <img
          src="/connect_text.png"
          alt=""
          className="bg-connect-watermark"
        />
      </div>

      {/* ── NAVBAR ── */}
      <header
        className="sticky top-0 z-50 px-6 sm:px-12 h-20 flex items-center justify-between transition-all duration-300"
        style={{
          background: isDark ? 'rgba(9,9,16,0.85)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
          boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.03)',
        }}
      >
        <Logo size="md" />

        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
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

          <Link
            to="/login"
            className="text-sm font-bold transition-colors px-2"
            style={{ color: isDark ? '#ffffff' : '#000000' }}
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="hiero-btn-primary text-sm px-6 py-2.5 rounded-xl font-bold shadow-[0_0_20px_rgba(6,192,6,0.2)]"
          >
            Get Started <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      {/* ── SECTION 1: HERO ── */}
      <section className="relative z-10 pt-20 pb-24 px-6 text-center max-w-4xl mx-auto flex flex-col items-center">
        <h1
          className="text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight mb-6"
          style={{ fontFamily: 'Outfit, sans-serif', color: isDark ? '#ffffff' : '#000000' }}
        >
          Connect Industry with{' '}
          <span className="hiero-gradient-text font-normal">Verified Talent</span>
        </h1>

        <p
          className="text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          style={{ color: isDark ? 'rgba(255,255,255,0.55)' : '#334155' }}
        >
          Discover candidates based on skills, competency and job alignment — not just resumes.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/register"
            className="hiero-btn-primary text-base px-8 py-4 rounded-xl group font-bold shadow-[0_0_30px_rgba(6,192,6,0.3)]"
          >
            Get Started
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/login"
            className="text-base px-8 py-4 rounded-xl font-bold transition-all shadow-sm"
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1'}`,
              color: isDark ? '#ffffff' : '#000000',
            }}
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* ── SECTION 2: HOW IT WORKS (3 STEPS) ── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-[#06c006]">Workflow</span>
          <h2
            className="text-2xl sm:text-3xl font-normal mt-2 mb-12"
            style={{ fontFamily: 'Outfit, sans-serif', color: isDark ? '#ffffff' : '#000000' }}
          >
            Three simple steps to verified recruitment
          </h2>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* Step 1 */}
            <div
              className="p-6 rounded-2xl text-center flex flex-col items-center backdrop-blur-md transition-all"
              style={{
                background: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
                boxShadow: isDark ? 'none' : '0 10px 25px rgba(0,0,0,0.05)',
              }}
            >
              <div className="text-xs font-extrabold text-[#06c006] uppercase tracking-wider mb-2">STEP 01</div>
              <h3 className="text-base font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: isDark ? '#ffffff' : '#000000' }}>POST JOB</h3>
              <p className="text-xs leading-relaxed font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#475569' }}>
                Define the role and required competency skills.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="p-6 rounded-2xl text-center flex flex-col items-center shadow-[0_0_20px_rgba(6,192,6,0.1)] backdrop-blur-md transition-all"
              style={{
                background: isDark ? 'rgba(6,192,6,0.1)' : 'rgba(6,192,6,0.08)',
                border: `1px solid ${isDark ? 'rgba(6,192,6,0.25)' : 'rgba(6,192,6,0.35)'}`,
              }}
            >
              <div className="text-xs font-extrabold text-[#06c006] uppercase tracking-wider mb-2">STEP 02</div>
              <h3 className="text-base font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: isDark ? '#ffffff' : '#000000' }}>FIND MATCHED TALENT</h3>
              <p className="text-xs leading-relaxed font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : '#334155' }}>
                HIERO Skill Intelligence surfaces verified competency matches.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="p-6 rounded-2xl text-center flex flex-col items-center backdrop-blur-md transition-all"
              style={{
                background: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
                boxShadow: isDark ? 'none' : '0 10px 25px rgba(0,0,0,0.05)',
              }}
            >
              <div className="text-xs font-extrabold text-[#06c006] uppercase tracking-wider mb-2">STEP 03</div>
              <h3 className="text-base font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: isDark ? '#ffffff' : '#000000' }}>SHORTLIST</h3>
              <p className="text-xs leading-relaxed font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#475569' }}>
                Review candidate skill gaps and manage hiring pipeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: ONE POWERFUL CANDIDATE-MATCH PREVIEW ── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-[#06c006]">Competency Matching</span>
          <h2
            className="text-2xl sm:text-3xl font-normal mt-2 mb-10"
            style={{ fontFamily: 'Outfit, sans-serif', color: isDark ? '#ffffff' : '#000000' }}
          >
            Find the right candidate beyond the resume
          </h2>

          {/* Candidate Match Preview Card */}
          <div
            className="rounded-3xl p-8 text-left relative overflow-hidden transition-all"
            style={{
              background: isDark ? 'rgba(12,12,20,0.92)' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(6,192,6,0.3)' : 'rgba(6,192,6,0.35)'}`,
              boxShadow: isDark ? '0 0 40px rgba(6,192,6,0.12)' : '0 20px 40px rgba(0,0,0,0.08)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
              <div>
                <h3 className="text-lg font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: isDark ? '#ffffff' : '#000000' }}>Candidate Competency Match</h3>
                <p className="text-xs font-medium mt-0.5" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#64748b' }}>Software Developer Requirement</p>
              </div>
              <div className="flex items-center gap-2 bg-[#06c006]/15 border border-[#06c006]/30 px-4 py-2 rounded-2xl">
                <Sparkles size={16} className="text-[#06c006]" />
                <span className="text-base font-black text-[#06c006]" style={{ fontFamily: 'Outfit, sans-serif' }}>94% MATCH</span>
              </div>
            </div>

            {/* Verified Skills Pill Bar */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {['Python ✓', 'SQL ✓', 'React ✓', 'Git ✓'].map(skill => (
                <span key={skill} className="text-xs font-semibold text-[#06c006] bg-[#06c006]/10 border border-[#06c006]/25 px-3 py-1.5 rounded-lg">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#64748b' }}>Verified by HIERO Skill Intelligence</span>
              <Link to="/register" className="text-xs font-bold text-[#06c006] hover:underline flex items-center gap-1">
                Why this candidate matches <ArrowRightCircle size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: RECRUITER CTA ── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl sm:text-4xl font-normal mb-4"
            style={{ fontFamily: 'Outfit, sans-serif', color: isDark ? '#ffffff' : '#000000' }}
          >
            Build better teams with skill intelligence.
          </h2>
          <p
            className="text-sm mb-8 font-medium"
            style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#475569' }}
          >
            Start discovering verified talent matched directly to your role requirements.
          </p>

          <Link
            to="/register"
            className="hiero-btn-primary text-base px-10 py-4 rounded-xl font-bold shadow-[0_0_30px_rgba(6,192,6,0.3)] group inline-flex items-center gap-2"
          >
            Get Started
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="relative z-10 pt-16 pb-10 px-6 sm:px-12 transition-colors duration-300"
        style={{
          background: isDark ? 'rgba(9,9,16,0.85)' : '#ffffff',
          backdropFilter: 'blur(24px)',
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Top Footer Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}>
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-4">
              <Logo size="md" showGlow={true} />
              <p className="text-xs leading-relaxed max-w-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#475569' }}>
                HIERO Connect is the industry portal powering skill-driven candidate discovery and verified competency matching.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#06c006]/10 border border-[#06c006]/20 text-[11px] font-semibold text-[#06c006]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06c006] animate-pulse" />
                HIERO Network Operational
              </div>
            </div>

            {/* Column 1: Product */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: isDark ? '#ffffff' : '#000000' }}>Product</h4>
              <ul className="space-y-2 text-xs font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#475569' }}>
                <li><a href="#" className="hover:text-[#06c006] transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-[#06c006] transition-colors">Skill Matching</a></li>
                <li><Link to="/login" className="hover:text-[#06c006] transition-colors">Recruiter Portal</Link></li>
                <li><Link to="/register" className="hover:text-[#06c006] transition-colors">Post Opening</Link></li>
              </ul>
            </div>

            {/* Column 2: Ecosystem */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: isDark ? '#ffffff' : '#000000' }}>Ecosystem</h4>
              <ul className="space-y-2 text-xs font-medium">
                <li style={{ color: isDark ? 'rgba(255,255,255,0.8)' : '#1e293b' }}>HIERO Core</li>
                <li className="text-[#06c006] font-semibold">HIERO Connect (Industry)</li>
                <li className="text-purple-600 dark:text-purple-400">HIERO Bridge (Academia)</li>
                <li className="text-blue-600 dark:text-blue-400">Student Portal</li>
              </ul>
            </div>

            {/* Column 3: Account & Support */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: isDark ? '#ffffff' : '#000000' }}>Account</h4>
              <ul className="space-y-2 text-xs font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#475569' }}>
                <li><Link to="/login" className="hover:text-[#06c006] transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-[#06c006] transition-colors">Register Company</Link></li>
                <li><a href="mailto:support@hiero.id" className="hover:text-[#06c006] transition-colors">Help & Support</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer Row */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : '#64748b' }}>
            <p>© 2026 HIERO Industry Portal. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-[#06c006] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#06c006] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#06c006] transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
