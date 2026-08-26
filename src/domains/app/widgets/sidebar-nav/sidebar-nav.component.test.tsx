/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { UserRole } from 'core/api/models';
import SidebarNav from './sidebar-nav.component';
import { SidebarLayoutProvider } from './sidebar-layout.context';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('domains/app/components', () => ({
  UserDropdown: ({ collapsed }: { collapsed?: boolean }) => (
    <button type="button">
      {collapsed ? 'Account footer collapsed' : 'Account footer expanded'}
    </button>
  ),
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

  it('hides Creator-only operational routes for admins', () => {
    renderSidebar([UserRole.ADMIN]);

    expect(screen.queryByRole('link', { name: /customers/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /sales/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /analytics/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /storefront/i })).toBeNull();
    expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument();
  });

  it('uses the Creator MVP navigation and omits removed marketplace items', () => {
    renderSidebar([UserRole.CREATOR]);

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /products/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /customers/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sales/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /storefront/i })).toHaveAttribute(
      'href',
      '/app/storefront',
    );
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /marketing/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /explore/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /messages/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /reviews/i })).toBeNull();
  });

  it('enables Analytics and shows remaining planned IA items without linking to nonexistent routes', () => {
    renderSidebar([UserRole.CREATOR]);

    expect(screen.getByRole('link', { name: /analytics/i })).toHaveAttribute(
      'href',
      '/app/analytics',
    );
    expect(screen.getByRole('button', { name: /help/i })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('renders the account dropdown trigger in the expanded sidebar footer', () => {
    renderSidebar([UserRole.CREATOR]);

    expect(
      screen.getByRole('button', { name: 'Account footer expanded' }),
    ).toBeInTheDocument();
  });

  it('passes collapsed state to the sidebar account footer trigger', () => {
    renderSidebar([UserRole.CREATOR]);

    fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));

    expect(
      screen.getByRole('button', { name: 'Account footer collapsed' }),
    ).toBeInTheDocument();
  });
});
