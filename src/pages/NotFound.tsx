import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-hiero-dark flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-hiero-green/[0.03] rounded-full blur-[120px]" />
      </div>
      <div className="text-center relative animate-fade-in">
        <div className="mb-8 opacity-40">
          <Logo size="xl" showGlow={false} />
        </div>
        <h1 className="text-8xl font-black text-hiero-green/20 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
        <p className="text-hiero-muted mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
