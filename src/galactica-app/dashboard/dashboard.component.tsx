import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

import UserProfileDropdown from '../../components/user-profile/user-profile.component';

import './dashboard.styles.scss';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className='dashboard-top'>
        <h2>Galactica dashboard</h2>
        <button onClick={() => navigate('')}>Go to website</button>
        <UserProfileDropdown />
      </div>
      <div className='dashboard-outlet'>
        <Outlet />
      </div>
    </div>

  );
}

  ;

export default Dashboard;