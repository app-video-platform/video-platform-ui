import MockAdapter from 'axios-mock-adapter';

import httpClient from 'core/api/http-client';
import {
  getCreatorStorefrontConfigAPI,
  getPublicStorefrontAPI,
  updateCreatorStorefrontConfigAPI,
} from './storefront-api';

describe('storefront-api', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it('constructs the public Storefront read-model request', async () => {
    mock.onGet('api/storefronts/creator-1').reply(200, {
      id: 'storefront-1',
      creator: { id: 'creator-1', displayName: 'Creator' },
      products: [],
    });

    await getPublicStorefrontAPI('creator-1');

    expect(mock.history.get[0].url).toBe('api/storefronts/creator-1');
  });

  it('constructs the creator Storefront config request', async () => {
    mock.onGet('api/creator/storefront').reply(200, {
      featuredProductId: 'product-1',
      productOrderIds: ['product-1'],
    });

    await getCreatorStorefrontConfigAPI();

    expect(mock.history.get[0].url).toBe('api/creator/storefront');
  });

  it('constructs the creator Storefront config update request', async () => {
    mock.onPatch('api/creator/storefront').reply(200, {
      featuredProductId: 'product-2',
      productOrderIds: ['product-2', 'product-1'],
    });

    await updateCreatorStorefrontConfigAPI({
      featuredProductId: 'product-2',
      productOrderIds: ['product-2', 'product-1'],
      theme: {
        appearance: 'DARK',
        accentColor: '#ffbd41',
        typography: 'MODERN',
      },
    });

    expect(mock.history.patch[0].url).toBe('api/creator/storefront');
    expect(JSON.parse(mock.history.patch[0].data)).toEqual({
      featuredProductId: 'product-2',
      productOrderIds: ['product-2', 'product-1'],
      theme: {
        appearance: 'DARK',
        accentColor: '#ffbd41',
        typography: 'MODERN',
      },
    });
  });
});
