// src/routes/protected-route.tsx
import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
// Example of pulling user state from a React Context or your Auth store:
import { useSelector } from 'react-redux';
import { selectIsUserLoggedIn, selectAuthLoading } from '../store/auth-store/auth.selectors';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  const authLoading = useSelector(selectAuthLoading);

  if (authLoading) {
    return <p>Loading authentication...</p>; // Or a spinner component
  }

  if (!isUserLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
