/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { UserRole } from 'core/api/models';
import authReducer from 'core/store/auth-store/auth.slice';
import AppLayout from './app-layout.component';

jest.mock('domains/app/widgets/top-navbar', () => ({
  TopNavbar: () => <nav data-testid="top-navbar">Top navbar</nav>,
}));

jest.mock('domains/app/layouts/creator-app-shell', () => ({
  CreatorAppShell: () => (
    <section data-testid="creator-shell">
      Creator shell
      <Outlet />
    </section>
  ),
}));

const renderLayout = (initialEntry: string, roles = [UserRole.CREATOR]) => {
  const testStore = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: {
          id: 'user-1',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.test',
          roles,
        },
        loading: false,
        error: null,
        isUserLoggedIn: true,
      },
    },
  });

  return render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<div>Creator dashboard</div>} />
            <Route path="explore" element={<div>Explore page</div>} />
            <Route path="products/create" element={<div>Product builder</div>} />
            <Route path="storefront" element={<div>Storefront builder</div>} />
            <Route path="store/:creatorId" element={<div>Public Storefront</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

describe('AppLayout shell ownership', () => {
  it('does not render TopNavbar for Creator management routes', () => {
    renderLayout('/app');

    expect(screen.getByTestId('creator-shell')).toBeInTheDocument();
    expect(screen.queryByTestId('top-navbar')).toBeNull();
  });

  it('does not render TopNavbar for Storefront Builder', () => {
    renderLayout('/app/storefront');

    expect(screen.getByTestId('creator-shell')).toBeInTheDocument();
    expect(screen.queryByTestId('top-navbar')).toBeNull();
  });

  it('keeps TopNavbar for marketplace routes that use shared app navigation', () => {
    renderLayout('/app/explore', [UserRole.USER]);

    expect(screen.getByTestId('top-navbar')).toBeInTheDocument();
    expect(screen.queryByTestId('creator-shell')).toBeNull();
  });

  it('keeps Product Builder outside Creator shell and marketplace top nav', () => {
    renderLayout('/app/products/create');

    expect(screen.getByText('Product builder')).toBeInTheDocument();
    expect(screen.queryByTestId('creator-shell')).toBeNull();
    expect(screen.queryByTestId('top-navbar')).toBeNull();
  });
});
