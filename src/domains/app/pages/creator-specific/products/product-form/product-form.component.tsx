/* eslint-disable indent */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

import { GalPriceSelector } from 'domains/app/components';
import { GalUppyFileUploader } from '@shared/ui';
import {
  CreateProductStepOne,
  ConsultationDetailsSection,
  CreateProductSections,
  BuilderSidebar,
  BuilderTab,
  useProductFormFacade,
  useProductFormAnimation,
  BasicInfo,
  SectionDraft,
  MembershipContentSection,
  RecurringPriceSelector,
  RecurringPricing,
  evaluateMembershipReadiness,
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
  ProductType,
  ProductWithSections,
  RootState,
} from 'core/api/models';
import {
  getProductSummariesByOwner,
  selectProductSummaries,
  selectProductsError,
  selectProductsLoading,
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

import './product-form.styles.scss';

export interface FormErrors {
  name?: string;
  type?: string;
  api?: string;
}

const getInitialBuilderTab = (productType: ProductType): BuilderTab => {
  switch (productType) {
    case 'CONSULTATION':
      return 'consultation-details';
    case 'MEMBERSHIP':
      return 'membership-content';
    case 'COURSE':
    case 'DOWNLOAD':
      return 'sections';
    default:
      return 'basics';
  }
};

const getRecurringPricingFromProduct = (
  formData: ReturnType<typeof useProductFormFacade>['formData'],
): RecurringPricing => ({
  amount: typeof formData.price === 'number' ? formData.price : 0,
  currency: formData.currency ?? 'EUR',
  interval: formData.billingInterval ?? 'MONTH',
});

const withFeedPositions = (feed: MembershipFeedEntry[]) =>
  feed.map((entry, index) => ({ ...entry, position: index + 1 }));

const ProductForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
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
    productImage,
    handleSetPrice,
    handleImageChange,
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
  } = useProductFormFacade();

  const membershipAggregate = useSelector((state: RootState) =>
    selectMembershipAggregateByProductId(state, formData.id),
  );
  const membershipLoading = useSelector(selectMembershipLoading);
  const membershipError = useSelector(selectMembershipError);
  const membershipSaving = useSelector(selectMembershipSaving);
  const membershipSaveError = useSelector(selectMembershipSaveError);
  const [activeTab, setActiveTab] = useState<BuilderTab | null>(null);
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
  const membershipReadiness = useMemo(() => {
    if (formData.type !== 'MEMBERSHIP') {
      return undefined;
    }

    return evaluateMembershipReadiness({
      formData,
      recurringPricing: membershipRecurringPricing,
      nativeContentItems: membershipNativeContentItems,
      includedProducts,
      hasThumbnail: Boolean(formData.imageUrl || productImage),
    });
  }, [
    formData,
    includedProducts,
    membershipNativeContentItems,
    membershipRecurringPricing,
    productImage,
  ]);
  const [hasHeroCollapsed, setHasHeroCollapsed] = useState(false);
  const [pendingSidebarScrollTarget, setPendingSidebarScrollTarget] = useState<{
    id: string;
    type: 'section' | 'lesson';
  } | null>(null);

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!formData.type || !showRestOfForm) {
      return;
    }

    if (!activeTab) {
      setActiveTab(getInitialBuilderTab(formData.type));
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

  const isMembership = formData.type === 'MEMBERSHIP';
  const canPublish = showRestOfForm && !isMembership;
  const publishDisabledReason = isMembership
    ? membershipReadiness?.canPublish
      ? 'Membership publishing will be enabled once Membership persistence is available.'
      : 'Resolve membership requirements before publishing. Membership publishing will be enabled once Membership persistence is available.'
    : undefined;

  const updateMembershipFeedForCurrentProduct = (
    feed: MembershipFeedEntry[],
    orderingMode: MembershipOrderingMode = membershipOrderingMode,
  ) => {
    if (!formData.id) {
      return;
    }

    dispatch(
      updateMembershipFeed({
        productId: formData.id,
        payload: {
          orderingMode,
          feed: withFeedPositions(feed),
        },
      }),
    );
  };

  const handleMembershipRecurringPricingChange = (pricing: RecurringPricing) => {
    setField('price', pricing.amount);
    setField('pricingModel', 'RECURRING');
    setField('currency', pricing.currency);
    setField('billingInterval', pricing.interval);
  };

  const handleCreateMembershipContent = (
    payload: MembershipContentCreateRequest,
  ) => {
    if (!formData.id) {
      return;
    }

    dispatch(createMembershipContent({ productId: formData.id, payload }))
      .unwrap()
      .then((result) => {
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

        updateMembershipFeedForCurrentProduct(nextFeed);
      });
  };

  const handleUpdateMembershipContent = (
    contentId: string,
    payload: MembershipContentUpdateRequest,
  ) => {
    if (!formData.id) {
      return;
    }

    dispatch(
      updateMembershipContent({
        productId: formData.id,
        contentId,
        payload,
      }),
    );
  };

  const handleDeleteMembershipContent = (contentId: string) => {
    if (!formData.id) {
      return;
    }

    dispatch(deleteMembershipContent({ productId: formData.id, contentId }));
  };

  const handleMembershipOrderingModeChange = (
    orderingMode: MembershipOrderingMode,
  ) => {
    const nextFeed =
      orderingMode === 'MANUAL' && membershipOrderingMode === 'NEWEST_FIRST'
        ? orderMembershipFeedEntries(membershipFeedEntries, 'NEWEST_FIRST')
        : membershipFeedEntries;

    updateMembershipFeedForCurrentProduct(nextFeed, orderingMode);
  };

  const handleAddIncludedProducts = (productIds: string[], addedAt: string) => {
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

    updateMembershipFeedForCurrentProduct(
      membershipOrderingMode === 'MANUAL'
        ? [...newEntries, ...membershipFeedEntries]
        : [...membershipFeedEntries, ...newEntries],
    );
  };

  const handleRemoveIncludedProduct = (productId?: string) => {
    if (!productId) {
      return;
    }

    updateMembershipFeedForCurrentProduct(
      membershipFeedEntries.filter(
        (entry) => entry.kind !== 'PRODUCT' || entry.productId !== productId,
      ),
    );
  };

  const handleMoveMembershipFeedEntry = (
    entryId: string,
    direction: 'UP' | 'DOWN',
  ) => {
    if (membershipOrderingMode !== 'MANUAL') {
      return;
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
      return;
    }

    const nextFeed = [...membershipFeedEntries];
    const currentEntry = nextFeed[currentIndex];

    nextFeed[currentIndex] = nextFeed[nextIndex];
    nextFeed[nextIndex] = currentEntry;

    updateMembershipFeedForCurrentProduct(nextFeed);
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
      canPublish={canPublish}
      publishDisabledReason={publishDisabledReason}
      navigation={workspaceNavigation}
    >
      <div ref={container}>
        <form id="product-builder-form" onSubmit={handleSubmit}>
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
              {activeTab === 'basics' && (
                <BasicInfo
                  formData={formData}
                  setField={setField}
                  showOnlyCurrentType={isEditMode}
                />
              )}

              {activeTab === 'pricing' && (
                <div className="price-selector-wrapper">
                  {formData.type === 'MEMBERSHIP' ? (
                    <>
                      <h3>Membership price</h3>
                      <RecurringPriceSelector
                        value={membershipRecurringPricing}
                        onChange={handleMembershipRecurringPricingChange}
                      />
                    </>
                  ) : (
                    <>
                      <h3>Choose Your Price Option</h3>
                      <GalPriceSelector
                        price={formData.price ?? 0}
                        setPrice={handleSetPrice}
                      />
                    </>
                  )}
                </div>
              )}

              {activeTab === 'sections' && (
                <CreateProductSections
                  sections={(formData as ProductWithSections).sections ?? []}
                  productType={formData.type}
                  productId={formData.id ?? ''}
                  onSectionsChange={(sections) =>
                    setField('sections', sections as SectionDraft[])
                  }
                />
              )}

              {activeTab === 'consultation-details' && (
                <ConsultationDetailsSection
                  formData={formData}
                  errors={errors}
                  setFormData={setFormData}
                />
              )}

              {activeTab === 'membership-content' && (
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
              )}

              {activeTab === 'media' && (
                <div className="image-uploader">
                  <div className="image-uploader-box">
                    <h3>Upload an image</h3>
                  </div>
                  <div className="image-uploader-box">
                    <GalUppyFileUploader
                      onFilesChange={handleImageChange}
                      allowedFileTypes={['image/*']}
                      disableImporters={true}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        </form>
      </div>
    </ProductWorkspaceShell>
  );
};

export default ProductForm;
