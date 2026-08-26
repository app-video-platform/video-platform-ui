import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import ProductPricingSection from './product-pricing-section.component';
import { ProductDraft, RecurringPricing } from '../models';

const baseProduct: ProductDraft = {
  id: 'product-1',
  type: 'COURSE',
  name: 'Product',
  price: 'free',
};

const renderPricing = (formData: ProductDraft) => {
  const setField = jest.fn();
  const onMembershipRecurringPricingChange = jest.fn();

  render(
    <ProductPricingSection
      formData={formData}
      setField={setField}
      onMembershipRecurringPricingChange={onMembershipRecurringPricingChange}
    />,
  );

  return { setField, onMembershipRecurringPricingChange };
};

describe('<ProductPricingSection />', () => {
  it('keeps Course Free represented as the literal free value', () => {
    const { setField } = renderPricing({
      ...baseProduct,
      type: 'COURSE',
      price: 49,
    });

    fireEvent.click(screen.getByRole('radio', { name: /free/i }));

    expect(setField).toHaveBeenCalledWith('price', 'free');
    expect(setField).toHaveBeenCalledWith('pricingModel', undefined);
  });

  it('supports Course one-time pricing with EUR context', () => {
    const { setField } = renderPricing({
      ...baseProduct,
      type: 'COURSE',
      price: 'free',
    });

    fireEvent.click(screen.getByRole('radio', { name: /one-time/i }));
    fireEvent.change(screen.getByLabelText('Course price'), {
      target: { value: '99.5' },
    });

    expect(screen.getByLabelText('Currency EUR')).toHaveTextContent('EUR');
    expect(setField).toHaveBeenCalledWith('pricingModel', 'ONE_TIME');
    expect(setField).toHaveBeenCalledWith('currency', 'EUR');
    expect(setField).toHaveBeenCalledWith('price', 99.5);
  });

  it('supports Download Free and one-time pricing without a separate component', () => {
    const { setField } = renderPricing({
      ...baseProduct,
      type: 'DOWNLOAD',
      price: 'free',
    });

    expect(screen.getByRole('radio', { name: /free/i })).toBeChecked();
    fireEvent.click(screen.getByRole('radio', { name: /one-time/i }));
    fireEvent.change(screen.getByLabelText('Download price'), {
      target: { value: '19' },
    });

    expect(setField).toHaveBeenCalledWith('price', 19);
  });

  it('exposes only one-time pricing for Consultation', () => {
    renderPricing({
      ...baseProduct,
      type: 'CONSULTATION',
      price: 150,
    });

    expect(screen.queryByRole('radio', { name: /free/i })).not
      .toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /one-time/i })).toBeChecked();
    expect(screen.getByLabelText('Consultation price')).toHaveValue(150);
  });

  it('supports Membership recurring price and monthly/yearly intervals', () => {
    const { onMembershipRecurringPricingChange } = renderPricing({
      ...baseProduct,
      type: 'MEMBERSHIP',
      price: 25,
      pricingModel: 'RECURRING',
      billingInterval: 'MONTH',
      currency: 'EUR',
    });

    expect(screen.queryByRole('radio', { name: /free/i })).not
      .toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /recurring/i })).toBeChecked();

    fireEvent.change(screen.getByLabelText('Membership price'), {
      target: { value: '30' },
    });
    fireEvent.click(screen.getByRole('radio', { name: 'Yearly' }));

    expect(onMembershipRecurringPricingChange).toHaveBeenCalledWith({
      amount: 30,
      currency: 'EUR',
      interval: 'MONTH',
    } satisfies RecurringPricing);
    expect(onMembershipRecurringPricingChange).toHaveBeenCalledWith({
      amount: 30,
      currency: 'EUR',
      interval: 'YEAR',
    } satisfies RecurringPricing);
  });

  it('does not silently convert an empty or invalid paid amount to zero', () => {
    const { setField } = renderPricing({
      ...baseProduct,
      type: 'COURSE',
      price: 12,
    });

    fireEvent.change(screen.getByLabelText('Course price'), {
      target: { value: '' },
    });

    expect(setField).toHaveBeenCalledWith('price', undefined);
    expect(screen.getByText('Enter a valid price amount.')).toBeInTheDocument();
  });
});
