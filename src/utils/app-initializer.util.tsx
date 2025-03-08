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
    // const token = localStorage.getItem('userToken');
    // const firstName = localStorage.getItem('firstName');
    // const lastName = localStorage.getItem('lastName');
    // const email = localStorage.getItem('email');
    // const role = localStorage.getItem('roles');


    // if (token) {
    //   dispatch(setToken(token));
    // }
    dispatch(getUserProfile()).then((data) => {
      console.log('User Profile in Init', data);
      navigate('dashboard');
    });
    // if (firstName && lastName && email && role) {
    //   const roleList = role.split(',').map(role => role.trim());
    //   const user: User = {
    //     firstName,
    //     lastName,
    //     email,
    //     role: roleList
    //   };
    //   dispatch(setUserProfile(user));
    // } else {
    //   dispatch(getUserProfile()).then((data) => {
    //     console.log('User Profile in Init', data);
    //     navigate('dashboard');
    //   });
    // }
  }, [dispatch]);

  return <>{children}</>;
};

export default AppInitializer;