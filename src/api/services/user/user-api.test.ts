/* eslint-disable @typescript-eslint/no-explicit-any */
import httpClient from '../../http-client';
import { UpdateUserRequest } from '../../models/user/update-user-request';
import { User, UserRole } from '../../models/user/user';
import { getUserProfileAPI, updateUserDetailsAPI } from './user-api';

jest.mock('../../http-client');

const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('User API', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const errorLogSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    errorLogSpy.mockRestore();
  });

  describe('getUserProfileAPI', () => {
    it('returns data when httpClient.get resolves', async () => {
      const fakeResponse: User = {
        firstName: 'Mock',
        lastName: 'User',
        email: 'mock@user.test',
        roles: [UserRole.USER],
        onboardingCompleted: true,
      };

      mockedHttpClient.get.mockResolvedValueOnce({ data: fakeResponse });

      const result = await getUserProfileAPI();

      expect(result).toEqual(fakeResponse);
      expect(mockedHttpClient.get).toHaveBeenCalledWith('api/user/userInfo', {
        headers: { 'X-CSRF-Force': true },
      });
    });

    it('logs and rethrows when httpClient.get rejects', async () => {
      const error = new Error('Retrieving user info error');
      mockedHttpClient.get.mockRejectedValueOnce(error);

      await expect(getUserProfileAPI()).rejects.toThrow(
        'Retrieving user info error',
      );
      expect(errorLogSpy).toHaveBeenCalled();
    });
  });

  describe('updateUserDetailsAPI', () => {
    it('PUTs payload with withCredentials:true and returns data', async () => {
      const payload: UpdateUserRequest = {
        title: 'Mr.',
      };
      const response: any = {
        ...payload,
        roles: [UserRole.USER],
        onboardingCompleted: true,
      };

      mockedHttpClient.put.mockResolvedValueOnce({ data: response });

      const result = await updateUserDetailsAPI(payload);

      expect(result).toEqual(response);
      expect(mockedHttpClient.put).toHaveBeenCalledWith(
        'api/user/userInfo',
        payload,
        { withCredentials: true },
      );
    });

    it('logs and rethrows when httpClient.put rejects', async () => {
      const error = new Error('Update failed');
      const payload = { firstName: 'X' };

      mockedHttpClient.put.mockRejectedValueOnce(error);

      await expect(updateUserDetailsAPI(payload as any)).rejects.toThrow(
        'Update failed',
      );
      expect(errorLogSpy).toHaveBeenCalled();
    });
  });
});
