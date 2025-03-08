import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUserProfile, setUserProfile } from './../store/auth.slice';
import { AppDispatch } from './../store/store';
import { User } from '../models/user';
import { useNavigate } from 'react-router-dom';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {

    dispatch(getUserProfile()).then((data) => {
      if (data.type === '"auth/getUserProfile/fulfilled"') {
        console.log('User Profile in Init', data);
        navigate('dashboard');
      }
    });

  }, [dispatch]);

  return <>{children}</>;
};

export default AppInitializer;