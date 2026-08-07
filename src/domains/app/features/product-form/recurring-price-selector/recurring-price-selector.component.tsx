import React from 'react';

import { Input, Radio, RadioGroup } from '@shared/ui';
import {
  BillingInterval,
  formatRecurringChargeSummary,
  formatRecurringPrice,
  RecurringPricing,
} from '../models';

import './recurring-price-selector.styles.scss';

export interface RecurringPriceSelectorProps {
  value: RecurringPricing;
  onChange: (value: RecurringPricing) => void;
}

const normalizeAmount = (rawValue: string) => {
  if (rawValue.trim() === '') {
    return 0;
  }

  const nextAmount = Number(rawValue);

  if (!Number.isFinite(nextAmount)) {
    return null;
  }

  return Math.max(0, nextAmount);
};

const RecurringPriceSelector: React.FC<RecurringPriceSelectorProps> = ({
  value,
  onChange,
}) => {
  const handleAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nextAmount = normalizeAmount(event.target.value);

    if (nextAmount === null) {
      return;
    }

    onChange({
      ...value,
      amount: nextAmount,
    });
  };

  const handleIntervalChange = (interval: string) => {
    const nextInterval: BillingInterval = interval === 'YEAR' ? 'YEAR' : 'MONTH';

    onChange({
      ...value,
      interval: nextInterval,
    });
  };

  return (
    <div className="recurring-price-selector">
      <div className="recurring-price-selector__amount-row">
        <Input
          label="Membership price"
          type="number"
          min={0}
          step="0.01"
          name="membership-recurring-price"
          value={value.amount}
          onChange={handleAmountChange}
        />
        <div
          className="recurring-price-selector__currency"
          aria-label="Currency EUR"
        >
          EUR
        </div>
      </div>

      <RadioGroup
        name="membership-billing-interval"
        label="Billing frequency"
        value={value.interval}
        onChange={handleIntervalChange}
        className="recurring-price-selector__intervals"
      >
        <Radio label="Monthly" value="MONTH" />
        <Radio label="Yearly" value="YEAR" />
      </RadioGroup>

      <div className="recurring-price-selector__summary">
        <strong>{formatRecurringPrice(value)}</strong>
        <span>{formatRecurringChargeSummary(value)}</span>
      </div>
    </div>
  );
};

export default RecurringPriceSelector;
