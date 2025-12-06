import React from 'react';
import { GoKebabHorizontal } from 'react-icons/go';

import { GalDropdown, GalIcon } from '@shared/ui';
import { getCssVar } from '@shared/utils';

import './menu-dropdown.styles.scss';

interface MenuDropdownProps {
  onItemClick: () => void;
}

const MenuDropdown: React.FC = () => {
  const aleb = true;

  return (
    <GalDropdown
      customClassName="menu-dropdown"
      trigger={({ toggle }) => (
        <button onClick={toggle} className="menu-trigger">
          <GalIcon
            icon={GoKebabHorizontal}
            size={18}
            color={getCssVar('--text-primary')}
          />
        </button>
      )}
      menu={() => (
        <>
          <span>Hide</span>
          <span>View</span>
        </>
      )}
    />
  );
};

export default MenuDropdown;
