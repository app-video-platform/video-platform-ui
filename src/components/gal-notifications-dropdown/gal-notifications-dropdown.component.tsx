import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IoIosNotifications } from 'react-icons/io';

import { selectAuthUser } from '../../store/auth-store/auth.selectors';
import { selectNotifications } from '../../store/notifications/notifications.selectors';
import GalIcon from '../gal-icon-component/gal-icon.component';

import './gal-notifications-dropdown.styles.scss';

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

const GalNotificationsDropdown: React.FC = () => {
  const user = useSelector(selectAuthUser);
  const notifications = useSelector(selectNotifications);
  const [open, setOpen] = useState(false);
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(notificationsDropdownRef, () => setOpen(false));

  // Toggle dropdown open/close
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="notifications-dropdown" ref={notificationsDropdownRef}>
      <button onClick={handleToggle} className="notifications-button">
        <GalIcon icon={IoIosNotifications} />
      </button>
      {open && (
        <div className="dropdown-menu">
          {notifications && notifications.length > 0 ? (
            notifications &&
            notifications.map((notification) => (
              <div key={notification.id} className="notification-box">
                <span className="notification-title">{notification.title}</span>
                <span className="notification-message">
                  {notification.message}
                </span>
                {notification.isRead && (
                  <div className="notification-is-read-bubble" />
                )}
              </div>
            ))
          ) : (
            <p>No notifications to show</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GalNotificationsDropdown;
