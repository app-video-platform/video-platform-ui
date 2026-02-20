/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-unused-vars */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Attaches a response interceptor to handle 401s by
 * requesting a token refresh and replaying failed requests.
 */
export function attachRefreshTokenInterceptor(httpClient: AxiosInstance) {
  httpClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // If status is 401, and we haven't already retried this request:
      if (error.response?.status === 401 && !originalRequest._retry) {
        // If the request was the refresh endpoint itself, just reject:
        if (
          originalRequest.url &&
          originalRequest.url.includes('/api/auth/refresh')
        ) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // Queue up the request until the refresh finishes
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              // Once refreshed, retry the original
              originalRequest.headers!['Authorization'] = `Bearer ${token}`;
              return axios(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise((resolve, reject) => {
          axios
            .post(
              `${process.env.REACT_APP_BASE_PATH}api/auth/refresh`,
              {},
              { withCredentials: true }
            )
            .then((res) => {
              // Backend should have updated the cookie(s). If you need
              // a fresh Authorization: Bearer header, extract it from res here.
              const newToken = res.data.token; // or however your backend returns it
              processQueue(null, newToken);

              // Retry original request
              originalRequest.headers!['Authorization'] = `Bearer ${newToken}`;
              resolve(axios(originalRequest));
            })
            .catch((err) => {
              processQueue(err, null);
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
}
