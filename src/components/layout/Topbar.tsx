import { Bell, Search, Command, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { demoCompanies } from '../../data/demo';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/industry': 'Dashboard',
  '/industry/jobs': 'Jobs & Internships',
  '/industry/create': 'Create Opportunity',
  '/industry/applications': 'Applications',
  '/industry/shortlisted': 'Shortlisted',
  '/industry/pipeline': 'Pipeline',
  '/industry/company': 'Company Profile',
  '/industry/settings': 'Settings',
};

export default function Topbar() {
  const user = useAuthStore(s => s.user);
  const company = demoCompanies.find(c => c.id === user?.companyId);
  const companyName = (user as any)?.companyName || company?.name || 'TechNova Inc.';
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || 'Industry Portal';
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="topbar sticky top-0 z-30 h-16 flex items-center px-4 lg:px-8">
      {/* Left: page title */}
      <div className="flex-1 flex items-center gap-4">
        <div className="hidden lg:block">
          <h1 className="text-base font-bold text-[var(--color-text)] tracking-tight">{pageTitle}</h1>
          <p className="text-[11px] text-[var(--color-muted)] -mt-0.5 font-semibold">{companyName}</p>
        </div>

        {/* Search */}
        <div
          className="topbar-search flex items-center gap-2 rounded-xl px-3 py-2 w-64 transition-all duration-200 cursor-pointer group"
        >
          <Search size={14} className="text-[var(--color-muted)] group-hover:text-[var(--color-text-dim)] transition-colors flex-shrink-0" />
          <span className="text-sm text-[var(--color-muted)] flex-1 group-hover:text-[var(--color-text-dim)] transition-colors">Search...</span>
          <div className="flex items-center gap-0.5 rounded-md px-1.5 py-0.5" style={{ background: 'var(--color-surface-2)' }}>
            <Command size={9} className="text-[var(--color-muted)]" />
            <span className="text-[10px] text-[var(--color-muted)] font-medium">K</span>
          </div>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn p-2.5 rounded-xl transition-all duration-200"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun size={17} className="text-amber-400" />
          ) : (
            <Moon size={17} className="text-indigo-500" />
          )}
        </button>

        {/* Notification */}
        <button className="topbar-icon-btn relative p-2.5 rounded-xl transition-all duration-200">
          <Bell size={17} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-hiero-green rounded-full animate-pulse" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 mx-1" style={{ background: 'var(--color-border)' }} />

        {/* User avatar */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-[var(--color-text)] leading-none">{user?.name?.split(' ')[0]}</p>
            <p className="text-[10px] text-[var(--color-muted)] mt-0.5">{user?.designation}</p>
          </div>
          <div
            className="user-avatar w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold text-hiero-green flex-shrink-0 transition-all duration-200"
          >
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
