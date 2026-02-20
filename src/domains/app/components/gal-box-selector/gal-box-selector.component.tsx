/* eslint-disable indent */
import React from 'react';
import clsx from 'clsx';

import { LessonType, ProductType, QuestionType } from 'core/api/models';
import { LESSON_META, PRODUCT_META, QUESTION_META } from 'core/api/index';
import { GalIcon } from '@shared/ui';

import './gal-box-selector.styles.scss';
import { IconType } from 'react-icons';

export type OptionType = ProductType | LessonType | QuestionType;

interface GalBoxSelectorProps<T extends OptionType> {
  selectedOption?: T;
  // eslint-disable-next-line no-unused-vars
  onSelect: (option: T) => void;
  disabledOptions?: T[];
  availableOptions?: T[];
  selectFor: 'product' | 'lesson' | 'question';
}

const GalBoxSelector = <T extends OptionType>({
  selectedOption,
  onSelect,
  disabledOptions = [],
  availableOptions,
  selectFor,
}: GalBoxSelectorProps<T>) => {
  const getOptionMeta = (option: T): { color: string; Icon: IconType } => {
    switch (selectFor) {
      case 'lesson':
        return {
          color: LESSON_META[option as LessonType].color,
          Icon: LESSON_META[option as LessonType].icon,
        };

      case 'question':
        return {
          color: QUESTION_META[option as QuestionType].color,
          Icon: QUESTION_META[option as QuestionType].icon,
        };
      default:
        return {
          color: PRODUCT_META[option as ProductType].color,
          Icon: PRODUCT_META[option as ProductType].icon,
        };
    }
  };

  return (
    <div className="box-selectors">
      {availableOptions &&
        availableOptions.map((option, index) => {
          const isDisabled = disabledOptions.includes(option);
          const isSelected = selectedOption === option;

          const { color, Icon } = getOptionMeta(option);
          return (
            <div
              key={index}
              className={clsx(
                'option-box',
                `option-box__${option.toLowerCase()}`,
                {
                  selected: isSelected,
                  disabled: isDisabled,
                  small: selectFor !== 'product',
                },
              )}
              onClick={() => {
                if (!isDisabled) {
                  onSelect(option);
                }
              }}
            >
              {Icon && (
                <GalIcon
                  icon={Icon}
                  color={color}
                  size={selectFor === 'product' ? 24 : 18}
                />
              )}
              <span className="option">{option}</span>
            </div>
          );
        })}
    </div>
  );
};

export default GalBoxSelector;
