import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-store/auth.slice';
import productsReducer from './product-store/product.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;