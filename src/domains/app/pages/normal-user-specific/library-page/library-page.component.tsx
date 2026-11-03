import React, { useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const tabRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const activePath = TABS.find((tab) =>
    pathname.endsWith(`/library/${tab.path}`),
  )?.path;

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    let nextIndex: number | undefined;
    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % TABS.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + TABS.length) % TABS.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = TABS.length - 1;
    }
    if (nextIndex === undefined) {
      return;
    }

    event.preventDefault();
    const tab = TABS[nextIndex];
    navigate(`/app/library/${tab.path}`);
    tabRefs.current[nextIndex]?.focus();
  };

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
            const isActive = tab.path === activePath;
            return (
              <NavLink
                key={tab.path}
                to={`/app/library/${tab.path}`}
                end
                ref={(node) => { tabRefs.current[idx] = node; }}
                tabIndex={isActive ? 0 : -1}
                onKeyDown={(event) => handleTabKeyDown(event, idx)}
                className={`tab-button${isActive ? ' tab-button__active' : ''}`}
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
