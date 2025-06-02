import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Ensure your store exports RootState
import { ProductType } from '../../api/models/product/product.types';

export const selectAllProducts = (state: RootState) => state.products.products;

export const selectProductsByType = (productType: ProductType) =>
  createSelector(selectAllProducts, (products) =>
    products?.filter((product) => product.type === productType)
  );
