import { configureStore } from '@reduxjs/toolkit';

import {
  createMembershipContentAPI,
  deleteMembershipContentAPI,
  getMembershipAggregateAPI,
  updateMembershipContentAPI,
  updateMembershipFeedAPI,
} from 'core/api/services';
import membershipReducer, {
  createMembershipContent,
  deleteMembershipContent,
  fetchMembershipAggregate,
  updateMembershipContent,
  updateMembershipFeed,
} from './membership.slice';

jest.mock('core/api/services', () => ({
  getMembershipAggregateAPI: jest.fn(),
  updateMembershipConfigAPI: jest.fn(),
  createMembershipContentAPI: jest.fn(),
  updateMembershipContentAPI: jest.fn(),
  deleteMembershipContentAPI: jest.fn(),
  updateMembershipFeedAPI: jest.fn(),
}));

const mockedGetMembershipAggregateAPI =
  getMembershipAggregateAPI as jest.MockedFunction<typeof getMembershipAggregateAPI>;
const mockedCreateMembershipContentAPI =
  createMembershipContentAPI as jest.MockedFunction<typeof createMembershipContentAPI>;
const mockedUpdateMembershipContentAPI =
  updateMembershipContentAPI as jest.MockedFunction<typeof updateMembershipContentAPI>;
const mockedDeleteMembershipContentAPI =
  deleteMembershipContentAPI as jest.MockedFunction<typeof deleteMembershipContentAPI>;
const mockedUpdateMembershipFeedAPI =
  updateMembershipFeedAPI as jest.MockedFunction<typeof updateMembershipFeedAPI>;

const aggregate = {
  productId: 'membership-1',
  config: {
    productId: 'membership-1',
    orderingMode: 'NEWEST_FIRST' as const,
  },
  content: [],
  feed: [],
};

const createStore = () =>
  configureStore({
    reducer: {
      membership: membershipReducer,
    },
  });

describe('membership slice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads a Membership aggregate by Product id', async () => {
    mockedGetMembershipAggregateAPI.mockResolvedValueOnce(aggregate);
    const store = createStore();

    await store.dispatch(fetchMembershipAggregate('membership-1'));

    expect(store.getState().membership.byProductId['membership-1']).toEqual(
      aggregate,
    );
    expect(store.getState().membership.loading).toBe(false);
    expect(store.getState().membership.error).toBeNull();
  });

  it('stores load errors', async () => {
    mockedGetMembershipAggregateAPI.mockRejectedValueOnce(new Error('nope'));
    const store = createStore();

    await store.dispatch(fetchMembershipAggregate('membership-1'));

    expect(store.getState().membership.loading).toBe(false);
    expect(store.getState().membership.error).toBe('nope');
  });

  it('creates and updates content in the loaded aggregate', async () => {
    mockedGetMembershipAggregateAPI.mockResolvedValueOnce(aggregate);
    mockedCreateMembershipContentAPI.mockResolvedValueOnce({
      id: 'post-1',
      type: 'POST',
      title: 'Post',
      body: 'Body',
      status: 'DRAFT',
      createdAt: '2026-08-10T10:00:00.000Z',
      updatedAt: '2026-08-10T10:00:00.000Z',
    });
    mockedUpdateMembershipContentAPI.mockResolvedValueOnce({
      id: 'post-1',
      type: 'POST',
      title: 'Updated',
      body: 'Body',
      status: 'PUBLISHED',
      createdAt: '2026-08-10T10:00:00.000Z',
      updatedAt: '2026-08-10T11:00:00.000Z',
    });
    const store = createStore();

    await store.dispatch(fetchMembershipAggregate('membership-1'));
    await store.dispatch(
      createMembershipContent({
        productId: 'membership-1',
        payload: {
          type: 'POST',
          title: 'Post',
          body: 'Body',
          status: 'DRAFT',
        },
      }),
    );
    await store.dispatch(
      updateMembershipContent({
        productId: 'membership-1',
        contentId: 'post-1',
        payload: {
          type: 'POST',
          status: 'PUBLISHED',
          title: 'Updated',
        },
      }),
    );

    expect(
      store.getState().membership.byProductId['membership-1']?.content[0],
    ).toMatchObject({
      id: 'post-1',
      title: 'Updated',
      status: 'PUBLISHED',
    });
  });

  it('deletes content and its feed entry', async () => {
    mockedGetMembershipAggregateAPI.mockResolvedValueOnce({
      ...aggregate,
      content: [
        {
          id: 'post-1',
          type: 'POST',
          title: 'Post',
          body: 'Body',
          status: 'DRAFT',
          createdAt: '2026-08-10T10:00:00.000Z',
          updatedAt: '2026-08-10T10:00:00.000Z',
        },
      ],
      feed: [
        {
          entryId: 'content:post-1',
          kind: 'CONTENT',
          contentId: 'post-1',
          addedAt: '2026-08-10T10:00:00.000Z',
        },
      ],
    });
    mockedDeleteMembershipContentAPI.mockResolvedValueOnce('post-1');
    const store = createStore();

    await store.dispatch(fetchMembershipAggregate('membership-1'));
    await store.dispatch(
      deleteMembershipContent({ productId: 'membership-1', contentId: 'post-1' }),
    );

    expect(
      store.getState().membership.byProductId['membership-1']?.content,
    ).toEqual([]);
    expect(store.getState().membership.byProductId['membership-1']?.feed).toEqual(
      [],
    );
  });

  it('stores feed updates returned by the service', async () => {
    const nextAggregate = {
      ...aggregate,
      config: {
        productId: 'membership-1',
        orderingMode: 'MANUAL' as const,
      },
      feed: [
        {
          entryId: 'product:course-1',
          kind: 'PRODUCT' as const,
          productId: 'course-1',
          addedAt: '2026-08-10T10:00:00.000Z',
          position: 1,
        },
      ],
    };
    mockedUpdateMembershipFeedAPI.mockResolvedValueOnce(nextAggregate);
    const store = createStore();

    await store.dispatch(
      updateMembershipFeed({
        productId: 'membership-1',
        payload: {
          orderingMode: 'MANUAL',
          feed: nextAggregate.feed,
        },
      }),
    );

    expect(
      store.getState().membership.byProductId['membership-1']?.config
        .orderingMode,
    ).toBe('MANUAL');
    expect(
      store.getState().membership.byProductId['membership-1']?.feed[0].position,
    ).toBe(1);
  });
});
