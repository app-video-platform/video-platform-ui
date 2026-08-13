import React from 'react';
import { IoIosNotifications } from 'react-icons/io';
import { useSelector } from 'react-redux';

import { Dropdown, Icon } from '@shared/ui';
import { selectAuthUser } from 'core/store/auth-store';
import { selectNotifications } from 'core/store/notifications';

import './notifications-dropdown.styles.scss';
import { getCssVar } from '@shared/utils';

const NotificationsDropdown: React.FC = () => {
  const user = useSelector(selectAuthUser);
  const notifications = useSelector(selectNotifications);

  if (!user) {
    return null;
  }
  return (
    <div className="notifications-dropdown">
      <Dropdown
        customClassName="notifications-dropdown-panel"
        trigger={({ toggle }) => (
          <button onClick={toggle} className="notifications-button">
            <Icon
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
