import MockAdapter from 'axios-mock-adapter';

import httpClient from 'core/api/http-client';
import {
  getCreatorCustomerDetailAPI,
  getCreatorCustomersPageAPI,
} from './customers-api';

describe('customers-api', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it('constructs the creator customers page request from a typed query', async () => {
    mock.onGet(/api\/creator\/customers\?.*/).reply(200, {
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

    await getCreatorCustomersPageAPI({
      page: 2,
      pageSize: 6,
      search: 'mira',
      status: 'past-due',
      product: 'prod-membership-lab',
      membership: 'past_due',
      sort: 'spend-desc',
    });

    expect(mock.history.get[0].url).toBe(
      'api/creator/customers?page=2&pageSize=6&sort=spend-desc&search=mira&status=past-due&product=prod-membership-lab&membership=past_due',
    );
  });

  it('constructs the creator customer detail request', async () => {
    mock.onGet('api/creator/customers/cust-1').reply(200, {
      id: 'cust-1',
      email: 'customer@example.test',
      relationshipStatus: 'buyer',
      membershipState: 'none',
      products: [],
      totalSpendCents: 0,
      ordersCount: 0,
      activeAccessCount: 0,
      activity: [],
      purchases: [],
      access: [],
    });

    await getCreatorCustomerDetailAPI('cust-1');

    expect(mock.history.get[0].url).toBe('api/creator/customers/cust-1');
  });
});
