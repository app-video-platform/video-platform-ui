/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { UserRole } from 'core/api/models';
import SidebarNav from './sidebar-nav.component';
import { SidebarLayoutProvider } from './sidebar-layout.context';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

const renderSidebar = (roles: UserRole[]) => {
  const state = {
    auth: {
      user: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.test',
        roles,
      },
    },
  };

  (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
    selector(state),
  );

  return render(
    <MemoryRouter>
      <SidebarLayoutProvider>
        <SidebarNav />
      </SidebarLayoutProvider>
    </MemoryRouter>,
  );
};

describe('SidebarNav', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows the admin route for admins', () => {
    renderSidebar([UserRole.ADMIN]);

    expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument();
  });

  it('hides the admin route for non-admin users', () => {
    renderSidebar([UserRole.CREATOR]);

    expect(screen.queryByRole('link', { name: /admin/i })).toBeNull();
  });
});
