import React from 'react';
import { useSelector } from 'react-redux';
// import { FaShoppingCart } from 'react-icons/fa';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { selectAuthUser } from '../../store/auth-store/auth.selectors';
import GalSearch from '../../components/gal-search/gal-search.component';
import GalIcon from '../../components/gal-icon-component/gal-icon.component';
import { UserRole } from '../../api/models/user/user';
import GalButton from '../../components/gal-button/gal-button.component';
import NewGalNotificationsDropdown from '../../components/gal-dropdowns/gal-notifications-dropdown/gal-notifications-dropdown.component';
import GalUserDropdown from '../../components/gal-dropdowns/gal-user-dropdown/gal-user-dropdown.component';

import './top-navbar.styles.scss';
import SmartSearch from './smart-search/smart-search.component';
import ShopCartDropdown from '../../components/gal-dropdowns/gal-shop-cart-dropdown/gal-shop-cart-dropdown.component';

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
            <Link to={'library'}>Library</Link>
          ))}
      </div>
      {user && (
        <div className="nav-links">
          {!isUserCreator && (
            // <GalIcon icon={FaShoppingCart} size={16} className="cart-icon" />
            <ShopCartDropdown />
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
            onClick={() => navigate('/sign-in')}
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
