import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@api/models';

export const selectWishlistProducts = (s: RootState) => s.wishlist.products;
export const selectWishlistIds = createSelector(
  [selectWishlistProducts],
  (products) => new Set(products.map((p) => p.id)),
);
export const selectWishlistCount = createSelector(
  [selectWishlistProducts],
  (products) => products.length,
);
export const makeSelectIsInWishlist = (productId: string) => (s: RootState) =>
  s.wishlist.products.some((p) => p.id === productId);
