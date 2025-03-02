import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    mock?: boolean;
  }
}

const API_BASE_URL = process.env.REACT_APP_BASE_PATH;

const mockAdapter = async (config: AxiosRequestConfig): Promise<AxiosResponse> => { // COMM FOR INTERCEPT
  if (config.mock) {
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

    if (config.url?.includes('api/auth/register')) {
      return Promise.resolve({
        data: 'Register mock success',
        status: 200,
        statusText: 'OK',
        headers: config.headers,
        config,
      } as AxiosResponse);
    }

    if (config.url?.includes('api/auth/verify?token=abc')) {
      return Promise.resolve({
        data: 'Verification success',
        status: 200,
        statusText: 'OK',
        headers: config.headers,
        config,
      } as AxiosResponse);
    }
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
  withCredentials: true,
  adapter: mockAdapter, // COMMM FOR INTERCEPT
});

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

const excludedEndpoints = ['/api/auth/register', '/api/auth/login', '/api/auth/verify'];

// Request interceptor to attach the CSRF token to state-changing requests
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check if the URL should be excluded from CSRF token attachment

    console.log('INTERCEPT', config.url);

    if (config.url && excludedEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
      console.log('SKIP INTERCEPT FOR', config.url);

      return config;
    }

    // Only attach CSRF token for methods that change state
    const methodsRequiringCsrf = ['post', 'put', 'delete', 'patch'];
    if (config.method && methodsRequiringCsrf.includes(config.method.toLowerCase())) {
      const csrfToken = getCookie('CSRF-TOKEN'); // Ensure this matches your cookie name
      console.log('COOKIE', csrfToken);

      if (csrfToken) {
        // Ensure headers exists
        config.headers = config.headers || {};
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);




export default httpClient;