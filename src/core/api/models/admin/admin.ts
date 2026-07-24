import { ProductMinimised } from '../product/product';
import { ProductStatus, ProductType } from '../product/products.types';
import { UserRole } from '../user/user';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
  enabled?: boolean;
  authProvider?: string;
  onboardingCompleted?: boolean;
  createdAt?: string;
}

export interface AdminRoleUpdateRequest {
  role: UserRole;
}

export interface AdminAuditLog {
  id: number;
  actorUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  beforeSummary?: string;
  afterSummary?: string;
  createdAt: string;
}

export interface AdminUserQuery {
  search?: string;
  role?: UserRole | '';
  page?: number;
  size?: number;
  sort?: string;
}

export interface AdminProductQuery {
  search?: string;
  ownerId?: string;
  type?: ProductType | '';
  status?: ProductStatus | '';
  page?: number;
  size?: number;
  sort?: string;
}

export interface AdminAuditQuery {
  actorId?: string;
  targetType?: string;
  targetId?: string;
  action?: string;
  page?: number;
  size?: number;
}

export type AdminProductsPage = PageResponse<ProductMinimised>;
