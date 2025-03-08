import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { FaUser } from 'react-icons/fa';

import './user-dashboard.styles.scss';


const UserDashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className='user-dashboard-container'>
      <FaUser className="user-avatar" />
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