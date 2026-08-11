import {
  MembershipBuilderState,
} from './use-membership-builder-state.hook';

export const getMembershipInspectionFixture = (): Pick<
  MembershipBuilderState,
  'nativeContentItems' | 'feedEntries' | 'orderingMode'
> => {
  const postAddedAt = '2026-08-08T10:00:00.000Z';
  const videoAddedAt = '2026-08-07T10:00:00.000Z';
  const resourceAddedAt = '2026-08-06T10:00:00.000Z';
  const draftPostAddedAt = '2026-08-05T10:00:00.000Z';

  return {
    orderingMode: 'MANUAL',
    nativeContentItems: [
      {
        id: 'membership-post-1',
        type: 'POST',
        title: 'Monthly lab note: what changed in buyer behavior this week',
        body:
          'A tactical update on objections, pricing signals, and how to adjust your product page without rewriting everything.',
        status: 'PUBLISHED',
        createdAt: postAddedAt,
        updatedAt: postAddedAt,
      },
      {
        id: 'membership-video-1',
        type: 'VIDEO',
        title: 'Office hours replay: fixing a confusing course promise',
        description:
          'A 42 minute recording with teardown notes and before/after positioning examples.',
        status: 'PUBLISHED',
        createdAt: videoAddedAt,
        updatedAt: videoAddedAt,
        video: {
          fileName: 'office-hours-offer-teardown-august.mp4',
          fileType: 'video/mp4',
          size: 482000000,
        },
      },
      {
        id: 'membership-resource-1',
        type: 'RESOURCE',
        title: 'Buyer interview prompt library',
        description:
          'A resource with prompts for identifying urgency, objections, and outcome language.',
        status: 'HIDDEN',
        createdAt: resourceAddedAt,
        updatedAt: resourceAddedAt,
        file: {
          fileName: 'buyer-interview-prompt-library.pdf',
          fileType: 'application/pdf',
          size: 1240000,
        },
      },
      {
        id: 'membership-post-2',
        type: 'POST',
        title: 'Draft: September experiment backlog',
        body:
          'A rough list of upcoming experiments for membership onboarding and product bundling.',
        status: 'DRAFT',
        createdAt: draftPostAddedAt,
        updatedAt: draftPostAddedAt,
      },
    ],
    feedEntries: [
      {
        entryId: 'content:membership-post-1',
        kind: 'CONTENT',
        contentId: 'membership-post-1',
        addedAt: postAddedAt,
      },
      {
        entryId: 'product:prod-course-growth',
        kind: 'PRODUCT',
        productId: 'prod-course-growth',
        addedAt: '2026-08-07T12:00:00.000Z',
      },
      {
        entryId: 'content:membership-video-1',
        kind: 'CONTENT',
        contentId: 'membership-video-1',
        addedAt: videoAddedAt,
      },
      {
        entryId: 'product:prod-download-toolkit',
        kind: 'PRODUCT',
        productId: 'prod-download-toolkit',
        addedAt: '2026-08-06T12:00:00.000Z',
      },
      {
        entryId: 'content:membership-resource-1',
        kind: 'CONTENT',
        contentId: 'membership-resource-1',
        addedAt: resourceAddedAt,
      },
      {
        entryId: 'content:membership-post-2',
        kind: 'CONTENT',
        contentId: 'membership-post-2',
        addedAt: draftPostAddedAt,
      },
    ],
  };
};
