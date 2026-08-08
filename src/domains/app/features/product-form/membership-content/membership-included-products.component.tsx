import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, ProductMinimised, ProductType } from 'core/api/models';
import {
  getProductSummariesByOwner,
  selectProductSummaries,
  selectProductsError,
  selectProductsLoading,
} from 'core/store/product-store';
import { ProductPicker } from '../product-picker';
import MembershipContentList from './membership-content-list.component';
import { MembershipContentItemBase } from './models';

const ALLOWED_INCLUDED_PRODUCT_TYPES: ProductType[] = ['COURSE', 'DOWNLOAD'];

interface MembershipIncludedProductsProps {
  ownerId?: string;
  currentProductId?: string;
  nativeContentItems?: MembershipContentItemBase[];
  productPickerRequest?: number;
  isContentListHidden?: boolean;
}

const MembershipIncludedProducts: React.FC<MembershipIncludedProductsProps> = ({
  ownerId,
  currentProductId,
  nativeContentItems = [],
  productPickerRequest = 0,
  isContentListHidden = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProductSummaries);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const [includedProductIds, setIncludedProductIds] = useState<string[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const previousProductPickerRequest = useRef(0);

  useEffect(() => {
    if (!ownerId || products || loading) {
      return;
    }

    dispatch(getProductSummariesByOwner(ownerId));
  }, [dispatch, loading, ownerId, products]);

  useEffect(() => {
    if (productPickerRequest === previousProductPickerRequest.current) {
      return;
    }

    previousProductPickerRequest.current = productPickerRequest;

    if (productPickerRequest > 0) {
      setIsPickerOpen(true);
    }
  }, [productPickerRequest]);

  const productById = useMemo(() => {
    const productMap = new Map<string, ProductMinimised>();

    (products ?? []).forEach((product) => {
      if (product.id) {
        productMap.set(product.id, product);
      }
    });

    return productMap;
  }, [products]);

  const includedProducts = includedProductIds
    .map((id) => productById.get(id))
    .filter((product): product is ProductMinimised => Boolean(product));

  const eligibleProductCount = (products ?? []).filter(
    (product) =>
      product.id &&
      product.type &&
      ALLOWED_INCLUDED_PRODUCT_TYPES.includes(product.type) &&
      product.id !== currentProductId,
  ).length;

  const handleConfirmProducts = (selectedIds: string[]) => {
    setIncludedProductIds((currentIds) =>
      Array.from(new Set([...currentIds, ...selectedIds])),
    );
    setIsPickerOpen(false);
  };

  const handleRemoveProduct = (productId?: string) => {
    if (!productId) {
      return;
    }

    setIncludedProductIds((currentIds) =>
      currentIds.filter((id) => id !== productId),
    );
  };

  return (
    <section className="membership-included-products">
      {!ownerId && (
        <p className="membership-included-products__empty">
          Save the membership before adding products.
        </p>
      )}

      {ownerId && loading && <p>Loading products...</p>}
      {ownerId && error && <p className="error-message">Error: {error}</p>}

      {ownerId && !loading && !error && !isContentListHidden && (
        <MembershipContentList
          nativeContentItems={nativeContentItems}
          includedProducts={includedProducts}
          onRemoveProduct={handleRemoveProduct}
        />
      )}

      {ownerId && !loading && !error && eligibleProductCount === 0 && (
        <p className="membership-included-products__empty">
          You do not have any eligible products to include yet.
        </p>
      )}

      {isPickerOpen && (
        <ProductPicker
          products={products ?? []}
          selectedIds={[]}
          allowedTypes={ALLOWED_INCLUDED_PRODUCT_TYPES}
          excludedIds={[...includedProductIds, currentProductId].filter(
            (id): id is string => Boolean(id),
          )}
          onConfirm={handleConfirmProducts}
          onCancel={() => setIsPickerOpen(false)}
        />
      )}
    </section>
  );
};

export default MembershipIncludedProducts;
