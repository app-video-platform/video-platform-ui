import React, { useEffect, useState } from 'react';

import {
  GalSelectOption,
  GalSelect,
  GalFormInput,
  GalButton,
} from '@shared/ui';
import { connectCalendarAPI, getAllCalendarProvidersAPI } from '@api/services';

const ConnectedCalendarTab: React.FC = () => {
  const [calendarProviders, setCalendarProviders] = useState<GalSelectOption[]>(
    [],
  );
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    let isMounted = true; // optional safety to avoid setting state after unmount

    (async () => {
      try {
        const providers = await getAllCalendarProvidersAPI(); // string[]
        if (isMounted) {
          const options: GalSelectOption[] = providers.map((provider) => ({
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
      () => console.log('CONNECTED'),
    );
  };

  return (
    <div className="connected-calendar-tab">
      <div className="connected-calendars"></div>

      <GalSelect
        options={calendarProviders}
        name="providers"
        label="Calendar Providers"
        value={selectedProvider}
        onChange={(e: { target: { value: string } }) =>
          setSelectedProvider(e.target.value)
        }
      />

      <div className="connect-provider">
        <h3>{selectedProvider}</h3>
        <GalFormInput
          value={email}
          label="Email"
          name="email"
          onChange={(e: { target: { value: string } }) =>
            setEmail(e.target.value)
          }
        />
        <GalButton
          text="Connect"
          type="primary"
          onClick={() => handleCalendarConnect()}
        />
      </div>
    </div>
  );
};

export default ConnectedCalendarTab;
