import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { AppDispatch, RootState } from 'core/api/models';
import { selectAuthUser } from 'core/store/auth-store';
import {
  clearCurrentProduct,
  getProductById,
  selectCurrentProduct,
  selectProductsError,
  selectProductsLoading,
} from 'core/store/product-store';
import {
  fetchPublicProductLandingPageConfig,
  selectPublicProductLandingPageConfigByProductId,
} from 'core/store/product-landing-page-store';
import {
  fetchPublicStorefront,
  selectCreatorStorefrontConfig,
  selectPublicStorefrontByCreatorId,
} from 'core/store/storefront-store';
import {
  getProductLandingPageViewModel,
  isPublicProductLandingPageProduct,
  ProductLandingPage,
} from 'domains/app/features/product-landing-page';

import './product-page.styles.scss';

const ProductPage: React.FC = () => {
  const { type, id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const currentProduct = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const creatorStorefrontConfig = useSelector(selectCreatorStorefrontConfig);
  const loadedProduct =
    currentProduct?.id && currentProduct.id === id ? currentProduct : null;
  const publicStorefront = useSelector((state: RootState) =>
    selectPublicStorefrontByCreatorId(state, loadedProduct?.userId),
  );
  const landingPageConfig = useSelector((state: RootState) =>
    selectPublicProductLandingPageConfigByProductId(state, loadedProduct?.id),
  );
  const isOwner = Boolean(user?.id && user.id === loadedProduct?.userId);

  useEffect(() => {
    if (id) {
      dispatch(clearCurrentProduct());
      dispatch(getProductById({ productId: id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (loadedProduct && type && loadedProduct.type !== type) {
      navigate(`/app/product/${loadedProduct.id}`, { replace: true });
    }
  }, [loadedProduct, navigate, type]);

  useEffect(() => {
    if (
      loadedProduct?.userId &&
      isPublicProductLandingPageProduct(loadedProduct) &&
      !publicStorefront
    ) {
      dispatch(fetchPublicStorefront(loadedProduct.userId));
    }
  }, [dispatch, loadedProduct, publicStorefront]);

  useEffect(() => {
    if (loadedProduct && isPublicProductLandingPageProduct(loadedProduct)) {
      dispatch(fetchPublicProductLandingPageConfig(loadedProduct.id));
    }
  }, [dispatch, loadedProduct]);

  const viewModel = useMemo(() => {
    if (!loadedProduct || !isPublicProductLandingPageProduct(loadedProduct)) {
      return null;
    }

    return getProductLandingPageViewModel({
      product: loadedProduct,
      currentUser: user,
      publicStorefront,
      creatorStorefrontTheme: isOwner
        ? creatorStorefrontConfig?.theme
        : undefined,
      landingPageConfig,
    });
  }, [
    creatorStorefrontConfig?.theme,
    isOwner,
    landingPageConfig,
    loadedProduct,
    publicStorefront,
    user,
  ]);

  if (loading && !loadedProduct) {
    return (
      <main className="product-page-state" aria-busy="true">
        <h1>Loading Product</h1>
        <p>Preparing this Product page.</p>
      </main>
    );
  }

  if (error || !loadedProduct) {
    return (
      <main className="product-page-state" role="alert">
        <h1>Product unavailable</h1>
        <p>{error ?? 'This Product page could not be loaded.'}</p>
      </main>
    );
  }

  if (!viewModel) {
    return (
      <main className="product-page-state" role="alert">
        <h1>Product unavailable</h1>
        <p>This Product is not publicly available.</p>
      </main>
    );
  }

  return <ProductLandingPage product={viewModel} />;
};

export default ProductPage;
