import { AxiosInstance, CanceledError, InternalAxiosRequestConfig } from 'axios';
import {
  getTransportGeneration,
  onSessionInvalidated,
  reportSessionFailure,
} from './session-lifecycle';

type SessionRequest = InternalAxiosRequestConfig & {
  _sessionGeneration?: number;
  _retry?: boolean;
  _publicRead?: boolean;
};

/** Cookie refresh is shared per client and never depends on a bearer payload. */
export function attachRefreshTokenInterceptor(httpClient: AxiosInstance) {
  let refresh: Promise<void> | undefined;
  let cancelRefresh: (() => void) | undefined;
  const changed = () => new CanceledError('Session changed');
  const unsubscribe = onSessionInvalidated(() => {
    const cancel = cancelRefresh;
    cancelRefresh = undefined;
    refresh = undefined;
    cancel?.();
  });
  const requestId = httpClient.interceptors.request.use((config: SessionRequest) => {
    const url = config.url?.replace(/^\//, '') ?? '';
    config._publicRead = config.method === 'get' && (
      url.startsWith('api/storefronts/') || url.startsWith('api/products/search?') ||
      /^api\/products\/[^/]+\/landing-page$/.test(url)
    );
    config._sessionGeneration ??= getTransportGeneration();
    if (!config._publicRead && config._sessionGeneration !== getTransportGeneration()) {
      throw changed();
    }
    return config;
  }, (error) => { throw error; }, { synchronous: true });
  const responseId = httpClient.interceptors.response.use(
    (response) => {
      const config = response.config as SessionRequest;
      if (!config._publicRead && config._sessionGeneration !== getTransportGeneration()) {
        return Promise.reject(changed());
      }
      return response;
    },
    async (error) => {
      const original = error.config as SessionRequest | undefined;
      if (!original || (!original._publicRead && original._sessionGeneration !== getTransportGeneration())) {
        return Promise.reject(original ? changed() : error);
      }
      const authEndpoint = /api\/auth\/(refresh|login|logout|googleSignIn|register|verify)(?:[/?]|$)/;
      if (original._publicRead || error.response?.status !== 401 || authEndpoint.test(original.url ?? '')) {
        return Promise.reject(error);
      }
      if (original._retry) {
        reportSessionFailure(error);
        return Promise.reject(error);
      }
      original._retry = true;
      if (!refresh) {
        const controller = new AbortController();
        const version = getTransportGeneration();
        const cancelled = new Promise<never>((_, reject) => {
          cancelRefresh = () => {
            reject(changed());
            controller.abort();
          };
        });
        const attempt = Promise.race([
          httpClient.post('api/auth/refresh', {}, {
            withCredentials: true,
            signal: controller.signal,
            timeout: 15000,
          }).then(() => undefined),
          cancelled,
        ]).catch((refreshError) => {
          if (version === getTransportGeneration()) {
            reportSessionFailure(refreshError);
          }
          throw refreshError;
        }).finally(() => {
          if (refresh === attempt) {
            refresh = undefined;
            cancelRefresh = undefined;
          }
        });
        refresh = attempt;
      }
      await refresh;
      if (original._sessionGeneration !== getTransportGeneration()) {
        throw changed();
      }
      return httpClient.request(original);
    },
  );
  return () => {
    cancelRefresh?.();
    unsubscribe();
    httpClient.interceptors.request.eject(requestId);
    httpClient.interceptors.response.eject(responseId);
  };
}
