import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import {
  AppDispatch,
  getPrimaryRole,
  rolePrecedence,
  UserRole,
} from 'core/api/models';
import { GalDropdown, UserAvatar } from '@shared/ui';
import {
  selectAuthUser,
  changeDevUserRole,
  logout,
  logoutUser,
} from 'core/store/auth-store';
import { getProfileNameInitials } from '@shared/utils';

import './gal-user-dropdown.styles.scss';

const GalUserDropdown: React.FC = () => {
  const user = useSelector(selectAuthUser);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const primaryRole = getPrimaryRole(user?.roles);
  const roleOptions = rolePrecedence.filter((role) => role !== primaryRole);
  const showDevRoleSwitch = process.env.NODE_ENV !== 'production';

  const handleRoleChange = (role: UserRole) => {
    dispatch(changeDevUserRole(role));
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
              <span>Role: {primaryRole}</span>
            </div>
            {showDevRoleSwitch && (
              <div className="dropdown-item dev-role-switch">
                <span>Change Role (for dev):</span>
                <div className="role-selector">
                  {roleOptions.map((role) => (
                    <button
                      key={role}
                      type="button"
                      className="role-button"
                      onClick={() => handleRoleChange(role)}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
