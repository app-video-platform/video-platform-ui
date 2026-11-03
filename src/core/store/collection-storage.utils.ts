import { ProductMinimised, ProductType } from 'core/api/models';

const PRODUCT_TYPES: ProductType[] = [
  'COURSE',
  'DOWNLOAD',
  'CONSULTATION',
  'MEMBERSHIP',
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isOptionalString = (value: unknown) =>
  value === undefined || typeof value === 'string';

const isOptionalDate = (value: unknown) =>
  value === undefined ||
  (value instanceof Date && !Number.isNaN(value.getTime())) ||
  (typeof value === 'string' && !Number.isNaN(Date.parse(value)));

const isOptionalPrice = (value: unknown) =>
  value === undefined ||
  value === 'free' ||
  (typeof value === 'number' && Number.isFinite(value) && value >= 0);

export const isValidWishlistProduct = (
  value: unknown,
): value is ProductMinimised & { id: string } => {
  if (!isRecord(value) || typeof value.id !== 'string' || !value.id.trim()) {
    return false;
  }

  return (
    isOptionalString(value.title) &&
    isOptionalString(value.description) &&
    (value.type === undefined || PRODUCT_TYPES.includes(value.type as ProductType)) &&
    isOptionalPrice(value.price) &&
    (value.pricingModel === undefined ||
      value.pricingModel === 'ONE_TIME' ||
      value.pricingModel === 'RECURRING') &&
    (value.billingInterval === undefined ||
      value.billingInterval === 'MONTH' ||
      value.billingInterval === 'YEAR') &&
    (value.currency === undefined || value.currency === 'EUR') &&
    (value.status === undefined ||
      value.status === 'DRAFT' ||
      value.status === 'HIDDEN' ||
      value.status === 'PUBLISHED') &&
    isOptionalString(value.imageUrl) &&
    isOptionalString(value.createdById) &&
    isOptionalString(value.createdByName) &&
    isOptionalString(value.createdByTitle) &&
    isOptionalDate(value.createdAt) &&
    isOptionalDate(value.updatedAt) &&
    // The current collections store one entry per Product, not quantity rows.
    (value.quantity === undefined || value.quantity === 1)
  );
};

export const isValidCartProduct = (
  value: unknown,
): value is ProductMinimised & { id: string; price: number | 'free' } =>
  isValidWishlistProduct(value) && value.price !== undefined;

const normalizeProductDates = (product: ProductMinimised): ProductMinimised => {
  const stored = product as ProductMinimised & {
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  return {
    ...product,
    createdAt:
      typeof stored.createdAt === 'string'
        ? new Date(stored.createdAt)
        : stored.createdAt,
    updatedAt:
      typeof stored.updatedAt === 'string'
        ? new Date(stored.updatedAt)
        : stored.updatedAt,
  };
};

export const normalizeCollectionProducts = (
  value: unknown,
  isValid: (item: unknown) => item is ProductMinimised,
): ProductMinimised[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const products: ProductMinimised[] = [];
  const ids = new Set<string>();
  for (const item of value) {
    if (!isValid(item) || !item.id || ids.has(item.id)) {
      continue;
    }
    ids.add(item.id);
    products.push(normalizeProductDates(item));
  }
  return products;
};

export const getCollectionPrice = (product: ProductMinimised): number =>
  product.price === 'free' ? 0 : (product.price as number);
