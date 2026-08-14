/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import httpClient from 'core/api/http-client';
import { registerCreatorStorefrontTestMocks } from 'core/api/test-fixtures/creator-storefront-http.mock';
import storefrontReducer from 'core/store/storefront-store/storefront.slice';
import StorefrontPage from './storefront-page.component';

jest.mock('../../../../assets/image-placeholder.png', () => 'placeholder.png');

const renderPublicRoute = (initialEntry = '/app/store/creator-1') => {
  const testStore = configureStore({
    reducer: {
      storefront: storefrontReducer,
    },
  });

  return render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/app/store/:creatorId" element={<StorefrontPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

describe('StorefrontPage', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
    registerCreatorStorefrontTestMocks(mock);
  });

  afterEach(() => {
    mock.restore();
  });

  it('loads the public route by creator id and applies published-only visibility', async () => {
    renderPublicRoute();

    expect(screen.getByText('Loading Storefront')).toBeInTheDocument();

    expect(
      (await screen.findAllByText('Creator Launch Studio')).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText('Content Calendar Kit')).toBeInTheDocument();
    expect(screen.getByText('Creator Lab Membership')).toBeInTheDocument();
    expect(screen.queryByText('Unannounced Workshop')).toBeNull();
    expect(screen.queryByText('Retired Preset Pack')).toBeNull();
    expect(mock.history.get[0].url).toBe('api/storefronts/creator-1');
  });

  it('renders empty public Storefront state from the public read model', async () => {
    renderPublicRoute('/app/store/empty-creator');

    expect((await screen.findAllByText('Quiet Creator')).length).toBeGreaterThan(0);
    expect(screen.getByText('No products are public right now')).toBeInTheDocument();
    expect(screen.queryByText('Featured product')).toBeNull();
  });

  it('renders honest unavailable state when the backend contract is missing', async () => {
    mock.resetHandlers();
    mock.onAny().reply(404);

    renderPublicRoute('/app/store/missing-creator');

    expect(await screen.findByText('Storefront unavailable')).toBeInTheDocument();
    expect(screen.queryByText('Creator Launch Studio')).toBeNull();
  });
});
