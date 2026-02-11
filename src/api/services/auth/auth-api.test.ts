/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getNewAPI,
  registerUser,
  verifyEmailApi,
  signInUser,
  logoutAPI,
  googleAPI,
  forgotPasswordAPI,
} from './auth-api';
import httpClient from '../../http-client';

jest.mock('../../http-client');

const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('Auth API', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const errorLogSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    errorLogSpy.mockRestore();
  });

  describe('getNewAPI', () => {
    it('returns data when GET resolves', async () => {
      const fake = { hello: 'world' };
      mockedHttpClient.get.mockResolvedValueOnce({ data: fake });

      await expect(getNewAPI()).resolves.toEqual(fake);
      expect(mockedHttpClient.get).toHaveBeenCalledWith('/testEndpoint');
    });

    it('rethrows when GET rejects and logs the error', async () => {
      const err = new Error('boom');
      mockedHttpClient.get.mockRejectedValueOnce(err);

      await expect(getNewAPI()).rejects.toThrow('boom');
      expect(errorLogSpy).toHaveBeenCalled();
    });
  });

  describe('registerUser', () => {
    it('posts with withCredentials:false and returns data', async () => {
      const fakeResponse = 'registered';
      const userData = {
        email: 'test@example.com',
        password: 'secret',
        firstName: 'Test',
        lastName: 'Example',
      };

      mockedHttpClient.post.mockResolvedValueOnce({ data: fakeResponse });

      await expect(registerUser(userData)).resolves.toEqual(fakeResponse);
      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        'api/auth/register',
        userData,
        { withCredentials: false },
      );
    });

    it('rethrows on error and logs', async () => {
      const err = new Error('Registration error');
      const userData = {
        email: 'test@example.com',
        password: 'secret',
        firstName: 'Test',
        lastName: 'Example',
      };

      mockedHttpClient.post.mockRejectedValueOnce(err);

      await expect(registerUser(userData)).rejects.toThrow(
        'Registration error',
      );
      expect(errorLogSpy).toHaveBeenCalled();
    });
  });

  describe('verifyEmailApi', () => {
    it('calls GET with token and withCredentials:false', async () => {
      const token = 'token123';
      mockedHttpClient.get.mockResolvedValueOnce({ data: 'ok' });

      const p = verifyEmailApi(token); // not awaited to also check the call
      expect(mockedHttpClient.get).toHaveBeenCalledWith(
        'api/auth/verify?token=' + token,
        { withCredentials: false },
      );

      // ensure it still returns what httpClient returns
      await expect(p).resolves.toEqual({ data: 'ok' });
    });
  });

  describe('signInUser', () => {
    it('posts credentials and returns data', async () => {
      const fakeResponse = { token: 'abc123' };
      const signInData = { email: 'test@example.com', password: 'secret' };

      mockedHttpClient.post.mockResolvedValueOnce({ data: fakeResponse });

      await expect(signInUser(signInData)).resolves.toEqual(fakeResponse);
      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        'api/auth/login',
        signInData,
      );
    });

    it('rethrows on error and logs', async () => {
      const err = new Error('Login error');
      const signInData = { email: 'test@example.com', password: 'secret' };

      mockedHttpClient.post.mockRejectedValueOnce(err);

      await expect(signInUser(signInData)).rejects.toThrow('Login error');
      expect(errorLogSpy).toHaveBeenCalled();
    });
  });

  describe('logoutAPI', () => {
    it('posts to logout and returns data', async () => {
      mockedHttpClient.post.mockResolvedValueOnce({ data: null });

      await expect(logoutAPI()).resolves.toBeNull();
      expect(mockedHttpClient.post).toHaveBeenCalledWith('api/auth/logout');
    });

    it('rethrows on error and logs', async () => {
      const err = new Error('Logout failed');
      mockedHttpClient.post.mockRejectedValueOnce(err);

      await expect(logoutAPI()).rejects.toThrow('Logout failed');
      expect(errorLogSpy).toHaveBeenCalled();
    });
  });

  describe('googleAPI', () => {
    it('posts idToken and returns data', async () => {
      const idToken = { idToken: 'google.id.token' } as any; // or proper GoogleLoginRequest
      const fakeResponse = 'ok';
      mockedHttpClient.post.mockResolvedValueOnce({ data: fakeResponse });

      await expect(googleAPI(idToken)).resolves.toEqual(fakeResponse);
      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        'api/auth/googleSignIn',
        idToken,
      );
    });

    it('rethrows on error and logs', async () => {
      const idToken = { idToken: 'bad' } as any;
      const err = new Error('Google sign-in failed');
      mockedHttpClient.post.mockRejectedValueOnce(err);

      await expect(googleAPI(idToken)).rejects.toThrow('Google sign-in failed');
      expect(errorLogSpy).toHaveBeenCalled();
    });
  });

  describe('forgotPasswordAPI', () => {
    it('posts email and returns data', async () => {
      const email = 'test@example.com';
      const fake = 'email sent';
      mockedHttpClient.post.mockResolvedValueOnce({ data: fake });

      await expect(forgotPasswordAPI(email)).resolves.toEqual(fake);
      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        'api/auth/forgot',
        email,
      );
    });

    it('rethrows on error and logs', async () => {
      const err = new Error('Reset error');
      mockedHttpClient.post.mockRejectedValueOnce(err);

      await expect(forgotPasswordAPI('x@y.z')).rejects.toThrow('Reset error');
      expect(errorLogSpy).toHaveBeenCalled();
    });
  });
});
