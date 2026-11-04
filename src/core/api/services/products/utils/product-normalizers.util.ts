import {
  AbstractProduct,
  AbstractProductApiResponse,
  ProductMinimised,
} from 'core/api/models';

export const normalizeProductPrice = (price: unknown): number | 'free' | undefined => {
  if (price === 'free') {
    return 'free';
  }
  if (typeof price !== 'number' && typeof price !== 'string') {
    return undefined;
  }
  if (typeof price === 'string' && !/^\d+(?:\.\d+)?$/.test(price.trim())) {
    return undefined;
  }
  const amount = typeof price === 'string' ? Number(price.trim()) : price;
  if (!Number.isFinite(amount) || amount < 0 || amount > Number.MAX_SAFE_INTEGER) {
    return undefined;
  }
  if (typeof price === 'string') {
    const [whole, fractional = ''] = price.trim().split('.');
    const decimal = fractional.replace(/0+$/, '');
    const canonical = `${whole.replace(/^0+(?=\d)/, '')}${decimal ? `.${decimal}` : ''}`;
    const roundTrip = new Intl.NumberFormat('en-US', {
      useGrouping: false,
      maximumFractionDigits: 20,
    }).format(amount);
    if (roundTrip !== canonical) {
      return undefined;
    }
  }
  return amount;
};

export const normalizeProductResponse = (
  response: AbstractProductApiResponse,
): AbstractProduct => {
  const product = { ...response, price: normalizeProductPrice(response.price) } as AbstractProduct & AbstractProductApiResponse;
  switch (product.type) {
  case 'COURSE':
  case 'DOWNLOAD': {
    const hasTopLevelSections =
      Array.isArray(product.sections) && product.sections.length > 0;
    const detailsSections = product.details?.sections;

    if (!hasTopLevelSections && Array.isArray(detailsSections)) {
      return {
        ...product,
        sections: detailsSections,
      };
    }

    return product;
  }

  case 'CONSULTATION': {
    const details =
      product.details as
        | { consultationDetails?: AbstractProduct['consultationDetails'] }
        | AbstractProduct['consultationDetails']
        | null
        | undefined;
    const detailsConsultation =
      details && typeof details === 'object' && 'consultationDetails' in details
        ? details.consultationDetails
        : (details as AbstractProduct['consultationDetails'] | undefined);

    if (!product.consultationDetails && detailsConsultation) {
      return {
        ...product,
        consultationDetails: detailsConsultation,
      };
    }

    return product;
  }

  default:
    return product;
  }
};

export const normalizeProductSummary = (
  product: ProductMinimised,
): ProductMinimised => ({ ...product, price: normalizeProductPrice(product.price) });
