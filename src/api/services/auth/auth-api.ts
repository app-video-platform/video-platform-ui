import { SignInFormData } from '../../../pages/sign-in/sign-in.component';
import httpClient from '../../http-client';
import { UserRegisterData } from '../../models/user/user';

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

export const signInUser = async (userData: SignInFormData) => {
  try {
    // const response = await httpClient.post<UserLoginResponse>('api/auth/login', userData, { mock: true }); // COMM FOR INTERCEPT
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

export const googleAPI = async (idToken: string) => {
  try {
    const response = await httpClient.post<string>('api/auth/googleSignIn', {
      idToken: idToken,
    });
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
