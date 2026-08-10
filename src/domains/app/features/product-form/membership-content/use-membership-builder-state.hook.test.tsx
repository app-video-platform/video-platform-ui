import { act, renderHook } from '@testing-library/react';

import {
  createMembershipPostItem,
  createMembershipResourceItem,
  createMembershipVideoItem,
  orderMembershipFeedEntries,
  updateMembershipPostItem,
} from './models';
import { useMembershipBuilderState } from './use-membership-builder-state.hook';

describe('useMembershipBuilderState', () => {
  it('defaults to NEWEST_FIRST ordering', () => {
    const { result } = renderHook(() => useMembershipBuilderState());

    expect(result.current.orderingMode).toBe('NEWEST_FIRST');
  });

  it('creates native content feed entries with stable identity and addedAt', () => {
    const { result } = renderHook(() => useMembershipBuilderState());
    const now = '2026-08-10T10:00:00.000Z';

    act(() => {
      const postId = result.current.getNextNativeContentId('POST');
      result.current.addNativeContentItem(
        createMembershipPostItem(
          {
            title: 'Member post',
            body: 'Saved content',
            status: 'DRAFT',
          },
          postId,
          now,
        ),
        now,
      );
    });

    expect(result.current.feedEntries).toEqual([
      {
        entryId: 'content:membership-post-1',
        kind: 'CONTENT',
        contentId: 'membership-post-1',
        addedAt: now,
      },
    ]);
  });

  it('editing native content preserves its feed entry identity', () => {
    const { result } = renderHook(() => useMembershipBuilderState());
    const createdAt = '2026-08-10T10:00:00.000Z';
    const updatedAt = '2026-08-10T11:00:00.000Z';

    act(() => {
      result.current.addNativeContentItem(
        createMembershipPostItem(
          {
            title: 'Original post',
            body: 'Original body',
            status: 'DRAFT',
          },
          'membership-post-1',
          createdAt,
        ),
        createdAt,
      );
    });

    const originalFeedEntry = result.current.feedEntries[0];

    act(() => {
      result.current.updateNativeContentItem('membership-post-1', (item) => {
        if (item.type !== 'POST') {
          return item;
        }

        return updateMembershipPostItem(
          item,
          {
            title: 'Updated post',
            body: 'Updated body',
            status: 'PUBLISHED',
          },
          updatedAt,
        );
      });
    });

    expect(result.current.feedEntries[0]).toEqual(originalFeedEntry);
    expect(result.current.nativeContentItems[0]).toEqual(
      expect.objectContaining({
        title: 'Updated post',
        updatedAt,
      }),
    );
  });

  it('deleting native content removes its corresponding feed entry', () => {
    const { result } = renderHook(() => useMembershipBuilderState());
    const now = '2026-08-10T10:00:00.000Z';

    act(() => {
      result.current.addNativeContentItem(
        createMembershipPostItem(
          {
            title: 'Member post',
            body: 'Saved content',
            status: 'DRAFT',
          },
          'membership-post-1',
          now,
        ),
        now,
      );
      result.current.deleteNativeContentItem('membership-post-1');
    });

    expect(result.current.nativeContentItems).toEqual([]);
    expect(result.current.feedEntries).toEqual([]);
  });

  it('creates included Product feed entries with membership-specific addedAt', () => {
    const { result } = renderHook(() => useMembershipBuilderState());
    const addedAt = '2026-08-10T10:00:00.000Z';

    act(() => {
      result.current.addIncludedProducts(['course-1'], addedAt);
    });

    expect(result.current.includedProductEntries).toEqual([
      {
        entryId: 'product:course-1',
        kind: 'PRODUCT',
        productId: 'course-1',
        addedAt,
      },
    ]);
  });

  it('removing and re-adding a Product creates the deterministic feed identity with new addedAt', () => {
    const { result } = renderHook(() => useMembershipBuilderState());

    act(() => {
      result.current.addIncludedProducts(
        ['course-1'],
        '2026-08-10T10:00:00.000Z',
      );
      result.current.removeIncludedProduct('course-1');
      result.current.addIncludedProducts(
        ['course-1'],
        '2026-08-10T11:00:00.000Z',
      );
    });

    expect(result.current.includedProductEntries).toEqual([
      {
        entryId: 'product:course-1',
        kind: 'PRODUCT',
        productId: 'course-1',
        addedAt: '2026-08-10T11:00:00.000Z',
      },
    ]);
  });

  it('does not duplicate included Product feed entries', () => {
    const { result } = renderHook(() => useMembershipBuilderState());

    act(() => {
      result.current.addIncludedProducts(
        ['course-1'],
        '2026-08-10T10:00:00.000Z',
      );
      result.current.addIncludedProducts(
        ['course-1'],
        '2026-08-10T11:00:00.000Z',
      );
    });

    expect(result.current.includedProductEntries).toHaveLength(1);
    expect(result.current.includedProductEntries[0].addedAt).toBe(
      '2026-08-10T10:00:00.000Z',
    );
  });

  it('switching from NEWEST_FIRST to MANUAL preserves the current visible order', () => {
    const { result } = renderHook(() => useMembershipBuilderState());

    act(() => {
      result.current.addNativeContentItem(
        createMembershipPostItem(
          {
            title: 'Older post',
            body: 'Older body',
            status: 'DRAFT',
          },
          'membership-post-1',
          '2026-08-10T10:00:00.000Z',
        ),
        '2026-08-10T10:00:00.000Z',
      );
      result.current.addIncludedProducts(
        ['course-1'],
        '2026-08-10T12:00:00.000Z',
      );
    });

    act(() => {
      result.current.setOrderingMode('MANUAL');
    });

    expect(result.current.orderingMode).toBe('MANUAL');
    expect(result.current.feedEntries.map((entry) => entry.entryId)).toEqual([
      'product:course-1',
      'content:membership-post-1',
    ]);
  });

  it('moves native content and Products within one manual sequence', () => {
    const { result } = renderHook(() => useMembershipBuilderState());

    act(() => {
      result.current.addNativeContentItem(
        createMembershipPostItem(
          {
            title: 'Post',
            body: 'Body',
            status: 'DRAFT',
          },
          'membership-post-1',
          '2026-08-10T10:00:00.000Z',
        ),
        '2026-08-10T10:00:00.000Z',
      );
      result.current.addIncludedProducts(
        ['course-1'],
        '2026-08-10T11:00:00.000Z',
      );
      result.current.addNativeContentItem(
        createMembershipVideoItem(
          {
            title: 'Video',
            description: '',
            status: 'DRAFT',
            video: {
              fileName: 'video.mp4',
              fileType: 'video/mp4',
              size: 4096,
            },
          },
          'membership-video-1',
          '2026-08-10T12:00:00.000Z',
        ),
        '2026-08-10T12:00:00.000Z',
      );
      result.current.setOrderingMode('MANUAL');
    });

    expect(result.current.feedEntries.map((entry) => entry.entryId)).toEqual([
      'content:membership-video-1',
      'product:course-1',
      'content:membership-post-1',
    ]);

    act(() => {
      result.current.moveFeedEntry('product:course-1', 'UP');
    });

    expect(result.current.feedEntries.map((entry) => entry.entryId)).toEqual([
      'product:course-1',
      'content:membership-video-1',
      'content:membership-post-1',
    ]);

    act(() => {
      result.current.moveFeedEntry('product:course-1', 'DOWN');
    });

    expect(result.current.feedEntries.map((entry) => entry.entryId)).toEqual([
      'content:membership-video-1',
      'product:course-1',
      'content:membership-post-1',
    ]);
  });

  it('does not move beyond manual sequence boundaries', () => {
    const { result } = renderHook(() => useMembershipBuilderState());

    act(() => {
      result.current.addIncludedProducts(
        ['course-1'],
        '2026-08-10T10:00:00.000Z',
      );
      result.current.addIncludedProducts(
        ['download-1'],
        '2026-08-10T11:00:00.000Z',
      );
      result.current.setOrderingMode('MANUAL');
    });

    const initialOrder = result.current.feedEntries.map(
      (entry) => entry.entryId,
    );

    act(() => {
      result.current.moveFeedEntry(initialOrder[0], 'UP');
      result.current.moveFeedEntry(initialOrder[1], 'DOWN');
    });

    expect(result.current.feedEntries.map((entry) => entry.entryId)).toEqual(
      initialOrder,
    );
  });

  it('switching to NEWEST_FIRST restores chronological display while preserving manual order', () => {
    const { result } = renderHook(() => useMembershipBuilderState());

    act(() => {
      result.current.addNativeContentItem(
        createMembershipPostItem(
          {
            title: 'Post',
            body: 'Body',
            status: 'DRAFT',
          },
          'membership-post-1',
          '2026-08-10T10:00:00.000Z',
        ),
        '2026-08-10T10:00:00.000Z',
      );
      result.current.addIncludedProducts(
        ['course-1'],
        '2026-08-10T12:00:00.000Z',
      );
    });

    act(() => {
      result.current.setOrderingMode('MANUAL');
    });

    act(() => {
      result.current.moveFeedEntry('content:membership-post-1', 'UP');
    });

    expect(result.current.feedEntries.map((entry) => entry.entryId)).toEqual([
      'content:membership-post-1',
      'product:course-1',
    ]);

    act(() => {
      result.current.setOrderingMode('NEWEST_FIRST');
    });

    expect(
      orderMembershipFeedEntries(
        result.current.feedEntries,
        result.current.orderingMode,
      ).map((entry) => entry.entryId),
    ).toEqual(['product:course-1', 'content:membership-post-1']);

    act(() => {
      result.current.setOrderingMode('MANUAL');
    });

    expect(result.current.feedEntries.map((entry) => entry.entryId)).toEqual([
      'content:membership-post-1',
      'product:course-1',
    ]);
  });

  it('adds new native content and included Products at the top in MANUAL', () => {
    const { result } = renderHook(() => useMembershipBuilderState());

    act(() => {
      result.current.addIncludedProducts(
        ['course-1'],
        '2026-08-10T10:00:00.000Z',
      );
    });

    act(() => {
      result.current.setOrderingMode('MANUAL');
    });

    act(() => {
      result.current.addNativeContentItem(
        createMembershipResourceItem(
          {
            title: 'Resource',
            description: '',
            status: 'DRAFT',
            file: {
              fileName: 'resource.pdf',
              fileType: 'application/pdf',
              size: 4096,
            },
          },
          'membership-resource-1',
          '2026-08-10T11:00:00.000Z',
        ),
        '2026-08-10T11:00:00.000Z',
      );
      result.current.addIncludedProducts(
        ['download-1'],
        '2026-08-10T12:00:00.000Z',
      );
    });

    expect(result.current.feedEntries.map((entry) => entry.entryId)).toEqual([
      'product:download-1',
      'content:membership-resource-1',
      'product:course-1',
    ]);
  });

  it('editing native content preserves manual position', () => {
    const { result } = renderHook(() => useMembershipBuilderState());

    act(() => {
      result.current.addIncludedProducts(
        ['course-1'],
        '2026-08-10T10:00:00.000Z',
      );
      result.current.addNativeContentItem(
        createMembershipPostItem(
          {
            title: 'Post',
            body: 'Body',
            status: 'DRAFT',
          },
          'membership-post-1',
          '2026-08-10T11:00:00.000Z',
        ),
        '2026-08-10T11:00:00.000Z',
      );
      result.current.setOrderingMode('MANUAL');
      result.current.updateNativeContentItem('membership-post-1', (item) => {
        if (item.type !== 'POST') {
          return item;
        }

        return updateMembershipPostItem(
          item,
          {
            title: 'Updated post',
            body: 'Updated body',
            status: 'PUBLISHED',
          },
          '2026-08-10T12:00:00.000Z',
        );
      });
    });

    expect(result.current.feedEntries.map((entry) => entry.entryId)).toEqual([
      'content:membership-post-1',
      'product:course-1',
    ]);
  });
});
