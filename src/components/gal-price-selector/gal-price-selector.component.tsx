import React, { useEffect, useState } from 'react';

import { GalFormInput } from '@shared/ui';

interface GalPriceSelectorProps {
  price: 'free' | number;
  // eslint-disable-next-line no-unused-vars
  setPrice: (price: 'free' | number) => void;
}

const GalPriceSelector: React.FC<GalPriceSelectorProps> = ({
  price,
  setPrice,
}) => {
  const [selectedPriceMode, setSelectedPriceMode] = useState<'free' | 'paid'>(
    'free',
  );

  useEffect(() => {
    if (price === 'free') {
      setSelectedPriceMode('free');
    } else {
      setSelectedPriceMode('paid');
    }
  }, [price]);

  const handlePriceModeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;
    setSelectedPriceMode(value as 'free' | 'paid');
    if (value === 'free') {
      setPrice('free');
    }
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(event.target.value));
  };

  return (
    <div>
      <label>
        <input
          type="radio"
          name="price" // ensure both radio buttons share the same name
          value="free"
          checked={selectedPriceMode === 'free'}
          onChange={handlePriceModeChange}
        />
        Free
      </label>

      <label style={{ marginLeft: '1rem' }}>
        <input
          type="radio"
          name="price"
          value="paid"
          checked={selectedPriceMode === 'paid'}
          onChange={handlePriceModeChange}
        />
        Paid
      </label>

      {selectedPriceMode === 'paid' && (
        <GalFormInput
          label="Price"
          type="text"
          name="price"
          value={price}
          onChange={handlePriceChange}
        />
      )}
    </div>
  );
};

export default GalPriceSelector;
