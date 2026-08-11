import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HiMenuAlt2, HiX } from 'react-icons/hi';

import { GalIcon } from '@shared/ui';
import { getCssVar } from '@shared/utils';
import { GalUserDropdown } from 'domains/app/components';
import { SidebarNav } from 'domains/app/widgets/sidebar-nav';

import './creator-app-shell.styles.scss';

const CreatorAppShell: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const closeMobileNav = () => setIsMobileNavOpen(false);

  return (
    <div className="creator-app-shell">
      <aside className="creator-app-shell__sidebar">
        <SidebarNav onNavigate={closeMobileNav} />
      </aside>

      <div className="creator-app-shell__mobile-bar">
        <button
          type="button"
          className="creator-app-shell__icon-button"
          aria-label="Open navigation"
          aria-expanded={isMobileNavOpen}
          onClick={() => setIsMobileNavOpen(true)}
        >
          <GalIcon icon={HiMenuAlt2} size={22} color={getCssVar('--text-primary')} />
        </button>
        <span className="creator-app-shell__mobile-brand brand-display">
          Galactica
        </span>
        <GalUserDropdown />
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
            <button
              type="button"
              className="creator-app-shell__drawer-close"
              aria-label="Close navigation"
              onClick={closeMobileNav}
            >
              <GalIcon icon={HiX} size={20} color={getCssVar('--text-primary')} />
            </button>
            <SidebarNav onNavigate={closeMobileNav} />
          </aside>
        </div>
      )}

      <div className="creator-app-shell__main">
        <div className="creator-app-shell__account">
          <GalUserDropdown />
        </div>
        <main className="creator-app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CreatorAppShell;
