/* eslint-disable indent */
import {
  AnyAction,
  createSlice,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit';

import { ProductMinimised } from '@api/models';
import { RootState } from '../store';
import { addToWishlist } from '../wishlist/wishlist.slice';

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

export const loadCartFromStorage = (): ShopCartState | undefined => {
  try {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ShopCartState) : undefined;
  } catch {
    return undefined;
  }
};

export const saveCartToStorage = (state: ShopCartState) => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / privacy errors */
  }
};

const getNumericPrice = (p: ProductMinimised): number => {
  const price = p.price;
  if (price === 'free' || price === null) {
    return 0;
  }
  return typeof price === 'number' ? price : Number(price) || 0;
};

const recomputeTotal = (items: ProductMinimised[]) =>
  items.reduce((sum, p) => sum + getNumericPrice(p), 0);

export const moveCartItemToWishlist =
  (productId: string): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch, getState) => {
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
      const idx = state.products?.findIndex((p) => p.id === idToRemove);
      if (idx && idx >= 0) {
        state.products?.splice(idx, 1);
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
