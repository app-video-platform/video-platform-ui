import { Middleware, isAction } from '@reduxjs/toolkit';
import authReducer from './auth-store/auth.slice';
import type { AppState } from './root-reducer';
import { invalidateSessionRequests } from '../api/interceptors/session-lifecycle';

const scopedPrefixes = ['auth/', 'admin/', 'analytics/', 'products/', 'customers/',
  'dashboard/', 'membership/', 'sales/', 'reviews/', 'storefront/', 'productLandingPage/'];

/** Register request ownership before listeners run; drop stale results before reducers/listeners. */
export const createSessionMiddleware = (): Middleware<object, AppState> => (api) => {
  const requests = new Map<string, number>();
  return (next) => (action) => {
    if (!isAction(action)) {
      return next(action);
    }
    const current = api.getState().auth;
    const meta = (action as { meta?: { requestId?: string; requestStatus?: string } }).meta;
    const scoped = scopedPrefixes.some((prefix) => action.type.startsWith(prefix)) &&
      !action.type.startsWith('storefront/fetchPublic') &&
      !action.type.startsWith('productLandingPage/fetchPublic');
    const version = current.sessionVersion ?? 0;
    if (scoped && meta?.requestId && meta.requestStatus !== 'pending') {
      const owner = requests.get(meta.requestId);
      requests.delete(meta.requestId);
      if (owner !== version) {
        return action;
      }
    }
    const nextAuth = authReducer(current, action);
    if ((nextAuth.sessionVersion ?? 0) !== version) {
      requests.clear();
      invalidateSessionRequests();
    }
    if (scoped && meta?.requestId && meta.requestStatus === 'pending') {
      requests.set(meta.requestId, nextAuth.sessionVersion ?? 0);
    }
    return next(action);
  };
};
