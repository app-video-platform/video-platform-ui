import type { AuthState, SessionStatus } from './auth.slice';

export const getSessionStatus = (state: AuthState): SessionStatus =>
  state.sessionStatus ?? (state.isUserLoggedIn === true && state.user
    ? 'authenticated'
    : state.loading ? 'resolving' : 'unauthenticated');
