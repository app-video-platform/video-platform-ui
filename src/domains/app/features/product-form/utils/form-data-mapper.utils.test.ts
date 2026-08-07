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
      recurringPricing: {
        amount: 15,
        currency: 'EUR',
        interval: 'MONTH',
      },
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
    } as ProductDraft & { recurringPricing: unknown };

    expect(mapFormDataToProductPayload(formData, null)).toEqual({
      id: 'membership-1',
      type: 'MEMBERSHIP',
      name: 'Founders Club',
      description: 'Private community',
      price: 25,
      status: 'DRAFT',
      userId: 'creator-1',
    });
    expect(mapFormDataToProductPayload(formData, null)).not.toHaveProperty(
      'recurringPricing',
    );
    expect(getAutosaveSnapshot(formData)).not.toHaveProperty('recurringPricing');
  });
});
