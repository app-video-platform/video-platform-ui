import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'core/api/models';

export const selectAllShopCartProducts = (state: RootState) =>
  state.shopCart.products;
export const selectShopCartTotal = (state: RootState) => state.shopCart.total;
export const selectCartCount = (state: RootState) =>
  state.shopCart.products?.length ?? 0;

export const selectCartIds = createSelector(
  [selectAllShopCartProducts],
  (products) => new Set(products.map((p) => p.id)),
);
