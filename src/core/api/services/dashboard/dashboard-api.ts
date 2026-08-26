import httpClient from 'core/api/http-client';
import { CreatorDashboardSummary } from 'core/api/models';

export const getCreatorDashboardSummaryAPI =
  async (): Promise<CreatorDashboardSummary> => {
    const response = await httpClient.get<CreatorDashboardSummary>(
      'api/creator/dashboard/summary',
      { withCredentials: true },
    );

    return response.data;
  };
