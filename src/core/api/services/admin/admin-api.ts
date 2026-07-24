import httpClient from 'core/api/http-client';
import {
  AdminAuditLog,
  AdminAuditQuery,
  AdminProductQuery,
  AdminProductsPage,
  AdminRoleUpdateRequest,
  AdminUser,
  AdminUserQuery,
  PageResponse,
  ProductMinimised,
} from 'core/api/models';
import { normalizeProductSummary } from '../products/utils/product-normalizers.util';

const buildQueryString = (params: Record<string, unknown>) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    query.set(key, String(value));
  });

  return query.toString();
};

export const getAdminUsersAPI = async (
  params: AdminUserQuery = {},
): Promise<PageResponse<AdminUser>> => {
  const query = buildQueryString({
    page: 0,
    size: 20,
    sort: 'createdAt,desc',
    ...params,
  });
  const response = await httpClient.get<PageResponse<AdminUser>>(
    `api/admin/users?${query}`,
    { withCredentials: true },
  );
  return response.data;
};

export const updateAdminUserRoleAPI = async (
  userId: string,
  payload: AdminRoleUpdateRequest,
): Promise<AdminUser> => {
  const response = await httpClient.patch<AdminUser>(
    `api/admin/users/${userId}/role`,
    payload,
    { withCredentials: true },
  );
  return response.data;
};

export const getAdminProductsAPI = async (
  params: AdminProductQuery = {},
): Promise<AdminProductsPage> => {
  const query = buildQueryString({
    page: 0,
    size: 20,
    sort: 'createdAt,desc',
    ...params,
  });
  const response = await httpClient.get<PageResponse<ProductMinimised>>(
    `api/admin/products?${query}`,
    { withCredentials: true },
  );
  return {
    ...response.data,
    content: response.data.content.map(normalizeProductSummary),
  };
};

export const getAdminAuditAPI = async (
  params: AdminAuditQuery = {},
): Promise<PageResponse<AdminAuditLog>> => {
  const query = buildQueryString({
    page: 0,
    size: 20,
    ...params,
  });
  const response = await httpClient.get<PageResponse<AdminAuditLog>>(
    `api/admin/audit?${query}`,
    { withCredentials: true },
  );
  return response.data;
};
