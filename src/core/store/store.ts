import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import authReducer from './auth-store/auth.slice';
import adminReducer from './admin-store/admin.slice';
import analyticsReducer from './analytics-store/analytics.slice';
import productsReducer from './product-store/product.slice';
import customersReducer from './customers-store/customers.slice';
import dashboardReducer from './dashboard-store/dashboard.slice';
import membershipReducer from './membership-store/membership.slice';
import notificationsReducer from './notifications/notifications.slice';
import salesReducer from './sales-store/sales.slice';
import storefrontReducer from './storefront-store/storefront.slice';
import shopCartReducer, {
  loadCartFromStorage,
  saveCartToStorage,
  ShopCartState,
} from './shop-cart/shop-cart.slice';
import wishlistReducer from './wishlist/wishlist.slice';
import { setupProductListeners } from './listeners/product-listeners';
import { reviewsSlice } from './reviews-store';

const listenerMiddleware = createListenerMiddleware();

setupProductListeners(listenerMiddleware);

const preloadedCart = loadCartFromStorage();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    analytics: analyticsReducer,
    products: productsReducer,
    customers: customersReducer,
    dashboard: dashboardReducer,
    membership: membershipReducer,
    notifications: notificationsReducer,
    sales: salesReducer,
    storefront: storefrontReducer,
    shopCart: shopCartReducer,
    wishlist: wishlistReducer,
    reviews: reviewsSlice,
  },
  preloadedState: preloadedCart
    ? ({ shopCart: preloadedCart } as { shopCart: ShopCartState })
    : undefined,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

let lastSaved: string | null = null;
store.subscribe(() => {
  const state = store.getState().shopCart as ShopCartState;
  const snapshot = JSON.stringify(state);
  if (snapshot !== lastSaved) {
    saveCartToStorage(state);
    lastSaved = snapshot;
  }
});
