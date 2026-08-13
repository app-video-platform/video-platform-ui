import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiArrowUp,
  FiArrowDown,
  FiExternalLink,
  FiRefreshCw,
  FiSave,
  FiSettings,
  FiSliders,
} from 'react-icons/fi';

import {
  AppDispatch,
  ProductLandingPageConfigUpdateRequest,
  ProductLandingPageHeroLayout,
  ProductLandingPageSectionId,
  RootState,
} from 'core/api/models';
import { Button, Drawer, Icon, StatusBadge, Textarea } from '@shared/ui';
import { appRoutes } from 'domains/app/routes/routes';
import {
  clearCurrentProduct,
  getProductById,
  selectCurrentProduct,
  selectProductsError,
  selectProductsLoading,
} from 'core/store/product-store';
import { selectAuthUser } from 'core/store/auth-store';
import {
  fetchCreatorProductLandingPageConfig,
  selectCreatorProductLandingPageConfigByProductId,
  selectCreatorProductLandingPageConfigError,
  selectCreatorProductLandingPageConfigLoading,
  selectCreatorProductLandingPageConfigSaveError,
  selectCreatorProductLandingPageConfigSaveLoading,
  updateCreatorProductLandingPageConfig,
} from 'core/store/product-landing-page-store';
import {
  fetchCreatorStorefrontConfig,
  selectCreatorStorefrontConfig,
} from 'core/store/storefront-store';
import {
  DEFAULT_PRODUCT_LANDING_PAGE_CONFIG,
  getProductLandingPageViewModel,
  normalizeProductLandingPageConfig,
  ProductLandingPage,
  productLandingPageSectionLabels,
} from 'domains/app/features/product-landing-page';
import {
  formatProductPrice,
  getProductStatusLabel,
  getProductTypeLabel,
} from '../products-list/products-list.utils';

import './product-landing-page-builder.styles.scss';

type DraftConfig = ProductLandingPageConfigUpdateRequest;

const heroLayoutOptions: Array<{
  label: string;
  value: ProductLandingPageHeroLayout;
}> = [
  { label: 'Media right', value: 'MEDIA_RIGHT' },
  { label: 'Media left', value: 'MEDIA_LEFT' },
];

const getDraftFromConfig = (
  productId: string,
  config?: Partial<DraftConfig> | null,
): DraftConfig => {
  const normalized = normalizeProductLandingPageConfig(productId, {
    productId,
    ...config,
  });

  return {
    marketingDescription: normalized.marketingDescription ?? '',
    heroLayout: normalized.heroLayout,
    visibleSections: normalized.visibleSections,
    sectionOrder: normalized.sectionOrder,
  };
};

const areDraftsEqual = (left: DraftConfig | null, right: DraftConfig) =>
  left !== null &&
  left.marketingDescription === right.marketingDescription &&
  left.heroLayout === right.heroLayout &&
  left.visibleSections.join('|') === right.visibleSections.join('|') &&
  left.sectionOrder.join('|') === right.sectionOrder.join('|');

const moveSection = (
  sections: ProductLandingPageSectionId[],
  section: ProductLandingPageSectionId,
  direction: -1 | 1,
) => {
  const currentIndex = sections.indexOf(section);
  const nextIndex = currentIndex + direction;

  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= sections.length) {
    return sections;
  }

  const nextSections = [...sections];
  [nextSections[currentIndex], nextSections[nextIndex]] = [
    nextSections[nextIndex],
    nextSections[currentIndex],
  ];

  return nextSections;
};

