import MockAdapter from 'axios-mock-adapter';

import httpClient from 'core/api/http-client';
import { getCreatorDashboardSummaryAPI } from './dashboard-api';

describe('dashboard-api', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it('constructs the creator dashboard summary request', async () => {
    mock.onGet('api/creator/dashboard/summary').reply(200, {
      metrics: [],
      activities: [],
      topProducts: [],
      attentionItems: [],
    });

    await getCreatorDashboardSummaryAPI();

    expect(mock.history.get[0].url).toBe('api/creator/dashboard/summary');
  });
});
