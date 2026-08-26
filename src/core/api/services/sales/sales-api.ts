import httpClient from 'core/api/http-client';
import {
  CreatorOrdersPage,
  CreatorOrdersQuery,
  CreatorSalesSummary,
  CreatorSalesSummaryQuery,
  SalesOrderDetail,
} from 'core/api/models';
import { buildQueryString } from '../utils/query-string';

export const getCreatorSalesSummaryAPI = async (
  query: CreatorSalesSummaryQuery = {},
): Promise<CreatorSalesSummary> => {
  const queryString = buildQueryString({
    period: '30d',
    ...query,
  });
  const response = await httpClient.get<CreatorSalesSummary>(
    `api/creator/sales/summary?${queryString}`,
    { withCredentials: true },
  );

  return response.data;
};

export const getCreatorOrdersPageAPI = async (
  query: CreatorOrdersQuery = {},
): Promise<CreatorOrdersPage> => {
  const queryString = buildQueryString({
    page: 0,
    pageSize: 6,
    period: '30d',
    sort: 'newest',
    ...query,
  });
  const response = await httpClient.get<CreatorOrdersPage>(
    `api/creator/orders?${queryString}`,
    { withCredentials: true },
  );

  return response.data;
};

export const getCreatorOrderDetailAPI = async (
  orderId: string,
): Promise<SalesOrderDetail> => {
  const response = await httpClient.get<SalesOrderDetail>(
    `api/creator/orders/${orderId}`,
    { withCredentials: true },
  );

  return response.data;
};
