import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';

import httpClient from 'core/api/http-client';
import { registerCreatorAnalyticsTestMocks } from 'core/api/test-fixtures/creator-analytics-http.mock';
import analyticsReducer, {
  fetchCreatorAnalyticsOverview,
} from './analytics.slice';

describe('analytics slice', () => {
  let mock: MockAdapter;

  const createStore = () =>
    configureStore({
      reducer: {
        analytics: analyticsReducer,
      },
    });

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
    registerCreatorAnalyticsTestMocks(mock);
  });

  afterEach(() => {
    mock.restore();
  });

  it('stores a fetched analytics overview', async () => {
    const testStore = createStore();

    await testStore.dispatch(fetchCreatorAnalyticsOverview({ period: '7d' }));

    const state = testStore.getState().analytics;
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.overview?.period).toBe('7d');
    expect(state.overview?.metrics.map((metric) => metric.label)).toContain(
      'Revenue',
    );
  });
});
