import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './galactica-nav-dropdown.styles.scss';

// Custom hook to handle clicks outside of a given ref.
function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  // eslint-disable-next-line no-unused-vars
  handler: (event: MouseEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // If ref.current is null or contains the event target, do nothing
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
}

const GalacticaNavDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navDropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(navDropdownRef, () => setOpen(false));

  // Toggle dropdown open/close
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="galactica-dropdown" ref={navDropdownRef}>
      <button onClick={handleToggle} className="galactica-dropdown-button">
        Galactica App
      </button>
      {open && (
        <div className="galactica-dropdown-menu">
          <Link to="/features" className="dropdown-item">
            Features
          </Link>
          <Link to="/products" className="dropdown-item">
            Products
          </Link>
          <Link to="/dashboard" className="dropdown-item">
            Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default GalacticaNavDropdown;
