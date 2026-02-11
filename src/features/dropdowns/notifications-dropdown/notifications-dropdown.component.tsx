import React from 'react';
import { IoIosNotifications } from 'react-icons/io';
import { useSelector } from 'react-redux';

import { Dropdown, VPIcon } from '@shared/ui';
import { selectAuthUser } from '@store/auth-store';
import { selectNotifications } from '@store/notifications';
import { getCssVar } from '@shared/utils';

import './notifications-dropdown.styles.scss';

const NotificationsDropdown: React.FC = () => {
  const user = useSelector(selectAuthUser);
  const notifications = useSelector(selectNotifications);

  if (!user) {
    return null;
  }
  return (
    <div className="gal-notifications-dropdown">
      <Dropdown
        customClassName="galactica-notifications"
        trigger={({ toggle }) => (
          <button onClick={toggle} className="notifications-button">
            <VPIcon
              icon={IoIosNotifications}
              size={16}
              color={getCssVar('--text-primary')}
            />
          </button>
        )}
        menu={() => (
          <>
            {/* <div className="dropdown-menu"> */}
            {notifications && notifications.length > 0 ? (
              notifications &&
              notifications.map((notification) => (
                <div key={notification.id} className="notification-box">
                  <span className="notification-title">
                    {notification.title}
                  </span>
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
            {/* </div> */}
          </>
        )}
      />
    </div>
  );
};

export default NotificationsDropdown;
