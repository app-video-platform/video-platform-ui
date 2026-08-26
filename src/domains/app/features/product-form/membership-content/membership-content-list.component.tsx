import React, { useMemo, useState } from 'react';

import { Button, StatusBadge, StatusBadgeTone } from '@shared/ui';
import { ProductMinimised } from 'core/api/models';
import { PRODUCT_TYPE_REGISTRY } from 'core/constants';
import {
  createMembershipContentListItems,
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
  onRemoveProduct?: (productId?: string) => Promise<void> | void;
  // eslint-disable-next-line no-unused-vars
  onMoveFeedEntry?: (entryId: string, direction: 'UP' | 'DOWN') => Promise<void> | void;
  // eslint-disable-next-line no-unused-vars
  onEditContent?: (contentId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onDeleteContent?: (contentId: string) => Promise<void> | void;
  onAddContent?: () => void;
}

const getProductTitle = (product: ProductMinimised) =>
  product.title ?? 'Untitled product';

const membershipStatusTone: Record<string, StatusBadgeTone> = {
  DRAFT: 'warning',
  PUBLISHED: 'success',
  HIDDEN: 'neutral',
};

const membershipStatusLabel: Record<string, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  HIDDEN: 'Hidden',
};

const productStatusLabel: Record<string, string> = {
  DRAFT: 'Draft product',
  PUBLISHED: 'Published product',
  HIDDEN: 'Hidden product',
};

const contentInitial: Record<MembershipContentItem['type'], string> = {
  POST: 'P',
  VIDEO: 'V',
  RESOURCE: 'R',
};

const canManageNativeContent = (content: MembershipContentItem) =>
  content.type === 'POST' ||
  content.type === 'VIDEO' ||
  content.type === 'RESOURCE';

const getContentSummary = (content: MembershipContentItem) => {
  if (content.type === 'POST') {
    return content.body;
  }

  if (content.description) {
    return content.description;
  }

  return content.type === 'VIDEO'
    ? content.video.fileName
    : content.file.fileName;
};

