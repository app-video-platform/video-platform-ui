import React, { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Button } from '@shared/ui';
import { selectAuthUser } from 'core/store/auth-store';
import { RootState } from 'core/api/models';
import { UserDropdown } from 'domains/app/components';

import './nav.styles.scss';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const sessionStatus = useSelector((state: RootState) => state.auth.sessionStatus);
  const sessionPending = sessionStatus === 'resolving' || sessionStatus === 'unavailable';
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setMenuOpen(false); }, [location]);
  useEffect(() => {
    if (!menuOpen) { return undefined; }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); triggerRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const handleRedirect = (url: '/auth/signup' | '/auth/login') => {
    navigate(url);
  };

  return (
    <nav className="website-navbar">
      <div className="navbar-content">
        <Link className="marketing-brand" to="/">Galactica</Link>
        <button
          ref={triggerRef}
          type="button"
          className="marketing-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >Menu</button>
        <div id={menuId} className={`marketing-menu ${menuOpen ? 'is-open' : ''}`}>
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
            {/* <NavDropdown /> */}

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
                  <UserDropdown />
                </div>
              ) : !sessionPending ? (
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
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
