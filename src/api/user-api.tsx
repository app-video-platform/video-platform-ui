import { UserLoginResponse, UserRegisterData } from '../models/user';
import { SignInFormData } from '../pages/sign-in/sign-in.component';
import httpClient from './http-client';

export const getNewAPI = async () => {
  try {
    const response = await httpClient.get('/testEndpoint');
    return response.data;
  } catch (error) {
    console.error('Error fetching new API:', error);
    throw error;
  }
};

export const registerUser = async (userData: UserRegisterData) => {
  try {
    const response = await httpClient.post<string>('api/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering new user:', error);
    throw error;
  }
};

export const signInUser = async (userData: SignInFormData) => {
  try {
    // const response = await httpClient.post<UserLoginResponse>('api/auth/login', userData, { mock: true }); // COMM FOR INTERCEPT
    const response = await httpClient.post<UserLoginResponse>('api/auth/login', userData);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const verifyEmailApi = (token: string) => httpClient.get('api/auth/verify?token=' + token);