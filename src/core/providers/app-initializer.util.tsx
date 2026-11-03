import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUserProfile } from 'core/store/auth-store';
import { AppDispatch } from '../api';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);
  return <>{children}</>;
};

export default AppInitializer;
