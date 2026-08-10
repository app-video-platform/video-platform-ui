import React, { useMemo } from 'react';

import { Button, StatusChip } from '@shared/ui';
import { ProductMinimised } from 'core/api/models';
import { PRODUCT_TYPE_REGISTRY } from 'core/constants';
import {
  createMembershipContentListItems,
  MEMBERSHIP_CONTENT_TYPE_ICONS,
  MEMBERSHIP_CONTENT_TYPE_LABELS,
  MembershipContentItem,
  MembershipContentListItem,
  MembershipFeedEntry,
  MembershipOrderingMode,
} from './models';

interface MembershipContentListProps {
  nativeContentItems: readonly MembershipContentItem[];
  feedEntries: readonly MembershipFeedEntry[];
  orderingMode?: MembershipOrderingMode;
  includedProducts: readonly ProductMinimised[];
  // eslint-disable-next-line no-unused-vars
  onRemoveProduct?: (productId?: string) => void;
  // eslint-disable-next-line no-unused-vars
  onMoveFeedEntry?: (entryId: string, direction: 'UP' | 'DOWN') => void;
  // eslint-disable-next-line no-unused-vars
  onEditContent?: (contentId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onDeleteContent?: (contentId: string) => void;
}

const getProductTitle = (product: ProductMinimised) =>
  product.title ?? 'Untitled product';

const canManageNativeContent = (content: MembershipContentItem) =>
  content.type === 'POST' ||
  content.type === 'VIDEO' ||
  content.type === 'RESOURCE';

interface MembershipNativeContentRowProps {
  item: Extract<MembershipContentListItem, { kind: 'CONTENT' }>;
  orderingControls?: React.ReactNode;
  // eslint-disable-next-line no-unused-vars
  onEditContent?: (contentId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onDeleteContent?: (contentId: string) => void;
}

const MembershipNativeContentRow: React.FC<MembershipNativeContentRowProps> = ({
  item,
  orderingControls,
  onEditContent,
  onDeleteContent,
}) => {
  const { content } = item;

  return (
    <div
      key={item.entry.entryId}
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
        {content.type === 'POST' && <p>{content.body}</p>}
        {content.type !== 'POST' && content.description && (
          <p>{content.description}</p>
        )}
        {content.type === 'VIDEO' && (
          <p className="membership-content-list-item__file">
            {content.video.fileName}
          </p>
        )}
        {content.type === 'RESOURCE' && (
          <p className="membership-content-list-item__file">
            {content.file.fileName}
          </p>
        )}
      </div>
      <div className="membership-content-list-item__actions">
        {orderingControls}
        {canManageNativeContent(content) && (
          <>
            {onEditContent && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => onEditContent(content.id)}
              >
                Edit
              </Button>
            )}
            {onDeleteContent && (
              <Button
                type="button"
                variant="remove"
                onClick={() => onDeleteContent(content.id)}
              >
                Delete
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface MembershipIncludedProductRowProps {
  item: Extract<MembershipContentListItem, { kind: 'PRODUCT' }>;
  orderingControls?: React.ReactNode;
  // eslint-disable-next-line no-unused-vars
  onRemoveProduct?: (productId?: string) => void;
}

const MembershipIncludedProductRow: React.FC<
  MembershipIncludedProductRowProps
> = ({ item, orderingControls, onRemoveProduct }) => {
  const { product } = item;
  const typeConfig = product.type
    ? PRODUCT_TYPE_REGISTRY[product.type]
    : undefined;

  return (
    <div
      key={item.entry.entryId}
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
      <div className="membership-content-list-item__actions">
        {orderingControls}
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
    </div>
  );
};

interface MembershipOrderingControlsProps {
  entryId: string;
  isFirst: boolean;
  isLast: boolean;
  // eslint-disable-next-line no-unused-vars
  onMoveFeedEntry?: (entryId: string, direction: 'UP' | 'DOWN') => void;
}

const MembershipOrderingControls: React.FC<MembershipOrderingControlsProps> = ({
  entryId,
  isFirst,
  isLast,
  onMoveFeedEntry,
}) => {
  if (!onMoveFeedEntry) {
    return null;
  }

  return (
    <div className="membership-content-list-item__order-actions">
      <Button
        type="button"
        variant="secondary"
        disabled={isFirst}
        onClick={() => onMoveFeedEntry(entryId, 'UP')}
      >
        Move Up
      </Button>
      <Button
        type="button"
        variant="secondary"
        disabled={isLast}
        onClick={() => onMoveFeedEntry(entryId, 'DOWN')}
      >
        Move Down
      </Button>
    </div>
  );
};

const MembershipContentList: React.FC<MembershipContentListProps> = ({
  nativeContentItems,
  feedEntries,
  orderingMode = 'NEWEST_FIRST',
  includedProducts,
  onRemoveProduct,
  onMoveFeedEntry,
  onEditContent,
  onDeleteContent,
}) => {
  const listItems = useMemo(
    () =>
      createMembershipContentListItems(
        feedEntries,
        nativeContentItems,
        includedProducts,
        orderingMode,
      ),
    [feedEntries, includedProducts, nativeContentItems, orderingMode],
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
      {listItems.map((item, index) => {
        const orderingControls =
          orderingMode === 'MANUAL' ? (
            <MembershipOrderingControls
              entryId={item.entry.entryId}
              isFirst={index === 0}
              isLast={index === listItems.length - 1}
              onMoveFeedEntry={onMoveFeedEntry}
            />
          ) : null;

        return item.kind === 'CONTENT' ? (
          <MembershipNativeContentRow
            key={item.entry.entryId}
            item={item}
            orderingControls={orderingControls}
            onEditContent={onEditContent}
            onDeleteContent={onDeleteContent}
          />
        ) : (
          <MembershipIncludedProductRow
            key={item.entry.entryId}
            item={item}
            orderingControls={orderingControls}
            onRemoveProduct={onRemoveProduct}
          />
        );
      })}
    </div>
  );
};

export default MembershipContentList;
