import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

import GalSearch from '../../components/gal-search/gal-search.component';
import GalNotificationsDropdown from '../../components/gal-notifications-dropdown/gal-notifications-dropdown.component';
import GalUserProfileDropdown from '../../components/gal-user-profile/gal-user-profile.component';
import GalIcon from '../../components/gal-icon-component/gal-icon.component';

import './galactica-home.styles.scss';

const GalacticaHome: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  return (
    <div className="galactica-home-page">
      <nav className="galactica-home-nav">
        <div className="logo-container"></div>
        <GalSearch
          placeholder="Search for what your heart desires"
          onSearch={handleSearch}
          customClassName="galactica-home-search"
        />
        <div className="nav-links">
          <a href="/explore">Explore</a>
          <a href="/library">Library</a>
          <GalIcon icon={FaShoppingCart} size={16} className="cart-icon" />
          <GalNotificationsDropdown />
          <GalUserProfileDropdown />
        </div>
      </nav>

      <main className="galactica-home-main">
        <h1>Welcome back, dude!</h1>

        <h2>Continue your courses</h2>
        <div className="course-cards"></div>
        <h2>What to learn next</h2>
        <h2>New courses you might like</h2>
        <h3>How about joining our content creator team?</h3>
        <span>Button</span>
      </main>
    </div>
  );
};

export default GalacticaHome;
