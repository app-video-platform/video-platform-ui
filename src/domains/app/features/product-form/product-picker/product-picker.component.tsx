import React, { useMemo, useState } from 'react';

import { ProductMinimised, ProductType } from 'core/api/models';
import { PRODUCT_TYPE_REGISTRY } from 'core/constants';
import { Button, CheckboxInput, Input, StatusChip } from '@shared/ui';

import './product-picker.styles.scss';

export type PickableProduct = ProductMinimised & {
  name?: string;
};

export interface ProductPickerProps {
  products: PickableProduct[];
  selectedIds?: string[];
  allowedTypes: ProductType[];
  excludedIds?: string[];
  onConfirm: (selectedIds: string[]) => void;
  onCancel: () => void;
}

const getProductTitle = (product: PickableProduct) =>
  product.title ?? product.name ?? 'Untitled product';

const ProductPicker: React.FC<ProductPickerProps> = ({
  products,
  selectedIds = [],
  allowedTypes,
  excludedIds = [],
  onConfirm,
  onCancel,
}) => {
  const [query, setQuery] = useState('');
  const [draftSelectedIds, setDraftSelectedIds] = useState<string[]>(selectedIds);

  const excludedIdSet = useMemo(() => new Set(excludedIds), [excludedIds]);
  const allowedTypeSet = useMemo(() => new Set(allowedTypes), [allowedTypes]);

  const candidates = useMemo(
    () =>
      products.filter((product) => {
        if (!product.id || !product.type) {
          return false;
        }

        if (!allowedTypeSet.has(product.type)) {
          return false;
        }

        return !excludedIdSet.has(product.id);
      }),
    [allowedTypeSet, excludedIdSet, products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return candidates;
    }

    return candidates.filter((product) =>
      getProductTitle(product).toLowerCase().includes(normalizedQuery),
    );
  }, [candidates, query]);

  const toggleSelection = (productId: string) => {
    setDraftSelectedIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  const handleConfirm = () => {
    onConfirm(draftSelectedIds);
  };

  return (
    <div className="product-picker">
      <div className="product-picker__search">
        <Input
          name="product-picker-search"
          value={query}
          placeholder="Search products..."
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setQuery(event.target.value)
          }
        />
      </div>

      <div className="product-picker__list">
        {candidates.length === 0 && (
          <p className="product-picker__empty">No eligible products available.</p>
        )}

        {candidates.length > 0 && filteredProducts.length === 0 && (
          <p className="product-picker__empty">No products match your search.</p>
        )}

        {filteredProducts.map((product) => {
          const productId = product.id ?? '';
          const productTypeConfig = product.type
            ? PRODUCT_TYPE_REGISTRY[product.type]
            : undefined;
          const isSelected = draftSelectedIds.includes(productId);

          return (
            <div
              key={productId}
              className="product-picker-row"
            >
              <div className="product-picker-row__media">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={getProductTitle(product)} />
                ) : (
                  <span>{productTypeConfig?.displayIcon}</span>
                )}
              </div>

              <div className="product-picker-row__content">
                <h4>{getProductTitle(product)}</h4>
                <div className="product-picker-row__meta">
                  <span>{productTypeConfig?.label ?? product.type}</span>
                  <StatusChip status={product.status ?? 'DRAFT'} />
                </div>
                {product.description && <p>{product.description}</p>}
              </div>

              <CheckboxInput
                id={`product-picker-${productId}`}
                checked={isSelected}
                aria-label={`Select ${getProductTitle(product)}`}
                onChange={() => toggleSelection(productId)}
              />
            </div>
          );
        })}
      </div>

      <div className="product-picker__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleConfirm}
          disabled={draftSelectedIds.length === 0}
        >
          Add selected
        </Button>
      </div>
    </div>
  );
};

export default ProductPicker;
