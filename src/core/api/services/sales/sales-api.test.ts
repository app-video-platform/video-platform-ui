import MockAdapter from 'axios-mock-adapter';

import httpClient from 'core/api/http-client';
import {
  getCreatorOrderDetailAPI,
  getCreatorOrdersPageAPI,
  getCreatorSalesSummaryAPI,
} from './sales-api';

describe('sales-api', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it('constructs the creator sales summary request', async () => {
    mock.onGet(/api\/creator\/sales\/summary\?.*/).reply(200, {
      period: '7d',
      metrics: [],
    });

    await getCreatorSalesSummaryAPI({ period: '7d' });

    expect(mock.history.get[0].url).toBe('api/creator/sales/summary?period=7d');
  });

  it('constructs the creator orders page request from a typed query', async () => {
    mock.onGet(/api\/creator\/orders\?.*/).reply(200, {
      content: [],
      productOptions: [],
      totalElements: 0,
      totalPages: 1,
      size: 6,
      number: 0,
      first: true,
      last: true,
      empty: true,
    });

    await getCreatorOrdersPageAPI({
      page: 1,
      pageSize: 6,
      search: 'mira',
      status: 'failed',
      product: 'prod-membership-lab',
      period: '7d',
      sort: 'amount-desc',
    });

    expect(mock.history.get[0].url).toBe(
      'api/creator/orders?page=1&pageSize=6&period=7d&sort=amount-desc&search=mira&status=failed&product=prod-membership-lab',
    );
  });

  it('constructs the creator order detail request', async () => {
    mock.onGet('api/creator/orders/ORD-1').reply(200, {
      id: 'ORD-1',
      orderedAt: '2026-08-10T14:32:00.000Z',
      status: 'paid',
      type: 'one-time',
      amountCents: 1000,
      currency: 'EUR',
      customer: { name: 'Customer', email: 'customer@example.test' },
      product: { name: 'Product', type: 'Course' },
      summaryRows: [],
      access: { state: 'granted', label: 'Access granted' },
    });

    await getCreatorOrderDetailAPI('ORD-1');

    expect(mock.history.get[0].url).toBe('api/creator/orders/ORD-1');
  });
});
