import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-hiero-dark/70 backdrop-blur-xl border-b border-hiero-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm text-hiero-muted hover:text-white transition-colors font-medium">Sign In</Link>
          <Link to="/register" className="hiero-btn-primary text-sm !px-5 !py-2">Get Started</Link>
        </div>
      </div>
    </nav>
  );
}
