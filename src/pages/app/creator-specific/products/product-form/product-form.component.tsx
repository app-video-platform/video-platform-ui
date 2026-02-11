import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { GalPriceSelector } from '@components';
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
  ProductHeader,
} from '@features/product-form';
import { ProductWithSections } from '@api/models';

import './product-form.styles.scss';

export interface FormErrors {
  name?: string;
  type?: string;
  api?: string;
}

const ProductForm: React.FC = () => {
  const {
    user,
    formData,
    setFormData,
    setField,
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
  } = useProductFormFacade();

  const [activeTab, setActiveTab] = useState<BuilderTab | null>(null);
  const [hasHeroCollapsed, setHasHeroCollapsed] = useState(false);

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!formData.type || !showRestOfForm) {
      return;
    }

    if (!activeTab) {
      const tab: BuilderTab =
        formData.type === 'CONSULTATION' ? 'consultation-details' : 'sections';
      setActiveTab(tab);
    }
  }, [formData.type, showRestOfForm]);

  useProductFormAnimation(container, showRestOfForm, () => {
    setHasHeroCollapsed(true);
  });

  if (!user || !user.id) {
    return <p>You must be logged in to create a product.</p>;
  }

  return (
    <div ref={container}>
      <ProductHeader
        formData={formData}
        hasHeroCollapsed={hasHeroCollapsed}
        showRestOfForm={showRestOfForm}
        headerRef={undefined}
      />

      <form onSubmit={handleSubmit}>
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
              userId={user?.id}
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
            <div className="product-create-sidebar">
              <BuilderSidebar
                productType={formData.type}
                activeTab={activeTab}
                sections={sidebarSections} // your sections + lessons summary
                onChange={(tab) => setActiveTab(tab)}
                onSectionClick={handleSidebarSectionClick}
                onLessonClick={handleSidebarLessonClick}
              />
            </div>

            <div className="product-create-section">
              {activeTab === 'basics' && (
                <BasicInfo formData={formData} setField={setField} />
              )}

              {activeTab === 'pricing' && (
                <div className="price-selector-wrapper">
                  <h3>Choose Your Price Option</h3>
                  <GalPriceSelector
                    price={formData.price ?? 0}
                    setPrice={handleSetPrice}
                  />
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
  );
};

export default ProductForm;
