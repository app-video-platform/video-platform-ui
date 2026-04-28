import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Button } from '@shared/ui';
import { selectAuthUser } from 'core/store/auth-store';
import { GalNavDropdown, GalUserDropdown } from 'domains/app/components';

import './nav.styles.scss';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);

  const handleRedirect = (url: '/auth/signup' | '/auth/login') => {
    navigate(url);
  };

  return (
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
          <li>
            <Link to={'/getting-started'}>Getting Started</Link>
          </li>
          {/* <GalNavDropdown /> */}

          <li>
            <Link to={'/contact'}>Contact Us</Link>
          </li>
        </ul>
        <div className="user-buttons">
          <ul className="nav-link-list">
            {user ? (
              <div className="inline">
                <Link className="dashboard-link" to={'/app'}>
                  Go to Dashboard
                </Link>
                <GalUserDropdown />
              </div>
            ) : (
              <ul className="nav-link-list">
                <li>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleRedirect('/auth/login')}
                  >
                    Sign In
                  </Button>
                </li>
                <li>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => handleRedirect('/auth/signup')}
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
  );
};

export default Navigation;
