import { RootState } from '@api/models';

export const makeSelectWishlistToCartState = (id: string) => (s: RootState) => {
  const inWishlist = s.wishlist.products.some((p) => p.id === id);
  const inCart = s.shopCart.products.some((p) => p.id === id);
  return { inWishlist, inCart };
};
