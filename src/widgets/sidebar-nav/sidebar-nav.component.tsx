import React from 'react';
import { Link } from 'react-router-dom';

import './sidebar-nav.styles.scss';

const SidebarNav: React.FC = () => (
  <nav className="sidebar-nav">
    <div className="logo-container">
      <h2>Galactica</h2>
    </div>
    <ul>
      <li>
        <Link to="/app" className="sidebar-link">
          Overview
        </Link>
      </li>
      <li>
        <Link to="/app/products" className="sidebar-link">
          Products
        </Link>
      </li>
      <li>
        <Link to="/app/sales" className="sidebar-link">
          Sales
        </Link>
      </li>
      <li>
        <Link to="/app/marketing" className="sidebar-link">
          Marketing
        </Link>
      </li>
      <li>
        <Link to="/app/analytics" className="sidebar-link">
          Analytics
        </Link>
      </li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li>
        <a href="/settings">Messages</a>
      </li>
      <li>
        <Link to="/app/settings" className="sidebar-link">
          Settings
        </Link>
      </li>
    </ul>
  </nav>
);

export default SidebarNav;
