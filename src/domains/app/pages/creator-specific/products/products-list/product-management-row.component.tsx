import React from 'react';
import { Link } from 'react-router-dom';
import { FiExternalLink, FiMoreHorizontal } from 'react-icons/fi';

import { ProductMinimised } from 'core/api/models';
import { Button, GalDropdown, GalIcon } from '@shared/ui';
import { getCssVar } from '@shared/utils';

import {
  formatProductPrice,
  formatProductUpdatedDate,
  getProductName,
  getProductStatusLabel,
  getProductTypeLabel,
} from './products-list.utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../../../../../assets/image-placeholder.png');

interface ProductManagementRowProps {
  product: ProductMinimised;
  showInspectionRecurringMembership?: boolean;
}

const ProductManagementRow: React.FC<ProductManagementRowProps> = ({
  product,
  showInspectionRecurringMembership = false,
}) => {
  const productName = getProductName(product);
  const workspacePath = `/app/products/edit/${product.id}`;
  const status = product.status ?? 'DRAFT';
  const statusLabel = getProductStatusLabel(status);
  const updated = formatProductUpdatedDate(product);
  const priceLabel = formatProductPrice(product, {
    showInspectionRecurringMembership,
  });
  const imageSrc = product.imageUrl || placeholderImage;
  const canPreview = product.status === 'PUBLISHED' && Boolean(product.id);
  const hasSecondaryActions = canPreview;

  return (
    <article className="products-management-row">
      <div className="products-management-row__product">
        <Link
          to={workspacePath}
          className="products-management-row__identity"
          aria-label={`Open ${productName} workspace`}
        >
          <img
            className="products-management-row__thumbnail"
            src={imageSrc}
            alt=""
            aria-hidden="true"
          />
          <span className="products-management-row__title-group">
            <span className="products-management-row__title">{productName}</span>
            <span className="products-management-row__type">
              {getProductTypeLabel(product.type)}
            </span>
          </span>
        </Link>
      </div>

      <div className="products-management-row__status">
        <span
          className={`products-status-badge products-status-badge--${status.toLowerCase()}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="products-management-row__price">{priceLabel}</div>

      <div className="products-management-row__updated">
        {updated.iso ? (
          <time dateTime={updated.iso} title={updated.fullLabel}>
            <span className="products-management-row__updated-prefix">
              Updated{' '}
            </span>
            {updated.shortLabel}
          </time>
        ) : (
          <span>
            <span className="products-management-row__updated-prefix">
              Updated{' '}
            </span>
            {updated.shortLabel}
          </span>
        )}
      </div>

      <div className="products-management-row__actions">
        {hasSecondaryActions && (
          <GalDropdown
            customClassName="products-row-menu"
            trigger={({ open, toggle }) => (
              <Button
                type="button"
                variant="tertiary"
                size="icon"
                onClick={toggle}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={`Open actions for ${productName}`}
                className="products-management-row__menu-trigger"
              >
                <GalIcon
                  icon={FiMoreHorizontal}
                  size={18}
                  color={getCssVar('--text-primary')}
                />
              </Button>
            )}
            menu={({ close }) => (
              <>
                <Link to={`/app/product/${product.id}`} role="menuitem" onClick={close}>
                  <GalIcon
                    icon={FiExternalLink}
                    size={15}
                    color={getCssVar('--text-secondary')}
                  />
                  Preview
                </Link>
              </>
            )}
          />
        )}
      </div>
    </article>
  );
};

export default ProductManagementRow;
