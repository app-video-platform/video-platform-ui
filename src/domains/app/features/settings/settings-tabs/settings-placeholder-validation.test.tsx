/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import authReducer from 'core/store/auth-store/auth.slice';
import SettingsSubscriptionsTab from './settings-subscriptions-tab.component';
import SettingsPrivacyTab from './settings-privacy-tab.component';
import SettingsNotificationsTab from './settings-notifications-tab.component';

const tabs = [
  ['Subscriptions', SettingsSubscriptionsTab],
  ['Privacy', SettingsPrivacyTab],
  ['Notifications', SettingsNotificationsTab],
] as const;

describe.each(tabs)('%s placeholder validation', (label, Component) => {
  it('validates on blur, associates the message, and clears it after correction', async () => {
    const store = configureStore({ reducer: { auth: authReducer } });
    render(
      <Provider store={store}>
        <Component />
      </Provider>,
    );

    const input = screen.getByRole('textbox', { name: label });
    fireEvent.change(input, { target: { value: 'x' } });
    fireEvent.blur(input);
    expect(await screen.findByText(/at least 2 characters/i)).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'title-error');

    fireEvent.change(input, { target: { value: 'ok' } });
    await waitFor(() => expect(screen.queryByText(/at least 2 characters/i)).not.toBeInTheDocument());

    fireEvent.change(input, { target: { value: 'x'.repeat(51) } });
    fireEvent.blur(input);
    expect(await screen.findByText(/50 characters/i)).toBeInTheDocument();
  });
});
