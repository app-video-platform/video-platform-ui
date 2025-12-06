import React, { useState } from 'react';
import { FaRegStar } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';

import { getCssVar } from '@shared/utils';
import { GalIcon } from '../gal-icon';

import './star-rating.styles.scss';

export interface StarRatingProps {
  value: number; // current selected rating
  // eslint-disable-next-line no-unused-vars
  onChange?: (next: number) => void;
  showValue?: boolean;
  small?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  showValue = false,
  small = false,
}) => {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="star-rating-wrapper">
      <div className="star-rating" style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const n = i + 1;
          const isFilled = hover ? n <= hover : n <= value;

          const icon = isFilled ? FaStar : FaRegStar;

          return (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
              onClick={(e) => {
                e.preventDefault(); // 👈 extra safety
                e.stopPropagation();
                onChange?.(n);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <GalIcon
                icon={icon}
                size={small ? 18 : 24}
                color={getCssVar('--accent-primary')}
              />
            </button>
          );
        })}
      </div>
      {showValue && <span>{value}</span>}
    </div>
  );
};

export default StarRating;
