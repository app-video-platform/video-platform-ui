// user-api.test.ts

import { registerUser, signInUser, verifyEmailApi } from './auth-api';
import httpClient from './http-client';

jest.mock('./http-client');

const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('Auth API functions', () => {
  describe('registerUser', () => {
    it('should return data when httpClient.post resolves', async () => {
      const fakeResponse = 'registered';
      const userData = { email: 'test@example.com', password: 'secret', firstName: 'Test', lastName: 'Example' };

      // Assuming UserRegisterData matches this shape
      mockedHttpClient.post.mockResolvedValueOnce({ data: fakeResponse });

      const result = await registerUser(userData);
      expect(result).toEqual(fakeResponse);
      expect(mockedHttpClient.post).toHaveBeenCalledWith('api/auth/register', userData, { withCredentials: false });
    });

    it('should throw error when httpClient.post rejects', async () => {
      const error = new Error('Registration error');
      const userData = { email: 'test@example.com', password: 'secret', firstName: 'Test', lastName: 'Example' };

      mockedHttpClient.post.mockRejectedValueOnce(error);

      await expect(registerUser(userData)).rejects.toThrow('Registration error');
    });
  });

  describe('signInUser', () => {
    it('should return data when httpClient.post resolves', async () => {
      const fakeResponse = { token: 'abc123' };
      const signInData = { email: 'test@example.com', password: 'secret' };

      mockedHttpClient.post.mockResolvedValueOnce({ data: fakeResponse });

      const result = await signInUser(signInData);
      expect(result).toEqual(fakeResponse);
      expect(mockedHttpClient.post).toHaveBeenCalledWith('api/auth/login', signInData, { withCredentials: false });
    });

    it('should throw error when httpClient.post rejects', async () => {
      const error = new Error('Login error');
      const signInData = { email: 'test@example.com', password: 'secret' };

      mockedHttpClient.post.mockRejectedValueOnce(error);

      await expect(signInUser(signInData)).rejects.toThrow('Login error');
    });
  });

  describe('verifyEmailApi', () => {
    it('should call httpClient.get with the correct URL', () => {
      const token = 'token123';
      verifyEmailApi(token);
      expect(mockedHttpClient.get).toHaveBeenCalledWith('api/auth/verify?token=' + token, { withCredentials: false });
    });
  });
});
