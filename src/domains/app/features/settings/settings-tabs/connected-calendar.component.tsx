import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Input, Button, Select, SelectOption, InfoPopover } from '@shared/ui';
import {
  connectCalendarAPI,
  getAllCalendarProvidersAPI,
} from 'core/api/services';
import { SettingsSection } from '../settings-section';
import { selectAuthUser } from 'core/store/auth-store';
import { PageHeader } from 'domains/app/components';

const ConnectedCalendarTab: React.FC = () => {
  const user = useSelector(selectAuthUser);

  const [calendarProviders, setCalendarProviders] = useState<SelectOption[]>(
    [],
  );
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [email, setEmail] = useState<string>(user?.email ?? '');

  useEffect(() => {
    let isMounted = true; // optional safety to avoid setting state after unmount

    (async () => {
      try {
        const providers = await getAllCalendarProvidersAPI(); // string[]

        console.log('providers', providers);

        if (isMounted) {
          const options: SelectOption[] = providers.map((provider) => ({
            value: provider,
            label: provider.charAt(0) + provider.slice(1).toLowerCase(), // e.g. "Google"
          }));
          setCalendarProviders(options);
        }
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCalendarConnect = () => {
    console.log('Tryna connect', selectedProvider, email);

    connectCalendarAPI({ provider: selectedProvider, loginHint: email }).then(
      (data) => {
        console.log('data', data);
        window.open(data.authorizationUrl, '_blank');
      },
    );
  };

  return (
    <div className="connected-calendar-tab">
      <PageHeader
        title="Connected Calendars"
        subTitle="Add and manage your connected calendars"
      />

      <SettingsSection title="Calendars" subTitle="Connect a calendar provider">
        <div className="settings-input-row">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            type="text"
            name="email"
          />
          <InfoPopover className="info-popover" position="left">
            <span>
              The email connected to your calendar. Usually your main email, but
              if you are using another one for calendars, you can change it
              here.
            </span>
          </InfoPopover>
        </div>
        <div className="connect-calendar-row">
          <Select
            options={calendarProviders}
            name="providers"
            label="Calendar Providers"
            value={selectedProvider}
            customClassName="calendar-selector"
            onChange={(e: { target: { value: string } }) =>
              setSelectedProvider(e.target.value)
            }
          />

          <Button
            type="button"
            variant="primary"
            className="connect-calendar-btn"
            onClick={() => handleCalendarConnect()}
            disabled={!selectedProvider}
          >
            Connect
          </Button>
        </div>
      </SettingsSection>

      {/* <div className="connect-provider">
        <h3>{selectedProvider}</h3>
        <Input
          value={email}
          label="Email"
          name="email"
          onChange={(e: { target: { value: string } }) =>
            setEmail(e.target.value)
          }
        />
        <Button
          type="button"
          variant="primary"
          onClick={() => handleCalendarConnect()}
        >
          Connect
        </Button>
      </div> */}
    </div>
  );
};

export default ConnectedCalendarTab;
