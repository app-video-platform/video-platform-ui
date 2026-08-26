import React from 'react';

import { ProductType } from 'core/api/models';
import { PRODUCT_CREATE_OPTIONS } from 'core/constants';

import './product-type-selector.styles.scss';

interface ProductTypeSelectorProps {
  value: ProductType | '';
  // eslint-disable-next-line no-unused-vars
  onChange: (value: ProductType) => void;
}

const ProductTypeSelector: React.FC<ProductTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  const handleSelect = (type: ProductType) => {
    if (type !== value) {
      onChange(type);
    }
  };
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    type: ProductType,
  ) => {
    const currentIndex = PRODUCT_CREATE_OPTIONS.findIndex(
      (item) => item.type === type,
    );
    const lastIndex = PRODUCT_CREATE_OPTIONS.length - 1;

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleSelect(type);
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const nextType = PRODUCT_CREATE_OPTIONS[
        currentIndex === lastIndex ? 0 : currentIndex + 1
      ].type;

      handleSelect(nextType);
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const previousType = PRODUCT_CREATE_OPTIONS[
        currentIndex === 0 ? lastIndex : currentIndex - 1
      ].type;

      handleSelect(previousType);
    }
  };

  return (
    <div className="product-type-selector">
      <h2 className="product-type-selector__title">Select product type</h2>
      <p className="product-type-selector__subtitle">
        Choose what you’re creating. You can adjust details later.
      </p>

      <div
        className="product-type-selector__options"
        role="radiogroup"
        aria-label="Product type"
      >
        {PRODUCT_CREATE_OPTIONS.map((item) => {
          const isSelected = value === item.type;

          return (
            <button
              key={item.type}
              type="button"
              className={
                'product-type-option' +
                (isSelected ? ' product-type-option--selected' : '')
              }
              onClick={() => handleSelect(item.type)}
              onKeyDown={(event) => handleKeyDown(event, item.type)}
              role="radio"
              aria-checked={isSelected}
            >
              <div className="product-type-option__orb">
                <div className="product-type-option__orb-inner">
                  {/* Replace these with real icons if you want */}
                  <span className="product-type-option__icon">
                    {item.displayIcon}
                  </span>
                </div>
              </div>

              <div className="product-type-option__label-block">
                <span className="product-type-option__label">{item.label}</span>
                <span className="product-type-option__description">
                  {item.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductTypeSelector;
