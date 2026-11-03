/* eslint-disable @typescript-eslint/no-explicit-any, no-unused-vars */
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import httpClient from 'core/api/http-client';
import { rootReducer } from './root-reducer';
import { createSessionMiddleware } from './session.middleware';
import { logout, setUserProfile } from './auth-store/auth.slice';
import { User, UserRole } from 'core/api/models';
import { getProductById, clearCurrentProduct, getProductSummariesByOwner } from './product-store';
import { fetchCreatorCustomerDetail, clearCurrentCustomer } from './customers-store';
import { fetchCreatorOrderDetail, clearCurrentOrder } from './sales-store';
import { fetchAdminProducts, fetchAdminAuditLogs, fetchAdminUsers } from './admin-store';

const deferred = () => {
  let resolve!: (value: [number, unknown]) => void;
  const promise = new Promise<[number, unknown]>((done) => { resolve = done; });
  return { promise, resolve };
};
const page = (id: string) => ({ content: [{ id, title: id, type: 'COURSE', price: 3 }], number: 0, totalElements: 1, totalPages: 1, last: true });
const channels = [
  {
    name: 'Product', read: (id: string) => getProductById({ productId: id }),
    body: (id: string) => ({ id, name: id, type: 'COURSE', price: 3 }),
    state: (s: any) => ({ data: s.products.currentProduct?.id,
      loading: s.products.detailLoading ?? s.products.loading, error: s.products.detailError }),
    clear: clearCurrentProduct,
  },
  {
    name: 'Customer', read: fetchCreatorCustomerDetail, body: (id: string) => ({ id, name: id }),
    state: (s: any) => ({ data: s.customers.currentCustomer?.id, loading: s.customers.detailLoading, error: s.customers.detailError }),
    clear: clearCurrentCustomer,
  },
  {
    name: 'Order', read: fetchCreatorOrderDetail, body: (id: string) => ({ id }),
    state: (s: any) => ({ data: s.sales.currentOrder?.id, loading: s.sales.detailLoading, error: s.sales.detailError }),
    clear: clearCurrentOrder,
  },
  {
    name: 'Admin Products',
    read: (id: string) => fetchAdminProducts({ search: id, ownerId: id, type: 'COURSE', status: 'DRAFT', page: 2 }), body: page,
    state: (s: any) => ({ data: s.admin.productsPage?.content[0]?.id, loading: s.admin.productsLoading, error: s.admin.productsError }),
  },
  {
    name: 'Admin Audit',
    read: (id: string) => fetchAdminAuditLogs({ action: id, targetId: id, targetType: 'pRoDuCt', page: 2 }), body: page,
    state: (s: any) => ({ data: s.admin.auditPage?.content[0]?.id, loading: s.admin.auditLoading, error: s.admin.auditError }),
  },
];

