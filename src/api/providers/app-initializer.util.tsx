import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getUserProfile } from '@store/auth-store';
import { AppDispatch } from '..';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserProfile()).then((data) => {
      if (data.type === '"auth/getUserProfile/fulfilled"') {
        navigate('dashboard');
      }
    });
  }, [dispatch]);

  return <>{children}</>;
};

export default AppInitializer;
