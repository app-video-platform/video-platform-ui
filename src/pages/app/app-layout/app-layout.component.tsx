import React from 'react';
import { matchPath, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectAuthUser } from '@store/auth-store';
import { UserRole } from '@api/models';
import { SidebarNav } from '@widgets/sidebar-nav';
import { TopNavbar } from '@widgets/top-navbar';

import './app-layout.styles.scss';

const CREATOR_ROUTES = [
  '/app',
  '/app/products/*',
  '/app/sales',
  '/app/marketing',
  '/app/settings',
];

const AppLayout: React.FC = () => {
  const user = useSelector(selectAuthUser);
  const location = useLocation();
  const isUserCreator =
    user && user.roles && Object.keys(user.roles).length > 0
      ? user.roles.includes(UserRole.CREATOR || UserRole.ADMIN)
      : false;

  const inCreatorArea = CREATOR_ROUTES.some((pattern) =>
    Boolean(matchPath(pattern, location.pathname)),
  );
  const showSidebar = inCreatorArea && isUserCreator;

  return (
    <div className="app-layout">
      {showSidebar && (
        <aside className="sidebar">
          <SidebarNav />
        </aside>
      )}

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

export default AppLayout;
