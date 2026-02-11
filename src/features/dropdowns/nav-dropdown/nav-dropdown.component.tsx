import React from 'react';
import { Link } from 'react-router-dom';

import { Dropdown } from '@shared/ui';

const NavDropdown: React.FC = () => (
  <Dropdown
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
          Go to app
        </Link>
      </>
    )}
  />
);

export default NavDropdown;
