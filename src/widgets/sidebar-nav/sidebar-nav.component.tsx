import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi2';

import { appRoutes } from '@api/constants';
import { GalIcon } from '@shared/ui';
import { getCssVar } from '@shared/utils';
import { useSidebarLayout } from './sidebar-layout.context';

import './sidebar-nav.styles.scss';

const SidebarNav: React.FC = () => {
  const { isSidebarCollapsed, toggleSidebar } = useSidebarLayout();

  const linkClass = (active: boolean) =>
    clsx('sidebar-link', { 'sidebar-link__active': active });

  const sidebarClass = clsx('sidebar-nav', {
    'sidebar-nav__collapsed': isSidebarCollapsed,
  });

  return (
    <nav className={sidebarClass}>
      <div className="logo-container">
        {!isSidebarCollapsed && <h2>Galactica</h2>}
      </div>
      <ul className="routes-list">
        {appRoutes.map((route, index) => (
          <li key={index}>
            <NavLink
              to={route.path}
              end={route.end}
              className={({ isActive }) => linkClass(isActive)}
            >
              {({ isActive }) => (
                <>
                  <GalIcon
                    icon={route.icon}
                    color={
                      isActive
                        ? getCssVar('--text-primary')
                        : getCssVar('--text-secondary')
                    }
                    size={20}
                  />
                  {!isSidebarCollapsed && <span>{route.label}</span>}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="sidebar-nav-toggle"
        onClick={toggleSidebar}
        aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <GalIcon
          icon={isSidebarCollapsed ? HiChevronDoubleRight : HiChevronDoubleLeft}
          size={18}
          color={getCssVar('--brand-primary')}
        />
      </button>
    </nav>
  );
};

export default SidebarNav;
