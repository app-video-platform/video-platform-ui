import { ProductMinimised } from 'core/api/models';
import {
  createCommerceCheckoutSessionAPI,
  getCommerceOrderAPI,
} from 'core/api/services';
import {
  formatCommerceAmount,
  getCartCheckoutKind,
  getCommerceErrorMessage,
  getIdempotencyKeyForCart,
  startPaidCheckout,
  validatePaidCart,
} from './cart-checkout.utils';

jest.mock('core/api/services', () => ({
  createCommerceCheckoutSessionAPI: jest.fn(),
  getCommerceOrderAPI: jest.fn(),
}));

const paidProduct = (
  overrides: Partial<ProductMinimised> = {},
): ProductMinimised => ({
  id: 'product-1',
  title: 'Paid product',
  price: 25,
  status: 'PUBLISHED',
  createdById: 'creator-1',
  ...overrides,
});

const mockCryptoRandomUUID = (ids: string[]) => {
  const randomUUID = jest.fn(() => ids.shift() ?? 'fallback-key');
  Object.defineProperty(global, 'crypto', {
    value: { randomUUID },
    configurable: true,
  });
  return randomUUID;
};

describe('cart checkout utils', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('classifies free, paid, mixed, and empty carts', () => {
    expect(getCartCheckoutKind([])).toBe('EMPTY');
    expect(getCartCheckoutKind([paidProduct({ price: 'free' })])).toBe('FREE');
    expect(getCartCheckoutKind([paidProduct()])).toBe('PAID');
    expect(
      getCartCheckoutKind([paidProduct(), paidProduct({ id: 'free', price: 'free' })]),
    ).toBe('MIXED');
  });

  it('rejects free products before paid checkout', () => {
    expect(validatePaidCart([paidProduct({ price: 'free' })])).toEqual({
      valid: false,
      message: 'Free products use free enrollment and cannot enter paid checkout.',
    });
  });

  it('rejects mixed free and paid carts', () => {
    expect(
      validatePaidCart([
        paidProduct(),
        paidProduct({ id: 'free-product', price: 'free' }),
      ]),
    ).toEqual({
      valid: false,
      message:
        'Free and paid products cannot be checked out together. Please split your cart.',
    });
  });

  it('rejects duplicate, mixed-Creator, oversized, own, and unpublished carts', () => {
    expect(validatePaidCart([paidProduct(), paidProduct()]).valid).toBe(false);
    expect(
      validatePaidCart([
        paidProduct(),
        paidProduct({ id: 'product-2', createdById: 'creator-2' }),
      ]).message,
    ).toBe('Products from different Creators cannot be checked out together.');
    expect(
      validatePaidCart(
        Array.from({ length: 21 }, (_, index) =>
          paidProduct({ id: `product-${index}` }),
        ),
      ).message,
    ).toBe('Checkout supports up to 20 products at a time.');
    expect(validatePaidCart([paidProduct()], 'creator-1').message).toBe(
      'You cannot buy your own product.',
    );
    expect(
      validatePaidCart([paidProduct({ status: 'DRAFT' })]).message,
    ).toBe('Only published products can be checked out.');
  });

  it('reuses the idempotency key for an unchanged cart and rotates it when the cart changes', () => {
    const randomUUID = mockCryptoRandomUUID(['key-a', 'key-b']);

    expect(getIdempotencyKeyForCart(['product-1'], 1000)).toBe('key-a');
    expect(getIdempotencyKeyForCart(['product-1'], 2000)).toBe('key-a');
    expect(getIdempotencyKeyForCart(['product-1', 'product-2'], 3000)).toBe(
      'key-b',
    );
    expect(randomUUID).toHaveBeenCalledTimes(2);
  });

  it('rotates stale idempotency state for an identical cart', () => {
    const randomUUID = mockCryptoRandomUUID(['key-a', 'key-b']);

    expect(getIdempotencyKeyForCart(['product-1'], 1000)).toBe('key-a');
    expect(getIdempotencyKeyForCart(['product-1'], 31 * 60 * 1000)).toBe(
      'key-b',
    );
    expect(randomUUID).toHaveBeenCalledTimes(2);
  });

  it('starts paid checkout with only productIds and the generated key', async () => {
    mockCryptoRandomUUID(['checkout-key']);
    (createCommerceCheckoutSessionAPI as jest.Mock).mockResolvedValue({
      orderId: 'order-1',
      status: 'PENDING',
      provider: 'fake',
    });
    (getCommerceOrderAPI as jest.Mock).mockResolvedValue({
      orderId: 'order-1',
      status: 'PAID',
    });

    await startPaidCheckout([
      paidProduct({ id: 'product-1', price: 10 }),
      paidProduct({ id: 'product-2', price: 20 }),
    ]);

    expect(createCommerceCheckoutSessionAPI).toHaveBeenCalledWith(
      ['product-1', 'product-2'],
      'checkout-key',
    );
  });

  it('redirects when checkoutUrl is present and does not poll immediately', async () => {
    const assign = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { assign },
      configurable: true,
    });
    mockCryptoRandomUUID(['checkout-key']);
    (createCommerceCheckoutSessionAPI as jest.Mock).mockResolvedValue({
      orderId: 'order-1',
      status: 'PENDING',
      checkoutUrl: 'https://pay.example.test/session',
    });

    await startPaidCheckout([paidProduct()]);

    expect(assign).toHaveBeenCalledWith('https://pay.example.test/session');
    expect(getCommerceOrderAPI).not.toHaveBeenCalled();
  });

  it('handles fake gateway responses without a checkout URL by resolving order status', async () => {
    mockCryptoRandomUUID(['checkout-key']);
    (createCommerceCheckoutSessionAPI as jest.Mock).mockResolvedValue({
      orderId: 'order-1',
      status: 'PENDING',
      checkoutUrl: null,
    });
    (getCommerceOrderAPI as jest.Mock).mockResolvedValue({
      orderId: 'order-1',
      status: 'PENDING',
    });

    const result = await startPaidCheckout([paidProduct()]);

    expect(result.order?.status).toBe('PENDING');
    expect(getCommerceOrderAPI).toHaveBeenCalledWith('order-1');
  });

  it('formats Commerce totals from minor units', () => {
    expect(formatCommerceAmount(1234, 'EUR')).toBe('€12.34');
  });

  it('maps important Commerce HTTP errors to user-facing copy', () => {
    expect(getCommerceErrorMessage({ response: { status: 400 } })).toBe(
      'Checkout could not start. Please try again.',
    );
    expect(getCommerceErrorMessage({ response: { status: 409 } })).toContain(
      'already own',
    );
    expect(getCommerceErrorMessage({ response: { status: 422 } })).toContain(
      'cannot be checked out',
    );
    expect(getCommerceErrorMessage({ response: { status: 503 } })).toContain(
      'not configured',
    );
  });
});
