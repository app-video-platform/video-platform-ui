import httpClient from 'core/api/http-client';
import {
  CreatorAnalyticsOverview,
  CreatorAnalyticsOverviewQuery,
} from 'core/api/models';
import { buildQueryString } from '../utils/query-string';

// BACKEND CONTRACT NOT YET IMPLEMENTED: creator Analytics overview contract.
export const getCreatorAnalyticsOverviewAPI = async (
  query: CreatorAnalyticsOverviewQuery = {},
): Promise<CreatorAnalyticsOverview> => {
  const queryString = buildQueryString({
    period: '30d',
    ...query,
  });
  const response = await httpClient.get<CreatorAnalyticsOverview>(
    `api/creator/analytics/overview?${queryString}`,
    { withCredentials: true },
  );

  return response.data;
};
