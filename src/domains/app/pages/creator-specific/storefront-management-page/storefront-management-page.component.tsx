/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiCheck,
  FiCopy,
  FiEdit3,
  FiExternalLink,
  FiRotateCcw,
  FiSave,
  FiSliders,
  FiX,
} from 'react-icons/fi';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

import {
  Button,
  Drawer,
  GalIcon,
  InfoPopover,
  Input,
  StatusBadge,
  Textarea,
} from '@shared/ui';
import {
  AppDispatch,
  CreatorStorefrontConfigUpdateRequest,
  hasRole,
  ProductMinimised,
  StorefrontAppearance,
  StorefrontTheme,
  StorefrontTypography,
  UpdateUserRequest,
  UserRole,
} from 'core/api/models';
import {
  selectAuthError,
  selectAuthLoading,
  selectAuthUser,
  updateUserDetails,
} from 'core/store/auth-store';
import {
  getProductSummariesByOwner,
  selectProductSummaries,
  selectProductsError,
  selectProductsLoading,
} from 'core/store/product-store';
import {
  fetchCreatorStorefrontConfig,
  selectCreatorStorefrontConfig,
  selectCreatorStorefrontConfigError,
  selectCreatorStorefrontConfigLoading,
  selectCreatorStorefrontConfigSaveError,
  selectCreatorStorefrontConfigSaveLoading,
  updateCreatorStorefrontConfig,
} from 'core/store/storefront-store';
import { PUBLIC_EMAIL_POPOVER_COPY } from 'domains/app/features/settings';
import {
  DEFAULT_STOREFRONT_THEME,
  getProfileFromUser,
  getPublicStorefrontProducts,
  getStorefrontViewModel,
  normalizeStorefrontProducts,
  orderStorefrontProducts,
  StorefrontPublicPage,
  storefrontProductTypeLabels,
  storefrontStatusLabels,
} from 'domains/app/features/storefront';

import './storefront-management-page.styles.scss';

type DraftStorefrontConfig = CreatorStorefrontConfigUpdateRequest;
type EditableProfileField =
  | 'displayName'
  | 'title'
  | 'tagline'
  | 'bio'
  | 'website'
  | 'publicEmail';

const statusTone = {
  PUBLISHED: 'success',
  DRAFT: 'warning',
  HIDDEN: 'neutral',
} as const;

const accentSwatches = [
  '#ffbd41',
  '#18c7a5',
  '#4f8cff',
  '#ff6b6b',
  '#9b6bff',
  '#111827',
];

const appearanceOptions: Array<{
  label: string;
  value: StorefrontAppearance;
}> = [
  { label: 'Light', value: 'LIGHT' },
  { label: 'Dark', value: 'DARK' },
];

const typographyOptions: Array<{
  label: string;
  value: StorefrontTypography;
  preview: string;
}> = [
  { label: 'Modern', value: 'MODERN', preview: 'Clean Sans' },
  { label: 'Classic', value: 'CLASSIC', preview: 'Editorial Serif' },
  { label: 'Friendly', value: 'FRIENDLY', preview: 'Warm Sans' },
];

const normalizeDraftConfig = (
  config: DraftStorefrontConfig | null | undefined,
): DraftStorefrontConfig => ({
  featuredProductId: config?.featuredProductId ?? null,
  productOrderIds: config?.productOrderIds ?? [],
  theme: config?.theme ?? DEFAULT_STOREFRONT_THEME,
});

const getDisplayNamePayload = (displayName: string): UpdateUserRequest => {
  const [firstName = '', ...rest] = displayName.trim().split(/\s+/);
  return {
    firstName,
    lastName: rest.join(' '),
  };
};

interface InlineProfileEditorProps {
  label: string;
  value: string;
  fallback?: string;
  multiline?: boolean;
  helpText?: string;
  saving?: boolean;
  onSave: (value: string) => Promise<void>;
}

