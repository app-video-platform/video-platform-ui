import React, { useEffect, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes, useNavigate, Outlet } from 'react-router-dom';
import { AxiosError } from 'axios';
import '@testing-library/jest-dom';
import authReducer, {
  getUserProfile, logout, logoutUser, setUserProfile, updateUserDetails,
} from '../store/auth-store/auth.slice';
import { getUserProfileAPI } from '../api/services/user/user-api';
import ProtectedRoute from './protected-route.util';
import AppInitializer from './app-initializer.util';
import AppLayout from 'domains/app/pages/app-layout/app-layout.component';
import { User, UserRole } from '../api/models';

jest.mock('domains/app/widgets/top-navbar', () => ({ TopNavbar: () => <header>Public navigation</header> }));
jest.mock('domains/app/layouts/creator-app-shell', () => {
  const { Outlet } = jest.requireActual<typeof import('react-router-dom')>('react-router-dom');
  const MockShell = () => <section aria-label="Creator shell"><Outlet /></section>;
  return { CreatorAppShell: MockShell };
});

jest.mock('../api/services/user/user-api', () => ({ getUserProfileAPI: jest.fn() }));
const profile = getUserProfileAPI as jest.MockedFunction<typeof getUserProfileAPI>;
const user = { id: 'A', firstName: 'A', roles: [UserRole.CREATOR] } as User;
const failure = (status: number) => new AxiosError('Unavailable', undefined, undefined, undefined, {
  status, data: {}, statusText: '', headers: {}, config: {} as never,
});

const setup = (authenticated = false, bootstrap = false) => {
  const store = configureStore({ reducer: { auth: authReducer } });
  if (authenticated) {
    store.dispatch(setUserProfile(user));
  }
  const mounts = jest.fn();
  const Workspace = () => {
    const [value, setValue] = useState('unsaved draft');
    const navigate = useNavigate();
    useEffect(() => { mounts(); }, []);
    return <><input aria-label="Local work" value={value} onChange={(event) => setValue(event.target.value)} />
      <button onClick={() => navigate(-1)}>Back</button></>;
  };
  const Navigation = () => {
    const navigate = useNavigate();
    return <><button onClick={() => navigate('/app/analytics')}>Other route</button>
      <button onClick={() => navigate('/app/settings')}>Return settings</button></>;
  };
  const view = <Routes>
    <Route element={<AppLayout />}>
      <Route element={<ProtectedRoute allowedRoles={[UserRole.CREATOR]}><Outlet /></ProtectedRoute>}>
        <Route path="/app/settings" element={<Workspace />} />
        <Route path="/app/analytics" element={<h2>Other private workspace</h2>} />
      </Route>
    </Route>
    <Route path="/auth/login" element={<div>Sign in destination</div>} />
    <Route path="/unauthorized" element={<div>Denied destination</div>} />
  </Routes>;
  render(<Provider store={store}><MemoryRouter initialEntries={['/app/settings']}>
    <Navigation />{bootstrap ? <AppInitializer>{view}</AppInitializer> : view}
  </MemoryRouter></Provider>);
  return { store, mounts };
};

describe('protected session recovery', () => {
  beforeEach(() => { profile.mockReset(); });

  it('never mounts protected content during initial resolution', () => {
    const { mounts } = setup();
    expect(mounts).not.toHaveBeenCalled();
    expect(screen.queryByLabelText('Local work')).toBeNull();
    expect(screen.queryByText('Sign in destination')).toBeNull();
  });

  it.each([503, undefined])('recovers initial profile failure (%s) by explicit retry without login', async (status) => {
    profile.mockRejectedValueOnce(status ? failure(status) : new Error('Network failed'));
    profile.mockResolvedValueOnce(user);
    const { mounts } = setup(false, true);
    await screen.findByRole('alert', { name: 'Session unavailable' });
    expect(mounts).not.toHaveBeenCalled();
    expect(screen.queryByText('Sign in destination')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(await screen.findByLabelText('Local work')).toBeVisible();
    expect(mounts).toHaveBeenCalledTimes(1);
  });

  it('hides an existing workspace on outage and preserves local edits through recovery', async () => {
    const { store, mounts } = setup(true);
    fireEvent.change(screen.getByLabelText('Local work'), { target: { value: 'keep this local edit' } });
    profile.mockRejectedValueOnce(failure(503));
    await act(async () => { await store.dispatch(getUserProfile()); });
    expect(screen.getByLabelText('Local work')).not.toBeVisible();
    expect(screen.getByRole('alert', { name: 'Session unavailable' })).toBeVisible();
    profile.mockResolvedValueOnce(user);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Retry' })); });
    expect(screen.getByLabelText('Local work')).toBeVisible();
    expect(screen.getByLabelText('Local work')).toHaveValue('keep this local edit');
    expect(mounts).toHaveBeenCalledTimes(1);
  });

  it('discards local work at an account boundary even when React batches the transition', () => {
    const { store, mounts } = setup(true);
    fireEvent.change(screen.getByLabelText('Local work'), { target: { value: 'private A draft' } });
    act(() => {
      store.dispatch(logout());
      store.dispatch(setUserProfile({ ...user, id: 'B', firstName: 'B' }));
    });
    expect(screen.getByLabelText('Local work')).toHaveValue('unsaved draft');
    expect(mounts).toHaveBeenCalledTimes(2);
  });

  it('does not mount new protected children when navigating away and back during an outage', async () => {
    const { store, mounts } = setup(true);
    profile.mockRejectedValueOnce(failure(503));
    await act(async () => { await store.dispatch(getUserProfile()); });
    fireEvent.click(screen.getByRole('button', { name: 'Other route' }));
    expect(screen.queryByText('Other private workspace')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Return settings' }));
    expect(screen.queryByLabelText('Local work')).toBeNull();
    expect(mounts).toHaveBeenCalledTimes(1);
  });

  it('does not unmount authorized routes for profile mutation loading', () => {
    const { store, mounts } = setup(true);
    act(() => { store.dispatch(updateUserDetails.pending('save', { userId: 'A' })); });
    expect(screen.getByLabelText('Local work')).toBeVisible();
    expect(mounts).toHaveBeenCalledTimes(1);
  });

  it('redirects a genuine invalid session instead of offering outage recovery', async () => {
    profile.mockRejectedValueOnce(failure(401));
    const { store } = setup(true);
    await act(async () => { await store.dispatch(getUserProfile()); });
    expect(screen.getByText('Sign in destination')).toBeVisible();
    expect(screen.queryByLabelText('Local work')).toBeNull();
    expect(store.getState().auth.user).toBeNull();
  });

  it.each(['local', 'pending', 'failed', 'success'])('does not retain protected content after %s logout', (outcome) => {
    const { store } = setup(true);
    act(() => {
      if (outcome === 'local') {
        store.dispatch(logout());
      } else {
        store.dispatch(logoutUser.pending('logout'));
        if (outcome === 'failed') {
          store.dispatch(logoutUser.rejected(new Error('Network'), 'logout'));
        } else if (outcome === 'success') {
          store.dispatch(logoutUser.fulfilled(undefined, 'logout'));
        }
      }
    });
    expect(screen.getByText('Sign in destination')).toBeVisible();
    expect(screen.queryByLabelText('Local work')).toBeNull();
  });
});
