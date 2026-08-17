import { AxiosError } from 'axios';

import {
  CommerceCheckoutSession,
  CommerceOrder,
  CommerceOrderStatus,
  ProductMinimised,
} from 'core/api/models';
import {
  createCommerceCheckoutSessionAPI,
  getCommerceOrderAPI,
} from 'core/api/services';

const IDEMPOTENCY_STORAGE_KEY = 'commerceCheckout:idempotency:v1';
const IDEMPOTENCY_TTL_MS = 30 * 60 * 1000;
const MAX_CHECKOUT_PRODUCTS = 20;

interface StoredIdempotency {
  cartSignature: string;
  key: string;
  createdAt: number;
}

export type CartCheckoutKind = 'FREE' | 'PAID' | 'MIXED' | 'EMPTY';

export interface CartValidationResult {
  valid: boolean;
  message?: string;
}

export interface PaidCheckoutResult {
  session: CommerceCheckoutSession;
  order?: CommerceOrder;
}

export const getProductPriceAmount = (product: ProductMinimised): number => {
  if (product.price === 'free' || product.price === null || product.price === undefined) {
    return 0;
  }

  return Number(product.price) || 0;
};

export const getCartCheckoutKind = (
  products: ProductMinimised[],
): CartCheckoutKind => {
  if (products.length === 0) {
    return 'EMPTY';
  }

  const freeCount = products.filter(
    (product) => getProductPriceAmount(product) === 0,
  ).length;

  if (freeCount === products.length) {
    return 'FREE';
  }

  if (freeCount === 0) {
    return 'PAID';
  }

  return 'MIXED';
};

export const formatCommerceAmount = (
  totalMinor?: number,
  currency = 'EUR',
): string | null => {
  if (typeof totalMinor !== 'number') {
    return null;
  }

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(totalMinor / 100);
};

export const validatePaidCart = (
  products: ProductMinimised[],
  buyerId?: string,
): CartValidationResult => {
  if (products.length === 0) {
    return { valid: false, message: 'Your cart is empty.' };
  }

  if (products.length > MAX_CHECKOUT_PRODUCTS) {
    return {
      valid: false,
      message: 'Checkout supports up to 20 products at a time.',
    };
  }

  if (getCartCheckoutKind(products) === 'MIXED') {
    return {
      valid: false,
      message:
        'Free and paid products cannot be checked out together. Please split your cart.',
    };
  }

  if (products.some((product) => getProductPriceAmount(product) === 0)) {
    return {
      valid: false,
      message: 'Free products use free enrollment and cannot enter paid checkout.',
    };
  }

  if (products.some((product) => product.type === 'MEMBERSHIP')) {
    return {
      valid: false,
      message: 'Membership checkout is not available yet.',
    };
  }

  const productIds = products
    .map((product) => product.id)
    .filter((id): id is string => Boolean(id));

  if (productIds.length !== products.length) {
    return {
      valid: false,
      message: 'One or more cart products cannot be checked out yet.',
    };
  }

  if (new Set(productIds).size !== productIds.length) {
    return {
      valid: false,
      message: 'Duplicate products cannot be checked out together.',
    };
  }

  const creatorIds = products
    .map((product) => product.createdById)
    .filter((id): id is string => Boolean(id));

  if (creatorIds.length === products.length && new Set(creatorIds).size > 1) {
    return {
      valid: false,
      message: 'Products from different Creators cannot be checked out together.',
    };
  }

  if (
    buyerId &&
    products.some((product) => product.createdById && product.createdById === buyerId)
  ) {
    return {
      valid: false,
      message: 'You cannot buy your own product.',
    };
  }

  if (
    products.some(
      (product) => product.status && product.status !== 'PUBLISHED',
    )
  ) {
    return {
      valid: false,
      message: 'Only published products can be checked out.',
    };
  }

  return { valid: true };
};

export const getPaidProductIds = (products: ProductMinimised[]): string[] =>
  products
    .filter((product) => getProductPriceAmount(product) > 0)
    .map((product) => product.id)
    .filter((id): id is string => Boolean(id));

export const getCartSignature = (productIds: string[]): string =>
  [...productIds].sort().join('|');

const readStoredIdempotency = (): StoredIdempotency | null => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    const raw = window.sessionStorage.getItem(IDEMPOTENCY_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredIdempotency) : null;
  } catch {
    return null;
  }
};

const writeStoredIdempotency = (entry: StoredIdempotency) => {
  try {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(
      IDEMPOTENCY_STORAGE_KEY,
      JSON.stringify(entry),
    );
  } catch {
    /* ignore storage errors */
  }
};

export const getIdempotencyKeyForCart = (
  productIds: string[],
  now = Date.now(),
): string => {
  const cartSignature = getCartSignature(productIds);
  const existing = readStoredIdempotency();

  if (
    existing?.cartSignature === cartSignature &&
    now - existing.createdAt < IDEMPOTENCY_TTL_MS
  ) {
    return existing.key;
  }

  const key = crypto.randomUUID();
  writeStoredIdempotency({ cartSignature, key, createdAt: now });

  return key;
};

export const getCommerceErrorMessage = (error: unknown): string => {
  const status = (error as AxiosError)?.response?.status;

  switch (status) {
  case 400:
    return 'Checkout could not start. Please try again.';
  case 409:
    return 'Checkout could not continue because this cart changed or includes a product you already own.';
  case 422:
    return 'This cart cannot be checked out. Please review the products and try again.';
  case 503:
    return 'Payments are not configured right now. Please try again later.';
  default:
    return 'Checkout could not be started. Please try again.';
  }
};

export const isSuccessfulOrderStatus = (status: CommerceOrderStatus) =>
  status === 'PAID';

export const isTerminalUnsuccessfulOrderStatus = (
  status: CommerceOrderStatus,
) => status === 'FAILED' || status === 'EXPIRED' || status === 'REFUNDED';

export const startPaidCheckout = async (
  products: ProductMinimised[],
): Promise<PaidCheckoutResult> => {
  const productIds = getPaidProductIds(products);
  const idempotencyKey = getIdempotencyKeyForCart(productIds);
  const session = await createCommerceCheckoutSessionAPI(
    productIds,
    idempotencyKey,
  );

  if (session.checkoutUrl) {
    window.location.assign(session.checkoutUrl);
    return { session };
  }

  if (!session.orderId) {
    return { session };
  }

  const order = await getCommerceOrderAPI(session.orderId);
  return { session, order };
};
