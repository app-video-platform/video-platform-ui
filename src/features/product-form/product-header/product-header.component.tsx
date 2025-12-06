import React, { useLayoutEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import gsap from 'gsap';

import { ProductDraft } from '../models';
import { useGlobalSaveStatus } from '../hooks';
import {
  selectProductsError,
  selectProductsLoading,
} from '@store/product-store';
import { Button } from '@shared/ui';
import { SavingIndicator } from '@components';

import './product-header.styles.scss';

interface ProductHeaderProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  formData: ProductDraft;
  showRestOfForm: boolean;
  hasHeroCollapsed: boolean;
  headerRef: React.Ref<HTMLDivElement> | undefined;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  formData,
  showRestOfForm,
  hasHeroCollapsed,
  headerRef,
}) => {
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const box1 = useRef<HTMLDivElement>(null);
  const box2 = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!showRestOfForm) {
      return;
    }
    const tl = gsap.timeline();

    tl.from(box1.current, {
      x: 40,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out',
    }).from(
      box2.current,
      {
        x: 40,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
      },
      '+=0.12', // 👈 small delay between box1 and box2
    );
  }, [showRestOfForm]);

  const saveStatus = useGlobalSaveStatus(loading, Boolean(error), {
    minSavingMs: 200,
    savedVisibleMs: 2000,
  });
  return (
    <div className="product-header" ref={headerRef}>
      <h1>Create New Product</h1>
      {showRestOfForm && (
        <>
          <div
            className={clsx('product-summary-header', {
              'product-summary-header__visible': hasHeroCollapsed,
            })}
          >
            <div ref={box1} className="product-summary-header__type-pill">
              {formData.type === 'COURSE' && '🎓 Course'}
              {formData.type === 'DOWNLOAD' && '⬇️ Download'}
              {formData.type === 'CONSULTATION' && '🎧 Consultation'}
            </div>
            <div ref={box2} className="product-summary-header__title">
              {formData.name}
            </div>
          </div>

          <div className="product-main-actions">
            <SavingIndicator status={saveStatus} size="sm" />
            <Button variant="secondary">Save</Button>
            <Button variant="primary">Publish</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductHeader;
