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

  if (user && user.role && Object.keys(user.role).length > 0) {
    const isAllowed = allowedRoles.some((role) => user?.role.includes(role));
    if (!isAllowed) {
      return <Navigate to="/app" replace />;
    }
  }

  if (authLoading) {
    return <p>Loading authentication...</p>; // Or a spinner component
  }

  if (!isUserLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
