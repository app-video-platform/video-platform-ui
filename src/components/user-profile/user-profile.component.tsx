import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { logout, logoutUser } from '../../store/auth-store/auth.slice';

import './user-profile.styles.scss';
import { useNavigate } from 'react-router-dom';
import { selectAuthUser } from '../../store/auth-store/auth.selectors';


// Custom hook to handle clicks outside of a given ref.
function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
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

const UserProfileDropdown: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setOpen(false));

  // Toggle dropdown open/close
  const handleToggle = () => {
    setOpen(prev => !prev);
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

  if (!user) { return null; }

  return (
    <div className="user-profile-dropdown" ref={dropdownRef}>
      <button onClick={handleToggle} className="user-profile-button">
        {user.firstName} {user.lastName}
      </button>
      {open && (
        <div className="dropdown-menu">
          <div className="dropdown-item">
            <span>{user.email}</span>
          </div>
          <div className="dropdown-item">
            <span>Role: {Array.isArray(user.role) ? user.role.join(', ') : user.role}</span>
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

export default UserProfileDropdown;
