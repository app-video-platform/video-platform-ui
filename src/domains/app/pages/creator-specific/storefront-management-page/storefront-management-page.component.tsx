import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiCopy, FiExternalLink } from 'react-icons/fi';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

import { Button, GalIcon, StatusBadge } from '@shared/ui';
import { AppDispatch, hasRole, ProductMinimised, UserRole } from 'core/api/models';
import { selectAuthUser } from 'core/store/auth-store';
import {
  getProductSummariesByOwner,
  selectProductSummaries,
  selectProductsError,
  selectProductsLoading,
} from 'core/store/product-store';
import {
  getProfileFromUser,
  getPublicStorefrontProducts,
  getStorefrontViewModel,
  normalizeStorefrontProducts,
  orderStorefrontProducts,
  StorefrontPublicPage,
  storefrontInspectionFeaturedProductId,
  storefrontInspectionProducts,
  storefrontInspectionUser,
  storefrontProductTypeLabels,
  storefrontStatusLabels,
} from 'domains/app/features/storefront';

import './storefront-management-page.styles.scss';

const statusTone = {
  PUBLISHED: 'success',
  DRAFT: 'warning',
  HIDDEN: 'neutral',
} as const;

const CreatorStorefrontPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectAuthUser);
  const summaries = useSelector(selectProductSummaries);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const useInspectionData = process.env.REACT_APP_USE_MOCKS === 'true';
  const isCreator = hasRole(user?.roles, UserRole.CREATOR);
  const activeUser = user || (useInspectionData ? storefrontInspectionUser : null);
  const [featuredProductId, setFeaturedProductId] = useState<string | undefined>(
    storefrontInspectionFeaturedProductId,
  );
  const [orderedProductIds, setOrderedProductIds] = useState<string[]>([]);
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  useEffect(() => {
    if (isCreator && user?.id) {
      dispatch(getProductSummariesByOwner(user.id));
    }
  }, [dispatch, isCreator, user?.id]);

  const rawProducts: ProductMinimised[] = useMemo(() => {
    if (summaries && summaries.length > 0) {
      return summaries;
    }

    return useInspectionData ? storefrontInspectionProducts : [];
  }, [summaries, useInspectionData]);

  const allProducts = useMemo(
    () => normalizeStorefrontProducts(rawProducts),
    [rawProducts],
  );
  const orderedProducts = useMemo(
    () => orderStorefrontProducts(allProducts, orderedProductIds),
    [allProducts, orderedProductIds],
  );
  const publicProducts = useMemo(
    () => getPublicStorefrontProducts(orderedProducts),
    [orderedProducts],
  );
  const profile = useMemo(() => getProfileFromUser(activeUser), [activeUser]);
  const publicStorefrontUrl = `/app/store/${activeUser?.id || 'creator'}`;
  const absoluteStorefrontUrl = `${window.location.origin}${publicStorefrontUrl}`;
  const hasPublishableProducts = publicProducts.length > 0;
  const hiddenCount = allProducts.length - publicProducts.length;

  const storefront = useMemo(
    () =>
      getStorefrontViewModel({
        profile,
        products: orderedProducts,
        featuredProductId,
      }),
    [featuredProductId, orderedProducts, profile],
  );

  useEffect(() => {
    if (!featuredProductId || !publicProducts.some((product) => product.id === featuredProductId)) {
      setFeaturedProductId(publicProducts[0]?.id);
    }
  }, [featuredProductId, publicProducts]);

  const moveProduct = (productId: string, direction: -1 | 1) => {
    const currentOrder =
      orderedProductIds.length > 0
        ? orderedProductIds
        : allProducts.map((product) => product.id);
    const index = currentOrder.indexOf(productId);
    const nextIndex = index + direction;

    if (index === -1 || nextIndex < 0 || nextIndex >= currentOrder.length) {
      return;
    }

    const nextOrder = [...currentOrder];
    [nextOrder[index], nextOrder[nextIndex]] = [
      nextOrder[nextIndex],
      nextOrder[index],
    ];
    setOrderedProductIds(nextOrder);
  };

  const copyStorefrontLink = async () => {
    try {
      await navigator.clipboard.writeText(absoluteStorefrontUrl);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      setCopyState('idle');
    }
  };

  if (!isCreator && !useInspectionData) {
    return (
      <section className="storefront-management storefront-management__state">
        <h1>Storefront</h1>
        <p>Storefront management is available when your active role is Creator.</p>
      </section>
    );
  }

  const unavailable = !useInspectionData && !summaries && !loading && !error;

  return (
    <div className="storefront-management">
      <header className="storefront-management__header">
        <div>
          <h1>Storefront</h1>
          <p>
            Manage the fixed public page customers see when you share your
            Storefront link.
          </p>
        </div>
        <div className="storefront-management__header-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.open(publicStorefrontUrl, '_blank', 'noopener')}
            leadingIcon={
              <GalIcon icon={FiExternalLink} color="currentColor" size={15} />
            }
          >
            Preview
          </Button>
        </div>
      </header>

      <section className="storefront-management__status" aria-label="Storefront status">
        <div>
          <span>Storefront status</span>
          <strong>{hasPublishableProducts ? 'Public with products' : 'Public profile only'}</strong>
          <p>
            {hasPublishableProducts
              ? 'Customers can see your profile and published products. Draft and hidden products stay private.'
              : 'Customers can see your profile, but no products are public yet.'}
          </p>
        </div>
        <div className="storefront-management__url">
          <span>Public URL</span>
          <code>{publicStorefrontUrl}</code>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={copyStorefrontLink}
            leadingIcon={<GalIcon icon={FiCopy} color="currentColor" size={15} />}
          >
            {copyState === 'copied' ? 'Copied' : 'Copy link'}
          </Button>
        </div>
      </section>

      {unavailable && (
        <section className="storefront-management__notice" role="status">
          <h2>Storefront data is not available yet</h2>
          <p>
            Product and public profile data will appear here once production
            Storefront data is connected.
          </p>
        </section>
      )}

      {error && (
        <section className="storefront-management__notice storefront-management__notice--error" role="alert">
          <h2>Unable to load products</h2>
          <p>{error}</p>
        </section>
      )}

      <div className="storefront-management__layout">
        <div className="storefront-management__controls">
          <section className="storefront-management__panel" aria-labelledby="storefront-profile-heading">
            <div className="storefront-management__panel-header">
              <div>
                <h2 id="storefront-profile-heading">Public profile</h2>
                <p>Uses the profile fields already available in your account.</p>
              </div>
            </div>
            <div className="storefront-management__profile">
              <div className="storefront-management__avatar" aria-hidden="true">
                {profile.imageUrl ? <img src={profile.imageUrl} alt="" /> : profile.displayName.slice(0, 2)}
              </div>
              <dl>
                <div>
                  <dt>Name</dt>
                  <dd>{profile.displayName}</dd>
                </div>
                <div>
                  <dt>Title</dt>
                  <dd>{profile.title || 'Not set'}</dd>
                </div>
                <div>
                  <dt>Tagline</dt>
                  <dd>{profile.tagline || 'Not set'}</dd>
                </div>
                <div>
                  <dt>Website</dt>
                  <dd>{profile.website || 'Not set'}</dd>
                </div>
              </dl>
            </div>
            <p className="storefront-management__boundary">
              Profile edits are handled by existing account/profile flows. Storefront
              ordering and featured selection are local inspection controls until a
              Storefront persistence contract exists.
            </p>
          </section>

          <section className="storefront-management__panel" aria-labelledby="storefront-products-heading">
            <div className="storefront-management__panel-header">
              <div>
                <h2 id="storefront-products-heading">Products</h2>
                <p>
                  {publicProducts.length} public, {hiddenCount} draft or hidden.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="storefront-management__notice" role="status">
                <h3>Loading Storefront products</h3>
              </div>
            ) : allProducts.length > 0 ? (
              <ul className="storefront-management__product-list">
                {orderedProducts.map((product, index) => {
                  const isVisible = product.status === 'PUBLISHED';
                  const isFeatured = product.id === storefront.featuredProductId;

                  return (
                    <li key={product.id}>
                      <div className="storefront-management__product-main">
                        <span>{storefrontProductTypeLabels[product.type]}</span>
                        <h3>{product.title}</h3>
                        <p>
                          {isVisible
                            ? 'Visible publicly'
                            : 'Not visible on the public Storefront'}
                        </p>
                      </div>
                      <div className="storefront-management__product-actions">
                        <StatusBadge
                          label={storefrontStatusLabels[product.status]}
                          tone={statusTone[product.status]}
                          size="sm"
                        />
                        <Button
                          type="button"
                          variant={isFeatured ? 'primary' : 'secondary'}
                          size="sm"
                          disabled={!isVisible}
                          onClick={() => setFeaturedProductId(product.id)}
                        >
                          {isFeatured ? 'Featured' : 'Set featured'}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Move ${product.title} up`}
                          disabled={index === 0}
                          onClick={() => moveProduct(product.id, -1)}
                        >
                          <GalIcon
                            icon={MdKeyboardArrowUp}
                            color="currentColor"
                            size={18}
                          />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Move ${product.title} down`}
                          disabled={index === orderedProducts.length - 1}
                          onClick={() => moveProduct(product.id, 1)}
                        >
                          <GalIcon
                            icon={MdKeyboardArrowDown}
                            color="currentColor"
                            size={18}
                          />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="storefront-management__notice" role="status">
                <h3>No products available</h3>
                <p>Create and publish a product before customers can browse offers.</p>
              </div>
            )}
          </section>
        </div>

        <aside className="storefront-management__preview" aria-label="Live Storefront preview">
          <div className="storefront-management__preview-header">
            <h2>Live preview</h2>
            <p>Matches what customers see on your public Storefront.</p>
          </div>
          <StorefrontPublicPage storefront={storefront} preview />
        </aside>
      </div>
    </div>
  );
};

export default CreatorStorefrontPage;
