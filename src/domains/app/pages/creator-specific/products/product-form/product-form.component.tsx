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
  DEFAULT_RECURRING_PRICING,
  SectionDraft,
  MembershipContentSection,
  RecurringPriceSelector,
  RecurringPricing,
  useMembershipBuilderState,
  evaluateMembershipReadiness,
  resolveMembershipIncludedProducts,
  useGlobalSaveStatus,
} from 'domains/app/features/product-form';
import { AppDispatch, ProductType, ProductWithSections } from 'core/api/models';
import {
  getProductSummariesByOwner,
  selectProductSummaries,
  selectProductsError,
  selectProductsLoading,
} from 'core/store/product-store';
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

const getInitialRecurringPricing = (): RecurringPricing =>
  process.env.REACT_APP_USE_MOCKS === 'true'
    ? {
        amount: 39,
        currency: 'EUR',
        interval: 'MONTH',
      }
    : DEFAULT_RECURRING_PRICING;

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

  const [activeTab, setActiveTab] = useState<BuilderTab | null>(null);
  const [membershipRecurringPricing, setMembershipRecurringPricing] =
    useState<RecurringPricing>(getInitialRecurringPricing);
  const membershipBuilderState = useMembershipBuilderState();
  const includedProducts = useMemo(
    () =>
      resolveMembershipIncludedProducts(
        membershipBuilderState.includedProductEntries,
        productSummaries,
      ),
    [membershipBuilderState.includedProductEntries, productSummaries],
  );
  const membershipReadiness = useMemo(() => {
    if (formData.type !== 'MEMBERSHIP') {
      return undefined;
    }

    return evaluateMembershipReadiness({
      formData,
      recurringPricing: membershipRecurringPricing,
      nativeContentItems: membershipBuilderState.nativeContentItems,
      includedProducts,
      hasThumbnail: Boolean(formData.imageUrl || productImage),
    });
  }, [
    formData,
    includedProducts,
    membershipBuilderState.nativeContentItems,
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
    isAutosaving || productsLoading,
    Boolean(errors.api || productsError),
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
                        onChange={setMembershipRecurringPricing}
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
                  nativeContentItems={membershipBuilderState.nativeContentItems}
                  feedEntries={membershipBuilderState.feedEntries}
                  orderingMode={membershipBuilderState.orderingMode}
                  includedProductEntries={
                    membershipBuilderState.includedProductEntries
                  }
                  productSummaries={productSummaries}
                  includedProducts={includedProducts}
                  isLoadingProducts={productsLoading}
                  productsError={productsError}
                  getNextNativeContentId={
                    membershipBuilderState.getNextNativeContentId
                  }
                  onAddNativeContentItem={
                    membershipBuilderState.addNativeContentItem
                  }
                  onUpdateNativeContentItem={
                    membershipBuilderState.updateNativeContentItem
                  }
                  onDeleteNativeContentItem={
                    membershipBuilderState.deleteNativeContentItem
                  }
                  onOrderingModeChange={membershipBuilderState.setOrderingMode}
                  onAddIncludedProducts={
                    membershipBuilderState.addIncludedProducts
                  }
                  onRemoveIncludedProduct={
                    membershipBuilderState.removeIncludedProduct
                  }
                  onMoveFeedEntry={membershipBuilderState.moveFeedEntry}
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
