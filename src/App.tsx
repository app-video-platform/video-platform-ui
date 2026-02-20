import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import RoutesDev from './devtools/__routes-dev';
import { DevDashboard, NotFoundPage, UnauthorizedPage } from '@shared/pages';
import { AppInitializer } from 'core/providers';
import { AppRouter } from '@domains/app/routes';
import { AuthRouter } from '@domains/auth/routes';
import { MarketingRouter } from '@domains/marketing/routes';

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
