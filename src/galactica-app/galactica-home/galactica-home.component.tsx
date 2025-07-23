import React from 'react';

import GalSearch from '../../components/gal-search/gal-search.component';

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
        />
      </nav>
    </div>
  );
};

export default GalacticaHome;
