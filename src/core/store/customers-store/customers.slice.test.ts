import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';

import httpClient from 'core/api/http-client';
import { registerCreatorCustomersTestMocks } from 'core/api/test-fixtures/creator-customers-http.mock';
import customersReducer, {
  fetchCreatorCustomerDetail,
  fetchCreatorCustomersPage,
} from './customers.slice';

describe('customers slice', () => {
  let mock: MockAdapter;

  const createStore = () =>
    configureStore({
      reducer: {
        customers: customersReducer,
      },
    });

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
    registerCreatorCustomersTestMocks(mock);
  });

  afterEach(() => {
    mock.restore();
  });

  it('stores a fetched customers page', async () => {
    const testStore = createStore();

    await testStore.dispatch(fetchCreatorCustomersPage({ search: 'mira' }));

    const state = testStore.getState().customers;
    expect(state.listLoading).toBe(false);
    expect(state.listError).toBeNull();
    expect(state.customersPage?.totalElements).toBe(1);
    expect(state.customersPage?.content[0].id).toBe('cust-mira-patel');
  });

  it('stores a fetched customer detail', async () => {
    const testStore = createStore();

    await testStore.dispatch(fetchCreatorCustomerDetail('cust-maya-johnson'));

    const state = testStore.getState().customers;
    expect(state.detailLoading).toBe(false);
    expect(state.detailError).toBeNull();
    expect(state.currentCustomer?.email).toBe('maya.johnson@example.test');
  });
});
