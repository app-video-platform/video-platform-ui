import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import SidebarNav from './sidebar-nav/sidebar-nav.component';
import TopNavbar from './top-navbar/top-navbar.component';
import { selectAuthUser } from '../../store/auth-store/auth.selectors';
import { UserRole } from '../../api/models/user/user';

import './app-layout.styles.scss';

const AppLayout: React.FC = () => {
  const user = useSelector(selectAuthUser);
  const location = useLocation();
  const isUserCreator =
    user && user.roles && Object.keys(user.roles).length > 0
      ? user.roles.includes(UserRole.CREATOR)
      : false;
  const showSidebar =
    location.pathname.startsWith('/app/dashboard') && isUserCreator;

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
