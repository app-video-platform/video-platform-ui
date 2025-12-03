import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { GalPriceSelector } from '@components';
import { GalUppyFileUploader } from '@shared/ui';
import {
  CreateProductStepOne,
  ConsultationDetails,
  CreateProductSections,
  BuilderSidebar,
  BuilderTab,
  useProductFormFacade,
  useProductFormAnimation,
  BasicInfo,
  SectionDraft,
} from '@features/product-form';
import { ProductWithSections } from '@api/types';

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
  const headerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [isSidebarStuck, setIsSidebarStuck] = useState(false);
  const [sidebarFixedStyle, setSidebarFixedStyle] =
    useState<React.CSSProperties>({});

  useEffect(() => {
    if (!formData.type) {
      return;
    }

    if (!activeTab) {
      const tab: BuilderTab =
        formData.type === 'CONSULTATION' ? 'consultation-details' : 'sections';
      setActiveTab(tab);
    }
  }, [formData.type]);

  useProductFormAnimation(container, showRestOfForm, () => {
    setHasHeroCollapsed(true);
  });

  useEffect(() => {
    const formRoot = container.current;
    if (!formRoot) {
      return;
    }

    const scrollEl = formRoot.closest('main.content') as HTMLElement | null;
    if (!scrollEl) {
      return;
    }

    const headerEl = headerRef.current;

    const handleScroll = () => {
      if (!headerEl) {
        return;
      }

      const scrollTop = scrollEl.scrollTop;

      // How far to scroll before the sidebar "locks".
      // This is basically "past the header".
      const triggerPoint = headerEl.offsetHeight;

      setIsSidebarStuck(scrollTop > triggerPoint);
    };

    // run once to set initial state
    handleScroll();

    scrollEl.addEventListener('scroll', handleScroll);
    return () => {
      scrollEl.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // --- measure sidebar position/width for the fixed state ---
  useLayoutEffect(() => {
    if (!sidebarRef.current) {
      return;
    }

    const rect = sidebarRef.current.getBoundingClientRect();

    setSidebarFixedStyle({
      position: 'fixed',
      top: 110, // <--- adjust to your app top bar height + content padding
      left: rect.left,
      width: rect.width,
      zIndex: 20,
    });
  }, [showRestOfForm]);

  if (!user || !user.id) {
    return <p>You must be logged in to create a product.</p>;
  }

  return (
    <div ref={container}>
      <div className="product-header" ref={headerRef}>
        <h1>Create New Product</h1>
        {showRestOfForm && (
          <div
            className={clsx('product-summary-header', {
              'product-summary-header__visible': hasHeroCollapsed,
            })}
          >
            <div className="product-summary-header__type-pill">
              {/* re-use same icons as ProductTypeSelector */}
              {formData.type === 'COURSE' && '🎓 Course'}
              {formData.type === 'DOWNLOAD' && '⬇️ Download'}
              {formData.type === 'CONSULTATION' && '🎧 Consultation'}
            </div>
            <div className="product-summary-header__title">{formData.name}</div>
          </div>
        )}
      </div>
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
              <div
                ref={sidebarRef}
                style={isSidebarStuck ? sidebarFixedStyle : undefined}
              >
                <BuilderSidebar
                  productType={formData.type}
                  activeTab={activeTab}
                  sections={sidebarSections} // your sections + lessons summary
                  onChange={(tab) => setActiveTab(tab)}
                  onSectionClick={handleSidebarSectionClick}
                  onLessonClick={handleSidebarLessonClick}
                />
              </div>
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
                <ConsultationDetails
                  formData={formData}
                  errors={errors}
                  setFormData={setFormData}
                  userId={user.id}
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
