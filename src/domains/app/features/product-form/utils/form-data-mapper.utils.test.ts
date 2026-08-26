import {
  getAutosaveSnapshot,
  mapFormDataToProductPayload,
} from './form-data-mapper.utils';
import { ProductDraft } from '../models';

describe('mapFormDataToProductPayload', () => {
  it('serializes Membership with shared product fields only', () => {
    const formData = {
      id: 'membership-1',
      type: 'MEMBERSHIP',
      name: 'Founders Club',
      description: 'Private community',
      price: 25,
      pricingModel: 'RECURRING',
      billingInterval: 'MONTH',
      currency: 'EUR',
      status: 'PUBLISHED',
      orderingMode: 'MANUAL',
      nativeContentItems: [
        {
          id: 'post-1',
          type: 'POST',
          title: 'Should not be sent',
          body: 'Post body',
          status: 'DRAFT',
        },
        {
          id: 'video-1',
          type: 'VIDEO',
          title: 'Video should not be sent',
          description: 'Video description',
          status: 'PUBLISHED',
          video: {
            fileName: 'member-video.mp4',
            fileType: 'video/mp4',
            size: 4096,
          },
        },
        {
          id: 'resource-1',
          type: 'RESOURCE',
          title: 'Resource should not be sent',
          description: 'Resource description',
          status: 'HIDDEN',
          file: {
            fileName: 'member-resource.pdf',
            fileType: 'application/pdf',
            size: 8192,
          },
        },
      ],
      feedEntries: [
        {
          entryId: 'content:post-1',
          kind: 'CONTENT',
          contentId: 'post-1',
          addedAt: '2026-08-10T10:00:00.000Z',
          position: 0,
        },
        {
          entryId: 'product:course-1',
          kind: 'PRODUCT',
          productId: 'course-1',
          addedAt: '2026-08-10T11:00:00.000Z',
          position: 1,
        },
      ],
      userId: 'creator-1',
      sections: [
        {
          id: 'section-1',
          title: 'Should not be sent',
          position: 1,
        },
      ],
      consultationDetails: {
        durationMinutes: 50,
      },
    } as ProductDraft & {
      nativeContentItems: unknown;
      feedEntries: unknown;
      orderingMode: unknown;
      recurringPricing: unknown;
    };

    expect(mapFormDataToProductPayload(formData, null)).toEqual({
      id: 'membership-1',
      type: 'MEMBERSHIP',
      name: 'Founders Club',
      description: 'Private community',
      price: 25,
      pricingModel: 'RECURRING',
      billingInterval: 'MONTH',
      currency: 'EUR',
      status: 'PUBLISHED',
      userId: 'creator-1',
    });
    expect(mapFormDataToProductPayload(formData, null)).not.toHaveProperty(
      'recurringPricing',
    );
    expect(mapFormDataToProductPayload(formData, null)).not.toHaveProperty(
      'nativeContentItems',
    );
    expect(mapFormDataToProductPayload(formData, null)).not.toHaveProperty(
      'feedEntries',
    );
    expect(mapFormDataToProductPayload(formData, null)).not.toHaveProperty(
      'orderingMode',
    );
    expect(getAutosaveSnapshot(formData)).not.toHaveProperty('recurringPricing');
    expect(getAutosaveSnapshot(formData)).not.toHaveProperty(
      'nativeContentItems',
    );
    expect(getAutosaveSnapshot(formData)).not.toHaveProperty('feedEntries');
    expect(getAutosaveSnapshot(formData)).not.toHaveProperty('orderingMode');
    expect(getAutosaveSnapshot(formData)).toMatchObject({
      pricingModel: 'RECURRING',
      billingInterval: 'MONTH',
      currency: 'EUR',
      status: 'PUBLISHED',
    });
  });

  it('keeps one-time and free products on the existing pricing shape', () => {
    const formData = {
      id: 'download-1',
      type: 'DOWNLOAD',
      name: 'Launch Kit',
      price: 'free',
      status: 'DRAFT',
      userId: 'creator-1',
    } as ProductDraft;

    expect(mapFormDataToProductPayload(formData, null)).toEqual({
      id: 'download-1',
      type: 'DOWNLOAD',
      name: 'Launch Kit',
      description: undefined,
      price: 'free',
      pricingModel: undefined,
      billingInterval: undefined,
      currency: undefined,
      status: 'DRAFT',
      userId: 'creator-1',
    });
  });

  it('serializes Consultation availability configuration through product details', () => {
    const formData = {
      id: 'consultation-1',
      type: 'CONSULTATION',
      name: 'Offer audit',
      price: 150,
      status: 'DRAFT',
      userId: 'creator-1',
      consultationDetails: {
        durationMinutes: 60,
        meetingMethod: 'OTHER',
        customLocation: 'Call my studio line',
        weeklyAvailability: [
          {
            day: 'MONDAY',
            enabled: true,
            windows: [
              { startTime: '09:00', endTime: '12:00' },
              { startTime: '14:00', endTime: '17:00' },
            ],
          },
          {
            day: 'SUNDAY',
            enabled: false,
            windows: [],
          },
        ],
        bufferBeforeMinutes: 15,
        bufferAfterMinutes: 20,
        maxSessionsPerDay: 4,
        confirmationMessage: 'Bring your latest offer draft.',
        cancellationPolicy: 'full_48h',
        connectedCalendars: [
          {
            id: 'calendar-1',
            provider: 'Google Calendar',
            email: 'maya@example.test',
          },
        ],
      },
    } as ProductDraft;

    expect(mapFormDataToProductPayload(formData, null)).toMatchObject({
      id: 'consultation-1',
      type: 'CONSULTATION',
      name: 'Offer audit',
      price: 150,
      status: 'DRAFT',
      userId: 'creator-1',
      consultationDetails: {
        durationMinutes: 60,
        meetingMethod: 'OTHER',
        customLocation: 'Call my studio line',
        weeklyAvailability: [
          {
            day: 'MONDAY',
            enabled: true,
            windows: [
              { startTime: '09:00', endTime: '12:00' },
              { startTime: '14:00', endTime: '17:00' },
            ],
          },
          {
            day: 'SUNDAY',
            enabled: false,
            windows: [],
          },
        ],
        bufferBeforeMinutes: 15,
        bufferAfterMinutes: 20,
        maxSessionsPerDay: 4,
        confirmationMessage: 'Bring your latest offer draft.',
        cancellationPolicy: 'full_48h',
        connectedCalendars: [
          {
            id: 'calendar-1',
            provider: 'Google Calendar',
            email: 'maya@example.test',
          },
        ],
      },
    });
    expect(getAutosaveSnapshot(formData).consultationDetails)
      .toEqual(formData.consultationDetails);
  });
});
