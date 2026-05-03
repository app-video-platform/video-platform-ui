import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '@testing-library/jest-dom';

import ProtectedRoute from './protected-route.util';
import { UserRole } from 'core/api/models';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('ProtectedRoute', () => {
  const renderProtectedRoute = (authState: {
    isUserLoggedIn: boolean | null;
    loading: boolean;
    user: { roles: UserRole[] } | null;
  }) => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        auth: {
          isUserLoggedIn: authState.isUserLoggedIn,
          loading: authState.loading,
          user: authState.user,
        },
      }),
    );

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CREATOR]}>
                <div>Allowed content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/auth/login" element={<div>Login page</div>} />
          <Route path="/unauthorized" element={<div>Unauthorized page</div>} />
        </Routes>
      </MemoryRouter>,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children for an authenticated user with an allowed uppercase role', () => {
    renderProtectedRoute({
      isUserLoggedIn: true,
      loading: false,
      user: { roles: [UserRole.CREATOR] },
    });

    expect(screen.getByText('Allowed content')).toBeInTheDocument();
  });

  it('redirects authenticated users without the required role to unauthorized', () => {
    renderProtectedRoute({
      isUserLoggedIn: true,
      loading: false,
      user: { roles: [UserRole.USER] },
    });

    expect(screen.getByText('Unauthorized page')).toBeInTheDocument();
  });

  it('redirects logged-out users to login', () => {
    renderProtectedRoute({
      isUserLoggedIn: false,
      loading: false,
      user: null,
    });

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });
});
