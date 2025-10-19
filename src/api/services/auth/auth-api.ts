import httpClient from '../../http-client';

import { GoogleLoginRequest } from '../../models/auth/google-login';
import { LoginRequest } from '../../models/auth/login-request';
import { RegisterRequest } from '../../models/auth/register-request';

export const getNewAPI = async () => {
  try {
    const response = await httpClient.get('/testEndpoint');
    return response.data;
  } catch (error) {
    console.error('Error fetching new API:', error);
    throw error;
  }
};

export const registerUser = async (userData: RegisterRequest) => {
  try {
    const response = await httpClient.post<string>(
      'api/auth/register',
      userData,
      { withCredentials: false }
    );
    return response.data;
  } catch (error) {
    console.error('Error registering new user:', error);
    throw error;
  }
};

export const verifyEmailApi = (token: string) =>
  httpClient.get('api/auth/verify?token=' + token, { withCredentials: false });

export const signInUser = async (userData: LoginRequest) => {
  try {
    const response = await httpClient.post<string>('api/auth/login', userData);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logoutAPI = async () => {
  try {
    const response = await httpClient.post<null>('api/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const googleAPI = async (idToken: GoogleLoginRequest) => {
  try {
    const response = await httpClient.post<string>('api/auth/googleSignIn', idToken);
    return response.data;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const forgotPasswordAPI = async (email: string) => {
  try {
    const response = await httpClient.post<string>('api/auth/forgot', email);
    return response.data;
  } catch (error) {
    console.error('Error sending your email for password reset:', error);
    throw error;
  }
};
