import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    mock?: boolean;
  }
}

const API_BASE_URL = process.env.REACT_APP_BASE_PATH;

const mockAdapter = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  if (config.mock) {
    // if (config.url?.includes('api/auth/register')) {
    //   return Promise.resolve({
    //     data: 'Mocked registration success message',
    //     status: 200,
    //     statusText: 'OK',
    //     headers: config.headers,
    //     config,
    //   } );
    // }
    if (config.url?.includes('api/auth/login')) {
      return Promise.resolve({
        data: {
          firstName: 'Mock',
          lastName: 'User',
          email: 'mock@user.com',
          token: 'mocked-jwt-token',
          role: ['user'],
        },
        status: 200,
        statusText: 'OK',
        headers: config.headers,
        config,
      } as AxiosResponse);
    }
    //   if (config.url?.includes('api/auth/verify')) {
    //     return Promise.resolve({
    //       data: 'Mocked verification success message',
    //       status: 200,
    //       statusText: 'OK',
    //       headers: config.headers,
    //       config,
    //     });
    //   }
  }
  const defaultAdapter = axios.defaults.adapter as (config: AxiosRequestConfig) => Promise<AxiosResponse>;
  return defaultAdapter(config);
};

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  adapter: mockAdapter,
});

// // Optional: Add interceptors for auth tokens
// httpClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });




export default httpClient;