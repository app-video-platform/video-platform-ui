import React, { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import GalUserProfileDropdown from '../../components/gal-user-profile/gal-user-profile.component';
import GalButton from '../../components/gal-button/gal-button.component';

import './nav.styles.scss';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../../store/auth-store/auth.selectors';
import GalFooter from '../../components/gal-footer/gal-footer.component';
import GalNavDropdown from '../../components/gal-nav-dropdown/gal-nav-dropdown.component';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);

  const handleRedirect = (url: '/signup' | '/signin') => {
    navigate(url);
  };

  return (
    <Fragment>
      <nav className="website-navbar">
        <div className="navbar-content">
          <div className="logo-container"></div>
          <ul className="nav-link-list">
            <li>
              <Link to={'/'}>Home</Link>
            </li>
            <li>
              <Link to={'/about'}>About</Link>
            </li>
            <li>
              <Link to={'/pricing'}>Pricing</Link>
            </li>
            <GalNavDropdown />

            <li>
              <Link to={'/contact'}>Contact Us</Link>
            </li>
          </ul>
          <div className="user-buttons">
            <ul className="nav-link-list">
              {user ? (
                <GalUserProfileDropdown />
              ) : (
                <ul className="nav-link-list">
                  <li>
                    <GalButton
                      onClick={() => handleRedirect('/signin')}
                      type="secondary"
                      text="Sign In"
                    />
                  </li>
                  <li>
                    <GalButton
                      onClick={() => handleRedirect('/signup')}
                      type="primary"
                      text="Register"
                    />
                  </li>
                </ul>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
      <GalFooter />
    </Fragment>
  );
};

export default Navigation;
