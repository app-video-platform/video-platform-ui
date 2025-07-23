/* eslint-disable indent */
import React from 'react';

import {
  ProductType,
  LessonType,
} from '../../api/models/product/product.types';

import './gal-box-selector.styles.scss';

export type OptionType = ProductType | LessonType;

interface GalBoxSelectorProps<T extends OptionType> {
  selectedOption?: T;
  // eslint-disable-next-line no-unused-vars
  onSelect: (option: T) => void;
  disabledOptions?: T[];
  availableOptions?: T[];
}

const GalBoxSelector = <T extends OptionType>({
  selectedOption,
  onSelect,
  disabledOptions = [],
  availableOptions,
}: GalBoxSelectorProps<T>) => (
  <div className="box-selectors">
    <div className="box-selectors-container">
      {availableOptions &&
        availableOptions.map((option) => {
          const isDisabled = disabledOptions.includes(option);
          const isSelected = selectedOption === option;
          return (
            <div
              key={option}
              className={`option-box ${
                isSelected ? 'option-box__selected' : ''
              } ${isDisabled ? 'option-box__disabled' : ''}`}
              onClick={() => {
                if (!isDisabled) {
                  onSelect(option);
                }
              }}
            >
              <span className="option">{option}</span>
            </div>
          );
        })}
    </div>
  </div>
);

export default GalBoxSelector;
