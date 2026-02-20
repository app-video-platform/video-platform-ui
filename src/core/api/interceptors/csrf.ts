import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getCookie } from '@shared/utils';

/**
 * Attaches a request interceptor that automatically adds
 * X-XSRF-TOKEN from cookies on any state‐changing request.
 */
export function attachCsrfInterceptor(httpClient: AxiosInstance) {
  const excluded = [
    '/api/auth/register',
    '/api/auth/login',
    '/api/auth/verify',
  ];

  httpClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Skip attaching CSRF for excluded endpoints
      if (
        config.url &&
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        excluded.some((endpoint) => config.url!.includes(endpoint))
      ) {
        return config;
      }

      // Only attach token on POST/PUT/DELETE/PATCH or if header 'X-CSRF-Force' is set
      const methodsRequiringCsrf = ['post', 'put', 'delete', 'patch'];
      if (
        (config.method &&
          methodsRequiringCsrf.includes(config.method.toLowerCase())) ||
        config.headers?.['X-CSRF-Force']
      ) {
        const csrfToken = getCookie('XSRF-TOKEN');
        if (csrfToken) {
          config.headers = config.headers || {};
          config.headers['X-XSRF-TOKEN'] = csrfToken;
        }
      }
      return config;
    },
    (error) => Promise.reject(error),
  );
}
