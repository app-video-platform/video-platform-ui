import { SelectOption } from '@shared/ui';
import { StatusBadgeTone } from '@shared/ui/status-badge';

import {
  SalesOrder,
  SalesOrderStatus,
  SalesOrderType,
  SalesProductType,
} from 'core/api/models';

export type SalesPeriod = 'today' | '7d' | '30d' | '90d';
export type SalesStatusFilter = 'all' | SalesOrderStatus;
export type SalesSortOption = 'newest' | 'oldest' | 'amount-desc' | 'amount-asc';

export interface SalesFilterForm {
  search: string;
  period: SalesPeriod;
  status: SalesStatusFilter;
  product: string;
  sort: SalesSortOption;
}

export const defaultSalesFilterForm: SalesFilterForm = {
  search: '',
  period: '30d',
  status: 'all',
  product: 'all',
  sort: 'newest',
};

export const salesPeriodOptions: SelectOption[] = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
];

export const salesStatusOptions: SelectOption[] = [
  { label: 'All statuses', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Failed', value: 'failed' },
  { label: 'Refunded', value: 'refunded' },
  { label: 'Pending', value: 'pending' },
];

export const salesSortOptions: SelectOption[] = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Oldest first', value: 'oldest' },
  { label: 'Amount: high to low', value: 'amount-desc' },
  { label: 'Amount: low to high', value: 'amount-asc' },
];

export const orderStatusLabel: Record<SalesOrderStatus, string> = {
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
  pending: 'Pending',
};

export const orderStatusTone: Record<SalesOrderStatus, StatusBadgeTone> = {
  paid: 'success',
  failed: 'danger',
  refunded: 'warning',
  pending: 'neutral',
};

export const orderTypeLabel: Record<SalesOrderType, string> = {
  'one-time': 'One-time',
  subscription: 'Subscription',
  renewal: 'Renewal',
};

export const productTypeLabel: Record<SalesProductType, string> = {
  Course: 'Course',
  Download: 'Download',
  Consultation: 'Consultation',
  Membership: 'Membership',
};

export const subscriptionStateLabel: Record<string, string> = {
  active: 'Active',
  past_due: 'Past due',
  cancelled: 'Cancelled',
};

const periodStartByValue: Record<SalesPeriod, string> = {
  today: '2026-08-10T00:00:00.000Z',
  '7d': '2026-08-04T00:00:00.000Z',
  '30d': '2026-07-12T00:00:00.000Z',
  '90d': '2026-05-12T00:00:00.000Z',
};

const parseTimestamp = (value?: string) => {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const formatSalesMoney = (cents: number, currency = 'EUR') =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency,
    maximumFractionDigits: Number.isInteger(cents / 100) ? 0 : 2,
  }).format(cents / 100);

export const formatSalesShortDate = (value?: string) => {
  const timestamp = parseTimestamp(value);
  if (!timestamp) {
    return 'Unavailable';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp));
};

export const formatSalesDateTime = (value?: string) => {
  const timestamp = parseTimestamp(value);
  if (!timestamp) {
    return 'Unavailable';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(timestamp));
};

export const getSalesProductOptions = (orders: SalesOrder[]): SelectOption[] => {
  const productMap = new Map<string, string>();

  orders.forEach((order) => {
    if (order.product.id) {
      productMap.set(order.product.id, order.product.name);
    }
  });

  return Array.from(productMap.entries()).map(([value, label]) => ({
    value,
    label,
  }));
};

export const filterAndSortSalesOrders = (
  orders: SalesOrder[],
  filterForm: SalesFilterForm,
) => {
  const term = filterForm.search.trim().toLowerCase();
  const periodStart = parseTimestamp(periodStartByValue[filterForm.period]);

  const filtered = orders.filter((order) => {
    const orderedAt = parseTimestamp(order.orderedAt);
    const matchesPeriod = orderedAt >= periodStart;
    const matchesSearch =
      term === '' ||
      order.id.toLowerCase().includes(term) ||
      order.customer.name.toLowerCase().includes(term) ||
      order.customer.email.toLowerCase().includes(term);
    const matchesStatus =
      filterForm.status === 'all' || order.status === filterForm.status;
    const matchesProduct =
      filterForm.product === 'all' || order.product.id === filterForm.product;

    return matchesPeriod && matchesSearch && matchesStatus && matchesProduct;
  });

  return filtered.slice().sort((a, b) => {
    switch (filterForm.sort) {
    case 'oldest':
      return parseTimestamp(a.orderedAt) - parseTimestamp(b.orderedAt);
    case 'amount-desc':
      return b.amountCents - a.amountCents;
    case 'amount-asc':
      return a.amountCents - b.amountCents;
    case 'newest':
    default:
      return parseTimestamp(b.orderedAt) - parseTimestamp(a.orderedAt);
    }
  });
};

export const getSalesMetrics = (orders: SalesOrder[]) => {
  const paidOrders = orders.filter((order) => order.status === 'paid');
  const refundedValueCents = orders.reduce(
    (total, order) => total + (order.refund?.amountCents ?? 0),
    0,
  );

  return [
    {
      label: 'Revenue',
      value: formatSalesMoney(
        paidOrders.reduce((total, order) => total + order.amountCents, 0),
      ),
      direction: 'up',
      sentiment: 'favorable',
      comparison: '+8% vs prior period',
    },
    {
      label: 'Orders',
      value: String(paidOrders.length),
      direction: 'up',
      sentiment: 'favorable',
      comparison: '+2 vs prior period',
    },
    {
      label: 'Refunds',
      value: formatSalesMoney(refundedValueCents),
      direction: 'down',
      sentiment: 'favorable',
      comparison: '-1 vs prior period',
    },
    {
      label: 'Failed payments',
      value: String(orders.filter((order) => order.status === 'failed').length),
      direction: 'down',
      sentiment: 'favorable',
      comparison: '-2 vs prior period',
    },
  ];
};
