import { RootState } from 'core/api/models';

export const selectAuthUser = (state: RootState) =>
  state.auth.sessionStatus && state.auth.sessionStatus !== 'authenticated' ? null : state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsUserLoggedIn = (state: RootState) =>
  state.auth.isUserLoggedIn;

// Retained identity is for same-session layout/draft continuity, never authorization.
export const selectRetainedSessionUser = (state: RootState) => state.auth.user;
