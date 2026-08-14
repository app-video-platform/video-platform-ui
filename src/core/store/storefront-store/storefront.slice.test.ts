import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';

import httpClient from 'core/api/http-client';
import { registerCreatorStorefrontTestMocks } from 'core/api/test-fixtures/creator-storefront-http.mock';
import storefrontReducer, {
  fetchCreatorStorefrontConfig,
  fetchPublicStorefront,
  updateCreatorStorefrontConfig,
} from './storefront.slice';

describe('storefront slice', () => {
  let mock: MockAdapter;

  const createStore = () =>
    configureStore({
      reducer: {
        storefront: storefrontReducer,
      },
    });

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
    registerCreatorStorefrontTestMocks(mock);
  });

  afterEach(() => {
    mock.restore();
  });

  it('stores a fetched public Storefront by creator id', async () => {
    const testStore = createStore();

    await testStore.dispatch(fetchPublicStorefront('creator-1'));

    const state = testStore.getState().storefront;
    expect(state.publicLoading).toBe(false);
    expect(state.publicError).toBeNull();
    expect(state.publicByCreatorId['creator-1'].creator.displayName).toBe(
      'Maya Rivera',
    );
  });

  it('stores fetched creator Storefront config', async () => {
    const testStore = createStore();

    await testStore.dispatch(fetchCreatorStorefrontConfig());

    const state = testStore.getState().storefront;
    expect(state.configLoading).toBe(false);
    expect(state.configError).toBeNull();
    expect(state.creatorConfig?.featuredProductId).toBe('sf-course-1');
  });

  it('stores updated creator Storefront config', async () => {
    const testStore = createStore();

    await testStore.dispatch(
      updateCreatorStorefrontConfig({
        featuredProductId: 'sf-download-1',
        productOrderIds: ['sf-download-1', 'sf-course-1'],
        theme: {
          appearance: 'DARK',
          accentColor: '#ffbd41',
          typography: 'MODERN',
        },
      }),
    );

    const state = testStore.getState().storefront;
    expect(state.configSaveLoading).toBe(false);
    expect(state.configSaveError).toBeNull();
    expect(state.creatorConfig?.featuredProductId).toBe('sf-download-1');
    expect(state.creatorConfig?.productOrderIds[0]).toBe('sf-download-1');
  });

  it('stores loading errors independently for public and config fetches', async () => {
    mock.resetHandlers();
    mock.onAny().reply(404);
    const testStore = createStore();

    await testStore.dispatch(fetchPublicStorefront('missing-creator'));
    await testStore.dispatch(fetchCreatorStorefrontConfig());

    const state = testStore.getState().storefront;
    expect(state.publicLoading).toBe(false);
    expect(state.configLoading).toBe(false);
    expect(state.publicError).not.toBeNull();
    expect(state.configError).not.toBeNull();
  });
});
