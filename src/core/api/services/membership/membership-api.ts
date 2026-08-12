import httpClient from '../../http-client';
import {
  MembershipAggregate,
  MembershipConfigUpdateRequest,
  MembershipContent,
  MembershipContentCreateRequest,
  MembershipContentUpdateRequest,
  MembershipFeedUpdateRequest,
} from 'core/api/models';

// BACKEND CONTRACT NOT YET IMPLEMENTED
export const getMembershipAggregateAPI = async (productId: string) => {
  const response = await httpClient.get<MembershipAggregate>(
    `api/products/${productId}/membership`,
    { withCredentials: true },
  );

  return response.data;
};

// BACKEND CONTRACT NOT YET IMPLEMENTED
export const updateMembershipConfigAPI = async (
  productId: string,
  payload: MembershipConfigUpdateRequest,
) => {
  const response = await httpClient.patch<MembershipAggregate>(
    `api/products/${productId}/membership`,
    payload,
    { withCredentials: true },
  );

  return response.data;
};

// BACKEND CONTRACT NOT YET IMPLEMENTED
export const createMembershipContentAPI = async (
  productId: string,
  payload: MembershipContentCreateRequest,
) => {
  const response = await httpClient.post<MembershipContent>(
    `api/products/${productId}/membership/content`,
    payload,
    { withCredentials: true },
  );

  return response.data;
};

// BACKEND CONTRACT NOT YET IMPLEMENTED
export const updateMembershipContentAPI = async (
  productId: string,
  contentId: string,
  payload: MembershipContentUpdateRequest,
) => {
  const response = await httpClient.patch<MembershipContent>(
    `api/products/${productId}/membership/content/${contentId}`,
    payload,
    { withCredentials: true },
  );

  return response.data;
};

// BACKEND CONTRACT NOT YET IMPLEMENTED
export const deleteMembershipContentAPI = async (
  productId: string,
  contentId: string,
) => {
  await httpClient.delete(
    `api/products/${productId}/membership/content/${contentId}`,
    { withCredentials: true },
  );

  return contentId;
};

// BACKEND CONTRACT NOT YET IMPLEMENTED
export const updateMembershipFeedAPI = async (
  productId: string,
  payload: MembershipFeedUpdateRequest,
) => {
  const response = await httpClient.put<MembershipAggregate>(
    `api/products/${productId}/membership/feed`,
    payload,
    { withCredentials: true },
  );

  return response.data;
};
