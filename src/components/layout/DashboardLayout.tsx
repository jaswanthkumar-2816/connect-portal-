import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BackgroundAnimation from '../ui/BackgroundAnimation';
import OrbitWidget from '../orbit/OrbitWidget';
import OrbitCommandPalette from '../orbit/OrbitCommandPalette';
import { useOrbitStore } from '../../store/orbitStore';
import { useAuthStore } from '../../store/authStore';
import ChangePassword from '../auth/ChangePassword';

export default function DashboardLayout() {
  const location = useLocation();
  const mustChangePassword = useAuthStore(s => s.mustChangePassword);
  const { toggleOpen, openCommandPalette, isCommandPaletteOpen, closeCommandPalette } = useOrbitStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifier = e.ctrlKey || e.metaKey;
      if (isModifier && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        openCommandPalette();
      } else if (isModifier && (e.key === 'o' || e.key === 'O')) {
        e.preventDefault();
        toggleOpen();
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        e.preventDefault();
        closeCommandPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openCommandPalette, toggleOpen, isCommandPaletteOpen, closeCommandPalette]);

  // An emailed temporary password should not survive the first sign-in. The
  // server already said so; nothing had been asking.
  if (mustChangePassword) return <ChangePassword />;

  return (
    <div className="min-h-screen transition-colors duration-300 relative" style={{ background: 'var(--color-bg)' }}>
      <BackgroundAnimation />
      <Sidebar />
      <div className="lg:ml-[240px] min-h-screen flex flex-col transition-all duration-300 relative">
        <Topbar />
        <main className="flex-1 p-5 lg:p-8 pb-24 lg:pb-10">
          <div key={location.pathname} className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>

      <OrbitWidget />
      <OrbitCommandPalette />
    </div>
  );
}
