import React, { useMemo } from 'react';

import { Button, StatusChip } from '@shared/ui';
import { ProductMinimised } from 'core/api/models';
import { PRODUCT_TYPE_REGISTRY } from 'core/constants';
import {
  createMembershipContentListItems,
  MEMBERSHIP_CONTENT_TYPE_ICONS,
  MEMBERSHIP_CONTENT_TYPE_LABELS,
  MembershipContentItemBase,
} from './models';

interface MembershipContentListProps {
  nativeContentItems: readonly MembershipContentItemBase[];
  includedProducts: readonly ProductMinimised[];
  // eslint-disable-next-line no-unused-vars
  onRemoveProduct?: (productId?: string) => void;
}

const getProductTitle = (product: ProductMinimised) =>
  product.title ?? 'Untitled product';

const MembershipContentList: React.FC<MembershipContentListProps> = ({
  nativeContentItems,
  includedProducts,
  onRemoveProduct,
}) => {
  const listItems = useMemo(
    () => createMembershipContentListItems(nativeContentItems, includedProducts),
    [includedProducts, nativeContentItems],
  );

  if (listItems.length === 0) {
    return (
      <p className="membership-content-list__empty">
        No membership content yet.
      </p>
    );
  }

  return (
    <div className="membership-content-list">
      {listItems.map((item) => {
        if (item.kind === 'CONTENT') {
          const { content } = item;

          return (
            <div
              key={`content-${content.id}`}
              className="membership-content-list-item"
            >
              <div className="membership-content-list-item__media">
                <span>{MEMBERSHIP_CONTENT_TYPE_ICONS[content.type]}</span>
              </div>
              <div className="membership-content-list-item__content">
                <h4>{content.title}</h4>
                <div className="membership-content-list-item__meta">
                  <span>{MEMBERSHIP_CONTENT_TYPE_LABELS[content.type]}</span>
                  <span className="membership-content-list-item__status">
                    {content.status}
                  </span>
                </div>
                {content.description && <p>{content.description}</p>}
              </div>
            </div>
          );
        }

        const { product } = item;
        const typeConfig = product.type
          ? PRODUCT_TYPE_REGISTRY[product.type]
          : undefined;

        return (
          <div
            key={`product-${product.id}`}
            className="membership-content-list-item"
          >
            <div className="membership-content-list-item__media">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={getProductTitle(product)} />
              ) : (
                <span>{typeConfig?.displayIcon}</span>
              )}
            </div>
            <div className="membership-content-list-item__content">
              <h4>{getProductTitle(product)}</h4>
              <div className="membership-content-list-item__meta">
                <span>{typeConfig?.label ?? product.type}</span>
                <StatusChip status={product.status ?? 'DRAFT'} />
              </div>
              {product.description && <p>{product.description}</p>}
            </div>
            {onRemoveProduct && (
              <Button
                type="button"
                variant="remove"
                onClick={() => onRemoveProduct(product.id)}
              >
                Remove
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MembershipContentList;
