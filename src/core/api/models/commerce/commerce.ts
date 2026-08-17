import { ProductCurrency, ProductType } from '../product';

export type CommerceOrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'EXPIRED'
  | 'REFUNDED';

export interface CommerceCheckoutItem {
  productId: string;
  productTitle?: string;
  productType?: ProductType;
  currency?: ProductCurrency | string;
  amountMinor?: number;
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
