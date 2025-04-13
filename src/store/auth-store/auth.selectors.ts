import { RootState } from '../store';

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthMessage = (state: RootState) => state.auth.message;
export const selectIsUserLoggedIn = (state: RootState) => state.auth.isUserLoggedIn;
export const selectNotifications = (state: RootState) => state.auth.notifications;