interface MembershipNativeContentRowProps {
  item: Extract<MembershipContentListItem, { kind: 'CONTENT' }>;
  orderingControls?: React.ReactNode;
  // eslint-disable-next-line no-unused-vars
  onEditContent?: (contentId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onDeleteContent?: (contentId: string) => Promise<void> | void;
}

const MembershipNativeContentRow: React.FC<MembershipNativeContentRowProps> = ({
  item,
  orderingControls,
  onEditContent,
  onDeleteContent,
}) => {
  const { content } = item;
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const contentTypeLabel = MEMBERSHIP_CONTENT_TYPE_LABELS[content.type];
  const contentSummary = getContentSummary(content);

  const handleConfirmDelete = async () => {
    if (!onDeleteContent) {
      return;
    }

    setDeleteError(null);
    setIsDeleting(true);

    try {
      await onDeleteContent(content.id);
      setIsConfirmingDelete(false);
    } catch (error) {
      setDeleteError(
        error instanceof Error && error.message
          ? error.message
          : `${contentTypeLabel} deletion failed. Try again.`,
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      key={item.entry.entryId}
      className="membership-content-list-item membership-content-list-item--native"
    >
      <div className="membership-content-list-item__media" aria-hidden="true">
        <span>{contentInitial[content.type]}</span>
      </div>
      <div className="membership-content-list-item__content">
        <h4 title={content.title}>{content.title}</h4>
        <div className="membership-content-list-item__meta">
          <span>{contentTypeLabel}</span>
          <StatusBadge
            label={membershipStatusLabel[content.status]}
            tone={membershipStatusTone[content.status]}
            size="sm"
          />
        </div>
        <p>{contentSummary}</p>
        {content.type === 'VIDEO' && content.description && (
          <p className="membership-content-list-item__file">
            Selected file: {content.video.fileName}
          </p>
        )}
        {content.type === 'RESOURCE' && content.description && (
          <p className="membership-content-list-item__file">
            Selected file: {content.file.fileName}
          </p>
        )}
        {isConfirmingDelete && (
          <div className="membership-content-list-item__confirm" role="alertdialog">
            <p>
              {`Delete ${contentTypeLabel.toLowerCase()} "${content.title}"? This removes it from this Membership feed.`}
            </p>
            {deleteError && (
              <p className="membership-content-list-item__error" role="alert">
                {deleteError}
              </p>
            )}
            <div>
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                onClick={() => setIsConfirmingDelete(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                loading={isDeleting}
                onClick={handleConfirmDelete}
              >
                Delete {contentTypeLabel}
              </Button>
            </div>
          </div>
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
                size="sm"
                aria-label={`Edit ${content.title}`}
                onClick={() => onEditContent(content.id)}
              >
                Edit
              </Button>
            )}
            {onDeleteContent && (
              <Button
                type="button"
                variant="remove"
                size="sm"
                aria-label={`Delete ${contentTypeLabel} ${content.title}`}
                onClick={() => setIsConfirmingDelete(true)}
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
  onRemoveProduct?: (productId?: string) => Promise<void> | void;
}

const MembershipIncludedProductRow: React.FC<
  MembershipIncludedProductRowProps
> = ({ item, orderingControls, onRemoveProduct }) => {
  const { product } = item;
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const typeConfig = product.type
    ? PRODUCT_TYPE_REGISTRY[product.type]
    : undefined;
  const productTitle = getProductTitle(product);

  const handleConfirmRemove = async () => {
    if (!onRemoveProduct) {
      return;
    }

    setRemoveError(null);
    setIsRemoving(true);

    try {
      await onRemoveProduct(product.id);
      setIsConfirmingRemove(false);
    } catch (error) {
      setRemoveError(
        error instanceof Error && error.message
          ? error.message
          : 'Product removal failed. Try again.',
      );
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div
      key={item.entry.entryId}
      className="membership-content-list-item membership-content-list-item--product"
    >
      <div className="membership-content-list-item__media">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={productTitle} />
        ) : (
          <span>{typeConfig?.displayIcon}</span>
        )}
      </div>
      <div className="membership-content-list-item__content">
        <h4 title={productTitle}>{productTitle}</h4>
        <div className="membership-content-list-item__meta">
          <span>{typeConfig?.label ?? product.type}</span>
          <StatusBadge label="Included" tone="info" size="sm" />
          <span>{productStatusLabel[product.status ?? 'DRAFT']}</span>
        </div>
        {product.description && <p>{product.description}</p>}
        {isConfirmingRemove && (
          <div className="membership-content-list-item__confirm" role="alertdialog">
            <p>
              {`Remove "${productTitle}" from this Membership? The original Product will not be deleted.`}
            </p>
            {removeError && (
              <p className="membership-content-list-item__error" role="alert">
                {removeError}
              </p>
            )}
            <div>
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                onClick={() => setIsConfirmingRemove(false)}
                disabled={isRemoving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                loading={isRemoving}
                onClick={handleConfirmRemove}
              >
                Remove from Membership
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="membership-content-list-item__actions">
        {orderingControls}
        {onRemoveProduct && (
          <Button
            type="button"
            variant="remove"
            size="sm"
            aria-label={`Remove ${productTitle} from Membership`}
            onClick={() => setIsConfirmingRemove(true)}
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
  targetLabel: string;
  isFirst: boolean;
  isLast: boolean;
  // eslint-disable-next-line no-unused-vars
  onMoveFeedEntry?: (entryId: string, direction: 'UP' | 'DOWN') => Promise<void> | void;
}

const MembershipOrderingControls: React.FC<MembershipOrderingControlsProps> = ({
  entryId,
  targetLabel,
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
        size="sm"
        disabled={isFirst}
        aria-label={`Move ${targetLabel} up`}
        onClick={() => onMoveFeedEntry(entryId, 'UP')}
      >
        Move Up
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={isLast}
        aria-label={`Move ${targetLabel} down`}
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
  onAddContent,
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
      <div className="membership-content-list__empty">
        <h4>Start your member feed</h4>
        <p>
          Add posts, videos, resources, or include existing Courses and
          Downloads for active members.
        </p>
        {onAddContent && (
          <Button type="button" variant="primary" onClick={onAddContent}>
            Add your first content
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="membership-content-list">
      {listItems.map((item, index) => {
        const orderingControls =
          orderingMode === 'MANUAL' ? (
            <MembershipOrderingControls
              entryId={item.entry.entryId}
              targetLabel={
                item.kind === 'CONTENT'
                  ? item.content.title
                  : getProductTitle(item.product)
              }
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
