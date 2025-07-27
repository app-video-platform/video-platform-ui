import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { AppDispatch } from '../../store/store';
import {
  changeUserRole,
  logout,
  logoutUser,
} from '../../store/auth-store/auth.slice';
import { selectAuthUser } from '../../store/auth-store/auth.selectors';

import './gal-user-profile.styles.scss';
import { UserRole } from '../../api/models/user/user';

// Custom hook to handle clicks outside of a given ref.
function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  // eslint-disable-next-line no-unused-vars
  handler: (event: MouseEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // If ref.current is null or contains the event target, do nothing
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
}

const GalUserProfileDropdown: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userRole =
    user && user.roles && Object.keys(user.roles).length > 0
      ? user.roles[0]
      : UserRole.USER;
  const [selectedRole, setSelectedRole] = useState<UserRole>(userRole);
  useOnClickOutside(dropdownRef, () => setOpen(false));

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

  // Toggle dropdown open/close
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  // Log the user out
  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);

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

  const getProfileNameInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="user-profile-dropdown" ref={dropdownRef}>
      <button onClick={handleToggle} className="user-profile-button">
        {getProfileNameInitials(user.firstName, user.lastName)}
      </button>
      {open && (
        <div className="user-profile-dropdown-menu">
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
          <div className="dropdown-item">
            <Link to="/dev-dashboard">Dev Dashboard</Link>
          </div>
          <hr />
          <div className="dropdown-item logout-btn" onClick={handleLogout}>
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default GalUserProfileDropdown;
