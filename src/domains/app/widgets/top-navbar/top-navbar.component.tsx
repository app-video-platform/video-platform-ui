import React, { useEffect, useId, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { selectAuthUser } from 'core/store/auth-store';
import { isCreatorOrAdmin, RootState } from 'core/api/models';
import { Button } from '@shared/ui';
import { SmartSearch } from 'domains/app/features/smart-search';
import {
  WishlistDropdown,
  ShopCartDropdown,
  NotificationsDropdown,
  UserDropdown,
} from 'domains/app/components';

import './top-navbar.styles.scss';

const TopNavbar: React.FC = () => {
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
  const hasManagementRole = isCreatorOrAdmin(user?.roles);
  const isPathDashboard =
    location.pathname.startsWith('/app') && hasManagementRole;

  return (
    <nav className="top-navbar">
      {!isPathDashboard && (
        <div className="logo-container">
          <h2>Galactica</h2>
        </div>
      )}
      <button
        ref={triggerRef}
        type="button"
        className="market-menu-toggle"
        aria-expanded={menuOpen}
        aria-controls={menuId}
        onClick={() => setMenuOpen((open) => !open)}
      >Menu</button>
      <div className="home-search-container">
        <SmartSearch />
      </div>
      <div id={menuId} className={`market-menu ${menuOpen ? 'is-open' : ''}`}>
        <Link to="/app/explore">Explore</Link>
        {/* {user &&
          (isUserCreator ? (
            <Button
              type="primary"
              customClassName="create-product-btn"
              text="Create Product"
              onClick={() => navigate('/app/products/create')}
            />
          ) : (
            <Link to={'library/all-products'}>Library</Link>
          ))} */}
        {user && !hasManagementRole && (
          <Link to="/app/library/all-products">Library</Link>
        )}
        {user && (
          <div className="nav-links">
            {!hasManagementRole && (
              <>
                <WishlistDropdown />
                <ShopCartDropdown />
              </>
            )}
            <NotificationsDropdown />
            <UserDropdown />
          </div>
        )}

        {!user && !sessionPending && (
          <div className="nav-action-btns">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/auth/login')}
            >
            Log In
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate('/auth/signup')}
            >
            Register
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopNavbar;
