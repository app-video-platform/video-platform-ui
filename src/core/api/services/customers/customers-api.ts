import httpClient from 'core/api/http-client';
import {
  CreatorCustomerDetail,
  CreatorCustomersPage,
  CreatorCustomersQuery,
} from 'core/api/models';
import { buildQueryString } from '../utils/query-string';

// BACKEND CONTRACT NOT YET IMPLEMENTED: creator Customers list contract.
export const getCreatorCustomersPageAPI = async (
  query: CreatorCustomersQuery = {},
): Promise<CreatorCustomersPage> => {
  const queryString = buildQueryString({
    page: 0,
    pageSize: 6,
    sort: 'last-activity-desc',
    ...query,
  });
  const response = await httpClient.get<CreatorCustomersPage>(
    `api/creator/customers?${queryString}`,
    { withCredentials: true },
  );

  return response.data;
};

// BACKEND CONTRACT NOT YET IMPLEMENTED: creator Customer detail contract.
export const getCreatorCustomerDetailAPI = async (
  customerId: string,
): Promise<CreatorCustomerDetail> => {
  const response = await httpClient.get<CreatorCustomerDetail>(
    `api/creator/customers/${customerId}`,
    { withCredentials: true },
  );

  return response.data;
};
