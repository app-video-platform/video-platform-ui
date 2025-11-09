/* eslint-disable no-console */
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

console.info('[USE_MOCKS]', process.env.REACT_APP_USE_MOCKS);

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
