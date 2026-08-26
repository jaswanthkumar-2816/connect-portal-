import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, Users, FileText, Star,
  GitBranch, Settings, Building2, PlusCircle, ChevronLeft, ChevronRight,
  Zap, LogOut
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import Logo from '../ui/Logo';

const navItems = [
  { to: '/industry', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/industry/jobs', icon: Briefcase, label: 'Jobs & Internships' },
  { to: '/industry/create', icon: PlusCircle, label: 'Create Opportunity' },
  { to: '/industry/applications', icon: FileText, label: 'Applications' },
  { to: '/industry/shortlisted', icon: Star, label: 'Shortlisted' },
  { to: '/industry/pipeline', icon: GitBranch, label: 'Pipeline' },
  { to: '/industry/company', icon: Building2, label: 'Company Profile' },
  { to: '/industry/settings', icon: Settings, label: 'Settings' },
];

const SECTION_1 = navItems.slice(0, 6);
const SECTION_2 = navItems.slice(6);

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
      {/* Desktop Sidebar */}
      <aside
        className={`sidebar-root fixed top-0 left-0 h-screen z-50 flex-col hidden lg:flex transition-all duration-300 ease-in-out ${collapsed ? 'w-[72px]' : 'w-[240px]'}`}
      >
        {/* Logo */}
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

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          {/* Main nav */}
          <div className={`px-2 mb-1 ${collapsed ? 'px-2' : 'px-3'}`}>
            {!collapsed && (
              <p className="text-[9px] font-bold tracking-widest uppercase text-[var(--color-muted)] mb-2 px-1">Main</p>
            )}
            <div className="space-y-0.5">
              {SECTION_1.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
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

          {/* Company nav */}
          <div className={`px-2 mt-4 ${collapsed ? 'px-2' : 'px-3'}`}>
            {!collapsed && (
              <p className="text-[9px] font-bold tracking-widest uppercase text-[var(--color-muted)] mb-2 px-1">Company</p>
            )}
            <div className="space-y-0.5">
              {SECTION_2.map(item => (
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
        </nav>

        {/* Bottom: User + Collapse */}
        <div className="flex-shrink-0 p-3 space-y-2" style={{ borderTop: '1px solid var(--color-border)' }}>
          {/* User row */}
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-xl bg-[#06c006]/15 border border-[#06c006]/30 flex items-center justify-center text-[#06c006] text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[var(--color-text)] truncate leading-none">{user?.name || 'User'}</p>
                <p className="text-[11px] text-[var(--color-muted)] truncate mt-0.5 font-medium">{user?.designation || 'Recruiter'}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1 rounded-lg text-[var(--color-muted)] hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-150"
              >
                <LogOut size={13} />
              </button>
            </div>
          )}

          {/* Collapse button */}
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

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-2 px-2"
        style={{ background: 'var(--color-sidebar)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--color-border)' }}>
        {navItems.slice(0, 5).map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
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
