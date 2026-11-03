import shopCartReducer, {
  addProductToCart,
  loadCartFromStorage,
  normalizeCartState,
  removeProductFromCart,
  saveCartToStorage,
  ShopCartState,
} from './shop-cart.slice';

const product = (overrides: Record<string, unknown> = {}) => ({
  id: 'product-1',
  title: 'Course',
  type: 'COURSE',
  price: 12.5,
  status: 'PUBLISHED',
  createdById: 'creator-1',
  ...overrides,
});

describe('Shop Cart persistence boundary', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
  });

  it('hydrates valid arrays, deduplicates ids and recomputes derived state', () => {
    window.localStorage.setItem(
      'cart:v1',
      JSON.stringify({
        products: [product(), product({ price: 99 }), product({ id: 'free', price: 'free' })],
        loading: true,
        total: -999,
      }),
    );

    expect(loadCartFromStorage()).toEqual({
      products: [product(), product({ id: 'free', price: 'free' })],
      loading: false,
      total: 12.5,
    });
    expect(JSON.parse(window.localStorage.getItem('cart:v1') || '{}').total).toBe(12.5);
    expect(loadCartFromStorage()?.products).toEqual([
      product(),
      product({ id: 'free', price: 'free' }),
    ]);
  });

  it.each([null, [], 'wrong-root', { total: 12 }])(
    'safely resets wrong root or missing product arrays (%p)',
    (root) => {
      window.localStorage.setItem('cart:v1', JSON.stringify(root));
      expect(loadCartFromStorage()).toEqual({ products: [], loading: false, total: 0 });
      expect(JSON.parse(window.localStorage.getItem('cart:v1') || 'null')).toEqual({
        products: [], loading: false, total: 0,
      });
    },
  );

  it('drops null, missing-id, invalid-price and unsupported-quantity entries', () => {
    const normalized = normalizeCartState({
      products: [
        null,
        product({ id: undefined }),
        product({ id: 'negative', price: -1 }),
        product({ id: 'infinite', price: Infinity }),
        product({ id: 'string-price', price: '12.5' }),
        product({ id: 'null-price', price: null }),
        product({ id: 'no-price', price: undefined }),
        product({ id: 'bad-quantity', quantity: 0 }),
        product({ id: 'good', price: 3 }),
      ],
      total: 700,
    });

    expect(normalized.products).toEqual([product({ id: 'good', price: 3 })]);
    expect(normalized.total).toBe(3);
  });

  it('repairs malformed JSON and continues with an empty cart', () => {
    window.localStorage.setItem('cart:v1', '{broken');

    expect(loadCartFromStorage()).toBeUndefined();
    expect(JSON.parse(window.localStorage.getItem('cart:v1') || '{}')).toEqual({
      products: [],
      loading: false,
      total: 0,
    });
  });

  it('preserves storage when browser storage reads are unavailable', () => {
    const getItem = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage denied');
    });
    const setItem = jest.spyOn(Storage.prototype, 'setItem');

    expect(loadCartFromStorage()).toBeUndefined();
    expect(getItem).toHaveBeenCalledWith('cart:v1');
    expect(setItem).not.toHaveBeenCalled();
  });

  it('does not throw when browser storage writes are unavailable', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage denied');
    });
    expect(() => saveCartToStorage({ products: [], loading: false, total: 0 })).not.toThrow();
  });

  it('rejects malformed action ingress and keeps valid remove/add flows', () => {
    const bad = product({ id: undefined }) as never;
    let state = shopCartReducer(undefined, addProductToCart(bad));
    expect(state.products).toEqual([]);

    state = shopCartReducer(state, addProductToCart(product() as never));
    state = shopCartReducer(state, addProductToCart(product() as never));
    expect(state.products).toHaveLength(1);
    expect(state.total).toBe(12.5);

    state = shopCartReducer(state, removeProductFromCart('product-1'));
    expect(state).toEqual({ products: [], loading: false, total: 0 } satisfies ShopCartState);
  });
});
