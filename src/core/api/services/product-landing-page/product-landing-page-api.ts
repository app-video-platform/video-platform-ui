import httpClient from 'core/api/http-client';
import {
  ProductLandingPageConfig,
  ProductLandingPageConfigUpdateRequest,
} from 'core/api/models';

export const getPublicProductLandingPageConfigAPI = async (
  productId: string,
): Promise<ProductLandingPageConfig> => {
  const response = await httpClient.get<ProductLandingPageConfig>(
    `api/products/${productId}/landing-page`,
  );

  return response.data;
};

export const getCreatorProductLandingPageConfigAPI = async (
  productId: string,
): Promise<ProductLandingPageConfig> => {
  const response = await httpClient.get<ProductLandingPageConfig>(
    `api/creator/products/${productId}/landing-page`,
    { withCredentials: true },
  );

  return response.data;
};

export const updateCreatorProductLandingPageConfigAPI = async (
  productId: string,
  payload: ProductLandingPageConfigUpdateRequest,
): Promise<ProductLandingPageConfig> => {
  const response = await httpClient.patch<ProductLandingPageConfig>(
    `api/creator/products/${productId}/landing-page`,
    payload,
    { withCredentials: true },
  );

  return response.data;
};
