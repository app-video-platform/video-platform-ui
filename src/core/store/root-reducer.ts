import { combineReducers, UnknownAction } from '@reduxjs/toolkit';
import authReducer from './auth-store/auth.slice';
import adminReducer from './admin-store/admin.slice';
import analyticsReducer from './analytics-store/analytics.slice';
import productsReducer from './product-store/product.slice';
import customersReducer from './customers-store/customers.slice';
import dashboardReducer from './dashboard-store/dashboard.slice';
import membershipReducer from './membership-store/membership.slice';
import notificationsReducer from './notifications/notifications.slice';
import productLandingPageReducer from './product-landing-page-store/product-landing-page.slice';
import salesReducer from './sales-store/sales.slice';
import storefrontReducer from './storefront-store/storefront.slice';
import shopCartReducer from './shop-cart/shop-cart.slice';
import wishlistReducer from './wishlist/wishlist.slice';
import { reviewsSlice } from './reviews-store';


const combinedReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  analytics: analyticsReducer,
  products: productsReducer,
  customers: customersReducer,
  dashboard: dashboardReducer,
  membership: membershipReducer,
  notifications: notificationsReducer,
  productLandingPage: productLandingPageReducer,
  sales: salesReducer,
  storefront: storefrontReducer,
  shopCart: shopCartReducer,
  wishlist: wishlistReducer,
  reviews: reviewsSlice,
});

export type AppState = ReturnType<typeof combinedReducer>;

export const rootReducer = (state: AppState | undefined, action: UnknownAction): AppState => {
  const next = combinedReducer(state, action);
  if (!state || next.auth.sessionVersion === state.auth.sessionVersion) {
    return next;
  }
  const empty = combinedReducer(undefined, { type: '@@session/reset' });
  // Product reads mix public metadata and private drafts, so clear the shared cache.
  // Browser-local shopping collections are not entitlements and retain their existing lifecycle.
  return {
    ...next,
    admin: empty.admin,
    analytics: empty.analytics,
    products: empty.products,
    customers: empty.customers,
    dashboard: empty.dashboard,
    membership: empty.membership,
    notifications: empty.notifications,
    sales: empty.sales,
    reviews: empty.reviews,
    storefront: {
      ...empty.storefront,
      publicByCreatorId: next.storefront.publicByCreatorId,
      publicLoading: next.storefront.publicLoading,
      publicError: next.storefront.publicError,
    },
    productLandingPage: {
      ...empty.productLandingPage,
      // Creator saves also write into this map. Remove those mixed/private entries.
      publicByProductId: Object.fromEntries(Object.entries(next.productLandingPage.publicByProductId)
        .filter(([id]) => !state.productLandingPage.creatorByProductId[id])),
      publicLoading: next.productLandingPage.publicLoading,
      publicError: next.productLandingPage.publicError,
    },
  };
};
