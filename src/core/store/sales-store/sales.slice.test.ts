import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';

import httpClient from 'core/api/http-client';
import { registerCreatorSalesTestMocks } from 'core/api/test-fixtures/creator-sales-http.mock';
import salesReducer, {
  fetchCreatorOrderDetail,
  fetchCreatorOrdersPage,
  fetchCreatorSalesSummary,
} from './sales.slice';

describe('sales slice', () => {
  let mock: MockAdapter;

  const createStore = () =>
    configureStore({
      reducer: {
        sales: salesReducer,
      },
    });

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
    registerCreatorSalesTestMocks(mock);
  });

  afterEach(() => {
    mock.restore();
  });

  it('stores a fetched sales summary', async () => {
    const testStore = createStore();

    await testStore.dispatch(fetchCreatorSalesSummary({ period: '7d' }));

    const state = testStore.getState().sales;
    expect(state.summaryLoading).toBe(false);
    expect(state.summaryError).toBeNull();
    expect(state.summary?.period).toBe('7d');
    expect(state.summary?.metrics.map((metric) => metric.label)).toContain(
      'Revenue',
    );
  });

  it('stores a fetched orders page', async () => {
    const testStore = createStore();

    await testStore.dispatch(fetchCreatorOrdersPage({ search: 'mira.patel' }));

    const state = testStore.getState().sales;
    expect(state.ordersLoading).toBe(false);
    expect(state.ordersError).toBeNull();
    expect(state.ordersPage?.totalElements).toBe(1);
    expect(state.ordersPage?.content[0].id).toBe('ORD-2026-00120');
  });

  it('stores a fetched order detail', async () => {
    const testStore = createStore();

    await testStore.dispatch(fetchCreatorOrderDetail('ORD-2026-00121'));

    const state = testStore.getState().sales;
    expect(state.detailLoading).toBe(false);
    expect(state.detailError).toBeNull();
    expect(state.currentOrder?.refund?.reason).toBe('Customer request');
  });
});
