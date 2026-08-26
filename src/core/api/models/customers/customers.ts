import { PageResponse } from '../admin';

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
export type CustomerAccessSource =
  | 'purchased'
  | 'membership'
  | 'manual'
  | 'free';
export type CustomerPurchaseStatus = 'paid' | 'refunded' | 'failed';

export type CreatorCustomerProductType =
  | 'Membership'
  | 'Course'
  | 'Download'
  | 'Consultation';

export interface CreatorCustomerProductSummary {
  id: string;
  name: string;
  type: CreatorCustomerProductType;
}

export interface CreatorCustomerListItem {
  id: string;
  name?: string;
  email: string;
  avatarUrl?: string;
  relationshipStatus: CustomerRelationshipStatus;
  membershipState: CustomerMembershipState;
  products: CreatorCustomerProductSummary[];
  totalSpendCents: number;
  ordersCount: number;
  activeAccessCount: number;
  lastActivityAt?: string;
  lastActivityLabel?: string;
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
  productType: CreatorCustomerProductType;
  purchasedAt: string;
  amountCents: number;
  paymentModel: 'One-time' | 'Monthly';
  status: CustomerPurchaseStatus;
}

export interface CreatorCustomerAccess {
  id: string;
  productName: string;
  productType: CreatorCustomerProductType;
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

export interface CreatorCustomerDetail extends CreatorCustomerListItem {
  phone?: string;
  location?: string;
  language?: string;
  timezone?: string;
  customerSince?: string;
  tags?: string[];
  notes?: CreatorCustomerNote[];
  activity: CreatorCustomerActivity[];
  purchases: CreatorCustomerPurchase[];
  access: CreatorCustomerAccess[];
}

export type CreatorCustomer = CreatorCustomerDetail;

export type CreatorCustomerStatusFilter = 'all' | CustomerRelationshipStatus;
export type CreatorCustomerMembershipFilter = 'all' | CustomerMembershipState;
export type CreatorCustomerSortOption =
  | 'last-activity-desc'
  | 'spend-desc'
  | 'spend-asc'
  | 'name-asc'
  | 'name-desc';

export interface CreatorCustomersQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: CreatorCustomerStatusFilter;
  product?: string;
  membership?: CreatorCustomerMembershipFilter;
  sort?: CreatorCustomerSortOption;
}

export type CreatorCustomersPage = PageResponse<CreatorCustomerListItem> & {
  productOptions: CreatorCustomerProductSummary[];
};
