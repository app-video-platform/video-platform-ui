import React, { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import UserProfileDropdown from '../../components/user-profile/user-profile.component';
import Button from '../../components/button/button.component';

import './nav.styles.scss';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(localStorage.getItem('userToken'));

  const refreshToken = () => {
    setToken(localStorage.getItem('userToken'));
  };

  // If you want to update token state when localStorage changes in other tabs:
  useEffect(() => {
    const handleStorageChange = () => {
      refreshToken();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    // The logout logic (removing token from localStorage) is handled inside UserProfileDropdown.
    // Here, we simply refresh the state.
    refreshToken();
    // navigate('/signin'); // Redirect after logout if needed
  };

  const handleRedirect = (url: '/signup' | '/signin') => {
    navigate(url);
  };

  return (
    <Fragment>
      <nav>
        <div className="logo-container"></div>
        <div className="nav-links">
          <ul className="nav-link-list">
            <li>Home</li>
            <li>Chi sonno</li>
            <li>Contattami</li>
          </ul>
        </div>
        <div className="user-buttons">
          <ul className="nav-link-list">
            {token ? (
              <UserProfileDropdown onLogout={handleLogout} />
            ) : (
              <ul className="nav-link-list">
                <li>
                  <Button onClick={() => handleRedirect('/signup')} type='secondary' text='Sign Up' />
                </li>
                <li>
                  <Button onClick={() => handleRedirect('/signin')} type='primary' text='Sign In' />
                </li>
              </ul>
            )}
          </ul>
        </div>
      </nav>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;
