import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, StatusBadge, StatusBadgeTone } from '@shared/ui';
import {
  AppDispatch,
  ProductStatus,
  RootState,
} from 'core/api/models';
import { selectAuthUser } from 'core/store/auth-store';
import {
  clearCurrentProduct,
  getProductById,
  selectCurrentProduct,
  selectProductsError,
  selectProductsLoading,
} from 'core/store/product-store';
import {
  fetchCreatorProductLandingPageConfig,
  selectCreatorProductLandingPageConfigByProductId,
  selectCreatorProductLandingPageConfigError,
  selectCreatorProductLandingPageConfigLoading,
} from 'core/store/product-landing-page-store';
import {
  fetchCreatorStorefrontConfig,
  selectCreatorStorefrontConfig,
  selectCreatorStorefrontConfigError,
  selectCreatorStorefrontConfigLoading,
} from 'core/store/storefront-store';
import {
  getProductLandingPageViewModel,
  ProductLandingPage,
} from 'domains/app/features/product-landing-page';
import { appRoutes } from 'domains/app/routes/routes';
import { getProductStatusLabel } from '../products-list/products-list.utils';

import './product-preview.styles.scss';

const productStatusTone: Record<ProductStatus, StatusBadgeTone> = {
  PUBLISHED: 'success',
  DRAFT: 'neutral',
  HIDDEN: 'warning',
};

const ProductPreview: React.FC = () => {
  const { productId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const product = useSelector(selectCurrentProduct);
  const productLoading = useSelector(selectProductsLoading);
  const productError = useSelector(selectProductsError);
  const creatorStorefrontConfig = useSelector(selectCreatorStorefrontConfig);
  const storefrontLoading = useSelector(selectCreatorStorefrontConfigLoading);
  const storefrontError = useSelector(selectCreatorStorefrontConfigError);
  const landingPageConfig = useSelector((state: RootState) =>
    selectCreatorProductLandingPageConfigByProductId(state, productId),
  );
  const landingPageConfigLoading = useSelector(
    selectCreatorProductLandingPageConfigLoading,
  );
  const landingPageConfigError = useSelector(
    selectCreatorProductLandingPageConfigError,
  );
  const loadedProduct = product?.id === productId ? product : null;

  useEffect(() => {
    dispatch(fetchCreatorStorefrontConfig());
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearCurrentProduct());

    if (productId) {
      dispatch(getProductById({ productId }));
      dispatch(fetchCreatorProductLandingPageConfig(productId));
    }
  }, [dispatch, productId]);

  const viewModel = useMemo(() => {
    if (!loadedProduct) {
      return null;
    }

    return getProductLandingPageViewModel({
      product: loadedProduct,
      currentUser: user,
      creatorStorefrontTheme: creatorStorefrontConfig?.theme,
      landingPageConfig,
    });
  }, [creatorStorefrontConfig?.theme, landingPageConfig, loadedProduct, user]);

  const handleBackToWorkspace = () => {
    if (loadedProduct?.id ?? productId) {
      navigate(appRoutes.productsEdit(loadedProduct?.id ?? productId));
      return;
    }

    navigate(appRoutes.products);
  };

  if (!productId) {
    return (
      <main className="product-preview product-preview--state" role="alert">
        <h1>Product preview unavailable</h1>
        <p>This preview route is missing a Product ID.</p>
        <Button type="button" variant="secondary" onClick={() => navigate(appRoutes.products)}>
          Back to Products
        </Button>
      </main>
    );
  }

  const loadError = productError ?? landingPageConfigError ?? storefrontError;

  if (
    ((productLoading || landingPageConfigLoading || storefrontLoading) &&
      !loadedProduct) ||
    (!loadedProduct && !loadError)
  ) {
    return (
      <main className="product-preview product-preview--state" aria-busy="true">
        <h1>Loading Product preview</h1>
        <p>Preparing the creator-only preview.</p>
      </main>
    );
  }

  if (loadError || !loadedProduct || !viewModel) {
    return (
      <main className="product-preview product-preview--state" role="alert">
        <h1>Product preview unavailable</h1>
        <p>{loadError ?? 'This Product could not be loaded for preview.'}</p>
        <Button type="button" variant="secondary" onClick={() => navigate(appRoutes.products)}>
          Back to Products
        </Button>
      </main>
    );
  }

  const productStatus = loadedProduct.status ?? 'DRAFT';
  const statusLabel = getProductStatusLabel(productStatus);

  return (
    <main className="product-preview">
      <div className="product-preview__bar" role="status">
        <div className="product-preview__bar-copy">
          <StatusBadge
            label={statusLabel}
            tone={productStatusTone[productStatus] ?? 'neutral'}
            size="sm"
          />
          <div>
            <p>{statusLabel} Product preview</p>
            <span>
              This creator-only preview is available for Draft, Hidden, and
              Published Products. Public visibility is controlled separately.
            </span>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleBackToWorkspace}
        >
          Back to workspace
        </Button>
      </div>

      <ProductLandingPage product={viewModel} />
    </main>
  );
};

export default ProductPreview;
