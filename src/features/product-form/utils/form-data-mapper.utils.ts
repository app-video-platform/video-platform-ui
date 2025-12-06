/* eslint-disable indent */
import { AbstractProductBase } from '@api/models';
import { selectAuthUser } from '@store/auth-store';
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
    status: 'DRAFT' as const,
    userId: user?.id,
  };

  switch (formData.type) {
    case 'COURSE':
      return {
        ...base,
        type: 'COURSE',
        // sections: formData.sections ?? [],
      };

    case 'DOWNLOAD':
      return {
        ...base,
        type: 'DOWNLOAD',
        sections: formData.sections ?? [],
      };

    // case 'CONSULTATION':
    //   return {
    //     ...base,
    //     type: 'CONSULTATION',
    //     meetingMethod: formData.meetingMethod as MeetingMethod,
    //     durationMinutes: formData.durationMinutes,
    //     customLocation: formData.customLocation,
    //     bufferBeforeMinutes: formData.bufferBeforeMinutes,
    //     bufferAfterMinutes: formData.bufferAfterMinutes,
    //     maxSessionsPerDay: formData.maxSessionsPerDay,
    //     confirmationMessage: formData.confirmationMessage,
    //     cancellationPolicy: formData.cancellationPolicy,
    //     connectedCalendars: formData.connectedCalendars,
    //   };

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
  status: formData.status,
  // CONSULTATION fields if you want autosave to care about them:
  durationMinutes: formData.durationMinutes,
  meetingMethod: formData.meetingMethod,
  customLocation: formData.customLocation,
  bufferBeforeMinutes: formData.bufferBeforeMinutes,
  bufferAfterMinutes: formData.bufferAfterMinutes,
  maxSessionsPerDay: formData.maxSessionsPerDay,
  confirmationMessage: formData.confirmationMessage,
  cancellationPolicy: formData.cancellationPolicy,
  connectedCalendars: formData.connectedCalendars,
  // 👇 deliberately NO `sections` here
});
