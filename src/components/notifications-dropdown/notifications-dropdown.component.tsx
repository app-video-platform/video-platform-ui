import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IoIosNotifications } from 'react-icons/io';

import './notifications-dropdown.styles.scss';
import { selectAuthUser, selectNotifications } from '../../store/auth-store/auth.selectors';

const NotificationsIcon = IoIosNotifications as React.ElementType;
// Custom hook to handle clicks outside of a given ref.
function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
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

const NotificationsDropdown: React.FC = () => {
  const user = useSelector(selectAuthUser);
  const notifications = useSelector(selectNotifications);
  const [open, setOpen] = useState(false);
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(notificationsDropdownRef, () => setOpen(false));

  // Toggle dropdown open/close
  const handleToggle = () => {
    setOpen(prev => !prev);
  };

  if (!user) { return null; }

  return (
    <div className="notifications-dropdown" ref={notificationsDropdownRef}>
      <button onClick={handleToggle} className="notifications-button">
        <NotificationsIcon />
      </button>
      {open && (
        <div className="dropdown-menu">
          {
            notifications && notifications.length > 0 ? (
              notifications && notifications.map((notification, index) => <div key={index} className='notification-box'>
                <span className='notification-title'>{notification.title}</span>
                <span className='notification-message'>{notification.message}</span>
                {
                  notification.isRead && <div className='notification-is-read-bubble' />
                }
              </div>)
            ) : (
              <p>No notifications to show</p>
            )
          }
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
