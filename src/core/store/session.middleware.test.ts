/* eslint-disable no-unused-vars */
import { configureStore, createAsyncThunk, createListenerMiddleware } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';
import { createSessionMiddleware } from './session.middleware';
import { logout, setUserProfile, signinUser, changeDevUserRole } from './auth-store/auth.slice';
import { User, UserRole, CreatorDashboardSummary } from 'core/api/models';
import { setupProductListeners } from './listeners/product-listeners';
import { fetchMembershipAggregate } from './membership-store/membership.slice';

const user = (id: string, role = UserRole.CREATOR) => ({ id, roles: [role], firstName: id } as User);
const summary = (id: string) => ({ id } as unknown as CreatorDashboardSummary);
const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((done, fail) => { resolve = done; reject = fail; });
  return { promise, resolve, reject };
};
const setup = () => {
  const listener = createListenerMiddleware();
  setupProductListeners(listener);
  return configureStore({ reducer: rootReducer, middleware: (getDefault) =>
    getDefault().prepend(createSessionMiddleware(), listener.middleware) });
};

describe('account-owned Redux lifecycle', () => {
  it.each([UserRole.CREATOR, UserRole.USER, UserRole.ADMIN])('isolates delayed, failed and stale reads for B (%s)', async (role) => {
    const store = setup();
    store.dispatch(setUserProfile(user('A')));
    const a = deferred<CreatorDashboardSummary>();
    const aFailure = deferred<CreatorDashboardSummary>();
    const b = deferred<CreatorDashboardSummary>();
    const read = createAsyncThunk('dashboard/fetchCreatorDashboardSummary', async (gate: typeof a) => gate.promise);
    const pendingA = store.dispatch(read(a));
    const failedA = store.dispatch(read(aFailure));
    a.resolve(summary('A'));
    await pendingA;
    expect(store.getState().dashboard.summary).toEqual(summary('A'));
    const lateA = deferred<CreatorDashboardSummary>();
    const pendingLateA = store.dispatch(read(lateA));
    store.dispatch(logout());
    store.dispatch(setUserProfile(user('B', role)));
    const seen: unknown[] = [];
    const unsubscribe = store.subscribe(() => seen.push(store.getState().dashboard.summary));
    const pendingB = store.dispatch(read(b));
    expect(store.getState().dashboard.summary).toBeNull();
    lateA.resolve(summary('A'));
    aFailure.reject(new Error('old failure'));
    await Promise.all([pendingLateA, failedA]);
    expect(store.getState().dashboard.loading).toBe(true);
    expect(store.getState().dashboard.error).toBeNull();
    b.reject(new Error('B unavailable'));
    await pendingB;
    expect(store.getState().dashboard.summary).toBeNull();
    expect(seen.every((value) => value === null)).toBe(true);
    unsubscribe();
  });

  it('rejects work from a previous login of the same account and after a role boundary', async () => {
    const store = setup();
    store.dispatch(setUserProfile(user('A')));
    const old = deferred<CreatorDashboardSummary>();
    const read = createAsyncThunk('dashboard/fetchCreatorDashboardSummary', async () => old.promise);
    const pending = store.dispatch(read());
    store.dispatch(signinUser.pending('login', { email: 'a@example.invalid', password: 'synthetic' }));
    store.dispatch(setUserProfile(user('A')));
    old.resolve(summary('old session'));
    await pending;
    expect(store.getState().dashboard.summary).toBeNull();
    store.dispatch({ type: 'dashboard/fetchCreatorDashboardSummary/fulfilled', payload: summary('A') });
    store.dispatch(changeDevUserRole.pending('role', UserRole.USER));
    expect(store.getState().dashboard.summary).toBeNull();
  });

  it('clears private slices together, preserving separate public caches and browser collections', () => {
    const store = setup();
    store.dispatch(setUserProfile(user('A')));
    store.dispatch({ type: 'products/getProductById/fulfilled', payload: { id: 'private draft' } });
    store.dispatch({ type: 'storefront/fetchPublicStorefront/fulfilled', payload: { creator: { id: 'public' } } });
    store.dispatch({ type: 'storefront/fetchCreatorStorefrontConfig/fulfilled', payload: { theme: 'private' } });
    store.dispatch({ type: 'productLandingPage/fetchCreatorProductLandingPageConfig/fulfilled', payload: { productId: 'draft' } });
    store.dispatch({ type: 'notifications/addNotification', payload: { title: 'private' } });
    for (const type of ['admin/fetchUsers', 'analytics/fetchCreatorAnalyticsOverview',
      'customers/fetchCreatorCustomerDetail', 'sales/fetchCreatorSalesSummary',
      'dashboard/fetchCreatorDashboardSummary']) {
      store.dispatch({ type: `${type}/fulfilled`, payload: { privateAccount: 'A' } });
    }
    store.dispatch(fetchMembershipAggregate.pending('membership-seed', 'private membership'));
    store.dispatch(fetchMembershipAggregate.fulfilled({
      productId: 'private membership',
      config: { productId: 'private membership', orderingMode: 'NEWEST_FIRST' },
      content: [], feed: [],
    }, 'membership-seed', 'private membership'));
    expect(store.getState().membership.requests?.['private membership'].status).toBe('loaded');
    store.dispatch({ type: 'reviews/getReviewsPage/fulfilled', payload: { items: [{ id: 'private review' }], page: 0, pageSize: 1 } });
    store.dispatch({ type: 'productLandingPage/updateCreatorProductLandingPageConfig/fulfilled', payload: { productId: 'draft' } });
    store.dispatch({ type: 'productLandingPage/fetchPublicProductLandingPageConfig/fulfilled', payload: { productId: 'public' } });
    const before = store.getState();
    store.dispatch(logout());
    const after = store.getState();
    const empty = rootReducer(undefined, { type: '@@test' });
    for (const key of ['admin', 'analytics', 'customers', 'dashboard', 'sales', 'membership', 'products', 'notifications', 'reviews'] as const) {
      expect(after[key]).toEqual(empty[key]);
    }
    expect(after.storefront.creatorConfig).toBeNull();
    expect(after.productLandingPage.creatorByProductId).toEqual({});
    expect(after.productLandingPage.publicByProductId).toEqual({ public: { productId: 'public' } });
    expect(after.storefront.publicByCreatorId).toEqual(before.storefront.publicByCreatorId);
    expect(after.shopCart).toBe(before.shopCart);
    expect(after.wishlist).toBe(before.wishlist);
  });

  it.each(['success', 'failure'])('does not restore A identity after late profile %s', async (outcome) => {
    const store = setup();
    store.dispatch(setUserProfile(user('A')));
    const gate = deferred<User>();
    const readProfile = createAsyncThunk('auth/getUserProfile', async () => gate.promise);
    const pending = store.dispatch(readProfile());
    store.dispatch(logout());
    store.dispatch(setUserProfile(user('B')));
    if (outcome === 'success') {
      gate.resolve(user('A'));
    } else {
      gate.reject(new Error('old profile outage'));
    }
    await pending;
    expect(store.getState().auth.user?.id).toBe('B');
    expect(store.getState().auth.sessionStatus).toBe('authenticated');
  });

  it('drops stale product results before notification listeners run', async () => {
    const store = setup();
    store.dispatch(setUserProfile(user('A')));
    const gate = deferred<{ name: string }>();
    const create = createAsyncThunk('products/createProduct', async () => gate.promise);
    const pending = store.dispatch(create());
    store.dispatch(logout());
    store.dispatch(setUserProfile(user('B')));
    gate.resolve({ name: 'Private A draft' });
    await pending;
    expect(store.getState().notifications).toEqual(rootReducer(undefined, { type: '@@test' }).notifications);
    expect(store.getState().products.currentProduct).toBeNull();
  });
});
