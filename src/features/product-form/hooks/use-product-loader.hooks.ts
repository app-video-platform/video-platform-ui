import { useRef, useState, useEffect } from 'react';

import { ProductType, AppDispatch } from '@api/models';
import { getProductByProductId } from '@store/product-store';
import { ProductDraft, FormErrors } from '../models/product-form';
import { getAutosaveSnapshot } from '../utils/form-data-mapper.utils';

interface UseProductLoaderParams {
  isEditMode: boolean;
  id?: string;
  type: ProductType;
  dispatch: AppDispatch;
  // eslint-disable-next-line no-unused-vars
  setFormData: (data: ProductDraft) => void;
  // eslint-disable-next-line no-unused-vars
  setErrors: (errors: FormErrors) => void;
  // eslint-disable-next-line no-unused-vars
  setShowRestOfForm: (value: boolean) => void;
}

export const useProductLoader = ({
  isEditMode,
  id,
  type,
  dispatch,
  setFormData,
  setErrors,
  setShowRestOfForm,
}: UseProductLoaderParams) => {
  const lastSavedSnapshot = useRef<Partial<ProductDraft> | null>(null);
  const [, setLastSavedAt] = useState<Date | null>(null); // you can also lift this up if needed

  useEffect(() => {
    if (!isEditMode || !id) {
      return;
    }

    dispatch(
      getProductByProductId({
        productId: id,
        productType: type,
      }),
    )
      .unwrap()
      .then((product) => {
        const baseData = {
          id: product.id ?? '',
          name: product.name ?? '',
          description: product.description ?? '',
          type: product.type ?? ('COURSE' as ProductType),
          price: product.price ?? 'free',
        };

        let newData: ProductDraft = baseData;

        if (product.type === 'COURSE' || product.type === 'DOWNLOAD') {
          newData = {
            ...baseData,
            sections: product.sections || [],
          };
        } else if (product.type === 'CONSULTATION') {
          newData = {
            ...baseData,
            durationMinutes: product.durationMinutes ?? 60,
            meetingMethod: product.meetingMethod ?? 'ZOOM',
            customLocation: product.customLocation ?? '',
            bufferBeforeMinutes: product.bufferBeforeMinutes ?? 0,
            bufferAfterMinutes: product.bufferAfterMinutes ?? 0,
            cancellationPolicy: product.cancellationPolicy ?? '',
            maxSessionsPerDay: product.maxSessionsPerDay ?? 1,
            confirmationMessage: product.confirmationMessage ?? '',
          };
        }

        setFormData(newData);
        lastSavedSnapshot.current = getAutosaveSnapshot(newData);
        setLastSavedAt(new Date());
        setShowRestOfForm(true);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Failed to load product data', error);
        setErrors({ api: 'Could not load product data' });
      });
  }, [
    dispatch,
    id,
    isEditMode,
    type,
    setFormData,
    setErrors,
    setShowRestOfForm,
  ]);

  return { lastSavedSnapshot };
};
