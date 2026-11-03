/* eslint-disable no-unused-vars */
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { isAxiosError } from 'axios';
import httpClient from 'core/api/http-client';
import { rootReducer } from '../root-reducer';
import { createSessionMiddleware } from '../session.middleware';
import { setSessionFailureHandler } from 'core/api/interceptors/session-lifecycle';
import {
  getUserProfile, signinUser, logout, logoutUser, sessionExpired, sessionUnavailable,
} from './auth.slice';
import { UserRole } from 'core/api/models';

const credentials = { email: 'synthetic@example.invalid', password: 'synthetic-test-only' };
const user = { id: 'A', firstName: 'A', roles: [UserRole.CREATOR] };

describe('session lifecycle through real thunks and HTTP interceptors', () => {
  const mock = new MockAdapter(httpClient);
  const setup = () => {
    const store = configureStore({ reducer: rootReducer, middleware: (getDefault) =>
      getDefault().prepend(createSessionMiddleware()) });
    setSessionFailureHandler((error) => {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      store.dispatch(status === 401 || status === 403 ? sessionExpired() : sessionUnavailable());
    });
    return store;
  };
  afterEach(() => { mock.reset(); setSessionFailureHandler(() => undefined); });
  afterAll(() => mock.restore());

  it('signs in, establishes the profile, then logs out locally before the server completes', async () => {
    const store = setup();
    mock.onPost('api/auth/login').reply(200, 'Login successful');
    mock.onGet('api/user/userInfo').reply(200, user);
    await store.dispatch(signinUser(credentials));
    await store.dispatch(getUserProfile());
    expect(store.getState().auth.sessionStatus).toBe('authenticated');
    expect(store.getState().auth.user?.id).toBe('A');
    let finish!: (response: [number]) => void;
    mock.onPost('api/auth/logout').reply(() => new Promise((resolve) => { finish = resolve; }));
    store.dispatch(logout());
    const pending = store.dispatch(logoutUser());
    expect(store.getState().auth.sessionStatus).toBe('unauthenticated');
    finish([200]);
    await pending;
    expect(store.getState().auth.user).toBeNull();
  });

  it('ignores late sign-in completion after explicit logout and never fetches its profile', async () => {
    const store = setup();
    let finish!: (response: [number, string]) => void;
    mock.onPost('api/auth/login').reply(() => new Promise((resolve) => { finish = resolve; }));
    const pending = store.dispatch(signinUser(credentials));
    store.dispatch(logout());
    finish([200, 'Login successful']);
    await pending;
    expect(store.getState().auth.sessionStatus).toBe('unauthenticated');
    expect(mock.history.get).toHaveLength(0);
  });

  it('uses a recoverable outage for refresh 503 and invalidates for refresh 401', async () => {
    const store = setup();
    mock.onGet('api/user/userInfo').reply(200, user);
    await store.dispatch(getUserProfile());
    mock.onGet('api/user/userInfo').reply(401);
    mock.onPost('api/auth/refresh').reply(503);
    await store.dispatch(getUserProfile());
    expect(store.getState().auth.sessionStatus).toBe('unavailable');
    mock.onPost('api/auth/refresh').reply(401);
    await store.dispatch(getUserProfile());
    expect(store.getState().auth.sessionStatus).toBe('unauthenticated');
    expect(store.getState().auth.user).toBeNull();
  });
});
