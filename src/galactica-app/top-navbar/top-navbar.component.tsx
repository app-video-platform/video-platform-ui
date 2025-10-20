import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { selectAuthUser } from '../../store/auth-store/auth.selectors';
import { UserRole } from '../../api/models/user/user';
import GalButton from '../../components/gal-button/gal-button.component';
import NewGalNotificationsDropdown from '../../components/gal-dropdowns/gal-notifications-dropdown/gal-notifications-dropdown.component';
import GalUserDropdown from '../../components/gal-dropdowns/gal-user-dropdown/gal-user-dropdown.component';
import SmartSearch from './smart-search/smart-search.component';
import ShopCartDropdown from '../../components/gal-dropdowns/gal-shop-cart-dropdown/gal-shop-cart-dropdown.component';

import './top-navbar.styles.scss';
import GalWishlistDropdown from '../../components/gal-dropdowns/gal-wishlist-dropdown/gal-wishlist-dropdown.component';

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
        {user &&
          (isUserCreator ? (
            <GalButton
              type="primary"
              customClassName="create-product-btn"
              text="Create Product"
              onClick={() => navigate('/app/products/create')}
            />
          ) : (
            <Link to={'library/all-products'}>Library</Link>
          ))}
      </div>
      {user && (
        <div className="nav-links">
          {!isUserCreator && (
            <>
              <GalWishlistDropdown />
              <ShopCartDropdown />
            </>
          )}
          <NewGalNotificationsDropdown />
          <GalUserDropdown />
        </div>
      )}

      {!user && (
        <div className="nav-action-btns">
          <GalButton
            text="Log In"
            type="secondary"
            onClick={() => navigate('/login')}
          />
          <GalButton
            text="Register"
            type="primary"
            onClick={() => navigate('/sign-up')}
          />
        </div>
      )}
    </nav>
  );
};

export default TopNavbar;
