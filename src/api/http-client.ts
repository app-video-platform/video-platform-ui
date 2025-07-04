// import axios, {
//   AxiosRequestConfig,
//   AxiosResponse,
//   InternalAxiosRequestConfig,
// } from 'axios';
// import { User } from '../models/user/user';
// import { BaseProduct } from '../models/product/product';
// import { DownloadProduct } from '../models/product/download-product';
// import { IProductResponse } from './products-api';

// declare module 'axios' {
//   export interface AxiosRequestConfig {
//     mock?: boolean;
//   }
// }

// const API_BASE_URL = process.env.REACT_APP_BASE_PATH;

// // const mockAdapter = async (config: AxiosRequestConfig): Promise<AxiosResponse> => { // COMM FOR INTERCEPT
// //   if (config.mock) {
// //     if (config.url?.includes('api/auth/login')) {
// //       const mockResponse: AxiosResponse<string> = {
// //         data: 'Login successful!',
// //         status: 200,
// //         statusText: 'OK',
// //         headers: {},
// //         config: config as InternalAxiosRequestConfig
// //       };
// //       return Promise.resolve(mockResponse);
// //     }

// //     if (config.url?.includes('api/user/userInfo')) {
// //       const mockResponse: AxiosResponse<User> = {
// //         data: {
// //           id: 'user-id-alex-bej',
// //           firstName: 'Alex',
// //           lastName: 'Bej',
// //           email: 'alexbej@a;ex.ved',
// //           role: []
// //         },
// //         status: 200,
// //         statusText: 'OK',
// //         headers: {},
// //         config: config as InternalAxiosRequestConfig
// //       };
// //       return Promise.resolve(mockResponse);
// //     }

// //     if (config.url?.includes('api/products/update')) {
// //       const mockResponse: AxiosResponse<IProductResponse> = {
// //         data: {
// //           description: 'Lorem ipsum dolor sit amet. Gaudeamus igitur, iuvenem dum sumus. Exosricsamus te, omnis immundus spiritusm omnis
// // satanica potestats, imnis inscriptios de mai jos!',
// //           id: '1',
// //           name: 'How to stop nose leaks',
// //           price: 10.99,
// //           sections: [{
// //             id: '1',
// //             position: 1,
// //             title: 'Section One',
// //             description: 'Section One Description'
// //           },
// //           {
// //             id: '2',
// //             position: 2,
// //             title: 'Section Two',
// //             description: 'Section Two Description'
// //           }
// //           ],
// //           status: 'draft',
// //           type: 'DOWNLOAD',
// //           userId: 'user-id-alex-bej'
// //         },
// //         status: 200,
// //         statusText: 'OK',
// //         headers: {},
// //         config: config as InternalAxiosRequestConfig
// //       };
// //       return Promise.resolve(mockResponse);
// //     }

// //     if (config.url?.includes('api/product/get?')) {
// //       const now = new Date();
// //       const mockResponse: AxiosResponse<DownloadProduct> = {
// //         data: {
// //           createdAt: now,
// //           customers: 100,
// //           description: 'Lorem ipsum dolor sit amet. Gaudeamus igitur, iuvenem dum sumus. Exosricsamus te, omnis immundus spiritusm
// // omnis satanica potestats, imnis inscriptios de mai jos!',
// //           id: '1',
// //           image: '',
// //           name: 'How to stop nose leaks',
// //           price: 10.99,
// //           sections: [{
// //             position: 1,
// //             title: 'Section One',
// //             description: 'Section One Description'
// //           }],
// //           status: 'draft',
// //           type: 'DOWNLOAD',
// //           updatedAt: now,
// //           userId: 'user-id-alex-bej'
// //         },
// //         status: 200,
// //         statusText: 'OK',
// //         headers: {},
// //         config: config as InternalAxiosRequestConfig
// //       };
// //       return Promise.resolve(mockResponse);
// //     }

// //     if (config.url?.includes('api/product/getAll')) {
// //       const now = new Date();
// //       console.log('THIS CALLEd?');

