import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import authReducer from './auth-store/auth.slice';
import productsReducer from './product-store/product.slice';
import notificationsReducer from './notifications/notifications.slice';
import { setupProductListeners } from './listeners/product-listeners';

const listenerMiddleware = createListenerMiddleware();

setupProductListeners(listenerMiddleware);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
