import React from 'react';

import { ProductType } from 'core/api/models';

import './product-type-selector.styles.scss';

interface ProductTypeSelectorProps {
  value: ProductType | '';
  // eslint-disable-next-line no-unused-vars
  onChange: (value: ProductType) => void;
}

type TypeConfig = {
  id: ProductType;
  label: string;
  description: string;
};

const TYPE_CONFIG: TypeConfig[] = [
  {
    id: 'COURSE',
    label: 'Course',
    description: 'Multi-lesson video or text course',
  },
  {
    id: 'DOWNLOAD',
    label: 'Download',
    description: 'Files, templates, digital assets',
  },
  {
    id: 'CONSULTATION',
    label: 'Consultation',
    description: '1:1 sessions, coaching, calls',
  },
];

const ProductTypeSelector: React.FC<ProductTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  const handleSelect = (type: ProductType) => {
    if (type !== value) {
      onChange(type);
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
        {TYPE_CONFIG.map((item) => {
          const isSelected = value === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={
                'product-type-option' +
                (isSelected ? ' product-type-option--selected' : '')
              }
              onClick={() => handleSelect(item.id)}
              role="radio"
              aria-checked={isSelected}
            >
              {/* hidden native radio for accessibility / forms if needed */}
              <input
                type="radio"
                name="productType"
                value={item.id}
                checked={isSelected}
                onChange={() => handleSelect(item.id)}
                className="product-type-option__input"
              />

              <div className="product-type-option__orb">
                <div className="product-type-option__orb-inner">
                  {/* Replace these with real icons if you want */}
                  <span className="product-type-option__icon">
                    {item.id === 'COURSE' && '🎓'}
                    {item.id === 'DOWNLOAD' && '⬇️'}
                    {item.id === 'CONSULTATION' && '🎧'}
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
