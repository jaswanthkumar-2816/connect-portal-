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
import CandidateInterview from './pages/interview/CandidateInterview';

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
import Employees from './pages/industry/Employees';
import Attendance from './pages/industry/Attendance';
import AccessRequests from './pages/industry/AccessRequests';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Shortlisted from './pages/industry/Shortlisted';
import Pipeline from './pages/industry/Pipeline';
import Settings from './pages/industry/Settings';

// HIERO's own area. Signed in is not enough — an ordinary company recruiter
// has no business here, and the server enforces the same rule on every call.
function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const isRestoring = useAuthStore(s => s.isRestoring);
  const user = useAuthStore(s => s.user);

  if (isRestoring) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-[#06c006] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (user?.accountRole !== 'admin') return <Navigate to="/industry/applications" replace />;
  return <>{children}</>;
}

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

// A candidate who scanned a QR code at a counter is not visiting the portal.
// They have one thing to do, often on someone else's patience, and four
// seconds of branding is in the way of it — so the interview link skips the
// splash entirely.
const opensAnInterview = () =>
  typeof window !== 'undefined' && window.location.pathname.startsWith('/interview/');

export default function App() {
  const [splashDone, setSplashDone] = useState(opensAnInterview);
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

        {/* The candidate's interview. No account, no sign-in: the token in
            the link is the credential, and it is good for one interview. */}
        <Route path="/interview/:token" element={<CandidateInterview />} />

        {/* HIERO admin — its own area, not part of the company portal */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="access" replace />} />
          <Route path="access" element={<AccessRequests />} />
        </Route>

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
          <Route path="access" element={<Navigate to="/admin/access" replace />} />
          {/* Workforce modules — mapped out, not built. ModulePage says so. */}
          <Route path="interviews" element={<ModulePage slug="interviews" />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
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
