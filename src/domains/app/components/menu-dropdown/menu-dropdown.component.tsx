import React from 'react';
import { GoKebabHorizontal } from 'react-icons/go';

import { Button, GalDropdown, GalIcon } from '@shared/ui';
import { getCssVar } from '@shared/utils';

import './menu-dropdown.styles.scss';

const MenuDropdown: React.FC = () => (
  <GalDropdown
    customClassName="menu-dropdown"
    trigger={({ toggle }) => (
      <Button
        type="button"
        variant="tertiary"
        size="icon"
        onClick={toggle}
        className="menu-trigger"
        aria-label="Open item menu"
      >
        <GalIcon
          icon={GoKebabHorizontal}
          size={18}
          color={getCssVar('--text-primary')}
        />
      </Button>
    )}
    menu={() => (
      <>
        <button type="button">Hide</button>
        <button type="button">View</button>
      </>
    )}
  />
);

export default MenuDropdown;