const ProductLandingPageBuilder: React.FC = () => {
  const { productId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const product = useSelector(selectCurrentProduct);
  const productLoading = useSelector(selectProductsLoading);
  const productError = useSelector(selectProductsError);
  const creatorStorefrontConfig = useSelector(selectCreatorStorefrontConfig);
  const persistedConfig = useSelector((state: RootState) =>
    selectCreatorProductLandingPageConfigByProductId(state, productId),
  );
  const configLoading = useSelector(selectCreatorProductLandingPageConfigLoading);
  const configError = useSelector(selectCreatorProductLandingPageConfigError);
  const saveLoading = useSelector(selectCreatorProductLandingPageConfigSaveLoading);
  const saveError = useSelector(selectCreatorProductLandingPageConfigSaveError);
  const [draftConfig, setDraftConfig] = useState<DraftConfig | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [isMobileCustomize, setIsMobileCustomize] = useState(false);

  useEffect(() => {
    dispatch(fetchCreatorStorefrontConfig());
  }, [dispatch]);

  useEffect(() => {
    if (!window.matchMedia) {
      return undefined;
    }

    const query = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobileCustomize(query.matches);
    update();
    query.addEventListener?.('change', update);

    return () => query.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    dispatch(clearCurrentProduct());

    if (productId) {
      dispatch(getProductById({ productId }));
      dispatch(fetchCreatorProductLandingPageConfig(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (productId) {
      setDraftConfig(getDraftFromConfig(productId, persistedConfig));
      setSavedMessage(null);
    }
  }, [persistedConfig, productId]);

  const loadedProduct = product?.id === productId ? product : null;
  const baselineConfig = useMemo(() => {
    if (!productId) {
      return DEFAULT_PRODUCT_LANDING_PAGE_CONFIG;
    }

    return getDraftFromConfig(productId, persistedConfig);
  }, [persistedConfig, productId]);
  const hasChanges = !areDraftsEqual(draftConfig, baselineConfig);
  const previewModel = useMemo(() => {
    if (!loadedProduct || !draftConfig) {
      return null;
    }

    return getProductLandingPageViewModel({
      product: loadedProduct,
      currentUser: user,
      creatorStorefrontTheme: creatorStorefrontConfig?.theme,
      landingPageConfig: {
        ...draftConfig,
        productId: loadedProduct.id,
      },
    });
  }, [creatorStorefrontConfig?.theme, draftConfig, loadedProduct, user]);

  const updateDraft = (patch: Partial<DraftConfig>) => {
    setSavedMessage(null);
    setDraftConfig((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        ...patch,
      };
    });
  };

  const toggleSection = (section: ProductLandingPageSectionId) => {
    if (!draftConfig) {
      return;
    }

    const visibleSections = draftConfig.visibleSections.includes(section)
      ? draftConfig.visibleSections.filter((item) => item !== section)
      : [...draftConfig.visibleSections, section];

    updateDraft({ visibleSections });
  };

  const save = async () => {
    if (!productId || !draftConfig) {
      return;
    }

    await dispatch(
      updateCreatorProductLandingPageConfig({
        productId,
        config: draftConfig,
      }),
    ).unwrap();
    setSavedMessage('Landing page saved.');
  };

  const reset = () => {
    setDraftConfig(baselineConfig);
    setSavedMessage(null);
  };

  if (!productId) {
    return (
      <main className="product-landing-builder product-landing-builder--state">
        <h1>Landing page unavailable</h1>
        <p>This route is missing a Product ID.</p>
        <Button type="button" variant="secondary" onClick={() => navigate(appRoutes.products)}>
          Back to Products
        </Button>
      </main>
    );
  }

  if ((productLoading || configLoading) && !loadedProduct) {
    return (
      <main className="product-landing-builder product-landing-builder--state" aria-busy="true">
        <h1>Loading landing page</h1>
        <p>Preparing the live editor.</p>
      </main>
    );
  }

  if (productError || !loadedProduct) {
    return (
      <main className="product-landing-builder product-landing-builder--state" role="alert">
        <h1>Landing page unavailable</h1>
        <p>{productError ?? 'This Product could not be loaded.'}</p>
        <Button type="button" variant="secondary" onClick={() => navigate(appRoutes.products)}>
          Back to Products
        </Button>
      </main>
    );
  }

  const customizationControls = (
    <>
      <section>
        <div className="product-landing-builder__section-heading">
          <h2>Landing content</h2>
          <p>Product details and Creator profile stay read-only here.</p>
        </div>
        <Textarea
          label="Marketing description"
          value={draftConfig?.marketingDescription ?? ''}
          onChange={(event) =>
            updateDraft({ marketingDescription: event.target.value })
          }
          maxLength={1200}
          isMaxLengthShown
          block
        />
      </section>

      <section>
        <div className="product-landing-builder__section-heading">
          <h2>Hero layout</h2>
        </div>
        <div className="product-landing-builder__segmented">
          {heroLayoutOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={
                draftConfig?.heroLayout === option.value ? 'primary' : 'secondary'
              }
              onClick={() => updateDraft({ heroLayout: option.value })}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </section>

      <section>
        <div className="product-landing-builder__section-heading">
          <h2>Sections</h2>
        </div>
        <div className="product-landing-builder__section-list">
          {draftConfig?.sectionOrder.map((section, index) => (
            <article key={section}>
              <label>
                <input
                  type="checkbox"
                  name={`section-${section}`}
                  checked={draftConfig.visibleSections.includes(section)}
                  onChange={() => toggleSection(section)}
                />
                <span>{productLandingPageSectionLabels[section]}</span>
              </label>
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Move ${productLandingPageSectionLabels[section]} up`}
                  disabled={index === 0}
                  onClick={() =>
                    updateDraft({
                      sectionOrder: moveSection(
                        draftConfig.sectionOrder,
                        section,
                        -1,
                      ),
                    })
                  }
                >
                  <Icon icon={FiArrowUp} color="currentColor" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Move ${productLandingPageSectionLabels[section]} down`}
                  disabled={index === draftConfig.sectionOrder.length - 1}
                  onClick={() =>
                    updateDraft({
                      sectionOrder: moveSection(
                        draftConfig.sectionOrder,
                        section,
                        1,
                      ),
                    })
                  }
                >
                  <Icon icon={FiArrowDown} color="currentColor" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="product-landing-builder__section-heading">
          <h2>Read-only Product source</h2>
        </div>
        <dl className="product-landing-builder__facts">
          <div>
            <dt>Status</dt>
            <dd>
              <StatusBadge
                label={getProductStatusLabel(loadedProduct.status)}
                tone={loadedProduct.status === 'PUBLISHED' ? 'success' : 'neutral'}
                size="sm"
              />
            </dd>
          </div>
          <div>
            <dt>Price</dt>
            <dd>{formatProductPrice(loadedProduct)}</dd>
          </div>
        </dl>
      </section>

      {(configError || saveError || savedMessage) && (
        <p
          className="product-landing-builder__feedback"
          role={saveError ? 'alert' : 'status'}
        >
          {saveError ?? savedMessage ?? configError}
        </p>
      )}
    </>
  );

  return (
    <main className="product-landing-builder">
      <header className="product-landing-builder__topbar">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate(appRoutes.productsOverview(loadedProduct.id))}
          leadingIcon={<Icon icon={FiArrowLeft} color="currentColor" />}
        >
          Product Overview
        </Button>
        <div>
          <span>{getProductTypeLabel(loadedProduct.type)}</span>
          <h1>{loadedProduct.name || 'Untitled product'}</h1>
        </div>
        <div className="product-landing-builder__actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(appRoutes.productsEdit(loadedProduct.id))}
            leadingIcon={<Icon icon={FiSettings} color="currentColor" />}
          >
            Edit product details
          </Button>
          {loadedProduct.status === 'PUBLISHED' && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(appRoutes.product(loadedProduct.id))}
              leadingIcon={<Icon icon={FiExternalLink} color="currentColor" />}
            >
              View public page
            </Button>
          )}
          <Button
            type="button"
            variant="secondary"
            disabled={!hasChanges || saveLoading}
            onClick={reset}
            leadingIcon={<Icon icon={FiRefreshCw} color="currentColor" />}
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="primary"
            loading={saveLoading}
            disabled={!hasChanges}
            onClick={save}
            leadingIcon={<Icon icon={FiSave} color="currentColor" />}
          >
            Save
          </Button>
          <Button
            type="button"
            variant="primary"
            className="product-landing-builder__mobile-customize"
            aria-expanded={customizeOpen && isMobileCustomize}
            onClick={() => setCustomizeOpen(true)}
            leadingIcon={<Icon icon={FiSliders} color="currentColor" />}
          >
            Customize
          </Button>
        </div>
      </header>

      <section className="product-landing-builder__workspace">
        <aside className="product-landing-builder__controls" aria-label="Landing page controls">
          {customizationControls}
        </aside>

        <section className="product-landing-builder__preview" aria-label="Landing page preview">
          {previewModel && <ProductLandingPage product={previewModel} />}
        </section>
      </section>

      <Drawer
        open={customizeOpen && isMobileCustomize}
        title={<h2>Customize landing page</h2>}
        onClose={() => setCustomizeOpen(false)}
        className="product-landing-builder__drawer"
      >
        <div className="product-landing-builder__controls product-landing-builder__controls--drawer">
          {customizationControls}
        </div>
      </Drawer>
    </main>
  );
};

export default ProductLandingPageBuilder;
