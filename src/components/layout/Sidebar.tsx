import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Briefcase, Inbox, Star, PlusCircle, ChevronLeft, ChevronRight,
  Zap, LogOut, Mic, Users, Fingerprint, CalendarClock, TrendingUp,
  Receipt, BarChart3
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import Logo from '../ui/Logo';

// Connect covers two halves of the same job: filling a role, then running the
// people who fill it. The nav says so — hiring on top because that is what
// works today, workforce below it, and the modules that are not built carry a
// dot rather than pretending to be pages.
interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  /** Planned, with a page that says what it will do and what it waits on. */
  soon?: boolean;
}

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: 'Recruitment',
    items: [
      { to: '/industry/dashboard', icon: Home, label: 'Home' },
      { to: '/industry/create', icon: PlusCircle, label: 'Post' },
      { to: '/industry/applications', icon: Inbox, label: 'Inbox' },
      { to: '/industry/shortlisted', icon: Star, label: 'Shortlisted' },
      { to: '/industry/jobs', icon: Briefcase, label: 'Jobs' },
      { to: '/industry/interviews', icon: Mic, label: 'AI Interviews', soon: true },
    ],
  },
  {
    label: 'Workforce',
    items: [
      { to: '/industry/employees', icon: Users, label: 'Employees' },
      { to: '/industry/attendance', icon: Fingerprint, label: 'Attendance' },
      { to: '/industry/shifts', icon: CalendarClock, label: 'Shift & Leave', soon: true },
      { to: '/industry/performance', icon: TrendingUp, label: 'Performance', soon: true },
    ],
  },
  {
    label: 'Insights',
    items: [
      { to: '/industry/payroll', icon: Receipt, label: 'Payroll Reports', soon: true },
      { to: '/industry/analytics', icon: BarChart3, label: 'Analytics', soon: true },
    ],
  },
];

// The phone bar fits four. Home and the inbox are what a shop owner opens;
// the rest live in the sidebar on a wider screen.
const MOBILE_PATHS = ['/industry/dashboard', '/industry/applications', '/industry/create', '/industry/jobs'];
const mobileNavItems = MOBILE_PATHS
  .map(path => navSections.flatMap(s => s.items).find(i => i.to === path))
  .filter((i): i is NavItem => Boolean(i));

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <aside
        className={`sidebar-root fixed top-0 left-0 h-screen z-50 flex-col hidden lg:flex transition-all duration-300 ease-in-out ${collapsed ? 'w-[72px]' : 'w-[240px]'}`}
      >
        <div className={`flex items-center gap-3 px-4 h-16 flex-shrink-0 transition-all duration-300 ${collapsed ? 'justify-center px-0' : ''}`}
          style={{ borderBottom: '1px solid var(--color-border)' }}>
          {collapsed ? (
            <div className="w-8 h-8 rounded-xl bg-[#06c006]/15 border border-[#06c006]/25 flex items-center justify-center">
              <Zap size={14} className="text-[#06c006]" />
            </div>
          ) : (
            <Logo size="md" showGlow={false} />
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          {navSections.map(section => (
          <div key={section.label} className={`px-2 mb-1 ${collapsed ? 'px-2' : 'px-3'}`}>
            {!collapsed && (
              <p className="text-[9px] font-bold tracking-widest uppercase text-[var(--color-muted)] mb-2 mt-3 first:mt-0 px-1">{section.label}</p>
            )}
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                      isActive ? 'nav-item-active' : 'nav-item'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={17} className={`flex-shrink-0 transition-colors ${isActive ? 'text-[#06c006]' : ''}`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {!collapsed && item.soon && (
                        <span
                          title="Planned, not built yet"
                          className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: 'rgba(255,255,255,0.22)' }}
                        />
                      )}
                      {collapsed && (
                        <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[var(--color-bg-2)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text)] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-xl z-50 font-bold">
                          {item.label}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
          ))}
        </nav>

        <div className="flex-shrink-0 p-3 space-y-2" style={{ borderTop: '1px solid var(--color-border)' }}>
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-[var(--color-surface-2)] transition-colors group">
              <div className="w-8 h-8 rounded-xl bg-[#06c006]/15 border border-[#06c006]/30 flex items-center justify-center text-[#06c006] text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[var(--color-text)] truncate leading-none">{user?.companyName || user?.name || 'Company'}</p>
                <p className="text-[11px] text-[var(--color-muted)] truncate mt-0.5 font-medium">{user?.email || 'HR'}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1 rounded-lg text-[var(--color-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all duration-150"
              >
                <LogOut size={13} />
              </button>
            </div>
          )}

          {collapsed && (
            <button
              onClick={handleLogout}
              title="Sign out"
              className="w-full flex items-center justify-center py-2 rounded-xl text-[var(--color-muted)] hover:text-red-500 hover:bg-red-500/10"
            >
              <LogOut size={15} />
            </button>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-all duration-200 text-xs font-semibold"
          >
            {collapsed ? <ChevronRight size={15} /> : (
              <>
                <ChevronLeft size={15} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-2 px-2"
        style={{ background: 'var(--color-sidebar)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--color-border)' }}>
        {mobileNavItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-200 ${
                isActive ? 'text-[#06c006]' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={19} className={isActive ? 'text-[#06c006]' : ''} />
                <span>{item.label.split(' ')[0]}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
