/* eslint-disable no-unused-vars */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { attachRefreshTokenInterceptor } from './refresh-token';
import { invalidateSessionRequests, setSessionFailureHandler } from './session-lifecycle';

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
};

const setup = () => {
  const client = axios.create({ withCredentials: true });
  const detach = attachRefreshTokenInterceptor(client);
  const mock = new MockAdapter(client);
  return { client, mock, detach };
};

describe('cookie refresh coordination', () => {
  afterEach(() => { setSessionFailureHandler(() => undefined); });

  it.each([1, 3])('settles %i concurrent reads after one text refresh without a Bearer header', async (count) => {
    const { client, mock, detach } = setup();
    const gate = deferred<[number, string]>();
    const started = deferred<void>();
    let ready = false;
    mock.onGet().reply(() => ready ? [200, 'private'] : [401]);
    mock.onPost('api/auth/refresh').reply(() => { started.resolve(); return gate.promise; });
    const reads = Array.from({ length: count }, (_, i) => client.get(`/private/${i}`));
    await started.promise;
    ready = true;
    gate.resolve([200, 'Refresh successful']);
    expect((await Promise.all(reads)).map((response) => response.data)).toEqual(Array(count).fill('private'));
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].withCredentials).toBe(true);
    expect(mock.history.get).toHaveLength(count * 2);
    mock.history.get.forEach((request) => expect(request.headers?.Authorization).toBeUndefined());
    detach();
  });

  it('rejects every waiter on refresh failure and permits a later independent attempt', async () => {
    const { client, mock, detach } = setup();
    const gate = deferred<[number]>();
    const started = deferred<void>();
    mock.onGet().reply(401);
    mock.onPost('api/auth/refresh').reply(() => { started.resolve(); return gate.promise; });
    const results = Promise.allSettled([client.get('/a'), client.get('/b'), client.get('/c')]);
    await started.promise;
    gate.resolve([401]);
    expect((await results).every((result) => result.status === 'rejected')).toBe(true);
    expect(mock.history.post).toHaveLength(1);
    mock.resetHandlers();
    mock.onPost('api/auth/refresh').reply(200, 'Refresh successful');
    mock.onGet('/later').replyOnce(401).onGet('/later').reply(200);
    await expect(client.get('/later')).resolves.toMatchObject({ status: 200 });
    detach();
  });

  it.each([401, 503])('settles a replay returning %i without an infinite retry', async (status) => {
    const { client, mock, detach } = setup();
    mock.onGet('/private').replyOnce(401).onGet('/private').reply(status);
    mock.onPost('api/auth/refresh').reply(200, 'Refresh successful');
    await expect(client.get('/private')).rejects.toMatchObject({ response: { status } });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.post).toHaveLength(1);
    detach();
  });

  it('cancels all waiters immediately at a session boundary and ignores late refresh success', async () => {
    const { client, mock, detach } = setup();
    const gate = deferred<[number, string]>();
    const started = deferred<void>();
    mock.onGet().reply(401);
    mock.onPost('api/auth/refresh').reply(() => { started.resolve(); return gate.promise; });
    const results = Promise.allSettled([client.get('/a'), client.get('/b')]);
    await started.promise;
    invalidateSessionRequests();
    expect((await results).every((result) => result.status === 'rejected')).toBe(true);
    gate.resolve([200, 'Refresh successful']);
    mock.resetHandlers();
    mock.onGet('/new-session').reply(200);
    await client.get('/new-session');
    expect(mock.history.get.map((request) => request.url)).toEqual(['/a', '/b', '/new-session']);
    expect(mock.history.post[0].signal?.aborted).toBe(true);
    detach();
  });

  it('rejects a late response from the old transport generation without starting refresh', async () => {
    const { client, mock, detach } = setup();
    const gate = deferred<[number]>();
    const started = deferred<void>();
    mock.onGet().reply(() => { started.resolve(); return gate.promise; });
    const result = client.get('/old').catch((error) => error);
    await started.promise;
    invalidateSessionRequests();
    gate.resolve([401]);
    expect(axios.isCancel(await result)).toBe(true);
    expect(mock.history.post).toHaveLength(0);
    detach();
  });
});

describe('request boundary capture and public reads', () => {
  it('captures the session when a request is invoked, before any awaited response', async () => {
    const { client, mock, detach } = setup();
    const gate = deferred<[number, string]>();
    mock.onGet('/old').reply(() => gate.promise);
    const result = client.get('/old').catch((error) => error);
    invalidateSessionRequests();
    gate.resolve([200, 'old private data']);
    expect(axios.isCancel(await result)).toBe(true);
    detach();
  });

  it('preserves independent public reads across an account change', async () => {
    const { client, mock, detach } = setup();
    const gate = deferred<[number, string]>();
    mock.onGet('api/storefronts/public').reply(() => gate.promise);
    const result = client.get('api/storefronts/public');
    invalidateSessionRequests();
    gate.resolve([200, 'public data']);
    expect((await result).data).toBe('public data');
    detach();
  });
});
