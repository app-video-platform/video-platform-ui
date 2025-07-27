import React from 'react';
import { Link } from 'react-router-dom';
import GalDropdown from '../gal-dropdown.component';

const NewGalNavDropdown: React.FC = () => (
  <GalDropdown
    customClassName="galactica-nav"
    trigger={({ toggle }) => (
      <button onClick={toggle} className="galactica-dropdown-button">
        Galactica App
      </button>
    )}
    menu={() => (
      <>
        <Link to="/features" className="dropdown-item">
          Features
        </Link>
        <Link to="/products" className="dropdown-item">
          Products
        </Link>
        <Link to="/app" className="dropdown-item">
          Dashboard
        </Link>
      </>
    )}
  />
);

export default NewGalNavDropdown;
