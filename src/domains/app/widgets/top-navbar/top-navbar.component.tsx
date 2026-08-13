import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { selectAuthUser } from 'core/store/auth-store';
import { isCreatorOrAdmin } from 'core/api/models';
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
  const location = useLocation();
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
      <div className="home-search-container">
        <SmartSearch />
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
          <Link to={'library/all-products'}>Library</Link>
        )}
      </div>
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

      {!user && (
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
    </nav>
  );
};

export default TopNavbar;
