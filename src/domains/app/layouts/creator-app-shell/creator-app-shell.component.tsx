import React, { useEffect, useState } from 'react';
import { matchPath, Outlet, useLocation } from 'react-router-dom';
import { HiMenuAlt2, HiX } from 'react-icons/hi';

import { Button, Icon } from '@shared/ui';
import { appRoutes } from 'core/constants';
import { getCssVar } from '@shared/utils';
import { UserDropdown } from 'domains/app/components';
import { SidebarNav, useSidebarLayout } from 'domains/app/widgets/sidebar-nav';

import './creator-app-shell.styles.scss';

const CreatorAppShell: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();
  const { setIsSidebarCollapsed } = useSidebarLayout();

  const closeMobileNav = () => setIsMobileNavOpen(false);

  useEffect(() => {
    const shouldCollapse = appRoutes.some(
      (route) =>
        route.collapseSidebarOnLoad &&
        Boolean(matchPath(`${route.path}/*`, location.pathname)),
    );

    if (shouldCollapse) {
      setIsSidebarCollapsed(true);
    }
  }, [location.pathname, setIsSidebarCollapsed]);

  return (
    <div className="creator-app-shell">
      <aside className="creator-app-shell__sidebar">
        <SidebarNav onNavigate={closeMobileNav} />
      </aside>

      <div className="creator-app-shell__mobile-bar">
        <Button
          type="button"
          variant="tertiary"
          size="icon"
          className="creator-app-shell__icon-button"
          aria-label="Open navigation"
          aria-expanded={isMobileNavOpen}
          onClick={() => setIsMobileNavOpen(true)}
        >
          <Icon icon={HiMenuAlt2} size={22} color={getCssVar('--text-primary')} />
        </Button>
        <span className="creator-app-shell__mobile-brand brand-display">
          Galactica
        </span>
        <UserDropdown />
      </div>

      {isMobileNavOpen && (
        <div className="creator-app-shell__mobile-layer">
          <button
            type="button"
            className="creator-app-shell__scrim"
            aria-label="Close navigation"
            onClick={closeMobileNav}
          />
          <aside className="creator-app-shell__drawer" aria-label="Creator navigation">
            <Button
              type="button"
              variant="tertiary"
              size="icon"
              className="creator-app-shell__drawer-close"
              aria-label="Close navigation"
              onClick={closeMobileNav}
            >
              <Icon icon={HiX} size={20} color={getCssVar('--text-primary')} />
            </Button>
            <SidebarNav onNavigate={closeMobileNav} />
          </aside>
        </div>
      )}

      <div className="creator-app-shell__main">
        <main className="creator-app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CreatorAppShell;
