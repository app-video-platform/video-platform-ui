import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { toast } from 'sonner';

import {
  AppDispatch,
  hasRole,
  ProductMinimised,
  RootState,
  UserRole,
} from 'core/api/models';
import {
  enrollInFreeProductAPI,
  getProductAccessAPI,
  getProductFileDownloadAPI,
} from 'core/api/services';
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
import { addProductToCart, selectCartIds } from 'core/store/shop-cart';
import { Button, LegacyExpansionPanel } from '@shared/ui';
import {
  getProductLandingPageViewModel,
  isPublicProductLandingPageProduct,
  ProductLandingPage,
} from 'domains/app/features/product-landing-page';
import { appRoutes } from '../../routes/routes';

import './product-page.styles.scss';

const ProductPage: React.FC = () => {
  const { type, id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const cartIds = useSelector(selectCartIds);
  const currentProduct = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const creatorStorefrontConfig = useSelector(selectCreatorStorefrontConfig);
  const [hasAccess, setHasAccess] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const loadedProduct =
    currentProduct?.id && currentProduct.id === id ? currentProduct : null;
  const publicStorefront = useSelector((state: RootState) =>
    selectPublicStorefrontByCreatorId(state, loadedProduct?.userId),
  );
  const landingPageConfig = useSelector((state: RootState) =>
    selectPublicProductLandingPageConfigByProductId(state, loadedProduct?.id),
  );
  const isOwner =
    Boolean(user?.id && user.id === loadedProduct?.userId) ||
    hasRole(user?.roles, UserRole.ADMIN);

  useEffect(() => {
    if (id) {
      dispatch(clearCurrentProduct());
      dispatch(getProductById({ productId: id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (loadedProduct && type && loadedProduct.type !== type) {
      navigate(appRoutes.product(loadedProduct.id), { replace: true });
    }
  }, [loadedProduct, navigate, type]);

  useEffect(() => {
    if (!user || !id) {
      setHasAccess(false);
      return;
    }

    getProductAccessAPI(id)
      .then((access) => setHasAccess(access.hasAccess))
      .catch(() => setHasAccess(false));
  }, [id, user]);

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

  const numericPrice =
    loadedProduct?.price === 'free' ? 0 : Number(loadedProduct?.price ?? 0);
  const isFree = numericPrice === 0;
  const isInCart = Boolean(loadedProduct?.id && cartIds.has(loadedProduct.id));

  const toSummary = (): ProductMinimised | null => {
    if (!loadedProduct) {
      return null;
    }
    return {
      id: loadedProduct.id,
      title: loadedProduct.name,
      description: loadedProduct.description,
      type: loadedProduct.type,
      price: loadedProduct.price,
      status: loadedProduct.status,
      imageUrl: loadedProduct.imageUrl,
      createdById: loadedProduct.userId,
      createdAt: loadedProduct.createdAt,
      updatedAt: loadedProduct.updatedAt,
    };
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    if (!loadedProduct) {
      return;
    }

    setEnrolling(true);
    try {
      await enrollInFreeProductAPI(loadedProduct.id);
      setHasAccess(true);
      await dispatch(getProductById({ productId: loadedProduct.id })).unwrap();
      toast.success('Added to your library');
    } catch {
      toast.error('This product could not be added to your library.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleAddToCart = () => {
    const product = toSummary();
    if (product && !isInCart) {
      dispatch(addProductToCart(product));
    }
  };

  const handleDownload = async (fileId?: string) => {
    if (!loadedProduct || !fileId) {
      return;
    }
    try {
      const { url } = await getProductFileDownloadAPI(
        loadedProduct.id,
        fileId,
      );
      window.location.assign(url);
    } catch {
      toast.error('The download could not be started.');
    }
  };

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

  const commerceActions = isOwner ? (
    <Button
      type="button"
      variant="primary"
      onClick={() => navigate(appRoutes.productsEdit(loadedProduct.id))}
    >
      Edit product
    </Button>
  ) : hasAccess ? (
    <Button type="button" variant="primary" disabled>
      In your library
    </Button>
  ) : isFree ? (
    <Button
      type="button"
      variant="primary"
      disabled={enrolling}
      onClick={handleEnroll}
    >
      {enrolling ? 'Adding...' : 'Enroll for free'}
    </Button>
  ) : (
    <div className="product-page__commerce-actions">
      <Button
        type="button"
        variant="primary"
        disabled={isInCart}
        onClick={handleAddToCart}
      >
        {isInCart ? 'Already in cart' : 'Add to cart'}
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          handleAddToCart();
          navigate(appRoutes.cart);
        }}
      >
        Buy now
      </Button>
    </div>
  );

  return (
    <>
      <ProductLandingPage product={viewModel} commerceActions={commerceActions} />
      {(hasAccess || isOwner) && loadedProduct.type === 'COURSE' && (
        <section className="product-page__protected-content">
          <h2>Course content</h2>
          {loadedProduct.sections?.map((section) => (
            <LegacyExpansionPanel key={section.id} header={section.title || ''}>
              {section.description && <p>{section.description}</p>}
              {section.lessons?.map((lesson) => (
                <article key={lesson.id} className="product-page__lesson">
                  <h3>{lesson.title}</h3>
                  {lesson.content && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(lesson.content),
                      }}
                    />
                  )}
                  {lesson.videoUrl && (
                    <video controls src={lesson.videoUrl}>
                      <track kind="captions" />
                    </video>
                  )}
                </article>
              ))}
            </LegacyExpansionPanel>
          ))}
        </section>
      )}
      {(hasAccess || isOwner) && loadedProduct.type === 'DOWNLOAD' && (
        <section className="product-page__protected-content">
          <h2>Downloads</h2>
          {loadedProduct.sections?.map((section) => (
            <LegacyExpansionPanel key={section.id} header={section.title || ''}>
              {section.files?.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  className="product-page__download"
                  onClick={() => handleDownload(file.id)}
                >
                  {file.fileName}
                </button>
              ))}
            </LegacyExpansionPanel>
          ))}
        </section>
      )}
    </>
  );
};

export default ProductPage;
