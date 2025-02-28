import { User } from '../models/user';
import { SignupFormData } from '../pages/sign-up/sign-up.component';
import httpClient from './http-client';

// export const getUser = async (userId: string) => {
//   // const response = await httpClient.get(`/users/${userId}`);
//   // return response.data;
//   try {
//     const response = await httpClient.get('/users');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     throw error;
//   }
// };

// export const updateUser = async (userId, userData) => {
//   const response = await httpClient.put(`/users/${userId}`, userData);
//   return response.data;
// };

export const getNewAPI = async () => {
  try {
    const response = await httpClient.get('/testEndpoint');
    return response.data;
  } catch (error) {
    console.error('Error fetching new API:', error);
    throw error;
  }
};


export const registerUser = async (userData: SignupFormData) => {
  try {
    const response = await httpClient.post<User>('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering new user:', error);
    throw error;
  }
};