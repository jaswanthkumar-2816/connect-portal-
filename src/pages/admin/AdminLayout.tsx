import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, Building2, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import ChangePassword from '../../components/auth/ChangePassword';

// ============================================================
// HIERO admin
// ============================================================
// Deliberately not the company portal. An admin here decides which companies
// get into Connect; they do not hire anyone, so an inbox, a job list and a
// workforce nav are noise at best and confusing at worst — the HIERO account
// has a companyId like any other, and those pages would show it as if HIERO
// were recruiting.
//
// Its own shell, its own address, nothing borrowed from the recruiter side.

const NAV = [{ to: '/admin/access', icon: Building2, label: 'Access requests' }];

export default function AdminLayout() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const mustChangePassword = useAuthStore(s => s.mustChangePassword);
  const navigate = useNavigate();

  if (mustChangePassword) return <ChangePassword />;

  const signOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 lg:px-8 h-16"
        style={{ background: 'var(--color-topbar)', borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--color-accent-bg)', border: '1px solid var(--color-accent-border)' }}
          >
            <ShieldCheck size={15} style={{ color: 'var(--color-accent)' }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              HIERO Admin
            </p>
            <p className="text-[11px] truncate" style={{ color: 'var(--color-muted)' }}>
              {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* An admin who also recruits for a company can still get there,
              but it is a deliberate step rather than a shared sidebar. */}
          <a
            href="/industry/applications"
            className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all"
            style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}
          >
            Company portal <ArrowUpRight size={12} />
          </a>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all"
            style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </header>

      <div className="flex">
        <nav
          className="hidden lg:block w-[210px] flex-shrink-0 p-3 min-h-[calc(100vh-4rem)]"
          style={{ borderRight: '1px solid var(--color-border)' }}
        >
          <p
            className="text-[9px] font-bold tracking-widest uppercase mb-2 px-1"
            style={{ color: 'var(--color-muted)' }}
          >
            HIERO
          </p>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? 'nav-item-active' : 'nav-item'
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
