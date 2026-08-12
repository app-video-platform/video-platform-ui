/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import httpClient from 'core/api/http-client';
import { UserRole } from 'core/api/models';
import { registerCreatorStorefrontTestMocks } from 'core/api/test-fixtures/creator-storefront-http.mock';
import authReducer from 'core/store/auth-store/auth.slice';
import productsReducer from 'core/store/product-store/product.slice';
import storefrontReducer from 'core/store/storefront-store/storefront.slice';
import CreatorStorefrontPage from './storefront-management-page.component';

jest.mock('../../../../../assets/image-placeholder.png', () => 'placeholder.png');

const renderManagement = (roles = [UserRole.CREATOR]) => {
  const testStore = configureStore({
    reducer: {
      auth: authReducer,
      products: productsReducer,
      storefront: storefrontReducer,
    },
    preloadedState: {
      auth: {
        user: {
          id: 'creator-1',
          firstName: 'Maya',
          lastName: 'Rivera',
          email: 'maya@example.test',
          roles,
          title: 'Creator educator',
          bio: 'Creator bio',
          website: 'https://maya.example.com',
        },
        loading: false,
        error: null,
        isUserLoggedIn: true,
      },
    },
  });

  return render(
    <Provider store={testStore}>
      <MemoryRouter>
        <CreatorStorefrontPage />
      </MemoryRouter>
    </Provider>,
  );
};

describe('CreatorStorefrontPage', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
    registerCreatorStorefrontTestMocks(mock);
  });

  afterEach(() => {
    mock.restore();
    jest.clearAllMocks();
  });

  it('loads config and product catalogue through Redux-backed HTTP requests', async () => {
    renderManagement();

    expect(screen.getByRole('heading', { name: 'Storefront' })).toBeInTheDocument();
    expect(
      (await screen.findAllByText('Creator Launch Studio')).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText('Public with products')).toBeInTheDocument();
    expect(screen.getByText('/app/store/creator-1')).toBeInTheDocument();
    expect(mock.history.get.map((request) => request.url)).toEqual(
      expect.arrayContaining([
        'api/products?ownerId=creator-1',
        'api/creator/storefront',
      ]),
    );
  });

  it('shows draft and hidden products as not public while preview hides them', async () => {
    renderManagement();

    expect(await screen.findByText('Unannounced Workshop')).toBeInTheDocument();
    expect(screen.getByText('Retired Preset Pack')).toBeInTheDocument();
    expect(screen.getAllByText('Not visible on the public Storefront')).toHaveLength(2);

    const preview = screen.getByLabelText('Live Storefront preview');
    expect(within(preview).queryByText('Unannounced Workshop')).toBeNull();
    expect(within(preview).queryByText('Retired Preset Pack')).toBeNull();
    expect(within(preview).getByText('Creator Lab Membership')).toBeInTheDocument();
  });

  it('persists featured product changes and updates the shared preview', async () => {
    renderManagement();

    await screen.findAllByText('Content Calendar Kit');
    fireEvent.click(screen.getAllByRole('button', { name: 'Set featured' })[0]);

    const preview = screen.getByLabelText('Live Storefront preview');
    expect(
      within(preview).getByRole('heading', {
        name: 'Content Calendar Kit',
        level: 2,
      }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(mock.history.patch).toHaveLength(1);
    });
    expect(JSON.parse(mock.history.patch[0].data).featuredProductId).toBe(
      'sf-download-1',
    );
  });

  it('persists product ordering changes', async () => {
    renderManagement();

    await screen.findAllByText('Content Calendar Kit');
    fireEvent.click(
      screen.getByRole('button', { name: 'Move Content Calendar Kit up' }),
    );

    await waitFor(() => {
      expect(mock.history.patch).toHaveLength(1);
    });
    expect(JSON.parse(mock.history.patch[0].data).productOrderIds.slice(0, 2)).toEqual(
      ['sf-download-1', 'sf-course-1'],
    );
  });

  it('renders honest unavailable state when Storefront config is unavailable', async () => {
    mock.resetHandlers();
    mock.onAny().reply(404);

    renderManagement();

    expect(
      await screen.findByText('Unable to load Storefront data'),
    ).toBeInTheDocument();
    expect(screen.getByText('No products available')).toBeInTheDocument();
  });

  it('keeps Storefront management creator-only', () => {
    renderManagement([UserRole.USER]);

    expect(
      screen.getByText(/Storefront management is available/i),
    ).toBeInTheDocument();
    expect(mock.history.get).toHaveLength(0);
  });
});
