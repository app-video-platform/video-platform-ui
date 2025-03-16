// PriceSelector.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PriceSelector from './price-selector.component';
import '@testing-library/jest-dom';

describe('PriceSelector component', () => {
  let mockSetPrice: jest.Mock;

  beforeEach(() => {
    mockSetPrice = jest.fn();
  });

  it('renders with "free" mode selected by default and no price input', () => {
    render(<PriceSelector price="free" setPrice={mockSetPrice} />);
    const freeRadio = screen.getByRole('radio', { name: 'Free' });
    const paidRadio = screen.getByRole('radio', { name: 'Paid' });

    expect(freeRadio).toBeChecked();
    expect(paidRadio).not.toBeChecked();

    // Ensure that the price input is not rendered when free is selected.
    const priceInput = screen.queryByLabelText(/Price/i);
    expect(priceInput).not.toBeInTheDocument();
  });

  it('switching to "paid" mode renders the price input', () => {
    render(<PriceSelector price="free" setPrice={mockSetPrice} />);
    const paidRadio = screen.getByRole('radio', { name: 'Paid' });
    fireEvent.click(paidRadio);

    // Paid radio should now be checked.
    expect(paidRadio).toBeChecked();

    // The FormInput should now be rendered.
    const priceInput = screen.getByLabelText(/Price/i);
    expect(priceInput).toBeInTheDocument();

    // In "paid" mode, setPrice is not called immediately.
    expect(mockSetPrice).not.toHaveBeenCalledWith('paid');
  });

  it('clicking the "free" radio calls setPrice with "free" after switching away', () => {
    render(<PriceSelector price="free" setPrice={mockSetPrice} />);

    // First switch to "paid" so that "free" can be re-selected.
    const paidRadio = screen.getByRole('radio', { name: 'Paid' });
    fireEvent.click(paidRadio);

    // Now click "free" to switch back.
    const freeRadio = screen.getByRole('radio', { name: 'Free' });
    fireEvent.click(freeRadio);

    expect(mockSetPrice).toHaveBeenCalledWith('free');
  });

  it('updates price when the price input changes in paid mode', () => {
    render(<PriceSelector price="free" setPrice={mockSetPrice} />);
    const paidRadio = screen.getByRole('radio', { name: 'Paid' });
    fireEvent.click(paidRadio);

    // Now the price input should be rendered.
    const priceInput = screen.getByLabelText(/Price/i);
    fireEvent.change(priceInput, { target: { value: '100' } });
    expect(mockSetPrice).toHaveBeenCalledWith(100);
  });
});
