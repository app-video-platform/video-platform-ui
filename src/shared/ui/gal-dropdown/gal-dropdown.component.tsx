/* eslint-disable no-unused-vars */
import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { useOnClickOutside } from '@shared/hooks';
import './gal-dropdown.styles.scss';

interface GalDropdownProps {
  customClassName: string;
  /** The element that toggles the dropdown open/closed */
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
  /** The actual dropdown menu, rendered only when open=true */
  menu: (props: { close: () => void }) => ReactNode;
}

const GalDropdown: React.FC<GalDropdownProps> = ({
  customClassName,
  trigger,
  menu,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen((o) => !o);
  const close = () => setOpen(false);

  useOnClickOutside(ref, close);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <div ref={ref} className="galactica-dropdown">
      {trigger({ open, toggle })}
      {open && (
        <div className={`galactica-dropdown-menu ${customClassName}`}>
          {menu({ close })}
        </div>
      )}
    </div>
  );
};

export default GalDropdown;
