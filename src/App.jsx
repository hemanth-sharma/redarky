import { Toaster } from '@/components/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from '@/lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ScrollToTop from '@/components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { ThemeProvider } from '@/lib/theme-context';
import { TooltipProvider } from '@/components/ui/tooltip';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import ActionQueue from '@/pages/ActionQueue';
import Onboarding from '@/pages/Onboarding';
import ProductProfile from '@/pages/ProductProfile';
import Integrations from '@/pages/Integrations';
import ScraperActivity from '@/pages/ScraperActivity';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

function AuthenticatedRoutes() {
  const { isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Onboarding — protected but standalone (no app chrome) */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/queue" element={<ActionQueue />} />
          <Route path="/product-profile" element={<ProductProfile />} />
          <Route path="/scraper-activity" element={<ScraperActivity />} />
          <Route path="/integrations" element={<Integrations />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClientInstance}>
          <TooltipProvider delayDuration={200}>
            <Router>
              <ScrollToTop />
              <AuthenticatedRoutes />
            </Router>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
