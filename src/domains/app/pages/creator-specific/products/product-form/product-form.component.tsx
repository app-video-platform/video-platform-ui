/* eslint-disable indent */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { Button } from '@shared/ui';
import {
  CreateProductStepOne,
  ConsultationDetailsSection,
  CreateProductSections,
  BuilderSidebar,
  BuilderTab,
  useProductFormFacade,
  useProductFormAnimation,
  BasicInfo,
  ProductPricingSection,
  ProductMediaSection,
  ProductReadinessSection,
  SectionDraft,
  MembershipContentSection,
  RecurringPricing,
  evaluateProductReadiness,
  MEMBERSHIP_DEFAULT_ORDERING_MODE,
  MembershipContentItem,
  MembershipFeedEntry,
  MembershipOrderingMode,
  MembershipProductFeedEntry,
  orderMembershipFeedEntries,
  resolveMembershipIncludedProducts,
  useGlobalSaveStatus,
} from 'domains/app/features/product-form';
import {
  AppDispatch,
  MembershipContentCreateRequest,
  MembershipContentUpdateRequest,
  ProductGalleryImage,
  ProductPromoVideo,
  ProductWithSections,
  RootState,
} from 'core/api/models';
import { appRoutes } from 'domains/app/routes/routes';
import {
  addImageToProduct,
  addProductGalleryImage,
  addProductPromoVideo,
  getProductSummariesByOwner,
  removeImageFromProduct,
  removeProductGalleryImage,
  removeProductPromoVideo,
  reorderProductGalleryImages,
  selectProductSummaries,
  selectProductsError,
  selectProductsLoading,
  updateProductDetails,
} from 'core/store/product-store';
import {
  createMembershipContent,
  deleteMembershipContent,
  fetchMembershipAggregate,
  selectMembershipAggregateByProductId,
  selectMembershipError,
  selectMembershipLoading,
  selectMembershipSaveError,
  selectMembershipSaving,
  updateMembershipContent,
  updateMembershipFeed,
} from 'core/store/membership-store';
import { ProductWorkspaceShell } from 'domains/app/layouts/product-workspace-shell';
import { mapFormDataToProductPayload } from 'domains/app/features/product-form/utils/form-data-mapper.utils';

import './product-form.styles.scss';

export interface FormErrors {
  name?: string;
  type?: string;
  price?: string;
  api?: string;
}

const getInitialBuilderTab = (): BuilderTab => 'basics';

const getRecurringPricingFromProduct = (
  formData: ReturnType<typeof useProductFormFacade>['formData'],
): RecurringPricing => ({
  amount: typeof formData.price === 'number' ? formData.price : 0,
  currency: formData.currency ?? 'EUR',
  interval: formData.billingInterval ?? 'MONTH',
});

const withFeedPositions = (feed: MembershipFeedEntry[]) =>
  feed.map((entry, index) => ({ ...entry, position: index + 1 }));

const tabCopy: Record<BuilderTab, { title: string; description: string }> = {
  basics: {
    title: 'Basics',
    description: 'Set the Product identity and core customer-facing description.',
  },
  pricing: {
    title: 'Pricing',
    description: 'Configure how customers pay for this Product.',
  },
  sections: {
    title: 'Content structure',
    description: 'Organize the Product content that customers receive after access.',
  },
  'consultation-details': {
    title: 'Availability',
    description: 'Configure the session details used for Consultation bookings.',
  },
  'membership-content': {
    title: 'Membership content',
    description: 'Manage the member-only feed and included Products.',
  },
  media: {
    title: 'Media',
    description: 'Manage Product-owned presentation media used across Storefront and Product pages.',
  },
  readiness: {
    title: 'Readiness',
    description: 'Review known publish blockers and backend-pending lifecycle requirements.',
  },
};

const ProductForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const productSummaries = useSelector(selectProductSummaries);
  const productsLoading = useSelector(selectProductsLoading);
  const productsError = useSelector(selectProductsError);
  const {
    user,
    isEditMode,
    productOwnerId,
    formData,
    setFormData,
    setField,
    showRestOfForm,
    setShowRestOfForm,
    showLoadingRestOfForm,
    setShowLoadingRestOfForm,
    errors,
    handleSubmit,
    handleSidebarSectionClick,
    handleSidebarLessonClick,
    sidebarSections,
    isAutosaving,
    hasPendingAutosave,
    flushAutosave,
  } = useProductFormFacade();

  const membershipAggregate = useSelector((state: RootState) =>
    selectMembershipAggregateByProductId(state, formData.id),
  );
  const membershipLoading = useSelector(selectMembershipLoading);
  const membershipError = useSelector(selectMembershipError);
  const membershipSaving = useSelector(selectMembershipSaving);
  const membershipSaveError = useSelector(selectMembershipSaveError);
  const [activeTab, setActiveTab] = useState<BuilderTab | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const membershipRecurringPricing = useMemo(
    () => getRecurringPricingFromProduct(formData),
    [formData],
  );
  const membershipNativeContentItems =
    membershipAggregate?.content ?? [] as MembershipContentItem[];
  const membershipFeedEntries = membershipAggregate?.feed ?? [];
  const membershipOrderingMode =
    membershipAggregate?.config.orderingMode ?? MEMBERSHIP_DEFAULT_ORDERING_MODE;
  const membershipIncludedProductEntries = membershipFeedEntries.filter(
    (entry): entry is MembershipProductFeedEntry => entry.kind === 'PRODUCT',
  );
  const includedProducts = useMemo(
    () =>
      resolveMembershipIncludedProducts(
        membershipIncludedProductEntries,
        productSummaries,
      ),
    [membershipIncludedProductEntries, productSummaries],
  );
  const isMembershipReadinessLoading = Boolean(
    formData.type === 'MEMBERSHIP' &&
      showRestOfForm &&
      (!membershipAggregate || membershipLoading),
  );
  const readinessResult = useMemo(() => evaluateProductReadiness({
    formData,
    recurringPricing: membershipRecurringPricing,
    membershipNativeContentItems,
    membershipIncludedProducts: includedProducts,
    isMembershipLoading: isMembershipReadinessLoading,
  }), [
    formData,
    includedProducts,
    isMembershipReadinessLoading,
    membershipNativeContentItems,
    membershipRecurringPricing,
  ]);
  const [hasHeroCollapsed, setHasHeroCollapsed] = useState(false);
  const [pendingSidebarScrollTarget, setPendingSidebarScrollTarget] = useState<{
    id: string;
    type: 'section' | 'lesson';
  } | null>(null);

  const container = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!formData.type || !showRestOfForm) {
      return;
    }

    if (!activeTab) {
      setActiveTab(getInitialBuilderTab());
    }
  }, [formData.type, showRestOfForm]);

  useEffect(() => {
    if (
      formData.type !== 'MEMBERSHIP' ||
      !showRestOfForm ||
      !productOwnerId ||
      productSummaries ||
      productsLoading
    ) {
      return;
    }

    dispatch(getProductSummariesByOwner(productOwnerId));
  }, [
    dispatch,
    formData.type,
    productOwnerId,
    productSummaries,
    productsLoading,
    showRestOfForm,
  ]);

  useEffect(() => {
    if (formData.type !== 'MEMBERSHIP' || !formData.id || !showRestOfForm) {
      return;
    }

    if (membershipAggregate || membershipLoading) {
      return;
    }

    dispatch(fetchMembershipAggregate(formData.id));
  }, [
    dispatch,
    formData.id,
    formData.type,
    membershipAggregate,
    membershipLoading,
    showRestOfForm,
  ]);

  useEffect(() => {
    if (activeTab !== 'sections' || !pendingSidebarScrollTarget) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (pendingSidebarScrollTarget.type === 'section') {
        handleSidebarSectionClick(pendingSidebarScrollTarget.id);
      } else {
        handleSidebarLessonClick(pendingSidebarScrollTarget.id);
      }

      setPendingSidebarScrollTarget(null);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [
    activeTab,
    pendingSidebarScrollTarget,
    handleSidebarLessonClick,
    handleSidebarSectionClick,
  ]);

  const handleSidebarSectionNavigation = (sectionId: string) => {
    if (activeTab === 'sections') {
      handleSidebarSectionClick(sectionId);
      return;
    }

    setPendingSidebarScrollTarget({ id: sectionId, type: 'section' });
    setActiveTab('sections');
  };

  const handleSidebarLessonNavigation = (lessonId: string) => {
    if (activeTab === 'sections') {
      handleSidebarLessonClick(lessonId);
      return;
    }

    setPendingSidebarScrollTarget({ id: lessonId, type: 'lesson' });
    setActiveTab('sections');
  };

  useProductFormAnimation(container, showRestOfForm, () => {
    setHasHeroCollapsed(true);
  });
  const saveStatus = useGlobalSaveStatus(
    isAutosaving || productsLoading || membershipSaving,
    Boolean(errors.api || productsError || membershipSaveError),
    {
      minSavingMs: 200,
      savedVisibleMs: 2000,
    },
  );

  if (!user || !user.id) {
    return <p>You must be logged in to create a product.</p>;
  }

  if (!isEditMode && !productOwnerId) {
    return <p>Select a creator owner before creating a product.</p>;
  }

  if (isEditMode && productsLoading && !showRestOfForm) {
    return (
      <ProductWorkspaceShell
        productType={formData.type}
        productTitle={formData.name}
        productStatus={formData.status}
        isEditMode={isEditMode}
        showWorkspace={false}
        saveStatus="idle"
        onBack={() => navigate(appRoutes.products)}
      >
        <main className="product-builder-state" aria-busy="true">
          <h1>Loading Product workspace</h1>
          <p>Preparing this Product for editing.</p>
        </main>
      </ProductWorkspaceShell>
    );
  }

  if (isEditMode && errors.api && !showRestOfForm) {
    return (
      <ProductWorkspaceShell
        productType={formData.type}
        productTitle={formData.name}
        productStatus={formData.status}
        isEditMode={isEditMode}
        showWorkspace={false}
        saveStatus="error"
        onBack={() => navigate(appRoutes.products)}
      >
        <main className="product-builder-state" role="alert">
          <h1>Product workspace unavailable</h1>
          <p>{errors.api}</p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(appRoutes.products)}
          >
            Back to Products
          </Button>
        </main>
      </ProductWorkspaceShell>
    );
  }

  const hasReadinessBlockers = readinessResult.blockers.length > 0 ||
    readinessResult.isEvaluating;
  const isPublished = formData.status === 'PUBLISHED';
  const isMembership = formData.type === 'MEMBERSHIP';
  const canPreview = Boolean(formData.id);
  const previewDisabledReason = formData.id
    ? undefined
    : 'Save this Product before opening a private preview.';
  const publishHelpText = isPublished
    ? 'This Product is already published. Unpublish is not part of the current MVP lifecycle.'
    : isMembership
    ? 'Membership publishing is not available yet. Content metadata can be saved, but subscriptions, entitlements, and member access are unavailable.'
    : hasReadinessBlockers
    ? 'Publish will open Readiness until known blockers are resolved.'
    : 'Publish currently uses the temporary Product update flow; backend lifecycle validation remains pending.';

  const handleWorkspaceBack = async () => {
    try {
      await flushAutosave();
      navigate(appRoutes.products);
    } catch {
      const shouldLeave = window.confirm(
        'Latest Product changes could not be saved. Leave the workspace anyway?',
      );

      if (shouldLeave) {
        navigate(appRoutes.products);
      }
    }
  };

  const handlePreview = () => {
    if (!formData.id || !canPreview) {
      return;
    }

    navigate(appRoutes.productsPreview(formData.id));
  };

  const handlePublish = async () => {
    if (isPublished || isPublishing || isMembership) {
      return;
    }

    setPublishError(null);

    try {
      setIsPublishing(true);
      await flushAutosave();
    } catch {
      setActiveTab('readiness');
      setPublishError('Latest Product changes could not be saved. Resolve the save issue and try Publish again.');
      setIsPublishing(false);
      return;
    }

    if (hasReadinessBlockers) {
      setActiveTab('readiness');
      setPublishError(
        readinessResult.isEvaluating
          ? 'Readiness is still evaluating required Product data. Try again once it finishes loading.'
          : 'Resolve blockers before publishing this Product.',
      );
      setIsPublishing(false);
      return;
    }

    try {
      const payload = mapFormDataToProductPayload(
        {
          ...formData,
          status: 'PUBLISHED',
        },
        user,
      );
      const updatedProduct = await dispatch(updateProductDetails(payload)).unwrap();
      setField('status', updatedProduct.status ?? 'PUBLISHED');
    } catch {
      setPublishError('Publish failed. Check the Product details and try again.');
      setActiveTab('readiness');
    } finally {
      setIsPublishing(false);
    }
  };

  const renderReadinessPanel = () => (
    <ProductReadinessSection
      result={readinessResult}
      publishError={publishError}
      onNavigateToDestination={(destination) => setActiveTab(destination)}
    />
  );

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'basics':
        return (
          <BasicInfo
            formData={formData}
            setField={setField}
            errors={errors}
            isEditMode={isEditMode}
          />
        );

      case 'pricing':
        return (
          <ProductPricingSection
            formData={formData}
            setField={setField}
            onMembershipRecurringPricingChange={
              handleMembershipRecurringPricingChange
            }
          />
        );

      case 'sections':
        return (
          <CreateProductSections
            sections={(formData as ProductWithSections).sections ?? []}
            productType={formData.type}
            productId={formData.id ?? ''}
            onSectionsChange={(sections) =>
              setField('sections', sections as SectionDraft[])
            }
          />
        );

      case 'consultation-details':
        return (
          <ConsultationDetailsSection
            formData={formData}
            errors={errors}
            setFormData={setFormData}
          />
        );

      case 'membership-content':
        return (
          <MembershipContentSection
            ownerId={productOwnerId}
            currentProductId={formData.id}
            nativeContentItems={membershipNativeContentItems}
            feedEntries={membershipFeedEntries}
            orderingMode={membershipOrderingMode}
            includedProductEntries={membershipIncludedProductEntries}
            productSummaries={productSummaries}
            includedProducts={includedProducts}
            isLoadingProducts={productsLoading || membershipLoading}
            productsError={productsError || membershipError}
            onAddNativeContentItem={handleCreateMembershipContent}
            onUpdateNativeContentItem={handleUpdateMembershipContent}
            onDeleteNativeContentItem={handleDeleteMembershipContent}
            onOrderingModeChange={handleMembershipOrderingModeChange}
            onAddIncludedProducts={handleAddIncludedProducts}
            onRemoveIncludedProduct={handleRemoveIncludedProduct}
            onMoveFeedEntry={handleMoveMembershipFeedEntry}
          />
        );

      case 'media':
        return (
          <ProductMediaSection
            productId={formData.id}
            productTitle={formData.name}
            thumbnailUrl={formData.imageUrl}
            galleryImages={formData.galleryImages as ProductGalleryImage[]}
            promoVideo={formData.promoVideo as ProductPromoVideo | null}
            onUploadThumbnail={handleUploadThumbnail}
            onRemoveThumbnail={handleRemoveThumbnail}
            onAddGalleryImage={handleAddGalleryImage}
            onRemoveGalleryImage={handleRemoveGalleryImage}
            onReorderGalleryImages={handleReorderGalleryImages}
            onUploadPromoVideo={handleUploadPromoVideo}
            onRemovePromoVideo={handleRemovePromoVideo}
          />
        );

      case 'readiness':
        return renderReadinessPanel();

      default:
        return null;
    }
  };

  const updateMembershipFeedForCurrentProduct = async (
    feed: MembershipFeedEntry[],
    orderingMode: MembershipOrderingMode = membershipOrderingMode,
  ) => {
    if (!formData.id) {
      throw new Error('Save this Membership before updating its content feed.');
    }

    await dispatch(
      updateMembershipFeed({
        productId: formData.id,
        payload: {
          orderingMode,
          feed: withFeedPositions(feed),
        },
      }),
    ).unwrap();
  };

  const handleMembershipRecurringPricingChange = (pricing: RecurringPricing) => {
    setField('price', pricing.amount);
    setField('pricingModel', 'RECURRING');
    setField('currency', pricing.currency);
    setField('billingInterval', pricing.interval);
  };

  const handleCreateMembershipContent = async (
    payload: MembershipContentCreateRequest,
  ) => {
    if (!formData.id) {
      throw new Error('Save this Membership before adding content.');
    }

    const result = await dispatch(
      createMembershipContent({ productId: formData.id, payload }),
    ).unwrap();

    const newEntry: MembershipFeedEntry = {
      entryId: `content:${result.content.id}`,
      kind: 'CONTENT',
      contentId: result.content.id,
      addedAt: result.content.createdAt,
    };
    const nextFeed =
      membershipOrderingMode === 'MANUAL'
        ? [newEntry, ...membershipFeedEntries]
        : [...membershipFeedEntries, newEntry];

    try {
      await updateMembershipFeedForCurrentProduct(nextFeed);
    } catch {
      try {
        await updateMembershipFeedForCurrentProduct(nextFeed);
      } catch {
        throw new Error(
          'Content was created, but it could not be attached to the Membership feed. Try again after the feed saves.',
        );
      }
    }
  };

  const handleUpdateMembershipContent = async (
    contentId: string,
    payload: MembershipContentUpdateRequest,
  ) => {
    if (!formData.id) {
      throw new Error('Save this Membership before updating content.');
    }

    await dispatch(
      updateMembershipContent({
        productId: formData.id,
        contentId,
        payload,
      }),
    ).unwrap();
  };

  const handleDeleteMembershipContent = async (contentId: string) => {
    if (!formData.id) {
      throw new Error('Save this Membership before deleting content.');
    }

    await dispatch(
      deleteMembershipContent({ productId: formData.id, contentId }),
    ).unwrap();
  };

  const handleMembershipOrderingModeChange = async (
    orderingMode: MembershipOrderingMode,
  ) => {
    const nextFeed =
      orderingMode === 'MANUAL' && membershipOrderingMode === 'NEWEST_FIRST'
        ? orderMembershipFeedEntries(membershipFeedEntries, 'NEWEST_FIRST')
        : membershipFeedEntries;

    await updateMembershipFeedForCurrentProduct(nextFeed, orderingMode);
  };

  const handleAddIncludedProducts = async (
    productIds: string[],
    addedAt: string,
  ) => {
    const existingProductIds = new Set(
      membershipIncludedProductEntries.map((entry) => entry.productId),
    );
    const newEntries = productIds
      .filter((productId) => !existingProductIds.has(productId))
      .map<MembershipFeedEntry>((productId) => ({
        entryId: `product:${productId}`,
        kind: 'PRODUCT',
        productId,
        addedAt,
      }));

    if (newEntries.length === 0) {
      return;
    }

    await updateMembershipFeedForCurrentProduct(
      membershipOrderingMode === 'MANUAL'
        ? [...newEntries, ...membershipFeedEntries]
        : [...membershipFeedEntries, ...newEntries],
    );
  };

  const handleRemoveIncludedProduct = async (productId?: string) => {
    if (!productId) {
      return;
    }

    await updateMembershipFeedForCurrentProduct(
      membershipFeedEntries.filter(
        (entry) => entry.kind !== 'PRODUCT' || entry.productId !== productId,
      ),
    );
  };

  const handleMoveMembershipFeedEntry = async (
    entryId: string,
    direction: 'UP' | 'DOWN',
  ) => {
    if (membershipOrderingMode !== 'MANUAL') {
      throw new Error('Switch to Manual order before moving feed entries.');
    }

    const currentIndex = membershipFeedEntries.findIndex(
      (entry) => entry.entryId === entryId,
    );
    const nextIndex = direction === 'UP' ? currentIndex - 1 : currentIndex + 1;

    if (
      currentIndex === -1 ||
      nextIndex < 0 ||
      nextIndex >= membershipFeedEntries.length
    ) {
      throw new Error('This feed entry cannot move any farther.');
    }

    const nextFeed = [...membershipFeedEntries];
    const currentEntry = nextFeed[currentIndex];

    nextFeed[currentIndex] = nextFeed[nextIndex];
    nextFeed[nextIndex] = currentEntry;

    await updateMembershipFeedForCurrentProduct(nextFeed);
  };

  const handleUploadThumbnail = async (file: File) => {
    if (!formData.id) {
      throw new Error('Save this Product before uploading a thumbnail.');
    }

    const result = await dispatch(
      addImageToProduct({ productId: formData.id, image: file }),
    ).unwrap();
    setField('imageUrl', result.imageUrl);

    return result.imageUrl;
  };

  const handleRemoveThumbnail = async () => {
    if (!formData.id) {
      throw new Error('Save this Product before removing a thumbnail.');
    }

    await dispatch(removeImageFromProduct({ productId: formData.id })).unwrap();
    setField('imageUrl', undefined);
  };

  const handleAddGalleryImage = async (file: File) => {
    if (!formData.id) {
      throw new Error('Save this Product before adding gallery images.');
    }

    const result = await dispatch(
      addProductGalleryImage({ productId: formData.id, image: file }),
    ).unwrap();
    setFormData((currentFormData) => ({
      ...currentFormData,
      galleryImages: [...(currentFormData.galleryImages ?? []), result.image]
        .slice()
        .sort((first, second) => first.position - second.position),
    }));

    return result.image;
  };

  const handleRemoveGalleryImage = async (imageId: string) => {
    if (!formData.id) {
      throw new Error('Save this Product before removing gallery images.');
    }

    await dispatch(
      removeProductGalleryImage({ productId: formData.id, imageId }),
    ).unwrap();
    setField(
      'galleryImages',
      (formData.galleryImages ?? [])
        .filter((image) => image.id !== imageId)
        .map((image, index) => ({ ...image, position: index + 1 })),
    );
  };

  const handleReorderGalleryImages = async (imageIds: string[]) => {
    if (!formData.id) {
      throw new Error('Save this Product before reordering gallery images.');
    }

    const result = await dispatch(
      reorderProductGalleryImages({ productId: formData.id, imageIds }),
    ).unwrap();
    setField('galleryImages', result.images);

    return result.images;
  };

  const handleUploadPromoVideo = async (file: File) => {
    if (!formData.id) {
      throw new Error('Save this Product before uploading a promo video.');
    }

    const result = await dispatch(
      addProductPromoVideo({ productId: formData.id, video: file }),
    ).unwrap();
    setField('promoVideo', result.promoVideo);

    return result.promoVideo;
  };

  const handleRemovePromoVideo = async () => {
    if (!formData.id) {
      throw new Error('Save this Product before removing a promo video.');
    }

    await dispatch(removeProductPromoVideo({ productId: formData.id })).unwrap();
    setField('promoVideo', null);
  };

  const workspaceNavigation =
    showRestOfForm && activeTab ? (
      <BuilderSidebar
        productType={formData.type}
        activeTab={activeTab}
        sections={sidebarSections}
        onChange={(tab) => setActiveTab(tab)}
        onSectionClick={handleSidebarSectionNavigation}
        onLessonClick={handleSidebarLessonNavigation}
      />
    ) : null;

  return (
    <ProductWorkspaceShell
      productType={formData.type}
      productTitle={formData.name}
      productStatus={formData.status}
      isEditMode={isEditMode}
      showWorkspace={showRestOfForm}
      saveStatus={saveStatus}
      hasPendingAutosave={hasPendingAutosave}
      canPublish={showRestOfForm && !isPublished && !isPublishing && !isMembership}
      publishDisabledReason={
        isPublished
          ? 'This Product is already published.'
          : isMembership
          ? 'Membership publishing is not available yet.'
          : undefined
      }
      isPublishing={isPublishing}
      canPreview={canPreview}
      previewDisabledReason={previewDisabledReason}
      publishHelpText={publishHelpText}
      onBack={handleWorkspaceBack}
      onPreview={handlePreview}
      onPublish={handlePublish}
      navigation={workspaceNavigation}
    >
      <div ref={container}>
        <form id="product-builder-form" ref={formRef} onSubmit={handleSubmit}>
        {!showRestOfForm && (
          <div
            className={clsx('product-create-hero', {
              'product-create-hero__collapsed': showRestOfForm,
              'product-create-hero__hidden': hasHeroCollapsed,
            })}
          >
            <CreateProductStepOne
              formData={formData}
              setField={setField}
              errors={errors}
              showRestOfForm={showRestOfForm}
              setShowRestOfForm={setShowRestOfForm}
              setShowLoadingRestOfForm={setShowLoadingRestOfForm}
              userId={productOwnerId ?? ''}
            />
          </div>
        )}

        {showLoadingRestOfForm && <p>Loading...</p>}

        {showRestOfForm && activeTab && (
          <div
            className={clsx('product-builder', {
              'product-builder__full': showRestOfForm,
            })}
          >
            <div className="product-create-section">
              <section
                id={`tab-panel-${activeTab}`}
                className="product-builder-panel"
                role="tabpanel"
                aria-labelledby={`builder-tab-${activeTab}`}
              >
                <div className="product-builder-panel__header">
                  <h2>{tabCopy[activeTab].title}</h2>
                  <p>{tabCopy[activeTab].description}</p>
                </div>
                <div className="product-builder-panel__body">
                  {renderActiveTabContent()}
                </div>
              </section>
            </div>
          </div>
        )}
        </form>
      </div>
    </ProductWorkspaceShell>
  );
};

export default ProductForm;