// //       const mockResponse: AxiosResponse<BaseProduct[]> = {
// //         data: [
// //           {
// //             id: '1',
// //             name: 'Course 1',
// //             description: 'Lorem ipsum dolor sit amet', // Limit 420 characters
// //             image: '',      // URL to image (jpeg, png, etc.)
// //             type: 'COURSE',
// //             status: 'draft',
// //             userId: 'user-id-alex-bej',
// //             price: 'free',
// //             customers: 12,
// //             createdAt: now,
// //             updatedAt: now,
// //           },
// //           {
// //             id: '2',
// //             name: 'Download package 1',
// //             description: 'Lorem ipsum dolor sit amet', // Limit 420 characters
// //             image: '',      // URL to image (jpeg, png, etc.)
// //             type: 'DOWNLOAD',
// //             status: 'draft',
// //             userId: 'user-id-alex-bej',
// //             price: 10.99,
// //             customers: 44,
// //             createdAt: now,
// //             updatedAt: now,
// //           },
// //           {
// //             id: '3',
// //             name: 'Coaching session 1',
// //             description: 'Lorem ipsum dolor sit amet', // Limit 420 characters
// //             image: '',      // URL to image (jpeg, png, etc.)
// //             type: 'CONSULTATION',
// //             status: 'published',
// //             userId: 'user-id-alex-bej',
// //             price: 24.99,
// //             customers: 44,
// //             createdAt: now,
// //             updatedAt: now,
// //           }
// //         ],
// //         status: 200,
// //         statusText: 'OK',
// //         headers: {},
// //         config: config as InternalAxiosRequestConfig
// //       };
// //       return Promise.resolve(mockResponse);
// //     }
// //   }
// //   const defaultAdapter = axios.defaults.adapter as (config: AxiosRequestConfig) => Promise<AxiosResponse>;
// //   return defaultAdapter(config);
// // };

// const httpClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   },
//   withCredentials: true,
//   // adapter: mockAdapter, // COMMM FOR INTERCEPT
// });

// function getCookie(name: string): string | null {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) {
//     return parts.pop()?.split(';').shift() || null;
//   }
//   return null;
// }

// const excludedEndpoints = [
//   '/api/auth/register',
//   '/api/auth/login',
//   '/api/auth/verify',
// ];

// // Request interceptor to attach the CSRF token to state-changing requests
// httpClient.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     // Check if the URL should be excluded from CSRF token attachment

//     if (
//       config.url &&
//       excludedEndpoints.some((endpoint) => config.url?.includes(endpoint))
//     ) {
//       return config;
//     }

//     // Only attach CSRF token for methods that change state
//     const methodsRequiringCsrf = ['post', 'put', 'delete', 'patch'];
//     if (
//       (config.method &&
//         methodsRequiringCsrf.includes(config.method.toLowerCase())) ||
//       config.headers?.['X-CSRF-Force']
//     ) {
//       const csrfToken = getCookie('XSRF-TOKEN'); // Ensure this matches your cookie name
//       if (csrfToken) {
//         // Ensure headers exists
//         config.headers = config.headers || {};
//         config.headers['X-XSRF-TOKEN'] = csrfToken;
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // -----------------------------
// // Refresh Token Flow
// // -----------------------------

// // Variables to manage the refresh flow
// let isRefreshing = false;
// let failedQueue: Array<{
//   resolve: (token: string) => void;
//   reject: (error: any) => void;
// }> = [];

// // Process queued requests after a refresh attempt
// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else if (token) {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// // Add a response interceptor to handle 401 errors
// httpClient.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error) => {
//     const originalRequest = error.config as AxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (originalRequest.url?.includes('/api/auth/refresh')) {
//         return Promise.reject(error);
//       }

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then(() => axios(originalRequest))
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       return new Promise((resolve, reject) => {
//         axios
//           .post(
//             `${API_BASE_URL}api/auth/refresh`,
//             {},
//             { withCredentials: true }
//           )
//           .then(() => {
//             // The backend should update the cookies (JWT, CSRF) automatically
//             processQueue(null);
//             resolve(axios(originalRequest));
//           })
//           .catch((err) => {
//             processQueue(err, null);
//             reject(err);
//           })
//           .finally(() => {
//             isRefreshing = false;
//           });
//       });
//     }
//     return Promise.reject(error);
//   }
// );

// export default httpClient;

import axios, { AxiosInstance } from 'axios';
import { attachCsrfInterceptor } from './interceptors/csrf';
import { attachRefreshTokenInterceptor } from './interceptors/refresh-token';

const API_BASE_URL = process.env.REACT_APP_BASE_PATH;

const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Wire up the CSRF interceptor first:
attachCsrfInterceptor(httpClient);

// Then wire up the refresh‐token interceptor:
attachRefreshTokenInterceptor(httpClient);

// --------------------------------------------------------------------
// Only load mocks if the “USE_MOCKS” env var is set to “true”
// (you can also check `window.location.hostname === 'localhost'` if preferred)
console.log('USE_MOCKS is:', process.env.REACT_APP_USE_MOCKS);
if (process.env.REACT_APP_USE_MOCKS === 'true') {
  // We use require() here so that when this file is bundled for production,
  // it won’t accidentally pull in the mock module.
  // The mock‐file itself (_mocks.ts) is in .gitignore, so it never ends up in repo.
  // If `_mocks.ts` doesn’t exist on disk, this “require” will silently fail.
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { setupMocks } = require('./_mocks');
    setupMocks(httpClient);
    console.info('[Mocks] axios-mocks enabled');
  } catch (e) {
    console.warn('[Mocks] could not load ./_mocks (file not found)');
  }
}

export default httpClient;
