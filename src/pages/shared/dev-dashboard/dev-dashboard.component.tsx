import React from 'react';
import { Link } from 'react-router-dom';

import { DashboardMDX } from '@shared/utils';
import { UserDropdown } from '@features/dropdowns';

import './dev-dashboard.styles.scss';

const DevDashboard: React.FC = () => (
  <div className="dev-dashboard">
    <nav className="dev-dashboard-nav">
      <div className="logo" />
      <div className="nav-links">
        <Link to={'/app/dashboard'}>Normal Dashboard</Link>
        <Link to={'/'}>Landing page</Link>
      </div>
      <UserDropdown />
    </nav>
    <main className="dev-dashboard-main">
      <DashboardMDX />
    </main>
  </div>
);

export default DevDashboard;
