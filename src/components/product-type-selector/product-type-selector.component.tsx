import React from 'react';

import { ProductType } from '../../models/product/product.types';

import './product-type-selector.styles.scss';

interface Props {
  selectedType: ProductType;
  onSelect: (type: ProductType) => void;
  disabledTypes?: ProductType[];
}

const AVAILABLE_TYPES: ProductType[] = ['COURSE', 'DOWNLOAD', 'CONSULTATION'];

const ProductTypeSelector: React.FC<Props> = ({
  selectedType,
  onSelect,
  disabledTypes = [],
}) => (
  <div className="type-selectors">
    <div className="type-selectors-container">
      {AVAILABLE_TYPES.map((type) => {
        const isDisabled = disabledTypes.includes(type);
        const isSelected = selectedType === type;
        return (
          <div
            key={type}
            className={`type-box ${isSelected ? 'type-box__selected' : ''} ${
              isDisabled ? 'type-box__disabled' : ''
            }`}
            onClick={() => {
              if (!isDisabled) {
                onSelect(type);
              }
            }}
          >
            <span className="type">{type}</span>
          </div>
        );
      })}
    </div>
  </div>
);

export default ProductTypeSelector;
