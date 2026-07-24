import httpClient from '../../http-client';
import {
  EntitlementLibraryQuery,
  ProductAccess,
  ProductEntitlement,
  ProductFileDownload,
} from '../../models';
import { normalizeProductSummary } from '../products/utils/product-normalizers.util';

const normalizeEntitlement = (
  entitlement: ProductEntitlement,
): ProductEntitlement => ({
  ...entitlement,
  product: normalizeProductSummary(entitlement.product),
});

export const enrollInFreeProductAPI = async (
  productId: string,
): Promise<ProductEntitlement> => {
  const response = await httpClient.post<ProductEntitlement>(
    `api/entitlements/products/${productId}/enroll`,
  );
  return normalizeEntitlement(response.data);
};

export const getMyEntitlementsAPI = async (
  query: EntitlementLibraryQuery = {},
): Promise<ProductEntitlement[]> => {
  const response = await httpClient.get<ProductEntitlement[]>(
    'api/entitlements/me',
    { params: query },
  );
  return response.data.map(normalizeEntitlement);
};

export const getProductAccessAPI = async (
  productId: string,
): Promise<ProductAccess> => {
  const response = await httpClient.get<ProductAccess>(
    `api/entitlements/products/${productId}/access`,
  );
  return response.data;
};

export const getProductFileDownloadAPI = async (
  productId: string,
  fileId: string,
): Promise<ProductFileDownload> => {
  const response = await httpClient.get<ProductFileDownload>(
    `api/entitlements/products/${productId}/files/${fileId}/download`,
  );
  return response.data;
};
