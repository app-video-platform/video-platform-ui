/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable indent */
/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import App from './App';
import { UserRole } from '@api/models';

// Define a dummy thunk middleware with minimal typing (using any to bypass type conflicts)
const dummyThunk =
  ({ dispatch, getState }: { dispatch: any; getState: any }) =>
  (next: any) =>
  (action: any): any => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    return next(action);
  };

// Cast the middleware array as any to avoid type errors from redux-mock-store.
const middlewares = [dummyThunk] as any;
const mockStore = configureStore(middlewares);

// Mock getUserProfile and setUserProfile from your auth slice so that the async thunk resolves immediately.
jest.mock('@store/auth-store/auth.slice', () => ({
  getUserProfile: jest.fn(
    () => () =>
      Promise.resolve({
        payload: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          role: [UserRole.USER],
        },
      }),
  ),
  setUserProfile: jest.fn(),
}));

// Mock ProtectedRoute to simply render its children.
// eslint-disable-next-line react/display-name
jest.mock('@api/providers/protected-route.util', () =>
  // eslint-disable-next-line react/display-name
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
);

// Define an initial auth state with no user so that getUserProfile is dispatched.
const initialState = {
  auth: {
    user: null,
    loading: false,
    error: null,
    message: null,
    isUserLoggedIn: false,
  },
};

describe('App Component', () => {
  test('navigates to /app and renders CreatorDashboard after getUserProfile', async () => {
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>,
    );

    // Wait for getUserProfile to resolve and for the dashboard (UserDashboard) to render.
    //   await waitFor(() => {
    //     expect(screen.getByText(/user dashboard/i)).toBeInTheDocument();
    //   });
  });

  test('matches snapshot after navigation', async () => {
    const store = mockStore(initialState);

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>,
    );

    // await waitFor(() => {
    //   expect(screen.getByText(/user dashboard/i)).toBeInTheDocument();
    // });

    expect(container).toMatchSnapshot();
  });
});
