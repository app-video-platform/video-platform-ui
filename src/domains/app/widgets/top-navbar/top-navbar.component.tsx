import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { selectAuthUser } from 'core/store/auth-store';
import { UserRole } from 'core/api/models';
import { Button } from '@shared/ui';
import { SmartSearch } from 'domains/app/features/smart-search';
import {
  GalWishlistDropdown,
  ShopCartDropdown,
  GalNotificationsDropdown,
  GalUserDropdown,
} from 'domains/app/components';

import './top-navbar.styles.scss';

const TopNavbar: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const location = useLocation();
  const isUserCreator =
    user && user.roles && Object.keys(user.roles).length > 0
      ? user.roles.includes(UserRole.CREATOR)
      : false;
  const isPathDashboard = location.pathname.startsWith('/app') && isUserCreator;

  return (
    <nav className="galactica-home-nav">
      {!isPathDashboard && (
        <div className="logo-container">
          <h2>Galactica</h2>
        </div>
      )}
      <div className="home-search-container">
        <SmartSearch />
        <Link to="/app/explore">Explore</Link>
        {/* {user &&
          (isUserCreator ? (
            <GalButton
              type="primary"
              customClassName="create-product-btn"
              text="Create Product"
              onClick={() => navigate('/app/products/create')}
            />
          ) : (
            <Link to={'library/all-products'}>Library</Link>
          ))} */}
        {user && !isUserCreator && (
          <Link to={'library/all-products'}>Library</Link>
        )}
      </div>
      {user && (
        <div className="nav-links">
          {!isUserCreator && (
            <>
              <GalWishlistDropdown />
              <ShopCartDropdown />
            </>
          )}
          <GalNotificationsDropdown />
          <GalUserDropdown />
        </div>
      )}

      {!user && (
        <div className="nav-action-btns">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate('/signup')}
          >
            Register
          </Button>
        </div>
      )}
    </nav>
  );
};

export default TopNavbar;
