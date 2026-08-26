import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BackgroundAnimation from '../ui/BackgroundAnimation';

export default function DashboardLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen transition-colors duration-300 relative" style={{ background: 'var(--color-bg)' }}>
      {/* Animated Background */}
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
    </div>
  );
}
