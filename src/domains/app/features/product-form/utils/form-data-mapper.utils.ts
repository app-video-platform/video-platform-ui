/* eslint-disable indent */
import { AbstractProductBase } from 'core/api/models';
import { selectAuthUser } from 'core/store/auth-store';
import { ProductDraft } from '../models/product-form';

export const mapFormDataToProductPayload = (
  formData: ProductDraft,
  user: ReturnType<typeof selectAuthUser> | null,
): AbstractProductBase => {
  const base = {
    id: formData.id ?? '',
    name: formData.name ?? '',
    description: formData.description,
    price: formData.price,
    pricingModel: formData.pricingModel,
    billingInterval: formData.billingInterval,
    currency: formData.currency,
    status: formData.status ?? ('DRAFT' as const),
    userId: formData.userId ?? user?.id,
  };

  const consDetails = formData.consultationDetails;

  switch (formData.type) {
    case 'COURSE':
      return {
        ...base,
        type: 'COURSE',
      };

    case 'DOWNLOAD':
      return {
        ...base,
        type: 'DOWNLOAD',
      };

    case 'CONSULTATION':
      return {
        ...base,
        type: 'CONSULTATION',
        consultationDetails: {
          bufferAfterMinutes: Number(consDetails?.bufferAfterMinutes),
          bufferBeforeMinutes: Number(consDetails?.bufferBeforeMinutes),
          cancellationPolicy: consDetails?.cancellationPolicy,
          confirmationMessage: consDetails?.confirmationMessage,
          connectedCalendars: consDetails?.connectedCalendars,
          customLocation: consDetails?.customLocation,
          durationMinutes: Number(consDetails?.durationMinutes),
          maxSessionsPerDay: Number(consDetails?.maxSessionsPerDay),
          meetingMethod: consDetails?.meetingMethod,
          weeklyAvailability: consDetails?.weeklyAvailability,
        },
      };

    case 'MEMBERSHIP':
      return {
        ...base,
        type: 'MEMBERSHIP',
      };

    default:
      throw new Error(`Unsupported product type: ${formData.type}`);
  }
};

export const getAutosaveSnapshot = (
  formData: ProductDraft,
): Partial<ProductDraft> => ({
  id: formData.id,
  type: formData.type,
  name: formData.name,
  description: formData.description,
  price: formData.price,
  pricingModel: formData.pricingModel,
  billingInterval: formData.billingInterval,
  currency: formData.currency,
  status: formData.status,
  // CONSULTATION fields if you want autosave to care about them:
  consultationDetails: formData.consultationDetails,
  // 👇 deliberately NO `sections` here
});
