/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllCalendarProvidersAPI, connectCalendarAPI } from './calendar-api';
import httpClient from '../../http-client';

jest.mock('../../http-client');

const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('Calendars API', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const errorLogSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    errorLogSpy.mockRestore();
  });

  describe('getAllCalendarProvidersAPI', () => {
    it('returns provider list when GET resolves', async () => {
      const providers = ['google', 'outlook', 'apple'];
      mockedHttpClient.get.mockResolvedValueOnce({ data: { providers } });

      await expect(getAllCalendarProvidersAPI()).resolves.toEqual(providers);
      expect(mockedHttpClient.get).toHaveBeenCalledWith(
        'api/calendars/providers',
      );
    });

    it('rethrows when GET rejects and logs', async () => {
      const err = new Error('providers failed');
      mockedHttpClient.get.mockRejectedValueOnce(err);

      await expect(getAllCalendarProvidersAPI()).rejects.toThrow(
        'providers failed',
      );
      expect(errorLogSpy).toHaveBeenCalled();
    });
  });

  describe('connectCalendarAPI', () => {
    it('POSTs payload with withCredentials:true and returns data', async () => {
      const payload = {
        provider: 'google',
        redirectUrl: 'https://app.example.com/callback',
        scopes: ['calendar.read', 'calendar.write'],
      } as any; // replace with ConnectInitRequest type if available in test scope

      const responseData = {
        authUrl: 'https://accounts.google.com/o/oauth2/auth?...',
        state: 'xyz123',
      };

      mockedHttpClient.post.mockResolvedValueOnce({ data: responseData });

      await expect(connectCalendarAPI(payload)).resolves.toEqual(responseData);
      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        '/api/calendars/connect',
        payload,
        { withCredentials: true },
      );
    });

    it('rethrows when POST rejects and logs', async () => {
      const payload = { provider: 'outlook' } as any;
      const err = new Error('connect failed');

      mockedHttpClient.post.mockRejectedValueOnce(err);

      await expect(connectCalendarAPI(payload)).rejects.toThrow(
        'connect failed',
      );
      expect(errorLogSpy).toHaveBeenCalled();
    });
  });
});
