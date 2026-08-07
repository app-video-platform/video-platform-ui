import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import RecurringPriceSelector from './recurring-price-selector.component';
import { RecurringPricing } from '../models';

const monthlyPricing: RecurringPricing = {
  amount: 15,
  currency: 'EUR',
  interval: 'MONTH',
};

const renderSelector = (value: RecurringPricing = monthlyPricing) => {
  const onChange = jest.fn();

  render(<RecurringPriceSelector value={value} onChange={onChange} />);

  return { onChange };
};

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('<RecurringPriceSelector />', () => {
  it('renders the amount, EUR currency, and monthly interval', () => {
    renderSelector();

    expect(screen.getByLabelText('Membership price')).toHaveValue(15);
    expect(screen.getByLabelText('Currency EUR')).toHaveTextContent('EUR');
    expect(screen.getByRole('radio', { name: 'Monthly' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Yearly' })).not.toBeChecked();
  });

  it('can select yearly billing', () => {
    const { onChange } = renderSelector();

    fireEvent.click(screen.getByRole('radio', { name: 'Yearly' }));

    expect(onChange).toHaveBeenCalledWith({
      amount: 15,
      currency: 'EUR',
      interval: 'YEAR',
    });
  });

  it('changes amount without changing currency or interval', () => {
    const { onChange } = renderSelector();

    fireEvent.change(screen.getByLabelText('Membership price'), {
      target: { value: '29.5' },
    });

    expect(onChange).toHaveBeenCalledWith({
      amount: 29.5,
      currency: 'EUR',
      interval: 'MONTH',
    });
  });

  it('changing interval preserves amount and currency', () => {
    const { onChange } = renderSelector({
      amount: 120,
      currency: 'EUR',
      interval: 'MONTH',
    });

    fireEvent.click(screen.getByRole('radio', { name: 'Yearly' }));

    expect(onChange).toHaveBeenCalledWith({
      amount: 120,
      currency: 'EUR',
      interval: 'YEAR',
    });
  });

  it('does not emit NaN for invalid input', () => {
    const { onChange } = renderSelector();

    fireEvent.change(screen.getByLabelText('Membership price'), {
      target: { value: 'not-a-number' },
    });

    expect(onChange).not.toHaveBeenCalledWith(
      expect.objectContaining({ amount: NaN }),
    );
  });

  it('normalizes negative values to zero', () => {
    const { onChange } = renderSelector();

    fireEvent.change(screen.getByLabelText('Membership price'), {
      target: { value: '-5' },
    });

    expect(onChange).toHaveBeenCalledWith({
      amount: 0,
      currency: 'EUR',
      interval: 'MONTH',
    });
  });

  it('summary text reflects amount and interval', () => {
    renderSelector({
      amount: 120,
      currency: 'EUR',
      interval: 'YEAR',
    });

    expect(screen.getByText('€120.00 / year')).toBeInTheDocument();
    expect(
      screen.getByText('Members will be charged €120.00 every year.'),
    ).toBeInTheDocument();
  });
});
