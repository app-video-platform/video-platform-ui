import { configureStore } from '@reduxjs/toolkit';

import { AppDispatch, ProductMinimised } from 'core/api/models';
import shopCartReducer, { ShopCartState } from '../shop-cart/shop-cart.slice';
import wishlistReducer, {
  addToWishlist,
  loadWishlistFromStorage,
  moveWishlistItemToCart,
  toggleWishlist,
  WishlistState,
} from './wishlist.slice';

const product = (
  overrides: Partial<ProductMinimised> = {},
): ProductMinimised => ({
  id: 'product-1',
  title: 'Course',
  type: 'COURSE',
  price: 12.5,
  status: 'PUBLISHED',
  ...overrides,
});

describe('Wishlist persistence boundary', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
  });

  it('hydrates valid saved products, drops invalid entries and deduplicates ids', () => {
    window.localStorage.setItem(
      'wishlist:v1',
      JSON.stringify([
        product(),
        product({ price: 'bad' as never }),
        null,
        product({ id: 'product-1', title: 'duplicate' }),
        product({ id: 'product-2', price: 'free' }),
      ]),
    );

    expect(loadWishlistFromStorage()).toEqual([
      product(),
      product({ id: 'product-2', price: 'free' }),
    ]);
    expect(JSON.parse(window.localStorage.getItem('wishlist:v1') || '[]')).toHaveLength(2);
    expect(loadWishlistFromStorage()).toEqual([
      product(),
      product({ id: 'product-2', price: 'free' }),
    ]);
  });

  it.each([null, {}, 'wrong-root'])('resets wrong wishlist roots (%p)', (root) => {
    window.localStorage.setItem('wishlist:v1', JSON.stringify(root));
    expect(loadWishlistFromStorage()).toEqual([]);
    expect(JSON.parse(window.localStorage.getItem('wishlist:v1') || 'null')).toEqual([]);
  });

  it('repairs malformed JSON and preserves data if storage access throws', () => {
    window.localStorage.setItem('wishlist:v1', '{broken');
    expect(loadWishlistFromStorage()).toEqual([]);
    expect(JSON.parse(window.localStorage.getItem('wishlist:v1') || 'null')).toEqual([]);

    jest.restoreAllMocks();
    const getItem = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage denied');
    });
    const setItem = jest.spyOn(Storage.prototype, 'setItem');
    expect(loadWishlistFromStorage()).toEqual([]);
    expect(getItem).toHaveBeenCalledWith('wishlist:v1');
    expect(setItem).not.toHaveBeenCalled();
  });

  it('rejects invalid action ingress and moves valid products to cart once', () => {
    let wishlist = wishlistReducer(undefined, addToWishlist(product({ id: undefined }) as never));
    expect(wishlist.products).toEqual([]);
    wishlist = wishlistReducer(wishlist, toggleWishlist(product() as never));
    wishlist = wishlistReducer(wishlist, addToWishlist(product() as never));
    expect(wishlist.products).toHaveLength(1);

    const store = configureStore({
      reducer: { shopCart: shopCartReducer, wishlist: wishlistReducer },
      preloadedState: {
        shopCart: { products: [], loading: false, total: 0 } satisfies ShopCartState,
        wishlist: { products: [product()] } satisfies WishlistState,
      },
    });
    (store.dispatch as AppDispatch)(moveWishlistItemToCart('product-1'));
    (store.dispatch as AppDispatch)(moveWishlistItemToCart('product-1'));

    expect(store.getState().shopCart.products).toHaveLength(1);
    expect(store.getState().shopCart.total).toBe(12.5);
    expect(store.getState().wishlist.products).toEqual([]);
  });

  it('keeps an item in wishlist when it lacks the required cart price', () => {
    const store = configureStore({
      reducer: { shopCart: shopCartReducer, wishlist: wishlistReducer },
      preloadedState: {
        shopCart: { products: [], loading: false, total: 0 } satisfies ShopCartState,
        wishlist: { products: [product({ price: undefined })] } satisfies WishlistState,
      },
    });

    (store.dispatch as AppDispatch)(moveWishlistItemToCart('product-1'));
    expect(store.getState().shopCart.products).toEqual([]);
    expect(store.getState().wishlist.products).toHaveLength(1);
  });
});