const InlineProfileEditor: React.FC<InlineProfileEditorProps> = ({
  label,
  value,
  fallback = 'Not set',
  multiline = false,
  helpText,
  saving = false,
  onSave,
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editing) {
      setDraft(value);
    }
  }, [editing, value]);

  const cancel = () => {
    setDraft(value);
    setError(null);
    setEditing(false);
  };

  const save = async () => {
    try {
      await onSave(draft.trim());
      setError(null);
      setEditing(false);
    } catch {
      setError(`Unable to save ${label.toLowerCase()}.`);
    }
  };

  if (editing) {
    return (
      <span className="storefront-inline-edit storefront-inline-edit--active">
        {multiline ? (
          <Textarea
            aria-label={label}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            block
          />
        ) : (
          <Input
            aria-label={label}
            name={`storefront-${label}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
        )}
        <span className="storefront-inline-edit__actions">
          <Button
            type="button"
            variant="primary"
            size="sm"
            loading={saving}
            onClick={save}
            leadingIcon={<GalIcon icon={FiCheck} color="currentColor" />}
          >
            Save
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={saving}
            onClick={cancel}
            leadingIcon={<GalIcon icon={FiX} color="currentColor" />}
          >
            Cancel
          </Button>
        </span>
        {error && <span className="storefront-inline-edit__error">{error}</span>}
      </span>
    );
  }

  return (
    <span className="storefront-inline-edit">
      <span>{value || fallback}</span>
      {helpText && (
        <InfoPopover className="storefront-inline-edit__popover">
          <span>{helpText}</span>
        </InfoPopover>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Edit ${label}`}
        onClick={() => setEditing(true)}
      >
        <GalIcon icon={FiEdit3} color="currentColor" size={15} />
      </Button>
    </span>
  );
};

const CreatorStorefrontPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectAuthUser);
  const authLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const summaries = useSelector(selectProductSummaries);
  const productsLoading = useSelector(selectProductsLoading);
  const productsError = useSelector(selectProductsError);
  const config = useSelector(selectCreatorStorefrontConfig);
  const configLoading = useSelector(selectCreatorStorefrontConfigLoading);
  const configError = useSelector(selectCreatorStorefrontConfigError);
  const configSaveLoading = useSelector(
    selectCreatorStorefrontConfigSaveLoading,
  );
  const configSaveError = useSelector(selectCreatorStorefrontConfigSaveError);
  const isCreator = hasRole(user?.roles, UserRole.CREATOR);
  const [draftConfig, setDraftConfig] = useState<DraftStorefrontConfig | null>(
    null,
  );
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [isMobileCustomize, setIsMobileCustomize] = useState(false);

  useEffect(() => {
    if (isCreator && user?.id) {
      dispatch(getProductSummariesByOwner(user.id));
      dispatch(fetchCreatorStorefrontConfig());
    }
  }, [dispatch, isCreator, user?.id]);

  useEffect(() => {
    if (!window.matchMedia) {
      return undefined;
    }

    const query = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobileCustomize(query.matches);
    update();
    query.addEventListener?.('change', update);

    return () => query.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    if (config) {
      setDraftConfig(normalizeDraftConfig(config));
    }
  }, [config]);

  const rawProducts: ProductMinimised[] = useMemo(
    () => summaries ?? [],
    [summaries],
  );
  const allProducts = useMemo(
    () => normalizeStorefrontProducts(rawProducts),
    [rawProducts],
  );
  const draft = draftConfig ?? normalizeDraftConfig(config);
  const orderedProducts = useMemo(
    () => orderStorefrontProducts(allProducts, draft.productOrderIds),
    [allProducts, draft.productOrderIds],
  );
  const publicProducts = useMemo(
    () => getPublicStorefrontProducts(orderedProducts),
    [orderedProducts],
  );
  const profile = useMemo(() => getProfileFromUser(user), [user]);
  const publicStorefrontUrl = `/app/store/${user?.id || 'creator'}`;
  const absoluteStorefrontUrl = `${window.location.origin}${publicStorefrontUrl}`;
  const hiddenCount = allProducts.length - publicProducts.length;
  const hasUnsavedChanges =
    Boolean(config) &&
    JSON.stringify(normalizeDraftConfig(config)) !== JSON.stringify(draft);

  const storefront = useMemo(
    () =>
      getStorefrontViewModel({
        profile,
        products: orderedProducts,
        featuredProductId: draft.featuredProductId ?? undefined,
        theme: draft.theme,
      }),
    [draft.featuredProductId, draft.theme, orderedProducts, profile],
  );

  const updateDraft = (next: Partial<DraftStorefrontConfig>) => {
    setDraftConfig((current) => ({
      ...normalizeDraftConfig(current ?? config),
      ...next,
    }));
  };

  const updateTheme = (nextTheme: Partial<StorefrontTheme>) => {
    updateDraft({
      theme: {
        ...draft.theme,
        ...nextTheme,
      },
    });
  };

  const saveDraft = () => {
    dispatch(updateCreatorStorefrontConfig(draft));
  };

  const resetDraft = () => {
    setDraftConfig(normalizeDraftConfig(config));
  };

  const setFeaturedProduct = (productId: string) => {
    const nextOrder =
      draft.productOrderIds.length > 0
        ? draft.productOrderIds
        : allProducts.map((product) => product.id);

    updateDraft({
      featuredProductId: productId,
      productOrderIds: nextOrder,
    });
  };

  const moveProduct = (productId: string, direction: -1 | 1) => {
    const currentOrder =
      draft.productOrderIds.length > 0
        ? draft.productOrderIds
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
    updateDraft({ productOrderIds: nextOrder });
  };

  const saveProfileField = async (
    field: EditableProfileField,
    value: string,
  ) => {
    const payloadByField: Record<EditableProfileField, UpdateUserRequest> = {
      displayName: getDisplayNamePayload(value),
      title: { title: value },
      tagline: { taglineMission: value },
      bio: { bio: value },
      website: { website: value },
      publicEmail: { publicEmail: value },
    };

    await dispatch(updateUserDetails(payloadByField[field])).unwrap();
  };

  const editableFields = {
    displayName: (value: string) => (
      <InlineProfileEditor
        label="Display name"
        value={value}
        saving={authLoading}
        onSave={(next) => saveProfileField('displayName', next)}
      />
    ),
    title: (value: string) => (
      <InlineProfileEditor
        label="Title"
        value={value}
        saving={authLoading}
        onSave={(next) => saveProfileField('title', next)}
      />
    ),
    tagline: (value: string) => (
      <InlineProfileEditor
        label="Tagline"
        value={value}
        saving={authLoading}
        onSave={(next) => saveProfileField('tagline', next)}
      />
    ),
    bio: (value: string) => (
      <InlineProfileEditor
        label="Bio"
        value={value}
        multiline
        saving={authLoading}
        onSave={(next) => saveProfileField('bio', next)}
      />
    ),
    website: (value: string) => (
      <InlineProfileEditor
        label="Website"
        value={value}
        saving={authLoading}
        onSave={(next) => saveProfileField('website', next)}
      />
    ),
    publicEmail: (value: string) => (
      <InlineProfileEditor
        label="Public Email"
        value={value}
        saving={authLoading}
        helpText={PUBLIC_EMAIL_POPOVER_COPY}
        onSave={(next) => saveProfileField('publicEmail', next)}
      />
    ),
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

  const customizeControls = (
    <div className="storefront-customize">
      <fieldset>
        <legend>Appearance</legend>
        <div className="storefront-customize__segments">
          {appearanceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={draft.theme.appearance === option.value}
              onClick={() => updateTheme({ appearance: option.value })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Brand color</legend>
        <div className="storefront-customize__swatches">
          {accentSwatches.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Use brand color ${color}`}
              aria-pressed={draft.theme.accentColor === color}
              style={{ backgroundColor: color }}
              onClick={() => updateTheme({ accentColor: color })}
            />
          ))}
          <input
            aria-label="Custom brand color"
            type="color"
            value={draft.theme.accentColor}
            onChange={(event) =>
              updateTheme({ accentColor: event.target.value })
            }
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>Typography</legend>
        <div className="storefront-customize__type-options">
          {typographyOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`storefront-customize__type-option storefront-customize__type-option--${option.value.toLowerCase()}`}
              aria-pressed={draft.theme.typography === option.value}
              onClick={() => updateTheme({ typography: option.value })}
            >
              <strong>{option.label}</strong>
              <span>{option.preview}</span>
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );

  if (!isCreator) {
    return (
      <section className="storefront-management storefront-management__state">
        <h1>Storefront</h1>
        <p>
          Storefront management is available when your active role is Creator.
        </p>
      </section>
    );
  }

  const unavailable =
    !summaries &&
    !productsLoading &&
    !productsError &&
    !configLoading &&
    !config;

  return (
    <div className="storefront-management storefront-builder">
      <header className="storefront-builder__chrome">
        <div>
          <h1>Storefront Builder</h1>
          <p>
            {hasUnsavedChanges
              ? 'Unsaved changes'
              : 'All Storefront configuration changes are saved'}
          </p>
        </div>
        <div className="storefront-builder__actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.open(publicStorefrontUrl, '_blank', 'noopener')}
            leadingIcon={
              <GalIcon icon={FiExternalLink} color="currentColor" size={15} />
            }
          >
            Open public Storefront
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label="Copy public Storefront link"
            onClick={copyStorefrontLink}
          >
            <GalIcon icon={FiCopy} color="currentColor" size={15} />
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={!hasUnsavedChanges || configSaveLoading}
            onClick={resetDraft}
            leadingIcon={
              <GalIcon icon={FiRotateCcw} color="currentColor" size={15} />
            }
          >
            Reset changes
          </Button>
          <Button
            type="button"
            variant="primary"
            loading={configSaveLoading}
            disabled={!hasUnsavedChanges}
            onClick={saveDraft}
            leadingIcon={<GalIcon icon={FiSave} color="currentColor" size={15} />}
          >
            Save changes
          </Button>
        </div>
      </header>

      {copyState === 'copied' && (
        <div className="storefront-builder__toast" role="status">
          Storefront link copied
        </div>
      )}

      {unavailable && (
        <section className="storefront-management__notice" role="status">
          <h2>Storefront data is not available yet</h2>
          <p>
            Product, profile, and Storefront configuration data will appear here
            once production Storefront data is connected.
          </p>
        </section>
      )}

      {(productsError || configError || configSaveError || authError) && (
        <section
          className="storefront-management__notice storefront-management__notice--error"
          role="alert"
        >
          <h2>Unable to load or save Storefront data</h2>
          <p>{productsError || configError || configSaveError || authError}</p>
        </section>
      )}

      <section
        className="storefront-builder__product-strip"
        aria-labelledby="storefront-products-builder-heading"
      >
        <div>
          <h2 id="storefront-products-builder-heading">Products</h2>
          <p>
            {publicProducts.length} public, {hiddenCount} draft or hidden. Draft
            and hidden products stay out of the shared public rendering.
          </p>
        </div>
        {productsLoading || configLoading ? (
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
                      disabled={!isVisible || configSaveLoading}
                      onClick={() => setFeaturedProduct(product.id)}
                    >
                      {isFeatured ? 'Featured' : 'Set featured'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Move ${product.title} up`}
                      disabled={index === 0 || configSaveLoading}
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
                      disabled={
                        index === orderedProducts.length - 1 ||
                        configSaveLoading
                      }
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

      <StorefrontPublicPage
        storefront={storefront}
        editableFields={editableFields}
      />

      <div className="storefront-builder__customize">
        {customizeOpen && !isMobileCustomize && (
          <aside
            className="storefront-builder__customize-panel"
            aria-label="Customize Storefront"
          >
            <header>
              <h2>Customize</h2>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close customization panel"
                onClick={() => setCustomizeOpen(false)}
              >
                <GalIcon icon={FiX} color="currentColor" size={18} />
              </Button>
            </header>
            {customizeControls}
          </aside>
        )}
        <Button
          type="button"
          variant="primary"
          size="icon"
          shape="round"
          className="storefront-builder__fab"
          aria-label="Customize Storefront"
          aria-expanded={customizeOpen}
          onClick={() => setCustomizeOpen((open) => !open)}
        >
          <GalIcon icon={FiSliders} color="currentColor" size={20} />
        </Button>
      </div>

      <Drawer
        open={customizeOpen && isMobileCustomize}
        title={<h2>Customize</h2>}
        onClose={() => setCustomizeOpen(false)}
        className="storefront-builder__customize-drawer"
      >
        {customizeControls}
      </Drawer>
    </div>
  );
};

export default CreatorStorefrontPage;
