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

  it('uses the Creator MVP navigation and omits removed marketplace items', () => {
    renderSidebar([UserRole.CREATOR]);

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /products/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sales/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /marketing/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /storefront/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /explore/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /messages/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /reviews/i })).toBeNull();
  });

  it('shows planned IA items without linking to nonexistent routes', () => {
    renderSidebar([UserRole.CREATOR]);

    expect(screen.getByRole('button', { name: /customers/i })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('button', { name: /analytics/i })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('button', { name: /help/i })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });
});
