import React from 'react';
import { useSelector } from 'react-redux';

import { selectAuthUser } from '@store/auth-store';
import { GalTabs } from '@shared/ui';
import {
  ConnectedCalendarTab,
  SettingsAccountSecurityTab,
  SettingsCloseAccountTab,
  SettingsNotificationsTab,
  SettingsPaymentMethodTab,
  SettingsPhotoTab,
  SettingsPrivacyTab,
  SettingsProfileTab,
  SettingsSubscriptionsTab,
} from '@features/settings';

import './settings-page.styles.scss';

const SettingsPage: React.FC = () => {
  const user = useSelector(selectAuthUser);

  return (
    <div className="settings-page">
      <GalTabs
        defaultIndex={0}
        items={[
          {
            label: 'Profile',
            content: (
              <div className="settings-tab-content">
                <SettingsProfileTab />
              </div>
            ),
          },
          {
            label: 'Photo',
            content: (
              <div className="settings-tab-content">
                <SettingsPhotoTab />
              </div>
            ),
          },
          {
            label: 'Account Security',
            content: (
              <div className="settings-tab-content">
                <SettingsAccountSecurityTab />
              </div>
            ),
          },
          {
            label: 'My Subscriptions',
            content: (
              <div className="settings-tab-content">
                <SettingsSubscriptionsTab />
              </div>
            ),
          },
          {
            label: 'Payment Methods',
            content: (
              <div className="settings-tab-content">
                <SettingsPaymentMethodTab />
              </div>
            ),
          },
          {
            label: 'Connected Calendar',
            content: (
              <div className="settings-tab-content">
                <ConnectedCalendarTab />
              </div>
            ),
          },
          {
            label: 'Privacy',
            content: (
              <div className="settings-tab-content">
                <SettingsPrivacyTab />
              </div>
            ),
          },
          {
            label: 'Notification preferences',
            content: (
              <div className="settings-tab-content">
                <SettingsNotificationsTab />
              </div>
            ),
          },
          {
            label: 'Close account',
            content: (
              <div className="settings-tab-content">
                <SettingsCloseAccountTab />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default SettingsPage;
