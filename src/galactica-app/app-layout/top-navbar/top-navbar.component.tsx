import React from 'react';
import { useSelector } from 'react-redux';

import { selectAuthUser } from '../../../store/auth-store/auth.selectors';

import './top-navbar.styles.scss';
import GalSearch from '../../../components/gal-search/gal-search.component';
import GalIcon from '../../../components/gal-icon-component/gal-icon.component';
import GalNotificationsDropdown from '../../../components/gal-notifications-dropdown/gal-notifications-dropdown.component';
import { FaShoppingCart } from 'react-icons/fa';
import GalUserProfileDropdown from '../../../components/gal-user-profile/gal-user-profile.component';
import { UserRole } from '../../../api/models/user/user';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import GalButton from '../../../components/gal-button/gal-button.component';

const TopNavbar: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const location = useLocation();
  const isUserCreator =
    user && user.roles && Object.keys(user.roles).length > 0
      ? user.roles.includes(UserRole.CREATOR)
      : false;
  const isPathDashboard =
    location.pathname.startsWith('/app/dashboard') && isUserCreator;

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  return (
    <nav className="galactica-home-nav">
      {!isPathDashboard && (
        <div className="logo-container">
          <h2>Galactica</h2>
        </div>
      )}
      <div className="home-search-container">
        <GalSearch
          placeholder="Search for what your heart desires"
          onSearch={handleSearch}
          customClassName={`galactica-home-search galactica-home-search__${
            isPathDashboard ? 'creator' : 'user'
          }`}
        />
        <Link to="/app">Explore</Link>
        {isUserCreator ? (
          isPathDashboard ? (
            <GalButton
              type="primary"
              customClassName="create-product-btn"
              text="Create Product"
              onClick={() => navigate('/app/dashboard/products/create')}
            />
          ) : (
            <Link to={'dashboard'}>Dashboard</Link>
          )
        ) : (
          <Link to={'library'}>Library</Link>
        )}
      </div>
      <div className="nav-links">
        {!isUserCreator && (
          <GalIcon icon={FaShoppingCart} size={16} className="cart-icon" />
        )}
        <GalNotificationsDropdown />
        <GalUserProfileDropdown />
      </div>
    </nav>
  );
};

export default TopNavbar;
