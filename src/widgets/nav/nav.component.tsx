import React from 'react';
import { Fragment } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Button } from '@shared/ui';
import { selectAuthUser } from '@store/auth-store';
import { NavDropdown, UserDropdown } from '@features/dropdowns';
import { VPFooter } from '@shared/components';

import './nav.styles.scss';

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
            <NavDropdown />

            <li>
              <Link to={'/contact'}>Contact Us</Link>
            </li>
          </ul>
          <div className="user-buttons">
            <ul className="nav-link-list">
              {user ? (
                <UserDropdown />
              ) : (
                <ul className="nav-link-list">
                  <li>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleRedirect('/signin')}
                    >
                      Sign In
                    </Button>
                  </li>
                  <li>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => handleRedirect('/signup')}
                    >
                      Register
                    </Button>
                  </li>
                </ul>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
      <VPFooter />
    </Fragment>
  );
};

export default Navigation;
