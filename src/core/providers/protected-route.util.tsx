import React, { useLayoutEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from 'core/store/auth-store';
import { getSessionStatus } from 'core/store/auth-store/auth-session';
import { AppDispatch, RootState } from 'core/api/models';
import { UserRole } from '../api/models/user/user';
import { hasAnyRole } from '../api/models/user/role-utils';
import { Button, Spinner } from '@shared/ui';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const route = location.pathname + location.search;
  const auth = useSelector((state: RootState) => state.auth);
  const status = getSessionStatus(auth);
  const authorizedIdentity = Boolean(auth.user) && hasAnyRole(auth.user?.roles, allowedRoles);
  const allowed = status === 'authenticated' && authorizedIdentity;
  const mountedVersion = useRef<number | null>(null);
  const mountedRoute = useRef<string | null>(null);
  const version = auth.sessionVersion ?? 0;
  const retain = allowed || (authorizedIdentity && mountedVersion.current === version && mountedRoute.current === route);
  useLayoutEffect(() => {
    if (allowed) {
      mountedVersion.current = version;
      mountedRoute.current = route;
    } else if (!retain) {
      mountedVersion.current = null;
      mountedRoute.current = null;
    }
  }, [allowed, retain, route, version]);

  if (status === 'unauthenticated') {
    return <Navigate to="/auth/login" replace />;
  }
  if (status === 'authenticated' && !allowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Retain an already-authorized workspace during same-session verification so
  // recovery does not discard local work. Unknown/new sessions never mount it.
  return (
    <>
      {status === 'resolving' && <Spinner />}
      {status === 'unavailable' && (
        <section role="alert" aria-label="Session unavailable">
          <h1>Unable to verify your session</h1>
          <p>{auth.profileError ?? 'The service is temporarily unavailable. Please retry.'}</p>
          <Button type="button" onClick={() => dispatch(getUserProfile())}>Retry</Button>
        </section>
      )}
      {retain && <div key={version} hidden={!allowed} style={{ display: allowed ? 'contents' : 'none' }}>{children}</div>}
    </>
  );
};

export default ProtectedRoute;
