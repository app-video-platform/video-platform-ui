/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { UserRole } from 'core/api/models';

import CreatorStorefrontPage from './storefront-management-page.component';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../../../../assets/image-placeholder.png', () => 'placeholder.png');

const renderManagement = () => {
  const state = {
    auth: {
      user: {
        id: 'creator-1',
        firstName: 'Maya',
        lastName: 'Rivera',
        email: 'maya@example.test',
        roles: [UserRole.CREATOR],
        title: 'Creator educator',
        bio: 'Creator bio',
      },
    },
    products: {
      productSummaries: null,
      loading: false,
      error: null,
    },
  };

  (useDispatch as unknown as jest.Mock).mockReturnValue(jest.fn());
  (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
    selector(state),
  );

  return render(
    <MemoryRouter>
      <CreatorStorefrontPage />
    </MemoryRouter>,
  );
};

describe('CreatorStorefrontPage', () => {
  const originalUseMocks = process.env.REACT_APP_USE_MOCKS;

  beforeEach(() => {
    process.env.REACT_APP_USE_MOCKS = 'true';
  });

  afterEach(() => {
    process.env.REACT_APP_USE_MOCKS = originalUseMocks;
    jest.clearAllMocks();
  });

  it('shows draft and hidden products as not public while preview hides them', () => {
    renderManagement();

    expect(screen.getByText('Unannounced Workshop')).toBeInTheDocument();
    expect(screen.getByText('Retired Preset Pack')).toBeInTheDocument();
    expect(screen.getAllByText('Not visible on the public Storefront')).toHaveLength(2);

    const preview = screen.getByLabelText('Live Storefront preview');
    expect(within(preview).queryByText('Unannounced Workshop')).toBeNull();
    expect(within(preview).queryByText('Retired Preset Pack')).toBeNull();
    expect(within(preview).getByText('Creator Lab Membership')).toBeInTheDocument();
  });

  it('lets creators change the featured product in the shared preview', () => {
    renderManagement();

    fireEvent.click(screen.getAllByRole('button', { name: /set featured/i })[0]);

    const preview = screen.getByLabelText('Live Storefront preview');
    expect(
      within(preview).getByRole('heading', {
        name: 'Content Calendar Kit',
        level: 2,
      }),
    ).toBeInTheDocument();
  });
});
