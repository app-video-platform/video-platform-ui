import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { AppDispatch } from '../../store/store';
import { logout, logoutUser } from '../../store/auth-store/auth.slice';
import { selectAuthUser } from '../../store/auth-store/auth.selectors';

import './gal-user-profile.styles.scss';

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

  useOnClickOutside(dropdownRef, () => setOpen(false));

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
            <span>
              Role:{' '}
              {Array.isArray(user.role) ? user.role.join(', ') : user.role}
            </span>
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
