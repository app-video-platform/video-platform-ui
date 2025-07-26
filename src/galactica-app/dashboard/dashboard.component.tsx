import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

import GalUserProfileDropdown from '../../components/gal-user-profile/gal-user-profile.component';

import './dashboard.styles.scss';
import UserDashboard from '../user-dashboard/user-dashboard.component';
import GalBreadcrumbs from '../../components/gal-breadcrumb/gal-breadcrumb.component';
import GalNotificationsDropdown from '../../components/gal-notifications-dropdown/gal-notifications-dropdown.component';

//////////////////////////////////////////
/////////// NO LONGER USED //////////////
////////////////////////////////////////

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="dashboard-top">
        <h2>Galactica</h2>
        <div className="app-nav-links">
          <Link to={''}>Overview</Link>
          <Link to={'products'}>Products</Link>
          <Link to={'sales'}>Sales & Analytics</Link>
          <Link to={'marketing'}>Marketing and Communication</Link>
        </div>
        <button onClick={() => navigate('/')}>Go to website</button>
        <GalNotificationsDropdown />
        <GalUserProfileDropdown />
      </div>
      <GalBreadcrumbs />
      <div className="dashboard-outlet">
        {/* <UserDashboard /> */}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
