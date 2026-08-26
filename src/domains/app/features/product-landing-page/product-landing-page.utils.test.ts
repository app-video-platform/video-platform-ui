import {
  DEFAULT_PRODUCT_LANDING_PAGE_CONFIG,
  normalizeProductLandingPageConfig,
} from './product-landing-page.utils';

describe('normalizeProductLandingPageConfig', () => {
  it('applies default sections when visibleSections is absent', () => {
    expect(
      normalizeProductLandingPageConfig('product-1', {
        productId: 'product-1',
        heroLayout: 'MEDIA_RIGHT',
        sectionOrder: ['ABOUT', 'CONTENTS', 'CREATOR'],
      }).visibleSections,
    ).toEqual(DEFAULT_PRODUCT_LANDING_PAGE_CONFIG.visibleSections);
  });

  it('preserves an explicitly empty visibleSections array', () => {
    expect(
      normalizeProductLandingPageConfig('product-1', {
        productId: 'product-1',
        heroLayout: 'MEDIA_RIGHT',
        visibleSections: [],
        sectionOrder: ['ABOUT', 'CONTENTS', 'CREATOR'],
      }).visibleSections,
    ).toEqual([]);
  });

  it('preserves configured non-empty visibleSections values', () => {
    expect(
      normalizeProductLandingPageConfig('product-1', {
        productId: 'product-1',
        heroLayout: 'MEDIA_RIGHT',
        visibleSections: ['ABOUT', 'CREATOR'],
        sectionOrder: ['ABOUT', 'CONTENTS', 'CREATOR'],
      }).visibleSections,
    ).toEqual(['ABOUT', 'CREATOR']);
  });
});
