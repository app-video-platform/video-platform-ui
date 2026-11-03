/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import httpClient from 'core/api/http-client';
import { UserRole } from 'core/api/models';
import authReducer from 'core/store/auth-store/auth.slice';
import SettingsProfileTab from './settings-profile-tab.component';

const toastSuccess = jest.fn();
const toastError = jest.fn();
jest.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
  },
}));

describe('<SettingsProfileTab />', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
    toastSuccess.mockClear();
    toastError.mockClear();
  });
  afterEach(() => mock.restore());

  const renderTab = () => {
    const user = {
      id: 'profile-1', firstName: 'Ari', lastName: 'Creator', email: 'ari@example.test',
      roles: [UserRole.CREATOR], bio: '', title: 'Creator', website: '',
    };
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: { auth: { user, loading: false, error: null, isUserLoggedIn: true, sessionStatus: 'authenticated' as const } },
    });
    return render(<Provider store={store}><SettingsProfileTab /></Provider>);
  };

  it('validates fields before dispatching and permits optional empty fields', async () => {
    mock.onPut('api/user/userInfo').reply(200, {
      id: 'profile-1', firstName: 'Ari', lastName: 'Creator', email: 'ari@example.test',
      roles: [UserRole.CREATOR], bio: '', title: 'Creator', website: '',
    });
    renderTab();
    fireEvent.change(screen.getByRole('textbox', { name: 'Bio' }), { target: { value: 'Too short' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Tagline / Mission' }), { target: { value: 'x' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Website' }), { target: { value: 'invalid url' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText(/at least 30 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 10 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid url/i)).toBeInTheDocument();
    expect(mock.history.put).toHaveLength(0);
  });

  it('persists valid values and reports success only after the API fulfills', async () => {
    mock.onPut('api/user/userInfo').reply((request) => [200, {
      id: 'profile-1', firstName: 'Ari', lastName: 'Creator', email: 'ari@example.test',
      roles: [UserRole.CREATOR], ...JSON.parse(request.data ?? '{}'),
    }]);
    renderTab();
    fireEvent.change(screen.getByRole('textbox', { name: 'Bio' }), {
      target: { value: 'A sufficiently detailed creator biography for the public profile.' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'Tagline / Mission' }), {
      target: { value: 'Helping creators grow' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'Website' }), {
      target: { value: 'https://ari.example.test' },
    });
    const profileForm = screen.getByRole('button', { name: 'Save' }).closest('form');
    expect(profileForm).not.toBeNull();
    fireEvent.submit(profileForm as HTMLFormElement);

    await waitFor(() => expect(mock.history.put).toHaveLength(1));
    const payload = JSON.parse(mock.history.put[0].data);
    expect(payload.bio).toContain('sufficiently detailed');
    expect(payload.taglineMission).toBe('Helping creators grow');
    expect(payload.website).toBe('https://ari.example.test');
    expect(payload.publicEmail).toBe('');
    expect(toastSuccess).toHaveBeenCalledWith('Profile saved.');
    expect(toastSuccess).not.toHaveBeenCalledWith('Product created successfully!');
  });

  it('reports a rejected save without a success notification', async () => {
    mock.onPut('api/user/userInfo').reply(503);
    renderTab();
    fireEvent.change(screen.getByRole('textbox', { name: 'Bio' }), {
      target: { value: 'A sufficiently detailed creator biography for the public profile.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(toastError).toHaveBeenCalledWith('Could not save your profile. Please try again.'));
    expect(toastSuccess).not.toHaveBeenCalled();
  });
});
