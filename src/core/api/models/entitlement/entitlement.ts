import { ProductMinimised, ProductType } from '../product';

export type EntitlementSource =
  | 'FREE_ENROLLMENT'
  | 'PURCHASE'
  | 'ADMIN_GRANT';

export interface ProductEntitlement {
  id: string;
  source: EntitlementSource;
  createdAt: string;
  product: ProductMinimised;
}

export interface ProductAccess {
  hasAccess: boolean;
  reason: 'ACCESS_GRANTED' | 'ENTITLEMENT_REQUIRED';
}

export interface ProductFileDownload {
  url: string;
}

export interface EntitlementLibraryQuery {
  type?: ProductType;
}
