import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiDotsVertical } from 'react-icons/hi';

import { ProductStatus, ProductType } from 'core/api/models';
import { PRODUCT_TYPE_REGISTRY } from 'core/constants';
import { Button, Icon, StatusChip } from '@shared/ui';
import { getCssVar } from '@shared/utils';
import { SavingIndicator } from 'domains/app/components';
import { SaveStatus } from 'domains/app/features/product-form';

import './product-workspace-shell.styles.scss';

interface ProductWorkspaceShellProps {
  productType?: ProductType;
  productTitle?: string;
  productStatus?: ProductStatus;
  isEditMode: boolean;
  showWorkspace: boolean;
  saveStatus: SaveStatus;
  canPublish?: boolean;
  publishDisabledReason?: string;
  navigation?: React.ReactNode;
  children: React.ReactNode;
}

const ProductWorkspaceShell: React.FC<ProductWorkspaceShellProps> = ({
  productType,
  productTitle,
  productStatus,
  isEditMode,
  showWorkspace,
  saveStatus,
  canPublish = true,
  publishDisabledReason,
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

  return (
    <div className="product-workspace-shell">
      <header className="product-workspace-shell__header">
        <div className="product-workspace-shell__identity">
          <Button
            type="button"
            variant="tertiary"
            className="product-workspace-shell__back"
            onClick={() => navigate('/app/products')}
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
          {productStatus && <StatusChip status={productStatus} />}
        </div>

        {showWorkspace && (
          <div className="product-workspace-shell__actions">
            <SavingIndicator status={saveStatus} size="sm" />
            <Button type="button" variant="secondary" disabled>
              Preview
            </Button>
            <Button
              type="button"
              variant="tertiary"
              size="icon"
              className="product-workspace-shell__overflow"
              aria-label="More product actions"
              disabled
            >
              <Icon
                icon={HiDotsVertical}
                size={18}
                color={getCssVar('--text-secondary')}
              />
            </Button>
            <Button
              type="submit"
              form="product-builder-form"
              variant="primary"
              disabled={!canPublish}
              title={!canPublish ? publishDisabledReason : undefined}
            >
              Publish
            </Button>
          </div>
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
