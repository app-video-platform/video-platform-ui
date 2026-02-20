import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import authReducer from './auth-store/auth.slice';
import productsReducer from './product-store/product.slice';
import notificationsReducer from './notifications/notifications.slice';
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
    products: productsReducer,
    notifications: notificationsReducer,
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
