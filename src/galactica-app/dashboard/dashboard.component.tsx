import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

import UserProfileDropdown from '../../components/user-profile/user-profile.component';

import './dashboard.styles.scss';
import UserDashboard from '../user-dashboard/user-dashboard.component';
import Breadcrumbs from '../../components/breadcrumb/breadcrumb.component';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className='dashboard-top'>
        <h2>Galactica dashboard</h2>
        <button onClick={() => navigate('products')}><strong>Products</strong></button>
        <button onClick={() => navigate('my-page-preview')}><strong>Preview my page</strong></button>
        <button onClick={() => navigate('/')}>Go to website</button>
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