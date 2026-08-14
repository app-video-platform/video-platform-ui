import httpClient from '../../http-client';
import {
  createMembershipContentAPI,
  deleteMembershipContentAPI,
  getMembershipAggregateAPI,
  updateMembershipConfigAPI,
  updateMembershipContentAPI,
  updateMembershipFeedAPI,
} from './membership-api';

jest.mock('../../http-client');

const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('membership API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads the Product-scoped Membership aggregate', async () => {
    mockedHttpClient.get.mockResolvedValueOnce({
      data: { productId: 'membership-1' },
    });

    await expect(getMembershipAggregateAPI('membership-1')).resolves.toEqual({
      productId: 'membership-1',
    });
    expect(mockedHttpClient.get).toHaveBeenCalledWith(
      'api/products/membership-1/membership',
      { withCredentials: true },
    );
  });

  it('updates Membership config', async () => {
    const payload = { orderingMode: 'MANUAL' as const };
    mockedHttpClient.patch.mockResolvedValueOnce({
      data: { productId: 'membership-1', config: payload },
    });

    await updateMembershipConfigAPI('membership-1', payload);

    expect(mockedHttpClient.patch).toHaveBeenCalledWith(
      'api/products/membership-1/membership',
      payload,
      { withCredentials: true },
    );
  });

  it('creates, updates, and deletes content', async () => {
    mockedHttpClient.post.mockResolvedValueOnce({ data: { id: 'post-1' } });
    mockedHttpClient.patch.mockResolvedValueOnce({ data: { id: 'post-1' } });
    mockedHttpClient.delete.mockResolvedValueOnce({ data: undefined });

    await createMembershipContentAPI('membership-1', {
      type: 'POST',
      title: 'Post',
      body: 'Body',
      status: 'DRAFT',
    });
    await updateMembershipContentAPI('membership-1', 'post-1', {
      type: 'POST',
      title: 'Updated',
    });
    await expect(
      deleteMembershipContentAPI('membership-1', 'post-1'),
    ).resolves.toBe('post-1');

    expect(mockedHttpClient.post).toHaveBeenCalledWith(
      'api/products/membership-1/membership/content',
      {
        type: 'POST',
        title: 'Post',
        body: 'Body',
        status: 'DRAFT',
      },
      { withCredentials: true },
    );
    expect(mockedHttpClient.patch).toHaveBeenCalledWith(
      'api/products/membership-1/membership/content/post-1',
      { type: 'POST', title: 'Updated' },
      { withCredentials: true },
    );
    expect(mockedHttpClient.delete).toHaveBeenCalledWith(
      'api/products/membership-1/membership/content/post-1',
      { withCredentials: true },
    );
  });

  it('updates feed ordering', async () => {
    const payload = {
      orderingMode: 'MANUAL' as const,
      feed: [
        {
          entryId: 'content:post-1',
          kind: 'CONTENT' as const,
          contentId: 'post-1',
          addedAt: '2026-08-10T10:00:00.000Z',
          position: 1,
        },
      ],
    };
    mockedHttpClient.put.mockResolvedValueOnce({
      data: { productId: 'membership-1', feed: payload.feed },
    });

    await updateMembershipFeedAPI('membership-1', payload);

    expect(mockedHttpClient.put).toHaveBeenCalledWith(
      'api/products/membership-1/membership/feed',
      payload,
      { withCredentials: true },
    );
  });
});
