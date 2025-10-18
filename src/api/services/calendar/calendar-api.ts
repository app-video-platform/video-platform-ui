import httpClient from '../../http-client';

export interface IConnectCalendarPayload {
  provider: string;
  loginHint: string;
}

export const getAllCalendarProvidersAPI = async () => {
  try {
    const response = await httpClient.get<string[]>(
      'api/calendars/providers'
    );
    return response.data;
  } catch (error) {
    console.error('Error getting all calendar providers:', error);
    throw error;
  }
};

export const connectCalendarAPI = async (payload: IConnectCalendarPayload) => {
  try {
    const response = await httpClient.post<string>(
      '/api/calendars/connect',
      payload,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error connecting calendar:', error);
    throw error;
  }
};