import httpClient from 'core/api/http-client';
import {
  CreatorStorefrontConfig,
  CreatorStorefrontConfigUpdateRequest,
  PublicStorefront,
} from 'core/api/models';

export const getPublicStorefrontAPI = async (
  creatorId: string,
): Promise<PublicStorefront> => {
  const response = await httpClient.get<PublicStorefront>(
    `api/storefronts/${creatorId}`,
    { withCredentials: true },
  );

  return response.data;
};

export const getCreatorStorefrontConfigAPI =
  async (): Promise<CreatorStorefrontConfig> => {
    const response = await httpClient.get<CreatorStorefrontConfig>(
      'api/creator/storefront',
      { withCredentials: true },
    );

    return response.data;
  };

export const updateCreatorStorefrontConfigAPI = async (
  payload: CreatorStorefrontConfigUpdateRequest,
): Promise<CreatorStorefrontConfig> => {
  const response = await httpClient.patch<CreatorStorefrontConfig>(
    'api/creator/storefront',
    payload,
    { withCredentials: true },
  );

  return response.data;
};
