import React from 'react';
import { useSelector } from 'react-redux';

import { selectAuthUser } from '../../store/auth-store/auth.selectors';

import './settings-page.styles.scss';
import GalTabs from '../../components/gal-tabs/gal-tabs.component';
import SettingsCloseAccountTab from './settings-tabs/settings-close-account-tab.component';
import SettingsNotificationsTab from './settings-tabs/settings-notifications-tab.component';
import SettingsPrivacyTab from './settings-tabs/settings-privacy-tab.component';
import SettingsPaymentMethodTab from './settings-tabs/settings-payment-method-tab.component';
import SettingsSubscriptionsTab from './settings-tabs/settings-subscriptions-tab.component';
import SettingsAccountSecurityTab from './settings-tabs/settings-account-security-tab.component';
import SettingsPhotoTab from './settings-tabs/settings-photo-tab.component';
import SettingsProfileTab from './settings-tabs/settings-profile-tab.component';
import ConnectedCalendarTab from './settings-tabs/connected-calendar.component';

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
