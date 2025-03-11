import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { logout, logoutUser } from '../../store/auth-store/auth.slice';

import './user-profile.styles.scss';
import { useNavigate } from 'react-router-dom';
import { selectAuthUser } from '../../store/auth-store/auth.selectors';


const UserProfileDropdown: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // const otherUser: User = {
  //   firstName: localStorage.getItem('firstName') || '',
  //   lastName: localStorage.getItem('lastName') || '',
  //   email: localStorage.getItem('email') || '',
  //   role: localStorage.getItem('roles')?.split(',').map(role => role.trim()) || [],
  // };

  // if (!user && otherUser) {
  //   user = otherUser;
  // }

  // Toggle dropdown open/close
  const handleToggle = () => {
    setOpen(prev => !prev);
  };

  // Log the user out
  const handleLogout = () => {
    dispatch(logout());
    // onLogout();
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

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
