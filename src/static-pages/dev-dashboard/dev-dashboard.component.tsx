/* eslint-disable indent */
import React from 'react';
import { Link } from 'react-router-dom';

import GalUserProfileDropdown from '../../components/gal-user-profile/gal-user-profile.component';

import './dev-dashboard.styles.scss';
import DashboardMDX from '../../utils/dashboard-details.mdx';

const DevDashboard: React.FC = () => (
  <div className="dev-dashboard">
    <nav className="dev-dashboard-nav">
      <div className="logo" />
      <div className="nav-links">
        <Link to={'/app/dashboard'}>Normal Dashboard</Link>
        <Link to={'/'}>Landing page</Link>
      </div>
      <GalUserProfileDropdown />
    </nav>
    <main className="dev-dashboard-main">
      <DashboardMDX />
    </main>
  </div>
);

export default DevDashboard;
