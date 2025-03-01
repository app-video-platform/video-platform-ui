import React from 'react';
import { Fragment } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import './nav.styles.scss';

const Navigation: React.FC = () => {
  const navigate = useNavigate();

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
            <li><button onClick={() => handleRedirect('/signup')}>Sign Up</button></li>
            <li><button onClick={() => handleRedirect('/signin')}>Sign In</button></li>
          </ul>
        </div>
      </nav>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;
