// src/routes/protected-route.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  selectIsUserLoggedIn,
  selectAuthLoading,
  selectAuthUser,
} from '../store/auth-store/auth.selectors';
import { UserRole } from '../api/models/user/user';
import GalSpinner from '../components/gal-spinner/gal-spinner.component';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  const authLoading = useSelector(selectAuthLoading);
  const user = useSelector(selectAuthUser);

  // 1) If we know the user is explicitly not logged in, redirect them now
  if (isUserLoggedIn === false && !authLoading) {
    return <Navigate to="/signin" replace />;
  }

  // 2) If we know they _are_ logged in and we know their roles, but none match, redirect
  const hasRole = user?.roles?.some((r) => allowedRoles.includes(r));
  if (isUserLoggedIn && !authLoading && !hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3) Otherwise, we either are still loading, or the user is allowed.
  //    In both cases we render the children. If we’re still loading, show a spinner overlay.
  return (
    <div style={{ position: 'relative' }}>
      {children}
      {authLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            zIndex: 10,
          }}
        >
          <GalSpinner />
        </div>
      )}
    </div>
  );
};

export default ProtectedRoute;
