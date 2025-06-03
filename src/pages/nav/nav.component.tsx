import React, { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import UserProfileDropdown from '../../components/user-profile/user-profile.component';
import Button from '../../components/button/button.component';

import './nav.styles.scss';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../../store/auth-store/auth.selectors';
import Footer from '../../components/footer/footer.component';
import GalacticaNavDropdown from '../../components/galactica-nav-dropdown/galactica-nav-dropdown.component';

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
          {/* <div className="nav-links"> */}
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
            <GalacticaNavDropdown />

            <li>
              <Link to={'/contact'}>Contact Us</Link>
            </li>

            {/* <li>Home</li>
            <li>About</li>
            <li>Pricing</li> */}
            {/* <li>Contact Us</li> */}
          </ul>
          {/* </div> */}
          <div className="user-buttons">
            <ul className="nav-link-list">
              {user ? (
                <UserProfileDropdown />
              ) : (
                <ul className="nav-link-list">
                  {/* <li>
                  <GoogleSignInButton data-test-id='google-sign-in-button' />
                </li> */}
                  <li>
                    <Button
                      onClick={() => handleRedirect('/signin')}
                      type="secondary"
                      text="Sign In"
                    />
                  </li>
                  <li>
                    <Button
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
      <Footer />
    </Fragment>
  );
};

export default Navigation;
