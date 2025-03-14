import React, { useState } from 'react';
import FormInput from '../form-input/form-input.component';

interface PriceSelectorProps {
  price: 'free' | number;
  // eslint-disable-next-line no-unused-vars
  setPrice: (price: 'free' | number) => void;
}


const PriceSelector: React.FC<PriceSelectorProps> = ({ price, setPrice }) => {
  const [selectedPriceMode, setSelectedPriceMode] = useState<string>('free');
  // const [isNumberInputVisible, setIsNumberInputVisible] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('change', event.target.value);
    if (event.target.value === 'free') {
      setSelectedPriceMode(event.target.value);
      setPrice('free');
    } else if (event.target.value === 'paid') {
      setSelectedPriceMode(event.target.value);
      // setPrice()
    } else {
      setPrice(Number(event.target.value));
    }
    // setPrice(event.target.value);
  };

  return (
    <div>
      <label>
        <input
          type="radio"
          name="price"           // ensure both radio buttons share the same name
          value="free"
          checked={selectedPriceMode === 'free'}
          onChange={handleChange}
        />
        Free
      </label>

      <label style={{ marginLeft: '1rem' }}>
        <input
          type="radio"
          name="price"
          value="paid"
          checked={selectedPriceMode === 'paid'}
          onChange={handleChange}
        />
        Paid
      </label>

      {
        selectedPriceMode === 'paid' &&
        <FormInput label="Price"
          type="text"
          name="price"
          value={price}
          onChange={handleChange} />
      }
    </div>
  );
};

export default PriceSelector;
