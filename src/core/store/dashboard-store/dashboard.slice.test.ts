import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';

import httpClient from 'core/api/http-client';
import { registerCreatorDashboardTestMocks } from 'core/api/test-fixtures/creator-dashboard-http.mock';
import dashboardReducer, {
  fetchCreatorDashboardSummary,
} from './dashboard.slice';

describe('dashboard slice', () => {
  let mock: MockAdapter;

  const createStore = () =>
    configureStore({
      reducer: {
        dashboard: dashboardReducer,
      },
    });

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
    registerCreatorDashboardTestMocks(mock);
  });

  afterEach(() => {
    mock.restore();
  });

  it('stores a fetched dashboard summary', async () => {
    const testStore = createStore();

    await testStore.dispatch(fetchCreatorDashboardSummary());

    const state = testStore.getState().dashboard;
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.summary?.metrics.map((metric) => metric.label)).toContain(
      'Revenue',
    );
    expect(state.summary?.attentionItems[0].actionPath).toBe(
      '/app/products/edit/prod-membership-lab',
    );
  });
});
