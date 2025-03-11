// src/routes/protected-route.tsx
import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
// Example of pulling user state from a React Context or your Auth store:
import { useSelector } from 'react-redux';
import { selectIsUserLoggedIn } from '../store/auth-store/auth.selectors';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  // isAuthenticated => boolean that indicates if the user is logged in

  if (!isUserLoggedIn) {
    // If the user is not authenticated, redirect to sign-in, or anywhere you want
    return <Navigate to="/signin" replace />;
  }

  // Otherwise, show the route as normal
  return children;
};

export default ProtectedRoute;
