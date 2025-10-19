import { AxiosError } from 'axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductMinimised } from '../../api/models/product/product';

interface ShopCartState {
  products: null | ProductMinimised[];
  loading: boolean;
  total: number;
}

const initialState: ShopCartState = {
  products: null,
  loading: false,
  total: 0,
};

export const extractErrorMessage = (err: unknown): string => {
  if (err instanceof AxiosError && err.response?.data?.message) {
    return err.response.data.message;
  } else if (err instanceof Error) {
    return err.message;
  }
  return 'An unknown error occurred';
};

const shopCartSlice = createSlice({
  name: 'shopCart',
  initialState,
  reducers: {
    addProductToCart(state, action: PayloadAction<ProductMinimised>) {
      state.loading = true;
      if (state.products && state.products.length > 0) {
        state.products.push(action.payload);
      } else {
        state.products = [action.payload];
      }
      if (action.payload.price && action.payload.price !== 'free') {
        state.total += action.payload.price;
      }
      state.loading = false;
    },

    clearShoppingCart(state) {
      state.products = [];
      state.total = 0;
      state.loading = false;
    },

    removeProductFromCart(state, action: PayloadAction<string>) {
      const idToRemove = action.payload;
      const idx = state.products?.findIndex((p) => p.id === idToRemove);
      if (idx && idx !== -1) {
        state.products?.splice(idx, 1);
      }
    },
  },
});

export default shopCartSlice.reducer;
