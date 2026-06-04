import { useRef, useState, useEffect } from 'react';

import { AbstractProduct, AppDispatch } from 'core/api/models';
import { getProductById } from 'core/store/product-store';
import { ProductDraft, FormErrors } from '../models/product-form';
import { getAutosaveSnapshot } from '../utils/form-data-mapper.utils';

interface UseProductLoaderParams {
  isEditMode: boolean;
  id?: string;
  dispatch: AppDispatch;
  // eslint-disable-next-line no-unused-vars
  setFormData: (data: ProductDraft) => void;
  // eslint-disable-next-line no-unused-vars
  setErrors: (errors: FormErrors) => void;
  // eslint-disable-next-line no-unused-vars
  setShowRestOfForm: (value: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onProductLoaded?: (product: AbstractProduct) => void;
}

export const useProductLoader = ({
  isEditMode,
  id,
  dispatch,
  setFormData,
  setErrors,
  setShowRestOfForm,
  onProductLoaded,
}: UseProductLoaderParams) => {
  const lastSavedSnapshot = useRef<Partial<ProductDraft> | null>(null);
  const [, setLastSavedAt] = useState<Date | null>(null); // you can also lift this up if needed

  useEffect(() => {
    if (!isEditMode || !id) {
      return;
    }

    dispatch(getProductById({ productId: id }))
      .unwrap()
      .then((product) => {
        const baseData = {
          id: product.id ?? '',
          name: product.name ?? '',
          description: product.description ?? '',
          type: product.type ?? 'COURSE',
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
            consultationDetails: product.consultationDetails,
          };
        }

        setFormData(newData);
        lastSavedSnapshot.current = getAutosaveSnapshot(newData);
        setLastSavedAt(new Date());
        setShowRestOfForm(true);
        onProductLoaded?.(product);
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
    setFormData,
    setErrors,
    setShowRestOfForm,
    onProductLoaded,
  ]);

  return { lastSavedSnapshot };
};
