import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Splash
import SplashScreen from './components/ui/SplashScreen';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Industry Pages
import Dashboard from './pages/industry/Dashboard';
import CompanyProfile from './pages/industry/CompanyProfile';
import Jobs from './pages/industry/Jobs';
import CreateJob from './pages/industry/CreateJob';
import JobDetails from './pages/industry/JobDetails';
import CandidateMatches from './pages/industry/CandidateMatches';
import CandidateProfile from './pages/industry/CandidateProfile';
import Applications from './pages/industry/Applications';
import ModulePage from './pages/industry/ModulePage';
import Shortlisted from './pages/industry/Shortlisted';
import Pipeline from './pages/industry/Pipeline';
import Settings from './pages/industry/Settings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const isRestoring = useAuthStore(s => s.isRestoring);

  // Wait for the stored token to be checked against the server. Deciding
  // before that finishes would bounce a signed-in recruiter to /login on
  // every reload.
  if (isRestoring) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-[#06c006] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);
  const restore = useAuthStore(s => s.restore);

  // A token in localStorage proves nothing on its own: the account may have
  // been disabled or the token expired. Check it with the server on start.
  useEffect(() => {
    restore();
  }, [restore]);

  if (!splashDone) {
    return <SplashScreen onDone={handleSplashDone} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Industry Routes */}
        <Route
          path="/industry"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="applications" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="company" element={<CompanyProfile />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="create" element={<CreateJob />} />
          <Route path="matches/:id" element={<CandidateMatches />} />
          <Route path="candidate/:id" element={<CandidateProfile />} />
          <Route path="applications" element={<Applications />} />
          {/* Workforce modules — mapped out, not built. ModulePage says so. */}
          <Route path="interviews" element={<ModulePage slug="interviews" />} />
          <Route path="employees" element={<ModulePage slug="employees" />} />
          <Route path="attendance" element={<ModulePage slug="attendance" />} />
          <Route path="shifts" element={<ModulePage slug="shifts" />} />
          <Route path="performance" element={<ModulePage slug="performance" />} />
          <Route path="payroll" element={<ModulePage slug="payroll" />} />
          <Route path="analytics" element={<ModulePage slug="analytics" />} />
          <Route path="shortlisted" element={<Shortlisted />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
