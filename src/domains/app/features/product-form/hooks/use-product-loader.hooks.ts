import { useRef, useState, useEffect, useLayoutEffect } from 'react';

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

  const onLoadedRef = useRef(onProductLoaded);
  useLayoutEffect(() => { onLoadedRef.current = onProductLoaded; });

  useEffect(() => {
    if (!isEditMode || !id) {
      return;
    }

    let active = true;
    setShowRestOfForm(false);
    setErrors({});
    dispatch(getProductById({ productId: id }))
      .unwrap()
      .then((product) => {
        if (!active) {return;}
        const baseData = {
          id: product.id ?? '',
          name: product.name ?? '',
          description: product.description ?? '',
          type: product.type ?? 'COURSE',
          price: product.price ?? 'free',
          pricingModel: product.pricingModel,
          billingInterval: product.billingInterval,
          currency: product.currency,
          status: product.status,
          imageUrl: product.imageUrl,
          galleryImages: product.galleryImages,
          promoVideo: product.promoVideo,
          userId: product.userId,
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
        } else if (product.type === 'MEMBERSHIP') {
          newData = baseData;
        }

        setFormData(newData);
        lastSavedSnapshot.current = getAutosaveSnapshot(newData);
        setLastSavedAt(new Date());
        setShowRestOfForm(true);
        onLoadedRef.current?.(product);
      })
      .catch((error) => {
        if (!active) {return;}
        // eslint-disable-next-line no-console
        console.error('Failed to load product data', error);
        setErrors({ api: 'Could not load product data' });
      });
    return () => { active = false; };
  }, [
    dispatch,
    id,
    isEditMode,
    setFormData,
    setErrors,
    setShowRestOfForm,
  ]);

  return { lastSavedSnapshot };
};
