import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { UserRole } from '@api/models';
import { GalDropdown } from '@shared/ui';
import {
  selectAuthUser,
  changeUserRole,
  logout,
  logoutUser,
} from '@store/auth-store';
import { AppDispatch } from '@store/store';
import { getProfileNameInitials } from '@shared/utils';

import './gal-user-dropdown.styles.scss';

const GalUserDropdown: React.FC = () => {
  const user = useSelector(selectAuthUser);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const userRole =
    user && user.roles && Object.keys(user.roles).length > 0
      ? user.roles[0]
      : UserRole.USER;
  const [selectedRole, setSelectedRole] = useState<UserRole>(userRole);

  useEffect(() => {
    const newUserRole =
      user && user.roles && Object.keys(user.roles).length > 0
        ? user.roles[0]
        : UserRole.USER;
    setSelectedRole(newUserRole);
  }, [user?.roles]);

  const handleClick = (role: UserRole) => {
    setSelectedRole(role);
    dispatch(changeUserRole(role));
  };

  // Log the user out
  const handleLogout = () => {
    dispatch(logout());

    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        // Redirect to login or homepage
        navigate('/');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="gal-user-dropdown">
      <GalDropdown
        customClassName="galactica-nav"
        trigger={({ toggle }) => (
          <button onClick={toggle} className="user-profile-button">
            {getProfileNameInitials(user.firstName, user.lastName)}
          </button>
        )}
        menu={() => (
          <>
            <div className="dropdown-item">
              <h3>
                {user.firstName} {user.lastName}
              </h3>
            </div>
            <div className="dropdown-item">
              <span>{user.email}</span>
            </div>
            <div className="dropdown-item">
              <span>Role: {selectedRole}</span>
              <div className="role-selector">
                {Object.values(UserRole).map((roleValue) => (
                  <button
                    key={roleValue}
                    className={`role-button ${
                      selectedRole === roleValue ? 'selected' : ''
                    }`}
                    onClick={() => handleClick(roleValue)}
                  >
                    {roleValue}
                  </button>
                ))}
              </div>
            </div>
            <div className="dropdown-item dev-items">
              <Link to="/dev-dashboard">Dev Dashboard</Link>
              <Link
                target="_blank"
                to="https://luxury-klepon-a62307.netlify.app/"
              >
                Docusaurus
              </Link>
            </div>
            <hr />
            <div className="dropdown-item logout-btn" onClick={handleLogout}>
              Logout
            </div>
          </>
        )}
      />
    </div>
  );
};

export default GalUserDropdown;
