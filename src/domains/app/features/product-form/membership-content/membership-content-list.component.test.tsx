import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ProductMinimised } from 'core/api/models';
import MembershipContentList from './membership-content-list.component';
import {
  createMembershipContentListItems,
  createMembershipContentFeedEntry,
  createMembershipPostItem,
  createMembershipProductFeedEntry,
  createMembershipResourceItem,
  createMembershipVideoItem,
  MembershipContentItem,
  orderMembershipFeedEntries,
  updateMembershipPostItem,
  updateMembershipResourceItem,
  updateMembershipVideoItem,
} from './models';

const nativePost: MembershipContentItem = {
  id: 'post-1',
  type: 'POST',
  title: 'Member update',
  body: 'A quick note for members',
  status: 'DRAFT',
  createdAt: '2026-08-08T10:00:00.000Z',
  updatedAt: '2026-08-08T10:00:00.000Z',
};

const nativeVideo: MembershipContentItem = {
  id: 'video-1',
  type: 'VIDEO',
  title: 'Member video',
  description: 'Private video update',
  status: 'PUBLISHED',
  video: {
    fileName: 'member-video.mp4',
    fileType: 'video/mp4',
    size: 4096,
  },
  createdAt: '2026-08-08T10:00:00.000Z',
  updatedAt: '2026-08-08T10:00:00.000Z',
};

const nativeResource: MembershipContentItem = {
  id: 'resource-1',
  type: 'RESOURCE',
  title: 'Member resource',
  description: 'Private worksheet',
  status: 'HIDDEN',
  file: {
    fileName: 'member-resource.pdf',
    fileType: 'application/pdf',
    size: 8192,
  },
  createdAt: '2026-08-08T10:00:00.000Z',
  updatedAt: '2026-08-08T10:00:00.000Z',
};

const courseProduct: ProductMinimised = {
  id: 'course-1',
  title: 'Launch Course',
  description: 'A full course',
  type: 'COURSE',
  status: 'PUBLISHED',
};

const downloadProduct: ProductMinimised = {
  id: 'download-1',
  title: 'Template Pack',
  type: 'DOWNLOAD',
  status: 'DRAFT',
};

const nativePostEntry = createMembershipContentFeedEntry(
  'post-1',
  '2026-08-08T10:00:00.000Z',
);
const nativeVideoEntry = createMembershipContentFeedEntry(
  'video-1',
  '2026-08-08T10:00:00.000Z',
);
const nativeResourceEntry = createMembershipContentFeedEntry(
  'resource-1',
  '2026-08-08T10:00:00.000Z',
);
const courseProductEntry = createMembershipProductFeedEntry(
  'course-1',
  '2026-08-08T11:00:00.000Z',
);
const downloadProductEntry = createMembershipProductFeedEntry(
  'download-1',
  '2026-08-08T11:00:00.000Z',
);

