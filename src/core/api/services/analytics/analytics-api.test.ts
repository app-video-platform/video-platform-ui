import MockAdapter from 'axios-mock-adapter';

import httpClient from 'core/api/http-client';
import { getCreatorAnalyticsOverviewAPI } from './analytics-api';

describe('analytics-api', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it('constructs the creator analytics overview request', async () => {
    mock.onGet(/api\/creator\/analytics\/overview\?.*/).reply(200, {
      period: '7d',
      periodLabel: 'last 7 days',
      previousPeriodLabel: 'previous 7 days',
      metrics: [],
      performance: { series: [], revenueDelta: 0, orderDelta: 0 },
      products: [],
      customerGrowth: {
        summary: { totalCustomers: 0, newCustomers: 0, comparison: '' },
        series: [],
      },
      memberships: { summary: null, series: [] },
      paymentHealth: { metrics: [], series: [] },
    });

    await getCreatorAnalyticsOverviewAPI({ period: '7d' });

    expect(mock.history.get[0].url).toBe(
      'api/creator/analytics/overview?period=7d',
    );
  });
});
