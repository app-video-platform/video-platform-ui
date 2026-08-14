/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { UserRole } from 'core/api/models';
import authReducer from 'core/store/auth-store/auth.slice';
import { SidebarLayoutProvider } from 'domains/app/widgets/sidebar-nav';
import CreatorAppShell from './creator-app-shell.component';

const renderShell = (initialEntry: string) => {
  const testStore = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: {
          id: 'creator-1',
          firstName: 'Maya',
          lastName: 'Rivera',
          email: 'maya@example.test',
          roles: [UserRole.CREATOR],
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
        <SidebarLayoutProvider>
          <Routes>
            <Route path="/app/storefront" element={<CreatorAppShell />}>
              <Route index element={<div>Storefront builder</div>} />
            </Route>
          </Routes>
        </SidebarLayoutProvider>
      </MemoryRouter>
    </Provider>,
  );
};

describe('CreatorAppShell', () => {
  it('collapses the Creator sidebar on the Storefront builder route', async () => {
    renderShell('/app/storefront');

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Expand sidebar' }),
      ).toBeInTheDocument();
    });
  });

  it('opens the existing user dropdown from the sidebar footer', async () => {
    renderShell('/app/storefront');

    const accountButton = await screen.findByRole('button', {
      name: 'Open account menu for Maya Rivera',
    });
    fireEvent.click(accountButton);

    expect(screen.getByText('maya@example.test')).toBeInTheDocument();
    expect(screen.getByText('Role: CREATOR')).toBeInTheDocument();
  });
});
