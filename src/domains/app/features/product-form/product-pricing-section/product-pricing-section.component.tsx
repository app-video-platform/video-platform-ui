import React, { useEffect, useMemo, useState } from 'react';

import { Input, Radio, RadioGroup } from '@shared/ui';
import { PRODUCT_TYPE_REGISTRY } from 'core/constants';
import { ProductType } from 'core/api/models';
import { ProductDraft, RecurringPricing } from '../models';

import './product-pricing-section.styles.scss';

type PricingMode = 'FREE' | 'ONE_TIME' | 'RECURRING';

interface ProductPricingSectionProps {
  formData: ProductDraft;
  setField: <K extends keyof ProductDraft>(
    // eslint-disable-next-line no-unused-vars
    field: K,
    // eslint-disable-next-line no-unused-vars
    value: ProductDraft[K],
  ) => void;
  // eslint-disable-next-line no-unused-vars
  onMembershipRecurringPricingChange: (value: RecurringPricing) => void;
}

const PRICING_OPTIONS: Record<
  ProductType,
  Array<{
    mode: PricingMode;
    label: string;
    description: string;
  }>
> = {
  COURSE: [
    {
      mode: 'FREE',
      label: 'Free',
      description: 'Customers can access this Course without a payment.',
    },
    {
      mode: 'ONE_TIME',
      label: 'One-time',
      description: 'Customers pay once for access to this Course.',
    },
  ],
  DOWNLOAD: [
    {
      mode: 'FREE',
      label: 'Free',
      description: 'Customers can download this Product without a payment.',
    },
    {
      mode: 'ONE_TIME',
      label: 'One-time',
      description: 'Customers pay once for access to the Download.',
    },
  ],
  CONSULTATION: [
    {
      mode: 'ONE_TIME',
      label: 'One-time',
      description: 'Customers pay once for the Consultation session.',
    },
  ],
  MEMBERSHIP: [
    {
      mode: 'RECURRING',
      label: 'Recurring',
      description: 'Members are charged on a monthly or yearly cadence.',
    },
  ],
};

const getCurrentMode = (formData: ProductDraft): PricingMode => {
  if (formData.type === 'MEMBERSHIP') {
    return 'RECURRING';
  }

  if (formData.type === 'CONSULTATION') {
    return 'ONE_TIME';
  }

  return formData.price === 'free' ? 'FREE' : 'ONE_TIME';
};

const getAmountText = (price: ProductDraft['price']) =>
  typeof price === 'number' ? String(price) : '';

const parsePositiveAmount = (rawValue: string) => {
  if (rawValue.trim() === '') {
    return undefined;
  }

  const value = Number(rawValue);

  if (!Number.isFinite(value) || value <= 0) {
    return undefined;
  }

  return value;
};

const formatMoney = (amount: number) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(amount);

const getPaidAmountError = (mode: PricingMode, amountText: string) => {
  if (mode === 'FREE') {
    return undefined;
  }

  const amount = Number(amountText);

  if (amountText.trim() === '' || !Number.isFinite(amount) || amount <= 0) {
    return 'Enter a valid price amount.';
  }

  return undefined;
};

