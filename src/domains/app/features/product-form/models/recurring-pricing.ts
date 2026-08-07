export type BillingInterval = 'MONTH' | 'YEAR';

export interface RecurringPricing {
  amount: number;
  currency: 'EUR';
  interval: BillingInterval;
}

export const DEFAULT_RECURRING_PRICING: RecurringPricing = {
  amount: 0,
  currency: 'EUR',
  interval: 'MONTH',
};

const formatCurrency = (amount: number, currency: RecurringPricing['currency']) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

const intervalLabel = (interval: BillingInterval) =>
  interval === 'YEAR' ? 'year' : 'month';

export const formatRecurringPrice = (pricing: RecurringPricing) =>
  `${formatCurrency(pricing.amount, pricing.currency)} / ${intervalLabel(
    pricing.interval,
  )}`;

export const formatRecurringChargeSummary = (pricing: RecurringPricing) =>
  `Members will be charged ${formatCurrency(
    pricing.amount,
    pricing.currency,
  )} every ${intervalLabel(pricing.interval)}.`;
