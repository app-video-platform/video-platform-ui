import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ProductMinimised } from 'core/api/models';
import MembershipContentList from './membership-content-list.component';
import {
  createMembershipContentListItems,
  createMembershipPostItem,
  MembershipContentItem,
  updateMembershipPostItem,
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

describe('<MembershipContentList />', () => {
  it('renders empty state when native content and included products are empty', () => {
    render(
      <MembershipContentList nativeContentItems={[]} includedProducts={[]} />,
    );

    expect(screen.getByText('No membership content yet.')).toBeInTheDocument();
  });

  it('renders an included Course using registry-driven metadata', () => {
    render(
      <MembershipContentList
        nativeContentItems={[]}
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
        includedProducts={[]}
      />,
    );

    expect(screen.getByText('Member update')).toBeInTheDocument();
    expect(screen.getByText('Post')).toBeInTheDocument();
    expect(screen.getByText('DRAFT')).toBeInTheDocument();
  });

  it('renders native content before included Products when both are present', () => {
    render(
      <MembershipContentList
        nativeContentItems={[nativePost]}
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

    const listItems = createMembershipContentListItems(
      nativeContentItems,
      includedProducts,
    );

    expect(listItems).toEqual([
      {
        kind: 'CONTENT',
        content: nativePost,
      },
      {
        kind: 'PRODUCT',
        product: courseProduct,
      },
    ]);
    expect(nativeContentItems).toEqual([nativePost]);
    expect(includedProducts).toEqual([courseProduct]);
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
});
