import { useState, useCallback } from 'react';
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
import Shortlisted from './pages/industry/Shortlisted';
import Pipeline from './pages/industry/Pipeline';
import Settings from './pages/industry/Settings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const hasAuth = isAuthenticated || localStorage.getItem('hc_auth') === 'true';
  if (!hasAuth) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

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
          <Route index element={<Dashboard />} />
          <Route path="company" element={<CompanyProfile />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="create" element={<CreateJob />} />
          <Route path="matches/:id" element={<CandidateMatches />} />
          <Route path="candidate/:id" element={<CandidateProfile />} />
          <Route path="applications" element={<Applications />} />
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
