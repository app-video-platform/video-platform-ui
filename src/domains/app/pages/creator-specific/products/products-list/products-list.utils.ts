import {
  ProductBillingInterval,
  ProductMinimised,
  ProductPricingModel,
  ProductStatus,
  ProductType,
} from 'core/api/models';
import { PRODUCT_TYPE_REGISTRY } from 'core/constants';

interface ProductPricingFields {
  price?: number | 'free';
  pricingModel?: ProductPricingModel;
  billingInterval?: ProductBillingInterval;
  type?: ProductType;
}

export type ProductsStatusFilter = 'all' | ProductStatus;
export type ProductsTypeFilter = 'all' | ProductType;
export type ProductsSortOption =
  | 'updated-desc'
  | 'created-desc'
  | 'created-asc'
  | 'name-asc'
  | 'name-desc';

export interface ProductsFilterForm {
  search: string;
  statusFilter: ProductsStatusFilter;
  typeFilter: ProductsTypeFilter;
  sort: ProductsSortOption;
}

export const defaultProductsFilterForm: ProductsFilterForm = {
  search: '',
  statusFilter: 'all',
  typeFilter: 'all',
  sort: 'updated-desc',
};

const parseTimestamp = (value?: Date | string | null) => {
  if (!value) {
    return 0;
  }

  const timestamp =
    value instanceof Date ? value.getTime() : new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const getProductName = (product: ProductMinimised) =>
  product.title?.trim() || 'Untitled product';

export const getProductTypeLabel = (type?: ProductType) =>
  type ? PRODUCT_TYPE_REGISTRY[type].label : 'Product';

export const getProductStatusLabel = (status?: ProductStatus) => {
  if (status === 'PUBLISHED') {
    return 'Published';
  }
  if (status === 'HIDDEN') {
    return 'Hidden';
  }
  return 'Draft';
};

const billingIntervalLabel: Record<ProductBillingInterval, string> = {
  MONTH: 'month',
  YEAR: 'year',
};

export const formatProductDate = (
  value?: Date | string | null,
  fallbackLabel = 'Unavailable',
) => {
  if (!value) {
    return {
      shortLabel: fallbackLabel,
      fullLabel: fallbackLabel,
      iso: undefined,
    };
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return {
      shortLabel: fallbackLabel,
      fullLabel: fallbackLabel,
      iso: undefined,
    };
  }

  return {
    shortLabel: new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
    }).format(date),
    fullLabel: new Intl.DateTimeFormat('en', {
      dateStyle: 'full',
    }).format(date),
    iso: date.toISOString(),
  };
};

export const formatProductPrice = (
  product: ProductPricingFields,
  options: { showInspectionRecurringMembership?: boolean } = {},
) => {
  if (product.price === 'free' || product.price === 0) {
    return 'Free';
  }

  if (typeof product.price !== 'number') {
    return 'Price not set';
  }

  const formatted = new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: Number.isInteger(product.price) ? 0 : 2,
  }).format(product.price);

  if (product.pricingModel === 'RECURRING' && product.billingInterval) {
    return `${formatted} / ${billingIntervalLabel[product.billingInterval]}`;
  }

  if (options.showInspectionRecurringMembership && product.type === 'MEMBERSHIP') {
    return `${formatted} / month`;
  }

  return formatted;
};

export const formatProductUpdatedDate = (product: ProductMinimised) => {
  const value = product.updatedAt ?? product.createdAt;

  return formatProductDate(value, 'Not updated');
};

export const filterAndSortProducts = (
  products: ProductMinimised[] | null,
  filterForm: ProductsFilterForm,
) => {
  if (!products) {
    return [];
  }

  const term = filterForm.search.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const matchesSearch =
      term === '' || getProductName(product).toLowerCase().includes(term);
    const matchesStatus =
      filterForm.statusFilter === 'all' ||
      (product.status ?? 'DRAFT') === filterForm.statusFilter;
    const matchesType =
      filterForm.typeFilter === 'all' || product.type === filterForm.typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return filtered.slice().sort((a, b) => {
    switch (filterForm.sort) {
    case 'created-desc':
      return parseTimestamp(b.createdAt) - parseTimestamp(a.createdAt);
    case 'created-asc':
      return parseTimestamp(a.createdAt) - parseTimestamp(b.createdAt);
    case 'name-asc':
      return getProductName(a).localeCompare(getProductName(b));
    case 'name-desc':
      return getProductName(b).localeCompare(getProductName(a));
    case 'updated-desc':
    default:
      return (
        parseTimestamp(b.updatedAt ?? b.createdAt) -
        parseTimestamp(a.updatedAt ?? a.createdAt)
      );
    }
  });
};
