/* eslint-disable no-console */
import httpClient from '../../http-client';
import {
  ConnectInitRequest,
  ConnectInitResponse,
} from '../../models/calendars/connect-init';

export const getAllCalendarProvidersAPI = async () => {
  try {
    const response = await httpClient.get<{ providers: string[] }>(
      'api/calendars/providers',
    );
    return response.data.providers;
  } catch (error) {
    console.error('Calendar providers request failed.');
    throw error;
  }
};

export const connectCalendarAPI = async (payload: ConnectInitRequest) => {
  try {
    const response = await httpClient.post<ConnectInitResponse>(
      '/api/calendars/connect',
      payload,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Calendar connection initialization failed.');
    throw error;
  }
};

//TODO: GET  /api/calendars
