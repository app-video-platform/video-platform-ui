import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { FaUser } from 'react-icons/fa';

import './user-dashboard.styles.scss';
import { selectAuthUser } from '../../store/auth-store/auth.selectors';


const UserDashboard: React.FC = () => {
  const user = useSelector(selectAuthUser);

  return (
    <div className='user-dashboard-container'>
      {/* <FaUser className="user-avatar" /> */}
      {React.createElement(FaUser as React.FC<{ className: string }>, { className: 'user-avatar' })}
      <div className="user-profile">
        <h2>{user?.firstName} {user?.lastName}</h2>
        <span>{user?.email}</span>
        <span>Content Creator</span>
        <span>Member since: <strong>12 March 2025</strong></span>
      </div>

    </div>
  );
};

export default UserDashboard;