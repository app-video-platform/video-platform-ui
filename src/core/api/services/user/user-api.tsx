/* eslint-disable no-console */
import httpClient from '../../http-client';
import { UpdateUserRequest } from '../../models/user/update-user-request';
import { User, UserRole } from '../../models/user/user';

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

export const updateUserDetailsAPI = async (payload: UpdateUserRequest) => {
  try {
    const response = await httpClient.put<User>('api/user/userInfo', payload, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user details:', error);
    throw error;
  }
};

export const changeDevUserRoleAPI = async (role: UserRole) => {
  try {
    const response = await httpClient.put<User>(
      'api/user/dev/role',
      { role },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.error('Error changing dev user role:', error);
    throw error;
  }
};
