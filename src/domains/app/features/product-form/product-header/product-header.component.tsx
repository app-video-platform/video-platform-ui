import React, { useLayoutEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import gsap from 'gsap';

import { ProductDraft } from '../models';
import { useGlobalSaveStatus } from '../hooks';
import {
  selectProductsError,
  selectProductsLoading,
} from 'core/store/product-store';
import { PRODUCT_TYPE_REGISTRY } from 'core/constants';
import { Button, InfoPopover } from '@shared/ui';
import { SavingIndicator } from 'domains/app/components';
import { MembershipReadinessResult } from '../membership-content';

import './product-header.styles.scss';

interface ProductHeaderProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  formData: ProductDraft;
  isEditMode: boolean;
  showRestOfForm: boolean;
  hasHeroCollapsed: boolean;
  headerRef: React.Ref<HTMLDivElement> | undefined;
  membershipReadiness?: MembershipReadinessResult;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  formData,
  isEditMode,
  showRestOfForm,
  hasHeroCollapsed,
  headerRef,
  membershipReadiness,
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
  const isMembership = formData.type === 'MEMBERSHIP';
  const membershipPublishMessage =
    'Membership publishing is not available yet. Content metadata can be saved, but subscriptions, entitlements, and member access are unavailable.';
  const handleMembershipPublishClick = () => {
    window.alert(membershipPublishMessage);
  };

  const renderMembershipReadiness = () => {
    if (!membershipReadiness) {
      return null;
    }

    const requirementText = membershipReadiness.canPublish
      ? 'Ready to publish'
      : 'Not ready to publish';
    const blockingIssues = membershipReadiness.errors.slice(0, 2);
    const remainingBlockers =
      membershipReadiness.errors.length - blockingIssues.length;

    return (
      <div
        className={clsx('membership-readiness-summary', {
          'membership-readiness-summary__ready': membershipReadiness.canPublish,
        })}
      >
        <div>
          <span className="membership-readiness-summary__status">
            {requirementText}
          </span>
          <span className="membership-readiness-summary__meta">
            {membershipReadiness.canPublish
              ? `${membershipReadiness.warnings.length} warnings`
              : `${membershipReadiness.errors.length} blockers`}
          </span>
        </div>
        {!membershipReadiness.canPublish && (
          <ul className="membership-readiness-summary__inline-list">
            {blockingIssues.map((issue) => (
              <li key={issue.code}>{issue.message}</li>
            ))}
            {remainingBlockers > 0 && <li>{remainingBlockers} more blockers</li>}
          </ul>
        )}
        <InfoPopover className="membership-readiness-summary__popover">
          <div className="membership-readiness-summary__popover-content">
            {membershipReadiness.errors.length > 0 && (
              <>
                <strong>Blockers</strong>
                <ul>
                  {membershipReadiness.errors.map((issue) => (
                    <li key={issue.code}>{issue.message}</li>
                  ))}
                </ul>
              </>
            )}
            {membershipReadiness.warnings.length > 0 && (
              <>
                <strong>Warnings</strong>
                <ul>
                  {membershipReadiness.warnings.map((issue) => (
                    <li key={issue.code}>{issue.message}</li>
                  ))}
                </ul>
              </>
            )}
            {membershipReadiness.canPublish && (
              <p>{membershipPublishMessage}</p>
            )}
          </div>
        </InfoPopover>
      </div>
    );
  };

  return (
    <div className="product-header" ref={headerRef}>
      <h1>{isEditMode ? 'EDIT PRODUCT' : 'CREATE NEW PRODUCT'}</h1>
      {showRestOfForm && (
        <>
          <div
            className={clsx('product-summary-header', {
              'product-summary-header__visible': hasHeroCollapsed,
            })}
          >
            <div ref={box1} className="product-summary-header__type-pill">
              {`${PRODUCT_TYPE_REGISTRY[formData.type].displayIcon} ${
                PRODUCT_TYPE_REGISTRY[formData.type].label
              }`}
            </div>
            <div ref={box2} className="product-summary-header__title">
              {formData.name}
            </div>
          </div>

          <div className="product-main-actions">
            <SavingIndicator status={saveStatus} size="sm" />
            {isMembership && renderMembershipReadiness()}
            <Button variant="secondary">Save</Button>
            {isMembership ? (
              <Button
                type="button"
                variant="primary"
                disabled
                onClick={handleMembershipPublishClick}
              >
                Publish
              </Button>
            ) : (
              <Button variant="primary">Publish</Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductHeader;
