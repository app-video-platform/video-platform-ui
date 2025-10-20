import { RootState } from '../store';

export const selectAllShopCartProducts = (state: RootState) =>
  state.shopCart.products;
export const selectShopCartTotal = (state: RootState) => state.shopCart.total;
export const selectCartCount = (state: RootState) =>
  state.shopCart.products?.length ?? 0;
