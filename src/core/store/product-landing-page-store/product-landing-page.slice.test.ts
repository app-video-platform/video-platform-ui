import productLandingPageReducer, {
  updateCreatorProductLandingPageConfig,
} from './product-landing-page.slice';

const args = { productId: 'product-1', config: {
  heroLayout: 'MEDIA_LEFT' as const,
  visibleSections: ['ABOUT' as const],
  sectionOrder: ['ABOUT' as const],
} };
const response = { productId: 'product-1', ...args.config };

describe('Product Landing Page save ownership', () => {
  it('does not let a late failure replace the newer successful save', () => {
    let state = productLandingPageReducer(undefined, { type: '@@init' });
    state = productLandingPageReducer(state, updateCreatorProductLandingPageConfig.pending('old', args));
    state = productLandingPageReducer(state, updateCreatorProductLandingPageConfig.pending('new', args));
    state = productLandingPageReducer(state, updateCreatorProductLandingPageConfig.fulfilled(response, 'new', args));
    state = productLandingPageReducer(state, updateCreatorProductLandingPageConfig.rejected(null, 'old', args, 'old failure'));

    expect(state.creatorSaveError).toBeNull();
    expect(state.creatorSaveLoading).toBe(false);
    expect(state.creatorByProductId['product-1']).toEqual(response);
  });
});
