// src/routes/protected-route.tsx
import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
// Example of pulling user state from a React Context or your Auth store:
import { useSelector } from 'react-redux';
import {
  selectIsUserLoggedIn,
  selectAuthLoading,
  selectAuthUser,
} from '../store/auth-store/auth.selectors';
import { UserRole } from '../api/models/user/user';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  const authLoading = useSelector(selectAuthLoading);
  const user = useSelector(selectAuthUser);

  if (user && user.roles && Object.keys(user.roles).length > 0) {
    const isAllowed = allowedRoles.some((role) => user?.roles.includes(role));
    if (!isAllowed) {
      return <Navigate to="/app" replace />;
    }
  }

  if (authLoading || isUserLoggedIn === null) {
    return <p>Loading authentication...</p>; // Or a spinner component
  }

  // !isUserLoggedIn returns true if isUserLoggedIn is null as well
  // isUserLoggedIn === false makes sure that the login attempt has been made already
  if (isUserLoggedIn === false) {
    console.log('GET HERE', user, authLoading, isUserLoggedIn);

    return <Navigate to="/signin" replace />;
  }

  const hasRole = user?.roles?.some((role) => allowedRoles.includes(role));
  if (!hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
