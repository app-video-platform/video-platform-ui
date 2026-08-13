import { RootState } from 'core/api/models';

export const selectPublicStorefrontByCreatorId = (
  state: RootState,
  creatorId?: string,
) =>
  creatorId ? (state.storefront.publicByCreatorId[creatorId] ?? null) : null;

export const selectPublicStorefrontLoading = (state: RootState) =>
  state.storefront.publicLoading;

export const selectPublicStorefrontError = (state: RootState) =>
  state.storefront.publicError;

export const selectCreatorStorefrontConfig = (state: RootState) =>
  state.storefront.creatorConfig;

export const selectCreatorStorefrontConfigLoading = (state: RootState) =>
  state.storefront.configLoading;

export const selectCreatorStorefrontConfigError = (state: RootState) =>
  state.storefront.configError;

export const selectCreatorStorefrontConfigSaveLoading = (state: RootState) =>
  state.storefront.configSaveLoading;

export const selectCreatorStorefrontConfigSaveError = (state: RootState) =>
  state.storefront.configSaveError;
