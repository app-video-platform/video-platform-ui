/* eslint-disable indent */
import {
  AnyAction,
  createSlice,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit';

import type { ProductMinimised } from '@api/models';
import { addProductToCart } from '../shop-cart/shop-cart.slice';
import { RootState } from '../store';

export interface WishlistState {
  products: ProductMinimised[];
}

const STORAGE_KEY = 'wishlist:v1';

const loadFromStorage = (): ProductMinimised[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProductMinimised[]) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (products: ProductMinimised[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    /* ignore storage errors */
  }
};

const initialState: WishlistState = {
  products: loadFromStorage(),
};

export const moveWishlistItemToCart =
  (productId: string): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch, getState) => {
    const state = getState();

    // find the product in wishlist
    const product = state.wishlist.products.find((p) => p.id === productId);
    if (!product) {
      return;
    } // nothing to do

    // if already in cart, just remove from wishlist (optional behavior)
    const isAlreadyInCart = state.shopCart.products.some(
      (p) => p.id === productId,
    );

    if (!isAlreadyInCart) {
      dispatch(addProductToCart(product));
    }
    dispatch(removeFromWishlist(productId));
  };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<ProductMinimised>) {
      const exists = state.products.some((p) => p.id === action.payload.id);
      if (!exists) {
        state.products.push(action.payload);
        saveToStorage(state.products);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string /* productId */>) {
      state.products = state.products.filter((p) => p.id !== action.payload);
      saveToStorage(state.products);
    },
    toggleWishlist(state, action: PayloadAction<ProductMinimised>) {
      const idx = state.products.findIndex((p) => p.id === action.payload.id);
      if (idx >= 0) {
        state.products.splice(idx, 1);
      } else {
        state.products.push(action.payload);
      }
      saveToStorage(state.products);
    },
    clearWishlist(state) {
      state.products = [];
      saveToStorage(state.products);
    },
    // Optional: replace entirely (e.g., after server sync)
    setWishlist(state, action: PayloadAction<ProductMinimised[]>) {
      state.products = action.payload;
      saveToStorage(state.products);
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  setWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
