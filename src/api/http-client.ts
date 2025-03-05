import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    mock?: boolean;
  }
}

const API_BASE_URL = process.env.REACT_APP_BASE_PATH;

// const mockAdapter = async (config: AxiosRequestConfig): Promise<AxiosResponse> => { // COMM FOR INTERCEPT
//   if (config.mock) {
//     if (config.url?.includes('api/auth/login')) {
//       return Promise.resolve({
//         data: {
//           firstName: 'Mock',
//           lastName: 'User',
//           email: 'mock@user.com',
//           token: 'mocked-jwt-token',
//           role: ['user'],
//         },
//         status: 200,
//         statusText: 'OK',
//         headers: config.headers,
//         config,
//       } as AxiosResponse);
//     }

//     if (config.url?.includes('api/auth/register')) {
//       return Promise.resolve({
//         data: 'Register mock success',
//         status: 200,
//         statusText: 'OK',
//         headers: config.headers,
//         config,
//       } as AxiosResponse);
//     }

//     if (config.url?.includes('api/auth/verify?token=abc')) {
//       return Promise.resolve({
//         data: 'Verification success',
//         status: 200,
//         statusText: 'OK',
//         headers: config.headers,
//         config,
//       } as AxiosResponse);
//     }
//   }
//   const defaultAdapter = axios.defaults.adapter as (config: AxiosRequestConfig) => Promise<AxiosResponse>;
//   return defaultAdapter(config);
// };

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  // adapter: mockAdapter, // COMMM FOR INTERCEPT
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

    console.log('INTERCEPT', config.url, config, logCookies());

    if (config.url && excludedEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
      console.log('SKIP INTERCEPT FOR', config.url);

      return config;
    }

    // Only attach CSRF token for methods that change state
    const methodsRequiringCsrf = ['post', 'put', 'delete', 'patch'];
    if ((config.method && methodsRequiringCsrf.includes(config.method.toLowerCase())) || config.headers?.['X-CSRF-Force']) {
      const csrfToken = getCookie('XSRF-TOKEN'); // Ensure this matches your cookie name
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


function logCookies() {
  console.log('Current cookies:', document.cookie);
  // You can also check for a specific cookie:
  // const jwtCookie = document.cookie.split('; ').find(row => row.startsWith('JWT_TOKEN='));
  // console.log('JWT_TOKEN exists:', !!jwtCookie);
}

// -----------------------------
// Refresh Token Flow
// -----------------------------

// Variables to manage the refresh flow
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

// Process queued requests after a refresh attempt
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add a response interceptor to handle 401 errors
httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If error is 401 (unauthorized) and the request wasn't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent infinite loop by not retrying the refresh endpoint itself
      if (originalRequest.url?.includes('/api/auth/refresh')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token: string | unknown) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
            }
            return axios(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        // Make sure to call the refresh endpoint; adjust URL or payload as needed
        axios
          .post(`${API_BASE_URL}/api/auth/refresh`, {}, { withCredentials: true })
          .then(({ data }) => {
            // Assume the new access token is returned as data.accessToken
            const newAccessToken = data.accessToken;

            // Optionally, store the new token in local storage or update context
            // localStorage.setItem('accessToken', newAccessToken);

            // Update default authorization header for future requests
            httpClient.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
            }
            processQueue(null, newAccessToken);
            resolve(axios(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            // Optionally, handle logout or redirect to login if refresh fails
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    return Promise.reject(error);
  }
);




export default httpClient;