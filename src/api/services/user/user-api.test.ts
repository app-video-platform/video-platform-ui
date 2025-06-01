import { User } from '../../../models/user/user';
import httpClient from '../../http-client';
import { getUserProfileAPI } from './user-api';

jest.mock('../../http-client');

const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('User API functions', () => {
  describe('getUserProfile', () => {
    it('should return data when httpClient.get resolves', async () => {
      const fakeResponse: User = {
        firstName: 'Mock',
        lastName: 'User',
        email: 'mock@user.test',
        role: ['User'],
        onboardingCompleted: true,
      };

      mockedHttpClient.get.mockResolvedValueOnce({ data: fakeResponse });

      const result = await getUserProfileAPI();
      expect(result).toEqual(fakeResponse);
      expect(mockedHttpClient.get).toHaveBeenCalledWith('api/user/userInfo', {
        headers: { 'X-CSRF-Force': true },
      });
    });

    it('should throw error when httpClient.get rejects', async () => {
      const error = new Error('Retrieving user info error');

      mockedHttpClient.get.mockRejectedValueOnce(error);

      await expect(getUserProfileAPI()).rejects.toThrow(
        'Retrieving user info error'
      );
    });
  });
});
