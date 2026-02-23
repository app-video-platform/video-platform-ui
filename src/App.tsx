import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

import RoutesDev from './devtools/__routes-dev';
import { DevDashboard, NotFoundPage, UnauthorizedPage } from '@shared/pages';
import { AppInitializer } from 'core/providers';
import { AppRouter } from '@domains/app/routes';
import { AuthRouter } from '@domains/auth/routes';
import { MarketingRouter } from '@domains/marketing/routes';

interface LegacyAuthRedirectProps {
  to: string;
}

const LegacyAuthRedirect: React.FC<LegacyAuthRedirectProps> = ({ to }) => {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}${location.hash}`} replace />;
};

const App = () => (
  <AppInitializer>
    <Toaster position="top-center" richColors closeButton />

    <Routes>
      {/* App domain */}
      <Route path="/app/*" element={<AppRouter />} />
      {/* Onboarding (root) is defined inside AppRouter as absolute /onboarding */}
      <Route path="/onboarding" element={<AppRouter />} />

      {/* Auth domain */}
      <Route path="/auth/*" element={<AuthRouter />} />
      {/* Legacy auth aliases */}
      <Route path="/signin" element={<LegacyAuthRedirect to="/auth/login" />} />
      <Route path="/signup" element={<LegacyAuthRedirect to="/auth/signup" />} />
      <Route path="/login" element={<LegacyAuthRedirect to="/auth/login" />} />
      <Route
        path="/verify-email"
        element={<LegacyAuthRedirect to="/auth/verify-email" />}
      />
      <Route
        path="/email-sent"
        element={<LegacyAuthRedirect to="/auth/email-sent" />}
      />
      <Route
        path="/forgot-password"
        element={<LegacyAuthRedirect to="/auth/forgot-password" />}
      />

      {/* Shared/system routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/dev-dashboard" element={<DevDashboard />} />

      {process.env.NODE_ENV === 'development' && (
        <Route path="/__routes-dev" element={<RoutesDev />} />
      )}

      {/* Marketing domain */}
      <Route path="/*" element={<MarketingRouter />} />

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </AppInitializer>
);

export default App;
