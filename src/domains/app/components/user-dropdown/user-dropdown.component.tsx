import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { HiChevronUpDown } from 'react-icons/hi2';

import {
  AppDispatch,
  getPrimaryRole,
  rolePrecedence,
  UserRole,
} from 'core/api/models';
import { Dropdown, Icon, UserAvatar } from '@shared/ui';
import {
  selectAuthUser,
  changeDevUserRole,
  logout,
  logoutUser,
} from 'core/store/auth-store';
import { getProfileNameInitials } from '@shared/utils';

import './user-dropdown.styles.scss';

interface UserDropdownProps {
  variant?: 'default' | 'sidebar';
  collapsed?: boolean;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  variant = 'default',
  collapsed = false,
}) => {
  const user = useSelector(selectAuthUser);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const primaryRole = getPrimaryRole(user?.roles);
  const roleOptions = rolePrecedence.filter((role) => role !== primaryRole);
  const displayName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  const isSidebarTrigger = variant === 'sidebar';

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
    <div
      className={clsx('user-dropdown', {
        'user-dropdown--sidebar': variant === 'sidebar',
        'user-dropdown--collapsed': collapsed,
      })}
    >
      <Dropdown
        customClassName="account-dropdown-panel"
        trigger={({ toggle }) => (
          <button
            type="button"
            onClick={toggle}
            className="user-profile-button inline"
            aria-label={
              isSidebarTrigger
                ? `Open account menu for ${displayName}`
                : getProfileNameInitials(user.firstName, user.lastName)
            }
            title={
              isSidebarTrigger && collapsed
                ? `Open account menu for ${displayName}`
                : undefined
            }
          >
            {isSidebarTrigger ? (
              <>
                <UserAvatar imageUrl={user.imageUrl ?? ''} alt={displayName} />
                {!collapsed && (
                  <>
                    <span className="user-profile-button__identity">
                      <span className="user-name">{displayName}</span>
                      <span className="user-role">{primaryRole}</span>
                    </span>
                    <Icon
                      icon={HiChevronUpDown}
                      color="currentColor"
                      size={16}
                      className="user-profile-button__chevron"
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <span className="user-name">{displayName}</span>
                <UserAvatar imageUrl={user.imageUrl ?? ''} alt={displayName} />
              </>
            )}
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

export default UserDropdown;
