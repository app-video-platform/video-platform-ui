import { normalizeProductPrice, normalizeProductResponse } from './product-normalizers.util';
import { formatProductPrice } from 'domains/app/pages/creator-specific/products/products-list/products-list.utils';
import { getProductLandingPrice } from 'domains/app/features/product-landing-page';

describe('Product API price normalization', () => {
  it.each([
    [12.5, 12.5], ['12.50', 12.5], ['15', 15], ['99.99', 99.99],
    ['149.50', 149.5], ['0', 0], ['free', 'free'],
    [null, undefined], [undefined, undefined], ['', undefined],
    ['invalid', undefined], ['12abc', undefined], ['-1', undefined], [-1, undefined],
    ['9007199254740990.50', undefined],
  ])('normalizes %s to %s', (input, expected) => {
    expect(normalizeProductPrice(input)).toBe(expected);
  });

  it.each(['COURSE', 'DOWNLOAD', 'CONSULTATION', 'MEMBERSHIP'] as const)(
    'presents a saved %s detail price consistently',
    (type) => {
      const product = normalizeProductResponse({
        id: 'product-1', name: 'Paid product', type, price: '12.50',
        currency: 'EUR', pricingModel: 'ONE_TIME',
      });
      expect(formatProductPrice(product)).toBe('€12.50');
      expect(getProductLandingPrice(product).label).toBe('€12.50');
    },
  );

  it('preserves recurring cadence and fractional precision', () => {
    const product = normalizeProductResponse({
      id: 'member', name: 'Member', type: 'MEMBERSHIP', price: '149.50',
      currency: 'EUR', pricingModel: 'RECURRING', billingInterval: 'YEAR',
    });
    expect(formatProductPrice(product)).toBe('€149.50 / year');
    expect(getProductLandingPrice(product)).toMatchObject({ label: '€149.50', cadence: 'year' });
  });

  it('preserves monthly cadence and a zero-priced Free Product', () => {
    const membership = normalizeProductResponse({
      id: 'member', name: 'Member', type: 'MEMBERSHIP', price: '9.99',
      currency: 'EUR', pricingModel: 'RECURRING', billingInterval: 'MONTH',
    });
    const free = normalizeProductResponse({ id: 'course', name: 'Course', type: 'COURSE', price: '0' });
    expect(formatProductPrice(membership)).toBe('€9.99 / month');
    expect(getProductLandingPrice(membership)).toMatchObject({ label: '€9.99', cadence: 'month' });
    expect(formatProductPrice(free)).toBe('Free');
    expect(getProductLandingPrice(free).isFree).toBe(true);
  });
});
