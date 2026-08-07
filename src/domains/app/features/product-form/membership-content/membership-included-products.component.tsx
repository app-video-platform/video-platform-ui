import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, StatusChip } from '@shared/ui';
import { AppDispatch, ProductMinimised, ProductType } from 'core/api/models';
import { PRODUCT_TYPE_REGISTRY } from 'core/constants';
import {
  getProductSummariesByOwner,
  selectProductSummaries,
  selectProductsError,
  selectProductsLoading,
} from 'core/store/product-store';
import { ProductPicker } from '../product-picker';

const ALLOWED_INCLUDED_PRODUCT_TYPES: ProductType[] = ['COURSE', 'DOWNLOAD'];

interface MembershipIncludedProductsProps {
  ownerId?: string;
  currentProductId?: string;
}

const MembershipIncludedProducts: React.FC<MembershipIncludedProductsProps> = ({
  ownerId,
  currentProductId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProductSummaries);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const [includedProductIds, setIncludedProductIds] = useState<string[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    if (!ownerId || products || loading) {
      return;
    }

    dispatch(getProductSummariesByOwner(ownerId));
  }, [dispatch, loading, ownerId, products]);

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
      <div className="membership-included-products__header">
        <div>
          <h3>Included Products</h3>
          <p>
            Add existing standalone products that members should get access to.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setIsPickerOpen(true)}
          disabled={!ownerId || loading}
        >
          + Add Product
        </Button>
      </div>

      {!ownerId && (
        <p className="membership-included-products__empty">
          Save the membership before adding products.
        </p>
      )}

      {ownerId && loading && <p>Loading products...</p>}
      {ownerId && error && <p className="error-message">Error: {error}</p>}

      {ownerId && !loading && !error && includedProducts.length === 0 && (
        <p className="membership-included-products__empty">
          No products included yet.
        </p>
      )}

      {includedProducts.length > 0 && (
        <div className="membership-included-products__list">
          {includedProducts.map((product) => {
            const typeConfig = product.type
              ? PRODUCT_TYPE_REGISTRY[product.type]
              : undefined;

            return (
              <div key={product.id} className="membership-included-product">
                <div className="membership-included-product__media">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} />
                  ) : (
                    <span>{typeConfig?.displayIcon}</span>
                  )}
                </div>
                <div className="membership-included-product__content">
                  <h4>{product.title ?? 'Untitled product'}</h4>
                  <div className="membership-included-product__meta">
                    <span>{typeConfig?.label ?? product.type}</span>
                    <StatusChip status={product.status ?? 'DRAFT'} />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="remove"
                  onClick={() => handleRemoveProduct(product.id)}
                >
                  Remove
                </Button>
              </div>
            );
          })}
        </div>
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
