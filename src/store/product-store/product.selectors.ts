import { createSelector } from '@reduxjs/toolkit';

import { ProductType } from '@api/types';
import { RootState } from '../store';

export const selectAllProducts = (state: RootState) => state.products.products;

export const selectProductsLoading = (state: RootState) =>
  state.products.loading;

export const selectProductsError = (state: RootState) => state.products.error;
export const selectCurrentProduct = (state: RootState) =>
  state.products.currentProduct;

export const selectProductsByType = (productType: ProductType) =>
  createSelector(selectAllProducts, (products) =>
    products?.filter((product) => product.type === productType),
  );

export const selectTopThreeProducts = createSelector(
  selectAllProducts,
  (products) => {
    if (!products) {
      return [];
    }
    return products
      .slice()
      .sort((a, b) => {
        const priceA = typeof a.price === 'number' ? a.price : 0;
        const priceB = typeof b.price === 'number' ? b.price : 0;
        return priceB - priceA;
      })
      .slice(0, 3);
  },
);
