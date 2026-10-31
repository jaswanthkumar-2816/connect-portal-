import { Bell, Search, Command, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useOrbitStore } from '../../store/orbitStore';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/industry': 'Inbox',
  '/industry/jobs': 'Jobs',
  '/industry/create': 'Post opportunity',
  '/industry/applications': 'Inbox',
  '/industry/shortlisted': 'Shortlisted',
  '/industry/pipeline': 'Pipeline',
  '/industry/company': 'Company Profile',
  '/industry/settings': 'Settings',
};

export default function Topbar() {
  const user = useAuthStore(s => s.user);
  const companyName = user?.companyName || 'Connect';
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || (location.pathname.startsWith('/industry/jobs/') ? 'Job' : 'Connect');
  const initials = (user?.companyName || user?.name || 'C').split(' ').map(n => n[0]).join('').slice(0, 2) || 'C';
  const { theme, toggleTheme } = useThemeStore();
  const { openCommandPalette } = useOrbitStore();

  return (
    <header className="topbar sticky top-0 z-30 h-16 flex items-center px-4 lg:px-8">
      <div className="flex-1 flex items-center gap-4">
        <div className="hidden lg:block">
          <h1 className="text-base font-bold text-[var(--color-text)] tracking-tight">{pageTitle}</h1>
          <p className="text-[11px] text-[var(--color-muted)] -mt-0.5 font-semibold">{companyName}</p>
        </div>

        <div
          onClick={openCommandPalette}
          className="topbar-search flex items-center gap-2 rounded-xl px-3 py-2 w-64 transition-all duration-200 cursor-pointer group hover:border-[#06c006]/50"
          title="Search or ask Orbit (Ctrl+K)"
        >
          <Search size={14} className="text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors flex-shrink-0" />
          <span className="text-sm text-[var(--color-muted)] flex-1 group-hover:text-[var(--color-text)] transition-colors truncate">
            Search or ask Orbit...
          </span>
          <div className="flex items-center gap-0.5 rounded-md px-1.5 py-0.5" style={{ background: 'var(--color-surface-2)' }}>
            <Command size={9} className="text-[var(--color-muted)]" />
            <span className="text-[10px] text-[var(--color-muted)] font-medium">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
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

        <button className="topbar-icon-btn relative p-2.5 rounded-xl transition-all duration-200">
          <Bell size={17} />
        </button>

        <div className="w-px h-6 mx-1" style={{ background: 'var(--color-border)' }} />

        <div className="flex items-center gap-2.5">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-[var(--color-text)] leading-none">{user?.name?.split(' ')[0] || 'HR'}</p>
            <p className="text-[10px] text-[var(--color-muted)] mt-0.5">{user?.email}</p>
          </div>
          <div className="user-avatar w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold text-hiero-green flex-shrink-0 transition-all duration-200">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
