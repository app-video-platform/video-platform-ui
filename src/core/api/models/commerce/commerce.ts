import { ProductCurrency, ProductType } from '../product';

export type CommerceOrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'EXPIRED'
  | 'REFUNDED';

export interface CommerceCheckoutItem {
  itemId: string;
  productName: string;
  productType?: ProductType;
  currency?: ProductCurrency | string;
  unitAmountMinor: number;
  lineTotalMinor: number;
  quantity: number;
}

export interface CommerceCheckoutSession {
  orderId: string;
  status: CommerceOrderStatus;
  provider?: string;
  checkoutUrl?: string | null;
  currency?: ProductCurrency | string;
  totalMinor?: number;
  createdAt?: string;
  updatedAt?: string;
  expiresAt?: string;
  items?: CommerceCheckoutItem[];
}

export interface CommerceOrder {
  orderId: string;
  status: CommerceOrderStatus;
  provider?: string;
  currency?: ProductCurrency | string;
  totalMinor?: number;
  createdAt?: string;
  updatedAt?: string;
  paidAt?: string;
  items?: CommerceCheckoutItem[];
}
