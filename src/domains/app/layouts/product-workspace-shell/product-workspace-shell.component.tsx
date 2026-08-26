import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiDotsVertical } from 'react-icons/hi';
import { FiExternalLink } from 'react-icons/fi';

import { ProductStatus, ProductType } from 'core/api/models';
import { PRODUCT_TYPE_REGISTRY } from 'core/constants';
import { Button, Icon, StatusBadge, StatusBadgeTone } from '@shared/ui';
import { getCssVar } from '@shared/utils';
import { SavingIndicator } from 'domains/app/components';
import { SaveStatus } from 'domains/app/features/product-form';
import { appRoutes } from 'domains/app/routes/routes';

import './product-workspace-shell.styles.scss';

interface ProductWorkspaceShellProps {
  productType?: ProductType;
  productTitle?: string;
  productStatus?: ProductStatus;
  isEditMode: boolean;
  showWorkspace: boolean;
  saveStatus: SaveStatus;
  hasPendingAutosave?: boolean;
  canPublish?: boolean;
  publishDisabledReason?: string;
  isPublishing?: boolean;
  canPreview?: boolean;
  previewDisabledReason?: string;
  publishHelpText?: string;
  onBack?: () => Promise<void> | void;
  onPreview?: () => void;
  onPublish?: () => void;
  navigation?: React.ReactNode;
  children: React.ReactNode;
}

const statusTone: Record<ProductStatus, StatusBadgeTone> = {
  DRAFT: 'neutral',
  PUBLISHED: 'success',
  HIDDEN: 'warning',
};

const statusLabel: Record<ProductStatus, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  HIDDEN: 'Hidden',
};

const ProductWorkspaceShell: React.FC<ProductWorkspaceShellProps> = ({
  productType,
  productTitle,
  productStatus,
  isEditMode,
  showWorkspace,
  saveStatus,
  hasPendingAutosave = false,
  canPublish = true,
  publishDisabledReason,
  isPublishing = false,
  canPreview = false,
  previewDisabledReason,
  publishHelpText,
  onBack,
  onPreview,
  onPublish,
  navigation,
  children,
}) => {
  const navigate = useNavigate();
  const typeLabel = productType
    ? PRODUCT_TYPE_REGISTRY[productType].label
    : 'Product';
  const typeIcon = productType
    ? PRODUCT_TYPE_REGISTRY[productType].displayIcon
    : undefined;
  const title =
    productTitle?.trim() ||
    (isEditMode ? 'Untitled product' : 'Create product');
  const handleBack = async () => {
    if (onBack) {
      await onBack();
      return;
    }

    navigate(appRoutes.products);
  };

  return (
    <div className="product-workspace-shell">
      <header className="product-workspace-shell__header">
        <div className="product-workspace-shell__identity">
          <Button
            type="button"
            variant="tertiary"
            className="product-workspace-shell__back"
            onClick={handleBack}
          >
            <Icon
              icon={HiArrowLeft}
              size={18}
              color={getCssVar('--brand-primary')}
            />
            <span>Products</span>
          </Button>
          <div className="product-workspace-shell__meta">
            <span className="product-workspace-shell__type">
              {typeIcon && <span aria-hidden="true">{typeIcon}</span>}
              {typeLabel}
            </span>
            <h1>{title}</h1>
          </div>
          {productStatus && (
            <StatusBadge
              label={statusLabel[productStatus]}
              tone={statusTone[productStatus]}
              size="sm"
            />
          )}
        </div>

        {showWorkspace && (
          <div className="product-workspace-shell__actions">
            <div className="product-workspace-shell__save-state" aria-live="polite">
              {hasPendingAutosave && saveStatus === 'idle' ? (
                <span>Unsaved changes</span>
              ) : (
                <SavingIndicator status={saveStatus} size="sm" />
              )}
            </div>
            <Button
              type="button"
              variant="secondary"
              disabled={!canPreview}
              title={!canPreview ? previewDisabledReason : undefined}
              onClick={onPreview}
              trailingIcon={
                canPreview ? (
                  <Icon
                    icon={FiExternalLink}
                    size={15}
                    color="currentColor"
                  />
                ) : undefined
              }
            >
              Preview
            </Button>
            <Button
              type="button"
              variant="tertiary"
              size="icon"
              className="product-workspace-shell__overflow"
              aria-label="More product actions"
              title="More product actions are planned for a later Product Builder phase."
              disabled
            >
              <Icon
                icon={HiDotsVertical}
                size={18}
                color={getCssVar('--text-secondary')}
              />
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={!canPublish || isPublishing}
              title={!canPublish ? publishDisabledReason : undefined}
              loading={isPublishing}
              aria-busy={isPublishing}
              onClick={onPublish}
            >
              {productStatus === 'PUBLISHED' ? 'Published' : 'Publish'}
            </Button>
          </div>
        )}
        {showWorkspace && publishHelpText && (
          <p className="product-workspace-shell__action-note">
            {publishHelpText}
          </p>
        )}
      </header>

      <div className="product-workspace-shell__body">
        {showWorkspace && navigation && (
          <nav
            className="product-workspace-shell__nav"
            aria-label="Product workspace navigation"
          >
            {navigation}
          </nav>
        )}
        <main className="product-workspace-shell__content">{children}</main>
      </div>
    </div>
  );
};

export default ProductWorkspaceShell;
