/* eslint-disable indent */
import {
  AnyAction,
  createSlice,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit';

import type { ProductMinimised, RootState } from 'core/api/models';
import { addProductToCart } from '../shop-cart/shop-cart.slice';
import {
  isValidCartProduct,
  isValidWishlistProduct,
  normalizeCollectionProducts,
} from '../collection-storage.utils';

export interface WishlistState {
  products: ProductMinimised[];
}

const STORAGE_KEY = 'wishlist:v1';

export const loadWishlistFromStorage = (): ProductMinimised[] => {
  let raw: string | null;
  try {
    if (typeof window === 'undefined') {
      return [];
    }
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return [];
  }
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    const products = normalizeCollectionProducts(parsed, isValidWishlistProduct);
    saveToStorage(products);
    return products;
  } catch {
    // Invalid persisted JSON is reset; storage access errors above preserve it.
    saveToStorage([]);
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
  products: loadWishlistFromStorage(),
};

export const moveWishlistItemToCart =
  (productId: string): ThunkAction<boolean, RootState, unknown, AnyAction> =>
  (dispatch, getState) => {
    if (typeof productId !== 'string' || !productId.trim()) {
      return false;
    }
    const state = getState();

    // find the product in wishlist
    const product = state.wishlist.products.find((p) => p.id === productId);
    if (!product || !isValidCartProduct(product)) {
      return false;
    } // nothing to do

    // if already in cart, just remove from wishlist (optional behavior)
    const isAlreadyInCart = state.shopCart.products.some(
      (p) => p.id === productId,
    );

    if (!isAlreadyInCart) {
      dispatch(addProductToCart(product));
    }
    dispatch(removeFromWishlist(productId));
    return true;
  };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<ProductMinimised>) {
      if (!isValidWishlistProduct(action.payload)) {
        return;
      }
      const exists = state.products.some((p) => p.id === action.payload.id);
      if (!exists) {
        state.products.push(action.payload);
        saveToStorage(state.products);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string /* productId */>) {
      if (typeof action.payload !== 'string' || !action.payload.trim()) {
        return;
      }
      state.products = state.products.filter((p) => p.id !== action.payload);
      saveToStorage(state.products);
    },
    toggleWishlist(state, action: PayloadAction<ProductMinimised>) {
      if (!isValidWishlistProduct(action.payload)) {
        return;
      }
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
      state.products = normalizeCollectionProducts(
        action.payload,
        isValidWishlistProduct,
      );
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
