import { RootState } from 'core/api/models';

export const selectPublicProductLandingPageConfigByProductId = (
  state: RootState,
  productId?: string,
) =>
  productId
    ? (state.productLandingPage.publicByProductId[productId] ?? null)
    : null;

export const selectPublicProductLandingPageConfigLoading = (state: RootState) =>
  state.productLandingPage.publicLoading;

export const selectPublicProductLandingPageConfigError = (state: RootState) =>
  state.productLandingPage.publicError;

export const selectCreatorProductLandingPageConfigByProductId = (
  state: RootState,
  productId?: string,
) =>
  productId
    ? (state.productLandingPage.creatorByProductId[productId] ?? null)
    : null;

export const selectCreatorProductLandingPageConfigLoading = (state: RootState) =>
  state.productLandingPage.creatorLoading;

export const selectCreatorProductLandingPageConfigError = (state: RootState) =>
  state.productLandingPage.creatorError;

export const selectCreatorProductLandingPageConfigSaveLoading = (
  state: RootState,
) => state.productLandingPage.creatorSaveLoading;

export const selectCreatorProductLandingPageConfigSaveError = (
  state: RootState,
) => state.productLandingPage.creatorSaveError;
