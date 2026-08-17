import MockAdapter from 'axios-mock-adapter';

import httpClient from 'core/api/http-client';
import {
  createCommerceCheckoutSessionAPI,
  getCommerceOrderAPI,
} from './commerce-api';

describe('commerce-api', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it('creates a checkout session with only productIds and an idempotency header', async () => {
    mock.onPost('api/commerce/checkout-sessions').reply(200, {
      orderId: 'order-1',
      status: 'PENDING',
      provider: 'fake',
    });

    await createCommerceCheckoutSessionAPI(['product-1', 'product-2'], 'key-1');

    expect(mock.history.post[0].url).toBe('api/commerce/checkout-sessions');
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      productIds: ['product-1', 'product-2'],
    });
    expect(mock.history.post[0].headers?.['Idempotency-Key']).toBe('key-1');
  });

  it('gets a Commerce order by id', async () => {
    mock.onGet('api/commerce/orders/order-1').reply(200, {
      orderId: 'order-1',
      status: 'PAID',
    });

    await getCommerceOrderAPI('order-1');

    expect(mock.history.get[0].url).toBe('api/commerce/orders/order-1');
  });
});
