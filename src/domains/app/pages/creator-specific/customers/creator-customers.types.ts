export type CustomerRelationshipStatus =
  | 'active-member'
  | 'past-due'
  | 'buyer'
  | 'waitlist';

export type CustomerMembershipState =
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'none';

export type CustomerAccessStatus = 'active' | 'expired' | 'revoked';
export type CustomerAccessSource = 'purchased' | 'membership' | 'manual';
export type CustomerPurchaseStatus = 'paid' | 'refunded' | 'failed';

export interface CreatorCustomerProductSummary {
  id: string;
  name: string;
  type: 'Membership' | 'Course' | 'Download' | 'Consultation';
}

export interface CreatorCustomer {
  id: string;
  name?: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  location?: string;
  language?: string;
  timezone?: string;
  customerSince?: string;
  relationshipStatus: CustomerRelationshipStatus;
  membershipState: CustomerMembershipState;
  products: CreatorCustomerProductSummary[];
  totalSpendCents: number;
  ordersCount: number;
  activeAccessCount: number;
  lastActivityAt?: string;
  lastActivityLabel?: string;
  tags?: string[];
  notes?: CreatorCustomerNote[];
  activity: CreatorCustomerActivity[];
  purchases: CreatorCustomerPurchase[];
  access: CreatorCustomerAccess[];
}

export interface CreatorCustomerActivity {
  id: string;
  label: string;
  context?: string;
  occurredAt: string;
  destinationPath?: string;
}

export interface CreatorCustomerPurchase {
  id: string;
  productName: string;
  productType: CreatorCustomerProductSummary['type'];
  purchasedAt: string;
  amountCents: number;
  paymentModel: 'One-time' | 'Monthly';
  status: CustomerPurchaseStatus;
}

export interface CreatorCustomerAccess {
  id: string;
  productName: string;
  productType: CreatorCustomerProductSummary['type'];
  status: CustomerAccessStatus;
  source: CustomerAccessSource;
  grantedAt: string;
  expiresAt?: string;
}

export interface CreatorCustomerNote {
  id: string;
  body: string;
  author: string;
  createdAt: string;
}

export interface CreatorCustomersDataState {
  status: 'ready' | 'unavailable';
  customers: CreatorCustomer[];
}
