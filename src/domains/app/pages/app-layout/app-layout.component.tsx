import React from 'react';
import { matchPath, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

import { selectAuthUser } from 'core/store/auth-store';
import { isCreatorOrAdmin } from 'core/api/models';
import { SidebarLayoutProvider } from 'domains/app/widgets/sidebar-nav';
import { TopNavbar } from 'domains/app/widgets/top-navbar';
import { CreatorAppShell } from 'domains/app/layouts/creator-app-shell';

import './app-layout.styles.scss';

const CREATOR_ROUTES = [
  '/app',
  '/app/admin/*',
  '/app/products',
  '/app/customers/*',
  '/app/sales',
  '/app/analytics',
  '/app/settings',
  '/app/storefront',
];

const Shell: React.FC = () => {
  const location = useLocation();
  const user = useSelector(selectAuthUser);
  const hasManagementRole = isCreatorOrAdmin(user?.roles);
  const inCreatorArea = CREATOR_ROUTES.some((pattern) =>
    Boolean(matchPath(pattern, location.pathname)),
  );
  const isBuilderRoute =
    location.pathname.startsWith('/app/products/create') ||
    location.pathname.startsWith('/app/products/edit') ||
    location.pathname.startsWith('/app/admin/products/create');
  const isPublicStorefrontRoute = Boolean(
    matchPath('/app/store/:creatorId', location.pathname),
  );

  if (isBuilderRoute || isPublicStorefrontRoute) {
    return <Outlet />;
  }

  if (inCreatorArea && hasManagementRole) {
    return <CreatorAppShell />;
  }

  return (
    <div className={clsx('app-layout', 'app-layout--marketplace')}>
      <div className="app-container">
        <header className="app-header">
          <TopNavbar />
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => (
  <SidebarLayoutProvider>
    <Shell />
  </SidebarLayoutProvider>
);

export default AppLayout;
