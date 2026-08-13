import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi2';

import { appRoutes } from 'core/constants';
import { hasAnyRole } from 'core/api/models';
import { selectAuthUser } from 'core/store/auth-store';
import { GalIcon } from '@shared/ui';
import { getCssVar } from '@shared/utils';
import { GalUserDropdown } from 'domains/app/components';
import { useSidebarLayout } from './sidebar-layout.context';

import './sidebar-nav.styles.scss';

interface SidebarNavProps {
  onNavigate?: () => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ onNavigate }) => {
  const { isSidebarCollapsed, toggleSidebar } = useSidebarLayout();
  const user = useSelector(selectAuthUser);

  const linkClass = (active: boolean) =>
    clsx('sidebar-link', { 'sidebar-link__active': active });

  const sidebarClass = clsx('sidebar-nav', {
    'sidebar-nav__collapsed': isSidebarCollapsed,
  });

  const visibleRoutes = appRoutes.filter(
    (route) =>
      !route.hideFromSidebar &&
      (!route.allowedRoles || hasAnyRole(user?.roles, route.allowedRoles)),
  );
  const primaryRoutes = visibleRoutes.filter(
    (route) => route.group !== 'utility',
  );
  const utilityRoutes = visibleRoutes.filter(
    (route) => route.group === 'utility',
  );

  const renderRoute = (route: (typeof visibleRoutes)[number]) => {
    const iconColor = route.disabled
      ? getCssVar('--text-muted')
      : getCssVar('--text-secondary');

    if (route.disabled) {
      return (
        <button
          type="button"
          className={clsx('sidebar-link', 'sidebar-link__disabled')}
          aria-disabled="true"
          title={`${route.label} is planned`}
        >
          <GalIcon icon={route.icon} color={iconColor} size={20} />
          {!isSidebarCollapsed && <span>{route.label}</span>}
        </button>
      );
    }

    return (
      <NavLink
        to={route.path}
        end={route.end}
        className={({ isActive }) => linkClass(isActive)}
        onClick={onNavigate}
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
    );
  };

  return (
    <nav className={sidebarClass} aria-label="Creator navigation">
      <div className="logo-container">
        {!isSidebarCollapsed && <h2 className="brand-display">Galactica</h2>}
      </div>
      <ul className="routes-list">
        {primaryRoutes.map((route) => (
          <li key={route.path}>{renderRoute(route)}</li>
        ))}
      </ul>
      <ul className="routes-list routes-list__utility">
        {utilityRoutes.map((route) => (
          <li key={route.path}>{renderRoute(route)}</li>
        ))}
      </ul>
      <div className="sidebar-nav__account">
        <GalUserDropdown variant="sidebar" collapsed={isSidebarCollapsed} />
      </div>
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
