import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import './library-page.styles.scss';

const TABS = [
  { label: 'All products', path: 'all-products' },
  { label: 'Courses', path: 'my-courses' },
  { label: 'Download Packages', path: 'my-download-packages' },
  { label: 'Consultation sessions', path: 'my-consultation' },
  { label: 'Wishlist', path: 'my-wishlist' },
];

const LibraryPage: React.FC = () => {
  const { pathname } = useLocation();

  const active = (() => {
    // pathname like /library/started-courses
    const seg = pathname.split('/')[2] ?? 'all-products';
    return TABS.findIndex((t) => t.path === seg);
  })();

  return (
    <div className="library-page">
      <h1 className="library-page-title">My Library</h1>

      <div className="tabs">
        <div
          className="tabs-header"
          role="tablist"
          aria-label="Library sections"
        >
          {TABS.map((tab, idx) => {
            const isActive = idx === active || (active === -1 && idx === 0);
            return (
              <NavLink
                key={tab.path}
                to={`/app/library/${tab.path}`}
                className={({ isActive: routeActive }) =>
                  `tab-button${routeActive ? ' tab-button__active' : ''}`
                }
                role="tab"
                aria-selected={isActive}
              >
                {tab.label}
              </NavLink>
            );
          })}
        </div>

        {/* Route content goes here */}
        <div className="tab-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
