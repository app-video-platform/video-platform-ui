import React, { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import UserProfileDropdown from '../../components/user-profile/user-profile.component';
import Button from '../../components/button/button.component';

import './nav.styles.scss';
import { useSelector } from 'react-redux';
import GoogleSignInButton from '../../components/google-sign-in-button/google-sign-in-button.component';
import { selectAuthUser } from '../../store/auth-store/auth.selectors';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);



  const handleRedirect = (url: '/signup' | '/signin') => {
    navigate(url);
  };

  return (
    <Fragment>
      <nav className='website-navbar'>
        <div className="logo-container"></div>
        <div className="nav-links">
          <ul className="nav-link-list">
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>
        <div className="user-buttons">
          <ul className="nav-link-list">
            {user ? (
              <UserProfileDropdown />
            ) : (
              <ul className="nav-link-list">
                <li>
                  <GoogleSignInButton data-test-id='google-sign-in-button' />
                </li>
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
