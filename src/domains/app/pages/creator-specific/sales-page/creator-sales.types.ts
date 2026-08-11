export type SalesOrderStatus = 'paid' | 'failed' | 'refunded' | 'pending';
export type SalesOrderType = 'one-time' | 'subscription' | 'renewal';
export type SalesProductType = 'Course' | 'Download' | 'Consultation' | 'Membership';
export type SalesAccessState = 'granted' | 'revoked' | 'none';

export interface SalesCustomerSummary {
  id?: string;
  name: string;
  email: string;
}

export interface SalesProductSummary {
  id?: string;
  name: string;
  type: SalesProductType;
  thumbnailUrl?: string;
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

export interface SalesOrder {
  id: string;
  orderedAt: string;
  status: SalesOrderStatus;
  type: SalesOrderType;
  amountCents: number;
  currency: string;
  customer: SalesCustomerSummary;
  product: SalesProductSummary;
  provider?: string;
  paymentMethod?: string;
  transactionId?: string;
  paymentDate?: string;
  summaryRows: SalesOrderSummaryRow[];
  access: {
    state: SalesAccessState;
    label: string;
    detail?: string;
  };
  refund?: SalesRefundDetail;
  failure?: SalesFailureDetail;
  subscription?: SalesSubscriptionContext;
}

export interface CreatorSalesDataState {
  status: 'ready' | 'unavailable';
  orders: SalesOrder[];
}
