import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Tabs } from '@shared/ui';
import {
  ConnectedCalendarTab,
  SettingsAccountSecurityTab,
  SettingsNotificationsTab,
  SettingsPaymentMethodTab,
  SettingsPrivacyTab,
  SettingsProfileTab,
  SettingsSubscriptionsTab,
} from '@features/settings';

import './settings-page.styles.scss';

type SettingsTabSlug =
  | 'profile'
  | 'account'
  | 'subscriptions'
  | 'payment'
  | 'calendar'
  | 'privacy'
  | 'notifications';

const SettingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabsConfig = useMemo(
    () => [
      {
        slug: 'profile' as SettingsTabSlug,
        label: 'Profile',
        content: (
          <div className="settings-tab-content">
            <SettingsProfileTab />
          </div>
        ),
      },
      {
        slug: 'account' as SettingsTabSlug,
        label: 'Account',
        content: (
          <div className="settings-tab-content">
            <SettingsAccountSecurityTab />
          </div>
        ),
      },
      {
        slug: 'subscriptions' as SettingsTabSlug,
        label: 'Subscriptions',
        content: (
          <div className="settings-tab-content">
            <SettingsSubscriptionsTab />
          </div>
        ),
      },
      {
        slug: 'payment' as SettingsTabSlug,
        label: 'Payment Methods',
        content: (
          <div className="settings-tab-content">
            <SettingsPaymentMethodTab />
          </div>
        ),
      },
      {
        slug: 'calendar' as SettingsTabSlug,
        label: 'Calendar',
        content: (
          <div className="settings-tab-content">
            <ConnectedCalendarTab />
          </div>
        ),
      },
      {
        slug: 'privacy' as SettingsTabSlug,
        label: 'Privacy',
        content: (
          <div className="settings-tab-content">
            <SettingsPrivacyTab />
          </div>
        ),
      },
      {
        slug: 'notifications' as SettingsTabSlug,
        label: 'Notifications',
        content: (
          <div className="settings-tab-content">
            <SettingsNotificationsTab />
          </div>
        ),
      },
    ],
    [],
  );

  const tabFromUrl = (searchParams.get('tab') as SettingsTabSlug) || 'profile';

  const activeIndex = (() => {
    const idx = tabsConfig.findIndex((t) => t.slug === tabFromUrl);
    return idx === -1 ? 0 : idx;
  })();

  const handleTabChange = (index: number) => {
    const next = tabsConfig[index];
    if (!next) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', next.slug);
    setSearchParams(nextParams, { replace: true }); // avoid polluting history if you want
  };

  return (
    <div className="settings-page">
      <Tabs
        items={tabsConfig.map(({ label, content }) => ({ label, content }))}
        activeIndex={activeIndex}
        onChange={handleTabChange}
      />
    </div>
  );
};

export default SettingsPage;
