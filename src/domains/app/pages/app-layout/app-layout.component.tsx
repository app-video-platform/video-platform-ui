import React, { useEffect, useState } from 'react';
import { matchPath, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

import { selectAuthUser } from 'core/store/auth-store';
import { UserRole } from 'core/api/models';
import {
  SidebarLayoutProvider,
  SidebarNav,
  useSidebarLayout,
} from 'domains/app/widgets/sidebar-nav';
import { TopNavbar } from 'domains/app/widgets/top-navbar';
import { appRoutes } from 'core/constants';

import './app-layout.styles.scss';

const CREATOR_ROUTES = [
  '/app',
  '/app/products/*',
  '/app/sales',
  '/app/marketing',
  '/app/settings',
];

const Shell: React.FC = () => {
  const location = useLocation();
  const { setIsSidebarCollapsed } = useSidebarLayout();
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  useEffect(() => {
    const matchedRoute = appRoutes.find((route) =>
      matchPath({ path: route.path, end: route.end }, location.pathname),
    );

    if (
      matchedRoute?.collapseSidebarOnLoad === true ||
      location.pathname.includes('create' || 'edit')
    ) {
      setIsSidebarCollapsed(true);
    }
  }, [location, setIsSidebarCollapsed]);

  const user = useSelector(selectAuthUser);

  const isUserCreator =
    user && user.roles && Object.keys(user.roles).length > 0
      ? user.roles.includes(UserRole.CREATOR || UserRole.ADMIN)
      : false;

  const inCreatorArea = CREATOR_ROUTES.some((pattern) =>
    Boolean(matchPath(pattern, location.pathname)),
  );
  const showSidebar = inCreatorArea && isUserCreator;

  const isBuilderRoute =
    location.pathname.startsWith('/app/products/create') ||
    location.pathname.startsWith('/app/products/edit');

  useEffect(() => {
    if (!isBuilderRoute) {
      setIsHeaderCollapsed(false);
      return;
    }

    const scrollEl = document.querySelector(
      'main.content',
    ) as HTMLElement | null;
    if (!scrollEl) {
      return;
    }

    const handleScroll = () => {
      const y = scrollEl.scrollTop;

      // First scroll down → collapse
      // Back to top (or almost) → expand
      if (y > 8) {
        setIsHeaderCollapsed(true);
      } else {
        setIsHeaderCollapsed(false);
      }
    };

    handleScroll(); // set initial state

    scrollEl.addEventListener('scroll', handleScroll);
    return () => {
      scrollEl.removeEventListener('scroll', handleScroll);
    };
  }, [isBuilderRoute, location.pathname]);

  return (
    <div
      className={clsx('app-layout', {
        'app-layout--builder-mode': isBuilderRoute,
        'app-layout--header-collapsed': isBuilderRoute && isHeaderCollapsed,
      })}
    >
      {showSidebar && (
        <aside className="sidebar">
          <SidebarNav />
        </aside>
      )}

      <div className="app-container">
        <header
          className={clsx('app-header', {
            'app-header--collapsed': isBuilderRoute && isHeaderCollapsed,
          })}
        >
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
