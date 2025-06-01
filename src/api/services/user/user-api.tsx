import { User } from '../../../models/user/user';
import httpClient from '../../http-client';

export const getUserProfileAPI = async () => {
  try {
    const response = await httpClient.get<User>('api/user/userInfo', {
      headers: { 'X-CSRF-Force': true },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};
