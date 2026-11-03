import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { rootReducer } from './root-reducer';
import { createSessionMiddleware } from './session.middleware';
import { sessionExpired, sessionUnavailable } from './auth-store/auth.slice';
import { setSessionFailureHandler } from '../api/interceptors/session-lifecycle';
import { loadCartFromStorage, saveCartToStorage, ShopCartState } from './shop-cart/shop-cart.slice';
import { setupProductListeners } from './listeners/product-listeners';

const listenerMiddleware = createListenerMiddleware();
setupProductListeners(listenerMiddleware);
const preloadedCart = loadCartFromStorage();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: preloadedCart ? { ...rootReducer(undefined, { type: '@@init' }), shopCart: preloadedCart } : undefined,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .prepend(createSessionMiddleware(), listenerMiddleware.middleware),
});

setSessionFailureHandler((error) => {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  store.dispatch(status === 401 || status === 403 ? sessionExpired() : sessionUnavailable());
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
