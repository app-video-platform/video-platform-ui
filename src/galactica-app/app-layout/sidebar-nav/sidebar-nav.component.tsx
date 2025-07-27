import React from 'react';
import { useSelector } from 'react-redux';

import { selectAuthUser } from '../../../store/auth-store/auth.selectors';

import './sidebar-nav.styles.scss';
import { Link } from 'react-router-dom';

const SidebarNav: React.FC = () => {
  const user = useSelector(selectAuthUser);
  return (
    <nav className="sidebar-nav">
      <div className="logo-container">
        <h2>Galactica</h2>
      </div>
      <ul>
        <li>
          <Link to="/" className="sidebar-link">
            Overview
          </Link>
        </li>
        <li>
          <Link to="dashboard/products" className="sidebar-link">
            Products
          </Link>
        </li>
        <li>
          <Link to="dashboard/sales" className="sidebar-link">
            Sales
          </Link>
        </li>
        <li>
          <Link to="dashboard/marketing" className="sidebar-link">
            Marketing
          </Link>
        </li>
        <li>
          <Link to="analytics" className="sidebar-link">
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
          <a href="/settings">Settings</a>
        </li>
      </ul>
    </nav>
  );
};

export default SidebarNav;