describe.each(channels)('$name request ownership', (channel) => {
  let mock: MockAdapter;
  const setup = () => {
    const store = configureStore({ reducer: rootReducer,
      middleware: (getDefault) => getDefault().prepend(createSessionMiddleware()) });
    store.dispatch(setUserProfile({ id: 'owner', roles: [UserRole.ADMIN] } as User));
    return store;
  };
  const start = (store: ReturnType<typeof setup>, id: string) => {
    const gate = deferred();
    mock.onGet().replyOnce(() => gate.promise);
    const finished = store.dispatch(channel.read(id) as any);
    return { finish: async (status = 200) => {
      gate.resolve([status, status === 200 ? channel.body(id) : { message: 'fixture failure' }]);
      await finished;
    } };
  };
  beforeEach(() => { mock = new MockAdapter(httpClient); });
  afterEach(() => { mock.restore(); });

  it('does not let A end loading while B is pending', async () => {
    const store = setup(); const a = start(store, 'A'); const b = start(store, 'B');
    await a.finish();
    expect(channel.state(store.getState()).loading).toBe(true);
    expect(channel.state(store.getState()).data).toBeUndefined();
    await b.finish();
    expect(channel.state(store.getState())).toMatchObject({ data: 'B', loading: false, error: null });
  });
  it.each([200, 503])('keeps B authoritative after an older A completion (%s)', async (status) => {
    const store = setup(); const a = start(store, 'A'); const b = start(store, 'B');
    await b.finish(); const selected = channel.state(store.getState());
    await a.finish(status);
    expect(channel.state(store.getState())).toEqual(selected);
  });
  it('preserves current B failure when old A succeeds, then permits retry', async () => {
    const store = setup(); const a = start(store, 'A'); const b = start(store, 'B');
    await b.finish(503); const failed = channel.state(store.getState());
    expect(failed.loading).toBe(false); expect(failed.error).toBeTruthy();
    await a.finish(); expect(channel.state(store.getState())).toEqual(failed);
    await start(store, 'B').finish();
    expect(channel.state(store.getState())).toMatchObject({ data: 'B', loading: false, error: null });
  });
  it('distinguishes request IDs through A → B → A and duplicate same-ID reads', async () => {
    const store = setup(); const a1 = start(store, 'A'); const b = start(store, 'B'); const a2 = start(store, 'A');
    await a1.finish(); await b.finish(503);
    expect(channel.state(store.getState()).loading).toBe(true);
    await a2.finish(); expect(channel.state(store.getState()).data).toBe('A');
    const first = start(store, 'A'); const second = start(store, 'A');
    await second.finish(); const selected = channel.state(store.getState());
    await first.finish(503); expect(channel.state(store.getState())).toEqual(selected);
  });
  it('handles a current missing response without accepting a stale success', async () => {
    const store = setup(); const a = start(store, 'A'); const missing = start(store, 'missing');
    await missing.finish(404); const failed = channel.state(store.getState());
    expect(failed.error).toBeTruthy(); await a.finish();
    expect(channel.state(store.getState())).toEqual(failed);
  });
  it('keeps old-session completion out of a new account', async () => {
    const store = setup(); const old = start(store, 'A');
    store.dispatch(logout()); store.dispatch(setUserProfile({ id: 'other', roles: [UserRole.ADMIN] } as User));
    const current = start(store, 'B'); await current.finish(); const selected = channel.state(store.getState());
    await old.finish(); expect(channel.state(store.getState())).toEqual(selected);
  });
  const clear = 'clear' in channel ? channel.clear : undefined;
  if (clear) {
    it('invalidates pending detail ownership on clear/close', async () => {
      const store = setup(); const old = start(store, 'A');
      store.dispatch(clear()); await old.finish();
      expect(channel.state(store.getState()).data).toBeUndefined();
      expect(channel.state(store.getState()).loading).toBe(false);
      await start(store, 'A').finish(); expect(channel.state(store.getState()).data).toBe('A');
    });
  }
});

it('keeps Admin Audit, Products and Users requests independent', async () => {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch(fetchAdminProducts.pending('products', { search: 'exact' }));
  store.dispatch(fetchAdminAuditLogs.pending('audit', { action: 'product_create' }));
  store.dispatch(fetchAdminUsers.fulfilled(page('user') as any, 'users', {}));
  expect(store.getState().admin.productsLoading).toBe(true);
  expect(store.getState().admin.auditLoading).toBe(true);
  store.dispatch(fetchAdminAuditLogs.fulfilled(page('audit') as any, 'audit', { action: 'product_create' }));
  expect(store.getState().admin.productsLoading).toBe(true);
  store.dispatch(fetchAdminProducts.fulfilled(page('product') as any, 'products', { search: 'exact' }));
  expect(store.getState().admin.auditPage?.content[0].id).toBe('audit');
  expect(store.getState().admin.productsPage?.content[0].id).toBe('product');
});

it('keeps Product detail loading/error independent of background list completion', () => {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch(getProductById.pending('detail', { productId: 'B' }));
  store.dispatch(getProductSummariesByOwner.fulfilled([], 'list', 'owner'));
  expect(store.getState().products.detailLoading).toBe(true);
  expect(store.getState().products.detailError).toBeNull();
});
