import { PageResponse } from '../admin';

export type SalesPeriod = 'today' | '7d' | '30d' | '90d';
export type SalesOrderStatus = 'paid' | 'failed' | 'refunded' | 'pending';
export type SalesOrderType = 'one-time' | 'subscription' | 'renewal';
export type SalesProductType = 'Course' | 'Download' | 'Consultation' | 'Membership';
export type SalesAccessState = 'granted' | 'revoked' | 'none';
export type SalesMetricDirection = 'up' | 'down' | 'flat';
export type SalesMetricSentiment = 'favorable' | 'unfavorable' | 'neutral';

export interface CreatorSalesMetric {
  label: string;
  value: string;
  direction: SalesMetricDirection;
  sentiment: SalesMetricSentiment;
  comparison: string;
}

export interface CreatorSalesSummary {
  period: SalesPeriod;
  metrics: CreatorSalesMetric[];
}

export interface SalesCustomerSummary {
  id?: string;
  name: string;
  email: string;
}

export interface SalesProductSummary {
  id: string;
  name: string;
  type: SalesProductType;
  thumbnailUrl?: string;
}

export type SalesAccessResultLabel =
  | 'No access granted'
  | 'Access granted'
  | 'Access revoked';

export interface SalesAccessResult {
  state: SalesAccessState;
  label: SalesAccessResultLabel;
  detail?: string;
}

export interface CreatorSalesOrderItem {
  product: SalesProductSummary;
  amountCents: number;
  access: SalesAccessResult;
}

export interface SalesRefundDetail {
  amountCents: number;
  refundedAt: string;
  reason?: string;
}

export interface SalesFailureDetail {
  message: string;
  retryAt?: string;
}

export interface SalesSubscriptionContext {
  priceCents: number;
  currency: string;
  interval: 'month' | 'year';
  state: 'active' | 'past_due' | 'cancelled';
  nextBillingAt?: string;
}

export interface SalesOrderSummaryRow {
  label: string;
  amountCents: number;
}

export interface SalesOrderListItem {
  id: string;
  orderedAt: string;
  status: SalesOrderStatus;
  type: SalesOrderType;
  amountCents: number;
  currency: string;
  customer: SalesCustomerSummary;
  items?: CreatorSalesOrderItem[];
  product?: SalesProductSummary;
  access?: SalesAccessResult;
}

export interface SalesOrderDetail extends SalesOrderListItem {
  provider?: string;
  paymentMethod?: string;
  transactionId?: string;
  paymentDate?: string;
  summaryRows: SalesOrderSummaryRow[];
  refund?: SalesRefundDetail;
  failure?: SalesFailureDetail;
  subscription?: SalesSubscriptionContext;
}

export type SalesOrder = SalesOrderDetail;

export type SalesStatusFilter = 'all' | SalesOrderStatus;
export type SalesSortOption = 'newest' | 'oldest' | 'amount-desc' | 'amount-asc';

export interface CreatorSalesSummaryQuery {
  period?: SalesPeriod;
}

export interface CreatorOrdersQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: SalesStatusFilter;
  product?: string;
  period?: SalesPeriod;
  sort?: SalesSortOption;
}

export type CreatorOrdersPage = PageResponse<SalesOrderListItem> & {
  productOptions: SalesProductSummary[];
};
