import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { AppDispatch, getPrimaryRole } from 'core/api/models';
import { GalDropdown, UserAvatar } from '@shared/ui';
import {
  selectAuthUser,
  logout,
  logoutUser,
} from 'core/store/auth-store';
import { getProfileNameInitials } from '@shared/utils';

import './gal-user-dropdown.styles.scss';

const GalUserDropdown: React.FC = () => {
  const user = useSelector(selectAuthUser);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

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
          <button
            onClick={toggle}
            className="user-profile-button inline"
            aria-label={getProfileNameInitials(user.firstName, user.lastName)}
          >
            <span className="user-name">
              {user.firstName} {user.lastName}
            </span>
            <UserAvatar
              imageUrl={user.imageUrl ?? ''}
              alt={`${user.firstName} ${user.lastName}`}
            />
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
              <span>Role: {getPrimaryRole(user.roles)}</span>
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
