import {
  CreatorCustomer,
  CustomerAccessSource,
  CustomerAccessStatus,
  CustomerMembershipState,
  CustomerPurchaseStatus,
  CustomerRelationshipStatus,
} from './creator-customers.types';

export type CustomerStatusFilter = 'all' | CustomerRelationshipStatus;
export type CustomerMembershipFilter = 'all' | CustomerMembershipState;
export type CustomerSortOption =
  | 'last-activity-desc'
  | 'spend-desc'
  | 'spend-asc'
  | 'name-asc'
  | 'name-desc';

export interface CustomerFilterForm {
  search: string;
  status: CustomerStatusFilter;
  product: string;
  membership: CustomerMembershipFilter;
  sort: CustomerSortOption;
}

export const defaultCustomerFilterForm: CustomerFilterForm = {
  search: '',
  status: 'all',
  product: 'all',
  membership: 'all',
  sort: 'last-activity-desc',
};

export const relationshipLabel: Record<CustomerRelationshipStatus, string> = {
  'active-member': 'Active member',
  'past-due': 'Past due',
  buyer: 'Buyer',
  waitlist: 'Waitlist',
};

export const membershipLabel: Record<CustomerMembershipState, string> = {
  active: 'Active',
  past_due: 'Past due',
  cancelled: 'Cancelled',
  none: 'None',
};

export const accessStatusLabel: Record<CustomerAccessStatus, string> = {
  active: 'Active',
  expired: 'Expired',
  revoked: 'Revoked',
};

export const accessSourceLabel: Record<CustomerAccessSource, string> = {
  purchased: 'Purchased',
  membership: 'Membership',
  manual: 'Manual grant',
};

export const purchaseStatusLabel: Record<CustomerPurchaseStatus, string> = {
  paid: 'Paid',
  refunded: 'Refunded',
  failed: 'Failed',
};

export const getCustomerDisplayName = (customer: CreatorCustomer) =>
  customer.name?.trim() || customer.email;

export const getCustomerInitials = (customer: CreatorCustomer) => {
  const name = customer.name?.trim();
  if (!name) {
    return customer.email.charAt(0).toUpperCase();
  }

  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
};

export const formatCustomerMoney = (cents: number) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: Number.isInteger(cents / 100) ? 0 : 2,
  }).format(cents / 100);

export const formatCustomerDate = (value?: string) => {
  if (!value) {
    return 'Unavailable';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unavailable';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatCustomerShortDate = (value?: string) => {
  if (!value) {
    return 'Unavailable';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unavailable';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const getProductSummaryLabel = (customer: CreatorCustomer) => {
  if (customer.products.length === 0) {
    return {
      count: 'No products',
      detail: 'Waitlist only',
    };
  }

  const types = customer.products.map((product) => product.type);
  const visibleTypes = types.slice(0, 2);
  const remaining = types.length - visibleTypes.length;

  return {
    count: `${customer.products.length} ${
      customer.products.length === 1 ? 'product' : 'products'
    }`,
    detail:
      remaining > 0
        ? `${visibleTypes.join(' · ')} · +${remaining}`
        : visibleTypes.join(' · '),
  };
};

const parseTimestamp = (value?: string) => {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const filterAndSortCustomers = (
  customers: CreatorCustomer[],
  filterForm: CustomerFilterForm,
) => {
  const term = filterForm.search.trim().toLowerCase();

  const filtered = customers.filter((customer) => {
    const matchesSearch =
      term === '' ||
      getCustomerDisplayName(customer).toLowerCase().includes(term) ||
      customer.email.toLowerCase().includes(term);
    const matchesStatus =
      filterForm.status === 'all' ||
      customer.relationshipStatus === filterForm.status;
    const matchesProduct =
      filterForm.product === 'all' ||
      customer.products.some((product) => product.id === filterForm.product);
    const matchesMembership =
      filterForm.membership === 'all' ||
      customer.membershipState === filterForm.membership;

    return matchesSearch && matchesStatus && matchesProduct && matchesMembership;
  });

  return filtered.slice().sort((a, b) => {
    switch (filterForm.sort) {
    case 'spend-desc':
      return b.totalSpendCents - a.totalSpendCents;
    case 'spend-asc':
      return a.totalSpendCents - b.totalSpendCents;
    case 'name-asc':
      return getCustomerDisplayName(a).localeCompare(getCustomerDisplayName(b));
    case 'name-desc':
      return getCustomerDisplayName(b).localeCompare(getCustomerDisplayName(a));
    case 'last-activity-desc':
    default:
      return parseTimestamp(b.lastActivityAt) - parseTimestamp(a.lastActivityAt);
    }
  });
};

export const getCustomerProductOptions = (customers: CreatorCustomer[]) => {
  const productMap = new Map<string, string>();
  customers.forEach((customer) => {
    customer.products.forEach((product) => {
      productMap.set(product.id, product.name);
    });
  });

  return Array.from(productMap.entries()).map(([value, label]) => ({
    value,
    label,
  }));
};
