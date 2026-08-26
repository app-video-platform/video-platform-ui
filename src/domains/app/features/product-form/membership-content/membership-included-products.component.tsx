import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch, ProductMinimised, ProductType } from 'core/api/models';
import {
  getProductSummariesByOwner,
} from 'core/store/product-store';
import { Drawer } from '@shared/ui';
import { ProductPicker } from '../product-picker';
import MembershipContentList from './membership-content-list.component';
import {
  MembershipContentItem,
  MembershipFeedEntry,
  MembershipOrderingMode,
  MembershipProductFeedEntry,
} from './models';

const ALLOWED_INCLUDED_PRODUCT_TYPES: ProductType[] = ['COURSE', 'DOWNLOAD'];

interface MembershipIncludedProductsProps {
  ownerId?: string;
  currentProductId?: string;
  nativeContentItems?: MembershipContentItem[];
  feedEntries: MembershipFeedEntry[];
  orderingMode: MembershipOrderingMode;
  includedProductEntries: MembershipProductFeedEntry[];
  productSummaries: ProductMinimised[] | null;
  includedProducts: ProductMinimised[];
  isLoadingProducts: boolean;
  productsError: string | null;
  productPickerRequest?: number;
  isContentListHidden?: boolean;
  // eslint-disable-next-line no-unused-vars
  onAddProducts: (productIds: string[], addedAt: string) => Promise<void> | void;
  // eslint-disable-next-line no-unused-vars
  onRemoveProduct: (productId?: string) => Promise<void> | void;
  // eslint-disable-next-line no-unused-vars
  onMoveFeedEntry: (entryId: string, direction: 'UP' | 'DOWN') => Promise<void> | void;
  // eslint-disable-next-line no-unused-vars
  onEditContent?: (contentId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onDeleteContent?: (contentId: string) => Promise<void> | void;
  onAddContent?: () => void;
}

const MembershipIncludedProducts: React.FC<MembershipIncludedProductsProps> = ({
  ownerId,
  currentProductId,
  nativeContentItems = [],
  feedEntries,
  orderingMode,
  includedProductEntries,
  productSummaries,
  includedProducts,
  isLoadingProducts,
  productsError,
  productPickerRequest = 0,
  isContentListHidden = false,
  onAddProducts,
  onRemoveProduct,
  onMoveFeedEntry,
  onEditContent,
  onDeleteContent,
  onAddContent,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const [isAddingProducts, setIsAddingProducts] = useState(false);
  const previousProductPickerRequest = useRef(0);
  const includedProductIds = includedProductEntries.map(
    (entry) => entry.productId,
  );

  useEffect(() => {
    if (!ownerId || productSummaries || isLoadingProducts) {
      return;
    }

    dispatch(getProductSummariesByOwner(ownerId));
  }, [dispatch, isLoadingProducts, ownerId, productSummaries]);

  useEffect(() => {
    if (productPickerRequest === previousProductPickerRequest.current) {
      return;
    }

    previousProductPickerRequest.current = productPickerRequest;

    if (productPickerRequest > 0) {
      setIsPickerOpen(true);
    }
  }, [productPickerRequest]);

  const eligibleProductCount = (productSummaries ?? []).filter(
    (product) =>
      product.id &&
      product.type &&
      ALLOWED_INCLUDED_PRODUCT_TYPES.includes(product.type) &&
      product.id !== currentProductId,
  ).length;

  const handleConfirmProducts = async (selectedIds: string[]) => {
    setPickerError(null);
    setIsAddingProducts(true);

    try {
      await onAddProducts(selectedIds, new Date().toISOString());
      setIsPickerOpen(false);
    } catch (error) {
      setPickerError(
        error instanceof Error && error.message
          ? error.message
          : 'Product inclusion failed. Try again.',
      );
    } finally {
      setIsAddingProducts(false);
    }
  };

  return (
    <section className="membership-included-products">
      {!ownerId && (
        <p className="membership-included-products__empty">
          Save the membership before adding products.
        </p>
      )}

      {ownerId && isLoadingProducts && <p>Loading products...</p>}
      {ownerId && productsError && (
        <p className="error-message">Error: {productsError}</p>
      )}

      {ownerId && !isLoadingProducts && !productsError && !isContentListHidden && (
        <MembershipContentList
          nativeContentItems={nativeContentItems}
          feedEntries={feedEntries}
          orderingMode={orderingMode}
          includedProducts={includedProducts}
          onRemoveProduct={onRemoveProduct}
          onMoveFeedEntry={onMoveFeedEntry}
          onEditContent={onEditContent}
          onDeleteContent={onDeleteContent}
          onAddContent={onAddContent}
        />
      )}

      {ownerId && !isLoadingProducts && !productsError && eligibleProductCount === 0 && (
        <p className="membership-included-products__empty">
          You do not have any eligible products to include yet.
        </p>
      )}

      <Drawer
        open={isPickerOpen}
        title="Include existing Products"
        onClose={() => setIsPickerOpen(false)}
        closeLabel="Close Product picker"
        className="membership-content-drawer"
      >
        <p className="membership-included-products__picker-help">
          Choose Courses or Downloads to include with this Membership. The
          original Products remain separate.
        </p>
        {pickerError && (
          <p className="membership-content-editor__error" role="alert">
            {pickerError}
          </p>
        )}
        <ProductPicker
          products={productSummaries ?? []}
          selectedIds={[]}
          allowedTypes={ALLOWED_INCLUDED_PRODUCT_TYPES}
          excludedIds={[...includedProductIds, currentProductId].filter(
            (id): id is string => Boolean(id),
          )}
          onConfirm={handleConfirmProducts}
          onCancel={() => setIsPickerOpen(false)}
          confirmLabel="Add to Membership"
          isConfirming={isAddingProducts}
        />
      </Drawer>
    </section>
  );
};

export default MembershipIncludedProducts;
