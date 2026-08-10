import { ProductMinimised } from 'core/api/models';
import { RecurringPricing } from '../../models';
import {
  MembershipContentItem,
  MembershipProductFeedEntry,
} from '../models';
import {
  evaluateMembershipReadiness,
  resolveMembershipIncludedProducts,
} from './membership-readiness.utils';

const validPricing: RecurringPricing = {
  amount: 12,
  currency: 'EUR',
  interval: 'MONTH',
};

const makePost = (
  status: MembershipContentItem['status'] = 'PUBLISHED',
): MembershipContentItem => ({
  id: `post-${status}`,
  type: 'POST',
  title: 'Member update',
  body: 'Hello members',
  status,
  createdAt: '2026-08-10T10:00:00.000Z',
  updatedAt: '2026-08-10T10:00:00.000Z',
});

const makeVideo = (
  status: MembershipContentItem['status'] = 'PUBLISHED',
): MembershipContentItem => ({
  id: `video-${status}`,
  type: 'VIDEO',
  title: 'Member video',
  status,
  video: {
    fileName: 'video.mp4',
    fileType: 'video/mp4',
    size: 1024,
  },
  createdAt: '2026-08-10T10:00:00.000Z',
  updatedAt: '2026-08-10T10:00:00.000Z',
});

const makeResource = (
  status: MembershipContentItem['status'] = 'PUBLISHED',
): MembershipContentItem => ({
  id: `resource-${status}`,
  type: 'RESOURCE',
  title: 'Member resource',
  status,
  file: {
    fileName: 'guide.pdf',
    fileType: 'application/pdf',
    size: 1024,
  },
  createdAt: '2026-08-10T10:00:00.000Z',
  updatedAt: '2026-08-10T10:00:00.000Z',
});

const makeIncludedProduct = (
  type: ProductMinimised['type'],
  status: ProductMinimised['status'] = 'PUBLISHED',
): ProductMinimised => ({
  id: `${type?.toLowerCase()}-${status}`,
  title: `${type} product`,
  type,
  status,
});

const evaluate = (
  overrides: Partial<Parameters<typeof evaluateMembershipReadiness>[0]> = {},
) =>
  evaluateMembershipReadiness({
    formData: { name: 'Founders Club', imageUrl: 'https://example.com/image.jpg' },
    recurringPricing: validPricing,
    nativeContentItems: [makePost()],
    includedProducts: [],
    ...overrides,
  });

describe('evaluateMembershipReadiness', () => {
  it('marks an empty Membership as not publishable', () => {
    const result = evaluate({
      formData: { name: '', imageUrl: undefined },
      recurringPricing: { ...validPricing, amount: 0 },
      nativeContentItems: [],
      includedProducts: [],
    });

    expect(result.canPublish).toBe(false);
    expect(result.errors.map((error) => error.code)).toEqual([
      'MISSING_NAME',
      'INVALID_RECURRING_PRICE',
      'NO_PUBLISHED_ENTRY',
    ]);
  });

  it('blocks when the Membership name is missing', () => {
    const result = evaluate({ formData: { name: '   ', imageUrl: 'thumb.jpg' } });

    expect(result.canPublish).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ message: 'Add a Membership name.' }),
    );
  });

  it('blocks when recurring price is invalid', () => {
    const result = evaluate({
      recurringPricing: { amount: 0, currency: 'EUR', interval: 'MONTH' },
    });

    expect(result.canPublish).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ message: 'Set a valid recurring price.' }),
    );
  });

  it('blocks when there is no published access-ready entry', () => {
    const result = evaluate({
      nativeContentItems: [makePost('DRAFT')],
      includedProducts: [makeIncludedProduct('COURSE', 'HIDDEN')],
    });

    expect(result.canPublish).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        message: 'Add at least one published content item or included Product.',
      }),
    );
  });

  it.each([
    ['published Post', makePost()],
    ['published Video', makeVideo()],
    ['published Resource', makeResource()],
  ])('%s satisfies the content requirement', (_label, item) => {
    const result = evaluate({
      nativeContentItems: [item],
      includedProducts: [],
    });

    expect(result.canPublish).toBe(true);
  });

  it.each([
    ['published included Course', makeIncludedProduct('COURSE')],
    ['published included Download', makeIncludedProduct('DOWNLOAD')],
  ])('%s satisfies the content requirement', (_label, product) => {
    const result = evaluate({
      nativeContentItems: [],
      includedProducts: [product],
    });

    expect(result.canPublish).toBe(true);
  });

  it('does not count Draft or Hidden content toward the content requirement', () => {
    const result = evaluate({
      nativeContentItems: [makePost('DRAFT'), makeVideo('HIDDEN')],
      includedProducts: [
        makeIncludedProduct('COURSE', 'DRAFT'),
        makeIncludedProduct('DOWNLOAD', 'HIDDEN'),
      ],
    });

    expect(result.canPublish).toBe(false);
    expect(result.errors.map((error) => error.code)).toContain(
      'NO_PUBLISHED_ENTRY',
    );
  });

  it('keeps warnings non-blocking', () => {
    const result = evaluate({
      formData: { name: 'Founders Club', imageUrl: undefined },
      hasThumbnail: false,
      nativeContentItems: [makePost()],
      includedProducts: [],
    });

    expect(result.canPublish).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it.each([
    ['NO_THUMBNAIL', { formData: { name: 'Founders Club', imageUrl: undefined } }],
    ['HAS_DRAFT_CONTENT', { nativeContentItems: [makePost(), makeVideo('DRAFT')] }],
    ['HAS_HIDDEN_CONTENT', { nativeContentItems: [makePost(), makeResource('HIDDEN')] }],
    ['NO_NATIVE_CONTENT', { nativeContentItems: [], includedProducts: [makeIncludedProduct('COURSE')] }],
    ['NO_INCLUDED_PRODUCTS', { includedProducts: [] }],
  ])('adds the %s warning', (code, overrides) => {
    const result = evaluate(overrides);

    expect(result.warnings.map((warning) => warning.code)).toContain(code);
  });

  it('does not mutate inputs', () => {
    const nativeContentItems = [makePost('DRAFT')];
    const includedProducts = [makeIncludedProduct('COURSE', 'PUBLISHED')];
    const input = {
      formData: { name: 'Founders Club', imageUrl: undefined },
      recurringPricing: validPricing,
      nativeContentItems,
      includedProducts,
    };
    const before = JSON.stringify(input);

    evaluateMembershipReadiness(input);

    expect(JSON.stringify(input)).toBe(before);
  });
});

describe('resolveMembershipIncludedProducts', () => {
  it('returns summaries in Membership entry order', () => {
    const entries: MembershipProductFeedEntry[] = [
      {
        entryId: 'product:download-1',
        kind: 'PRODUCT',
        productId: 'download-1',
        addedAt: '2026-08-10T10:00:00.000Z',
      },
      {
        entryId: 'product:course-1',
        kind: 'PRODUCT',
        productId: 'course-1',
        addedAt: '2026-08-10T10:01:00.000Z',
      },
    ];

    expect(
      resolveMembershipIncludedProducts(entries, [
        { id: 'course-1', title: 'Course One' },
        { id: 'download-1', title: 'Download One' },
      ]).map((product) => product.id),
    ).toEqual(['download-1', 'course-1']);
  });
});
