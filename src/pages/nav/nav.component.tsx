import React, { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import UserProfileDropdown from '../../components/user-profile/user-profile.component';
import Button from '../../components/button/button.component';

import './nav.styles.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  // const [token, setToken] = useState<string | null>(localStorage.getItem('userToken'));
  const user = useSelector((state: RootState) => state.auth.user);
  // const refreshToken = () => {
  //   setToken(localStorage.getItem('userToken'));
  // };

  // If you want to update token state when localStorage changes in other tabs:
  useEffect(() => {
    console.log('USER in NAV', user);


    // const handleStorageChange = () => {
    //   refreshToken();
    // };
    // window.addEventListener('storage', handleStorageChange);
    // return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);



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
            {user ? (
              <UserProfileDropdown />
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
