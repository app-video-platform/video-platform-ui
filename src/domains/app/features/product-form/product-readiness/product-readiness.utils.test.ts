import { MeetingMethods } from 'core/enums';
import {
  ProductDraft,
  RecurringPricing,
} from '../models';
import { MembershipContentItem } from '../membership-content/models';
import { evaluateProductReadiness } from './product-readiness.utils';

const baseProduct = (overrides: Partial<ProductDraft>): ProductDraft => ({
  id: 'product-1',
  type: 'COURSE',
  name: 'Ready Product',
  price: 25,
  status: 'DRAFT',
  imageUrl: 'https://cdn.example.com/thumb.jpg',
  ...overrides,
});

const recurringPricing: RecurringPricing = {
  amount: 25,
  currency: 'EUR',
  interval: 'MONTH',
};

const publishedPost = (): MembershipContentItem => ({
  id: 'content-1',
  type: 'POST',
  title: 'Published post',
  body: 'Hello members',
  status: 'PUBLISHED',
  createdAt: '2026-08-13T00:00:00.000Z',
  updatedAt: '2026-08-13T00:00:00.000Z',
});

describe('evaluateProductReadiness', () => {
  it('blocks missing Product names and warns for missing thumbnails', () => {
    const result = evaluateProductReadiness({
      formData: baseProduct({
        name: '   ',
        imageUrl: undefined,
        sections: [
          {
            id: 'section-1',
            title: 'Intro',
            position: 1,
            lessons: [
              {
                id: 'lesson-1',
                title: 'Welcome',
                type: 'ARTICLE',
                sectionId: 'section-1',
                description: '',
              },
            ],
          },
        ],
      }),
    });

    expect(result.blockers.map((issue) => issue.id)).toContain('missing-name');
    expect(result.warnings.map((issue) => issue.id)).toContain(
      'missing-thumbnail',
    );
  });

  it('evaluates Course pricing and curriculum readiness', () => {
    const missingCurriculum = evaluateProductReadiness({
      formData: baseProduct({ type: 'COURSE', price: undefined, sections: [] }),
    });

    expect(missingCurriculum.blockers.map((issue) => issue.id)).toEqual(
      expect.arrayContaining([
        'invalid-one-time-price',
        'course-needs-curriculum',
      ]),
    );

    const readyCourse = evaluateProductReadiness({
      formData: baseProduct({
        type: 'COURSE',
        price: 'free',
        sections: [
          {
            id: 'section-1',
            title: 'Intro',
            position: 1,
            lessons: [
              {
                id: 'lesson-1',
                title: 'Welcome',
                type: 'ARTICLE',
                sectionId: 'section-1',
                description: '',
              },
            ],
          },
        ],
      }),
    });

    expect(readyCourse.isReadyToPublish).toBe(true);
    expect(readyCourse.blockers).toEqual([]);
  });

  it('requires confirmed Download files', () => {
    const emptyDownload = evaluateProductReadiness({
      formData: baseProduct({
        type: 'DOWNLOAD',
        price: 'free',
        sections: [{ id: 'section-1', title: 'Files', position: 1, files: [] }],
      }),
    });

    expect(emptyDownload.blockers.map((issue) => issue.id)).toContain(
      'download-needs-file',
    );

    const readyDownload = evaluateProductReadiness({
      formData: baseProduct({
        type: 'DOWNLOAD',
        price: 10,
        sections: [
          {
            id: 'section-1',
            title: 'Files',
            position: 1,
            files: [{ id: 'file-1', fileName: 'guide.pdf' }],
          },
        ],
      }),
    });

    expect(readyDownload.isReadyToPublish).toBe(true);
  });

  it('evaluates Consultation duration, method, location, availability, and calendar warning', () => {
    const invalidConsultation = evaluateProductReadiness({
      formData: baseProduct({
        type: 'CONSULTATION',
        price: 40,
        consultationDetails: {
          durationMinutes: 0,
          meetingMethod: MeetingMethods.OTHER,
          customLocation: '',
          weeklyAvailability: [
            {
              day: 'MONDAY',
              enabled: true,
              windows: [
                { startTime: '12:00', endTime: '11:00' },
                { startTime: '10:00', endTime: '13:00' },
              ],
            },
          ],
          connectedCalendars: [],
        },
      }),
    });

    expect(invalidConsultation.blockers.map((issue) => issue.id)).toEqual(
      expect.arrayContaining([
        'consultation-duration',
        'consultation-custom-location',
        'consultation-invalid-availability',
      ]),
    );

    const readyConsultation = evaluateProductReadiness({
      formData: baseProduct({
        type: 'CONSULTATION',
        price: 40,
        consultationDetails: {
          durationMinutes: 60,
          meetingMethod: MeetingMethods.ZOOM,
          weeklyAvailability: [
            {
              day: 'MONDAY',
              enabled: true,
              windows: [{ startTime: '09:00', endTime: '17:00' }],
            },
          ],
          connectedCalendars: [],
        },
      }),
    });

    expect(readyConsultation.isReadyToPublish).toBe(true);
    expect(readyConsultation.warnings.map((issue) => issue.id)).toContain(
      'consultation-no-calendar',
    );
  });

  it('evaluates Membership pricing, loading, published access, draft warnings, and included Products', () => {
    const loadingMembership = evaluateProductReadiness({
      formData: baseProduct({ type: 'MEMBERSHIP', price: 25 }),
      recurringPricing,
      isMembershipLoading: true,
    });

    expect(loadingMembership.isEvaluating).toBe(true);
    expect(loadingMembership.isReadyToPublish).toBe(false);

    const draftOnlyMembership = evaluateProductReadiness({
      formData: baseProduct({ type: 'MEMBERSHIP', price: 25 }),
      recurringPricing: { ...recurringPricing, amount: 0 },
      membershipNativeContentItems: [
        {
          ...publishedPost(),
          id: 'draft-1',
          title: 'Draft post',
          status: 'DRAFT',
        },
      ],
    });

    expect(draftOnlyMembership.blockers.map((issue) => issue.id)).toEqual(
      expect.arrayContaining([
        'invalid-recurring-price',
        'membership-needs-published-entry',
      ]),
    );
    expect(draftOnlyMembership.warnings.map((issue) => issue.id)).toContain(
      'membership-has-draft-content',
    );

    const nativeContentReady = evaluateProductReadiness({
      formData: baseProduct({ type: 'MEMBERSHIP', price: 25 }),
      recurringPricing,
      membershipNativeContentItems: [publishedPost()],
    });

    expect(nativeContentReady.isReadyToPublish).toBe(true);

    const includedProductReady = evaluateProductReadiness({
      formData: baseProduct({ type: 'MEMBERSHIP', price: 25 }),
      recurringPricing,
      membershipIncludedProducts: [
        { id: 'course-1', title: 'Course', type: 'COURSE', status: 'PUBLISHED' },
      ],
    });

    expect(includedProductReady.isReadyToPublish).toBe(true);
  });
});