describe('<MembershipContentList />', () => {
  it('renders empty state when native content and included products are empty', () => {
    render(
      <MembershipContentList
        nativeContentItems={[]}
        feedEntries={[]}
        includedProducts={[]}
      />,
    );

    expect(screen.getByText('Start your member feed')).toBeInTheDocument();
    expect(
      screen.getByText(/Add posts, videos, resources/i),
    ).toBeInTheDocument();
  });

  it('renders an included Course using registry-driven metadata', () => {
    render(
      <MembershipContentList
        nativeContentItems={[]}
        feedEntries={[courseProductEntry]}
        includedProducts={[courseProduct]}
      />,
    );

    expect(screen.getByText('Launch Course')).toBeInTheDocument();
    expect(screen.getByText('Course')).toBeInTheDocument();
    expect(screen.getByText('🎓')).toBeInTheDocument();
  });

  it('renders an included Download using registry-driven metadata', () => {
    render(
      <MembershipContentList
        nativeContentItems={[]}
        feedEntries={[downloadProductEntry]}
        includedProducts={[downloadProduct]}
      />,
    );

    expect(screen.getByText('Template Pack')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
    expect(screen.getByText('⬇️')).toBeInTheDocument();
  });

  it('renders a native Membership content item using the frontend content model', () => {
    render(
      <MembershipContentList
        nativeContentItems={[nativePost]}
        feedEntries={[nativePostEntry]}
        includedProducts={[]}
      />,
    );

    expect(screen.getByText('Member update')).toBeInTheDocument();
    expect(screen.getByText('Post')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('renders a native Video with filename metadata', () => {
    render(
      <MembershipContentList
        nativeContentItems={[nativeVideo]}
        feedEntries={[nativeVideoEntry]}
        includedProducts={[]}
      />,
    );

    expect(screen.getByText('Member video')).toBeInTheDocument();
    expect(screen.getByText('Video')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByText(/member-video\.mp4/)).toBeInTheDocument();
  });

  it('exposes edit and delete actions for native Video items', () => {
    const onEditContent = jest.fn();
    const onDeleteContent = jest.fn();

    render(
      <MembershipContentList
        nativeContentItems={[nativeVideo]}
        feedEntries={[nativeVideoEntry]}
        includedProducts={[]}
        onEditContent={onEditContent}
        onDeleteContent={onDeleteContent}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Edit Member video' }));
    fireEvent.click(
      screen.getByRole('button', { name: 'Delete Video Member video' }),
    );
    expect(screen.getByRole('alertdialog')).toHaveTextContent(
      'Delete video "Member video"?',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Delete Video' }));

    expect(onEditContent).toHaveBeenCalledWith('video-1');
    expect(onDeleteContent).toHaveBeenCalledWith('video-1');
  });

  it('renders a native Resource with filename metadata', () => {
    render(
      <MembershipContentList
        nativeContentItems={[nativeResource]}
        feedEntries={[nativeResourceEntry]}
        includedProducts={[]}
      />,
    );

    expect(screen.getByText('Member resource')).toBeInTheDocument();
    expect(screen.getByText('Resource')).toBeInTheDocument();
    expect(screen.getByText('Hidden')).toBeInTheDocument();
    expect(screen.getByText(/member-resource\.pdf/)).toBeInTheDocument();
  });

  it('exposes edit and delete actions for native Resource items', () => {
    const onEditContent = jest.fn();
    const onDeleteContent = jest.fn();

    render(
      <MembershipContentList
        nativeContentItems={[nativeResource]}
        feedEntries={[nativeResourceEntry]}
        includedProducts={[]}
        onEditContent={onEditContent}
        onDeleteContent={onDeleteContent}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Edit Member resource' }),
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Delete Resource Member resource' }),
    );
    expect(screen.getByRole('alertdialog')).toHaveTextContent(
      'Delete resource "Member resource"?',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Delete Resource' }));

    expect(onEditContent).toHaveBeenCalledWith('resource-1');
    expect(onDeleteContent).toHaveBeenCalledWith('resource-1');
  });

  it('renders native content before included Products when both are present', () => {
    render(
      <MembershipContentList
        nativeContentItems={[nativePost]}
        feedEntries={[nativePostEntry, courseProductEntry]}
        orderingMode="MANUAL"
        includedProducts={[courseProduct]}
      />,
    );

    const titles = screen
      .getAllByRole('heading', { level: 4 })
      .map((heading) => heading.textContent);

    expect(titles).toEqual(['Member update', 'Launch Course']);
  });

  it('does not mutate input models while creating the unified list', () => {
    const nativeContentItems = Object.freeze([Object.freeze(nativePost)]);
    const includedProducts = Object.freeze([Object.freeze(courseProduct)]);

    const feedEntries = Object.freeze([
      Object.freeze(nativePostEntry),
      Object.freeze(courseProductEntry),
    ]);
    const listItems = createMembershipContentListItems(
      feedEntries,
      nativeContentItems,
      includedProducts,
      'MANUAL',
    );

    expect(listItems).toEqual([
      {
        kind: 'CONTENT',
        entry: nativePostEntry,
        content: nativePost,
      },
      {
        kind: 'PRODUCT',
        entry: courseProductEntry,
        product: courseProduct,
      },
    ]);
    expect(feedEntries).toEqual([nativePostEntry, courseProductEntry]);
    expect(nativeContentItems).toEqual([nativePost]);
    expect(includedProducts).toEqual([courseProduct]);
  });

  it('uses feed entry order and skips unresolved entries', () => {
    const listItems = createMembershipContentListItems(
      [
        courseProductEntry,
        createMembershipContentFeedEntry('missing-content', '2026-08-08T12:00:00.000Z'),
        nativePostEntry,
      ],
      [nativePost],
      [courseProduct],
      'MANUAL',
    );

    expect(listItems.map((item) => item.entry.entryId)).toEqual([
      'product:course-1',
      'content:post-1',
    ]);
  });

  it('defaults unified list resolution to NEWEST_FIRST', () => {
    const listItems = createMembershipContentListItems(
      [nativePostEntry, courseProductEntry],
      [nativePost],
      [courseProduct],
    );

    expect(listItems.map((item) => item.entry.entryId)).toEqual([
      'product:course-1',
      'content:post-1',
    ]);
  });

  it('sorts feed entries by Membership addedAt descending without mutating the source array', () => {
    const feedEntries = Object.freeze([
      Object.freeze(nativePostEntry),
      Object.freeze(courseProductEntry),
      Object.freeze(
        createMembershipContentFeedEntry(
          'video-1',
          '2026-08-09T12:00:00.000Z',
        ),
      ),
    ]);

    const orderedEntries = orderMembershipFeedEntries(feedEntries);

    expect(orderedEntries.map((entry) => entry.entryId)).toEqual([
      'content:video-1',
      'product:course-1',
      'content:post-1',
    ]);
    expect(feedEntries.map((entry) => entry.entryId)).toEqual([
      'content:post-1',
      'product:course-1',
      'content:video-1',
    ]);
  });

  it('ignores Product createdAt when ordering included Products', () => {
    const olderProductAddedToMembership = {
      ...courseProduct,
      createdAt: new Date('2026-08-10T16:00:00.000Z'),
    } as ProductMinimised;
    const newerProductAddedToMembership = {
      ...downloadProduct,
      createdAt: new Date('2026-08-01T09:00:00.000Z'),
    } as ProductMinimised;

    const listItems = createMembershipContentListItems(
      [
        createMembershipProductFeedEntry(
          'course-1',
          '2026-08-10T10:00:00.000Z',
        ),
        createMembershipProductFeedEntry(
          'download-1',
          '2026-08-10T12:00:00.000Z',
        ),
      ],
      [],
      [olderProductAddedToMembership, newerProductAddedToMembership],
    );

    expect(listItems.map((item) => item.entry.entryId)).toEqual([
      'product:download-1',
      'product:course-1',
    ]);
  });

  it('keeps equal addedAt values deterministic by preserving feed entry order', () => {
    const orderedEntries = orderMembershipFeedEntries([
      nativePostEntry,
      nativeVideoEntry,
      nativeResourceEntry,
    ]);

    expect(orderedEntries.map((entry) => entry.entryId)).toEqual([
      'content:post-1',
      'content:video-1',
      'content:resource-1',
    ]);
  });

  it('exposes manual Move Up and Move Down controls with boundary buttons disabled', () => {
    const onMoveFeedEntry = jest.fn();

    render(
      <MembershipContentList
        nativeContentItems={[nativePost]}
        feedEntries={[nativePostEntry, courseProductEntry]}
        orderingMode="MANUAL"
        includedProducts={[courseProduct]}
        onMoveFeedEntry={onMoveFeedEntry}
      />,
    );

    const moveUpButtons = [
      screen.getByRole('button', { name: 'Move Member update up' }),
      screen.getByRole('button', { name: 'Move Launch Course up' }),
    ];
    const moveDownButtons = screen.getAllByRole('button', {
      name: /Move .* down/,
    });

    expect(moveUpButtons[0]).toBeDisabled();
    expect(moveDownButtons[1]).toBeDisabled();

    fireEvent.click(moveDownButtons[0]);
    fireEvent.click(moveUpButtons[1]);

    expect(onMoveFeedEntry).toHaveBeenNthCalledWith(
      1,
      'content:post-1',
      'DOWN',
    );
    expect(onMoveFeedEntry).toHaveBeenNthCalledWith(
      2,
      'product:course-1',
      'UP',
    );
  });

  it('updating a Post preserves id and createdAt', () => {
    const created = createMembershipPostItem(
      {
        title: 'Original title',
        body: 'Original body',
        status: 'DRAFT',
      },
      'post-1',
      '2026-08-08T10:00:00.000Z',
    );

    const updated = updateMembershipPostItem(
      created,
      {
        title: 'Updated title',
        body: 'Updated body',
        status: 'PUBLISHED',
      },
      '2026-08-08T11:00:00.000Z',
    );

    expect(updated).toEqual({
      ...created,
      title: 'Updated title',
      body: 'Updated body',
      status: 'PUBLISHED',
      updatedAt: '2026-08-08T11:00:00.000Z',
    });
    expect(updated.id).toBe(created.id);
    expect(updated.createdAt).toBe(created.createdAt);
  });

  it('updating a Video preserves id and createdAt', () => {
    const created = createMembershipVideoItem(
      {
        title: 'Original title',
        description: 'Original description',
        status: 'DRAFT',
        video: {
          fileName: 'original.mp4',
          fileType: 'video/mp4',
          size: 4096,
        },
      },
      'video-1',
      '2026-08-08T10:00:00.000Z',
    );

    const updated = updateMembershipVideoItem(
      created,
      {
        title: 'Updated title',
        description: 'Updated description',
        status: 'PUBLISHED',
        video: {
          fileName: 'replacement.mp4',
          fileType: 'video/mp4',
          size: 8192,
        },
      },
      '2026-08-08T11:00:00.000Z',
    );

    expect(updated).toEqual({
      ...created,
      title: 'Updated title',
      description: 'Updated description',
      status: 'PUBLISHED',
      video: {
        fileName: 'replacement.mp4',
        fileType: 'video/mp4',
        size: 8192,
      },
      updatedAt: '2026-08-08T11:00:00.000Z',
    });
    expect(updated.id).toBe(created.id);
    expect(updated.createdAt).toBe(created.createdAt);
  });

  it('updating a Resource preserves id and createdAt', () => {
    const created = createMembershipResourceItem(
      {
        title: 'Original title',
        description: 'Original description',
        status: 'DRAFT',
        file: {
          fileName: 'original.pdf',
          fileType: 'application/pdf',
          size: 4096,
        },
      },
      'resource-1',
      '2026-08-08T10:00:00.000Z',
    );

    const updated = updateMembershipResourceItem(
      created,
      {
        title: 'Updated title',
        description: 'Updated description',
        status: 'PUBLISHED',
        file: {
          fileName: 'replacement.pdf',
          fileType: 'application/pdf',
          size: 8192,
        },
      },
      '2026-08-08T11:00:00.000Z',
    );

    expect(updated).toEqual({
      ...created,
      title: 'Updated title',
      description: 'Updated description',
      status: 'PUBLISHED',
      file: {
        fileName: 'replacement.pdf',
        fileType: 'application/pdf',
        size: 8192,
      },
      updatedAt: '2026-08-08T11:00:00.000Z',
    });
    expect(updated.id).toBe(created.id);
    expect(updated.createdAt).toBe(created.createdAt);
  });
});
