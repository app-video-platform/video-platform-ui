import React from 'react';
import { IoIosNotifications } from 'react-icons/io';
import { useSelector } from 'react-redux';

import GalDropdown from '../gal-dropdown.component';
import GalIcon from '../../gal-icon-component/gal-icon.component';
import { selectAuthUser } from '../../../store/auth-store/auth.selectors';
import { selectNotifications } from '../../../store/notifications/notifications.selectors';

import './gal-notifications-dropdown.styles.scss';

const NewGalNotificationsDropdown: React.FC = () => {
  const user = useSelector(selectAuthUser);
  const notifications = useSelector(selectNotifications);

  if (!user) {
    return null;
  }
  return (
    <div className="gal-notifications-dropdown">
      <GalDropdown
        customClassName="galactica-notifications"
        trigger={({ toggle }) => (
          <button onClick={toggle} className="notifications-button">
            <GalIcon icon={IoIosNotifications} size={16} />
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

export default NewGalNotificationsDropdown;
