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
          publicEmail: undefined,
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
    mock.onPut('api/user/userInfo').reply((request) => [
      200,
      {
        id: 'creator-1',
        firstName: 'Maya',
        lastName: 'Rivera',
        email: 'maya@example.test',
        roles: [UserRole.CREATOR],
        title: 'Creator educator',
        bio: 'Creator bio',
        website: 'https://maya.example.com',
        ...JSON.parse(request.data ?? '{}'),
      },
    ]);
  });

  afterEach(() => {
    mock.restore();
    jest.clearAllMocks();
  });

  it('loads config and product catalogue through Redux-backed HTTP requests', async () => {
    renderManagement();

    expect(
      screen.getByRole('heading', { name: 'Storefront Builder' }),
    ).toBeInTheDocument();
    expect(
      (await screen.findAllByText('Creator Launch Studio')).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText(/4 public, 2 draft or hidden/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Open public Storefront' }),
    ).toBeInTheDocument();
    expect(mock.history.get.map((request) => request.url)).toEqual(
      expect.arrayContaining([
        'api/products?ownerId=creator-1',
        'api/creator/storefront',
      ]),
    );
  });

  it('shows draft and hidden products as not public while preview hides them', async () => {
    const { container } = renderManagement();

    expect(await screen.findByText('Unannounced Workshop')).toBeInTheDocument();
    expect(screen.getByText('Retired Preset Pack')).toBeInTheDocument();
    expect(screen.getAllByText('Not visible on the public Storefront')).toHaveLength(2);

    const publicRendering = container.querySelector(
      '.storefront-public',
    ) as HTMLElement;
    expect(within(publicRendering).queryByText('Unannounced Workshop')).toBeNull();
    expect(within(publicRendering).queryByText('Retired Preset Pack')).toBeNull();
    expect(
      within(publicRendering).getByText('Creator Lab Membership'),
    ).toBeInTheDocument();
  });

  it('updates featured product in the shared rendering without PATCHing immediately', async () => {
    const { container } = renderManagement();

    await screen.findAllByText('Content Calendar Kit');
    fireEvent.click(screen.getAllByRole('button', { name: 'Set featured' })[0]);

    const preview = container.querySelector('.storefront-public') as HTMLElement;
    expect(
      within(preview).getByRole('heading', {
        name: 'Content Calendar Kit',
        level: 2,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    expect(mock.history.patch).toHaveLength(0);
  });

  it('saves the full draft Storefront config only when Save changes is clicked', async () => {
    renderManagement();

    await screen.findAllByText('Content Calendar Kit');
    fireEvent.click(screen.getAllByRole('button', { name: 'Set featured' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Customize Storefront' }));
    fireEvent.click(screen.getByRole('button', { name: 'Light' }));

    expect(mock.history.patch).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    await waitFor(() => {
      expect(mock.history.patch).toHaveLength(1);
    });
    expect(JSON.parse(mock.history.patch[0].data)).toEqual(
      expect.objectContaining({
        featuredProductId: 'sf-download-1',
        productOrderIds: expect.arrayContaining(['sf-course-1']),
        theme: expect.objectContaining({ appearance: 'LIGHT' }),
      }),
    );
  });

  it('keeps product ordering changes in draft until reset or save', async () => {
    renderManagement();

    await screen.findAllByText('Content Calendar Kit');
    fireEvent.click(
      screen.getByRole('button', { name: 'Move Content Calendar Kit up' }),
    );

    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    expect(mock.history.patch).toHaveLength(0);

    fireEvent.click(screen.getByRole('button', { name: 'Reset changes' }));
    await waitFor(() =>
      expect(screen.queryByText('Unsaved changes')).not.toBeInTheDocument(),
    );
    expect(mock.history.patch).toHaveLength(0);
  });

  it('renders honest unavailable state when Storefront config is unavailable', async () => {
    mock.resetHandlers();
    mock.onAny().reply(404);

    renderManagement();

    expect(
      await screen.findByText('Unable to load or save Storefront data'),
    ).toBeInTheDocument();
    expect(screen.getByText('No products available')).toBeInTheDocument();
  });

  it('edits public email through the profile API without showing login email fallback', async () => {
    renderManagement();

    expect((await screen.findAllByText('Creator Launch Studio')).length).toBeGreaterThan(0);
    expect(screen.queryByText('maya@example.test')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Edit Public Email' }));
    fireEvent.change(screen.getByLabelText('Public Email'), {
      target: { value: 'public@maya.example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(mock.history.put).toHaveLength(1);
    });
    expect(JSON.parse(mock.history.put[0].data)).toEqual({
      publicEmail: 'public@maya.example.com',
    });
    expect(mock.history.patch).toHaveLength(0);
  });

  it('keeps Storefront management creator-only', () => {
    renderManagement([UserRole.USER]);

    expect(
      screen.getByText(/Storefront management is available/i),
    ).toBeInTheDocument();
    expect(mock.history.get).toHaveLength(0);
  });
});
