import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { attachCsrfInterceptor } from './csrf';

describe('registration CSRF request headers', () => {
  let client: ReturnType<typeof axios.create>;
  let mock: MockAdapter;

  beforeEach(() => {
    document.cookie = 'XSRF-TOKEN=matching-cookie-token; path=/';
    client = axios.create();
    attachCsrfInterceptor(client);
    mock = new MockAdapter(client);
    mock.onPost(/api\/auth\/register/).reply(200, 'registered');
  });

  afterEach(() => {
    mock.restore();
    document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });

  it('attaches a cookie token for registration when no explicit token is supplied', async () => {
    await client.post('api/auth/register', {}, { withCredentials: true });
    expect(mock.history.post[0].withCredentials).toBe(true);
    expect(mock.history.post[0].headers?.['X-XSRF-TOKEN']).toBe(
      'matching-cookie-token',
    );
  });

  it('preserves the token returned by the credentialed bootstrap request', async () => {
    await client.post('api/auth/register', {}, {
      withCredentials: true,
      headers: { 'X-XSRF-TOKEN': 'bootstrap-response-token' },
    });
    expect(mock.history.post[0].headers?.['X-XSRF-TOKEN']).toBe(
      'bootstrap-response-token',
    );
  });
});
