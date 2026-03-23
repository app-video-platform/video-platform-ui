import {
  AbstractProduct,
  AbstractProductApiResponse,
  ProductMinimised,
} from 'core/api/models';

export const normalizeProductResponse = (
  product: AbstractProductApiResponse,
): AbstractProduct => {
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
): ProductMinimised => product;