const ProductPricingSection: React.FC<ProductPricingSectionProps> = ({
  formData,
  setField,
  onMembershipRecurringPricingChange,
}) => {
  const [amountText, setAmountText] = useState(getAmountText(formData.price));
  const [selectedMode, setSelectedMode] = useState(getCurrentMode(formData));
  const mode = selectedMode;
  const typeConfig = PRODUCT_TYPE_REGISTRY[formData.type];
  const typeLabel = typeConfig?.label ?? 'Product';
  const pricingOptions = PRICING_OPTIONS[formData.type];
  const amountError = getPaidAmountError(mode, amountText);
  const billingInterval = formData.billingInterval ?? 'MONTH';

  useEffect(() => {
    setAmountText(getAmountText(formData.price));
    setSelectedMode(getCurrentMode(formData));
  }, [formData.id, formData.price, formData.type]);

  const summary = useMemo(() => {
    if (mode === 'FREE') {
      return `${typeLabel} is free.`;
    }

    const amount = parsePositiveAmount(amountText);

    if (!amount) {
      return 'Pricing is incomplete.';
    }

    if (mode === 'RECURRING') {
      return `${formatMoney(amount)} every ${
        billingInterval === 'YEAR' ? 'year' : 'month'
      }.`;
    }

    return `${formatMoney(amount)} one-time payment.`;
  }, [amountText, billingInterval, mode, typeLabel]);

  const handleModeChange = (nextMode: string) => {
    const pricingMode = nextMode as PricingMode;

    setSelectedMode(pricingMode);

    if (pricingMode === 'FREE') {
      setField('price', 'free');
      setField('pricingModel', undefined);
      setField('billingInterval', undefined);
      setField('currency', undefined);
      return;
    }

    if (pricingMode === 'RECURRING') {
      const amount = parsePositiveAmount(amountText);

      onMembershipRecurringPricingChange({
        amount: amount ?? 0,
        currency: 'EUR',
        interval: billingInterval,
      });
      return;
    }

    setField('pricingModel', 'ONE_TIME');
    setField('billingInterval', undefined);
    setField('currency', 'EUR');

    if (formData.price === 'free') {
      setField('price', undefined);
    }
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const nextAmount = parsePositiveAmount(rawValue);

    setAmountText(rawValue);

    if (mode === 'RECURRING') {
      onMembershipRecurringPricingChange({
        amount: nextAmount ?? 0,
        currency: 'EUR',
        interval: billingInterval,
      });
      return;
    }

    setField('price', nextAmount);
    setField('pricingModel', 'ONE_TIME');
    setField('billingInterval', undefined);
    setField('currency', 'EUR');
  };

  const handleIntervalChange = (interval: string) => {
    const nextInterval = interval === 'YEAR' ? 'YEAR' : 'MONTH';
    const nextAmount = parsePositiveAmount(amountText);

    onMembershipRecurringPricingChange({
      amount: nextAmount ?? 0,
      currency: 'EUR',
      interval: nextInterval,
    });
  };

  return (
    <div className="product-pricing-section">
      <section
        className="product-config-section"
        aria-labelledby="pricing-model-title"
      >
        <div className="product-config-section__header">
          <h3 id="pricing-model-title">Pricing model</h3>
          <p>
            Choose the commercial model this {typeLabel.toLowerCase()} supports
            in the MVP.
          </p>
        </div>

        <RadioGroup
          name="product-pricing-model"
          label={`${typeLabel} pricing model`}
          value={mode}
          onChange={handleModeChange}
          className="product-pricing-section__modes"
        >
          {pricingOptions.map((option) => (
            <Radio
              key={option.mode}
              value={option.mode}
              label={option.label}
              description={option.description}
            />
          ))}
        </RadioGroup>
      </section>

      {mode !== 'FREE' && (
        <section
          className="product-config-section"
          aria-labelledby="pricing-amount-title"
        >
          <div className="product-config-section__header">
            <h3 id="pricing-amount-title">
              {mode === 'RECURRING' ? 'Recurring price' : 'Price amount'}
            </h3>
            <p>
              EUR is the only supported currency in the current Product model.
            </p>
          </div>

          <div className="product-pricing-section__amount-grid">
            <Input
              label={
                mode === 'RECURRING'
                  ? 'Membership price'
                  : `${typeLabel} price`
              }
              name="product-price"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              required
              aria-required="true"
              aria-describedby="product-price-help"
              value={amountText}
              error={amountError}
              onChange={handleAmountChange}
            />
            <div
              className="product-pricing-section__currency"
              aria-label="Currency EUR"
            >
              EUR
            </div>
          </div>
          <p id="product-price-help" className="product-config-help">
            Leave Free selected for no-cost Products. Paid Products need a
            positive amount.
          </p>

          {mode === 'RECURRING' && (
            <RadioGroup
              name="membership-billing-interval"
              label="Billing interval"
              value={billingInterval}
              onChange={handleIntervalChange}
              className="product-pricing-section__intervals"
            >
              <Radio label="Monthly" value="MONTH" />
              <Radio label="Yearly" value="YEAR" />
            </RadioGroup>
          )}
        </section>
      )}

      <div className="product-pricing-section__summary" aria-live="polite">
        <strong>Current pricing</strong>
        <span>{summary}</span>
      </div>
    </div>
  );
};

export default ProductPricingSection;
