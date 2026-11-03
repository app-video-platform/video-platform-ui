/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import httpClient from 'core/api/http-client';
import authReducer from 'core/store/auth-store/auth.slice';
import ConnectedCalendarTab from './connected-calendar.component';

describe('<ConnectedCalendarTab />', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
    mock.onGet('api/calendars/providers').reply(200, { providers: ['MICROSOFT', 'GOOGLE'] });
  });

  afterEach(() => mock.restore());

  const renderTab = () => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: { auth: {
        user: { id: 'u1', firstName: 'A', lastName: 'B', email: 'a@example.test', roles: [] },
        loading: false, error: null, isUserLoggedIn: true,
      } },
    });
    return render(<Provider store={store}><ConnectedCalendarTab /></Provider>);
  };

  it('shows a safe Microsoft failure, keeps the provider selected, and allows retry', async () => {
    mock.onPost('/api/calendars/connect').replyOnce(400, {
      message: 'sensitive authorization code and redirect data',
    });
    mock.onPost('/api/calendars/connect').reply(200, {
      authorizationUrl: 'https://login.microsoftonline.com/synthetic-consent',
    });
    const open = jest.spyOn(window, 'open').mockImplementation(() => null);
    renderTab();

    await screen.findByRole('option', { name: 'Microsoft' });
    fireEvent.change(screen.getByLabelText('Calendar Providers'), {
      target: { value: 'MICROSOFT' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Connect' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not start microsoft/i);
    expect(screen.getByLabelText('Calendar Providers')).toHaveValue('MICROSOFT');
    expect(screen.queryByText(/sensitive authorization/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Connect' }));
    await waitFor(() => expect(open).toHaveBeenCalledWith(
      'https://login.microsoftonline.com/synthetic-consent', '_blank', 'noopener,noreferrer',
    ));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    open.mockRestore();
  });

  it('rejects a missing authorization URL without opening a window', async () => {
    mock.onPost('/api/calendars/connect').reply(200, {});
    const open = jest.spyOn(window, 'open').mockImplementation(() => null);
    renderTab();
    await screen.findByRole('option', { name: 'Google' });
    fireEvent.change(screen.getByLabelText('Calendar Providers'), {
      target: { value: 'GOOGLE' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Connect' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not start google/i);
    expect(open).not.toHaveBeenCalled();
    open.mockRestore();
  });
});
