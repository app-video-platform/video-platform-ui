/* eslint-disable indent */
import {
  AnyAction,
  createSlice,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit';

import { ProductMinimised, RootState } from 'core/api/models';
import { addToWishlist } from '../wishlist/wishlist.slice';
import {
  getCollectionPrice,
  isValidCartProduct,
  normalizeCollectionProducts,
} from '../collection-storage.utils';

const STORAGE_KEY = 'cart:v1';

export interface ShopCartState {
  products: ProductMinimised[];
  loading: boolean;
  total: number;
}

const initialState: ShopCartState = {
  products: [],
  loading: false,
  total: 0,
};

export const normalizeCartState = (value: unknown): ShopCartState => {
  const products =
    typeof value === 'object' && value !== null && 'products' in value
      ? normalizeCollectionProducts(
          (value as { products: unknown }).products,
          isValidCartProduct,
        )
      : [];

  return {
    products,
    loading: false,
    // Persisted totals are derived data and are never trusted during hydration.
    total: products.reduce((sum, product) => sum + getCollectionPrice(product), 0),
  };
};

export const loadCartFromStorage = (): ShopCartState | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return undefined;
  }
  if (!raw) {
    return undefined;
  }

  try {
    const normalized = normalizeCartState(JSON.parse(raw));
    saveCartToStorage(normalized);
    return normalized;
  } catch {
    // Invalid persisted JSON is reset; storage access errors above preserve it.
    saveCartToStorage(initialState);
    return undefined;
  }
};

export const saveCartToStorage = (state: ShopCartState) => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeCartState(state)));
  } catch {
    /* ignore quota / privacy errors */
  }
};

const recomputeTotal = (items: ProductMinimised[]) =>
  items.reduce((sum, product) => sum + getCollectionPrice(product), 0);

export const moveCartItemToWishlist =
  (productId: string): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch, getState) => {
    if (typeof productId !== 'string' || !productId.trim()) {
      return;
    }
    const state = getState();

    // find the product in wishlist
    const product = state.shopCart.products.find((p) => p.id === productId);
    if (!product) {
      return;
    } // nothing to do

    // if already in cart, just remove from wishlist (optional behavior)
    const isAlreadyInWishlist = state.wishlist.products.some(
      (p) => p.id === productId,
    );

    if (!isAlreadyInWishlist) {
      dispatch(addToWishlist(product));
    }
    dispatch(removeProductFromCart(productId));
  };

const shopCartSlice = createSlice({
  name: 'shopCart',
  initialState,
  reducers: {
    addProductToCart(state, action: PayloadAction<ProductMinimised>) {
      if (!isValidCartProduct(action.payload)) {
        return;
      }
      state.loading = true;

      // optional: prevent duplicates (by product id)
      const exists = state.products?.some((p) => p.id === action.payload.id);
      if (!exists) {
        state.products?.push(action.payload);
      }

      state.total = recomputeTotal(state.products);
      state.loading = false;
    },

    removeProductFromCart(
      state,
      action: PayloadAction<string /* productId */>,
    ) {
      const idToRemove = action.payload;
      if (typeof idToRemove !== 'string' || !idToRemove.trim()) {
        return;
      }
      const idx = state.products.findIndex((p) => p.id === idToRemove);
      if (idx >= 0) {
        state.products.splice(idx, 1);
        state.total = recomputeTotal(state.products);
      }
      state.loading = false;
    },

    clearShoppingCart(state) {
      state.products = [];
      state.total = 0;
      state.loading = false;
    },
  },
});

export const { addProductToCart, clearShoppingCart, removeProductFromCart } =
  shopCartSlice.actions;
export default shopCartSlice.reducer;
