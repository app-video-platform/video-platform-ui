import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

import UserProfileDropdown from '../../components/user-profile/user-profile.component';

import './dashboard.styles.scss';
import UserDashboard from '../user-dashboard/user-dashboard.component';
import Breadcrumbs from '../../components/breadcrumb/breadcrumb.component';
import NotificationsDropdown from '../../components/notifications-dropdown/notifications-dropdown.component';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className='dashboard-top'>
        <h2>Galactica dashboard</h2>
        <div className='app-nav-links'>
          <Link to={''}>Dashboard</Link>
          <Link to={'products'}>Products</Link>
          <Link to={''}>Sales & Analytics</Link>
          <Link to={''}>Marketing and Communication</Link>
        </div>
        <button onClick={() => navigate('/')}>Go to website</button>
        <NotificationsDropdown />
        <UserProfileDropdown />
      </div>
      <Breadcrumbs />
      <div className='dashboard-outlet'>
        {/* <UserDashboard /> */}
        <Outlet />
      </div>
    </div>

  );
}

  ;

export default Dashboard;