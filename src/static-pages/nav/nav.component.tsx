import React from 'react';
import { Fragment } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import GalButton from '../../components/gal-button/gal-button.component';
import { selectAuthUser } from '../../store/auth-store/auth.selectors';
import GalFooter from '../../components/gal-footer/gal-footer.component';
import NewGalNavDropdown from '../../components/gal-dropdowns/gal-nav-dropdown/gal-nav-dropdown.component';
import GalUserDropdown from '../../components/gal-dropdowns/gal-user-dropdown/gal-user-dropdown.component';

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
            <NewGalNavDropdown />

            <li>
              <Link to={'/contact'}>Contact Us</Link>
            </li>
          </ul>
          <div className="user-buttons">
            <ul className="nav-link-list">
              {user ? (
                <GalUserDropdown />
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
