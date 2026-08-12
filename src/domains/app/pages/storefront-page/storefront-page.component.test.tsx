/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { ProductMinimised } from 'core/api/models';
import { getAllProductsMinimalByUserAPI } from 'core/api/services';

import StorefrontPage from './storefront-page.component';

jest.mock('core/api/services', () => ({
  getAllProductsMinimalByUserAPI: jest.fn(),
}));

jest.mock('../../../../assets/image-placeholder.png', () => 'placeholder.png');

const renderPublicRoute = () =>
  render(
    <MemoryRouter initialEntries={['/app/store/creator-1']}>
      <Routes>
        <Route path="/app/store/:creatorId" element={<StorefrontPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe('StorefrontPage', () => {
  const originalUseMocks = process.env.REACT_APP_USE_MOCKS;
  const products: ProductMinimised[] = [
    {
      id: 'published-course',
      title: 'Published Course',
      type: 'COURSE',
      status: 'PUBLISHED',
      price: 120,
      createdByName: 'Ari Lane',
      createdByTitle: 'Video educator',
    },
    {
      id: 'draft-download',
      title: 'Draft Download',
      type: 'DOWNLOAD',
      status: 'DRAFT',
      price: 20,
    },
    {
      id: 'hidden-membership',
      title: 'Hidden Membership',
      type: 'MEMBERSHIP',
      status: 'HIDDEN',
      price: 35,
    },
  ];

  beforeEach(() => {
    process.env.REACT_APP_USE_MOCKS = 'false';
    (getAllProductsMinimalByUserAPI as jest.Mock).mockResolvedValue(products);
  });

  afterEach(() => {
    process.env.REACT_APP_USE_MOCKS = originalUseMocks;
    jest.clearAllMocks();
  });

  it('loads the public route by creator id and applies published-only visibility', async () => {
    renderPublicRoute();

    expect(screen.getByText('Loading Storefront')).toBeInTheDocument();

    await waitFor(() => {
      expect(getAllProductsMinimalByUserAPI).toHaveBeenCalledWith('creator-1');
    });

    expect((await screen.findAllByText('Published Course')).length).toBeGreaterThan(0);
    expect(screen.queryByText('Draft Download')).toBeNull();
    expect(screen.queryByText('Hidden Membership')).toBeNull();
  });
});
