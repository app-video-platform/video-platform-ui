/* eslint-disable no-console */
import { useState, useRef, useEffect } from 'react';

import { selectAuthUser } from 'core/store/auth-store';
import { updateCourseProductDetails } from 'core/store/product-store';
import { ProductDraft } from '../models/product-form';
import {
  getAutosaveSnapshot,
  mapFormDataToProductPayload,
} from '../utils/form-data-mapper.utils';
import { AppDispatch } from 'core/api/models';

interface UseProductAutosaveParams {
  formData: ProductDraft;
  user: ReturnType<typeof selectAuthUser> | null;
  showRestOfForm: boolean;
  dispatch: AppDispatch;
}

export const useProductAutosave = ({
  formData,
  user,
  showRestOfForm,
  dispatch,
}: UseProductAutosaveParams) => {
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const lastSavedSnapshot = useRef<Partial<ProductDraft> | null>(null);

  useEffect(() => {
    if (!formData.id) {
      return;
    }
    if (!user || !user.id) {
      return;
    }
    if (!showRestOfForm) {
      return;
    }

    const currentSnapshot = getAutosaveSnapshot(formData);

    if (!lastSavedSnapshot.current) {
      lastSavedSnapshot.current = currentSnapshot;
      return;
    }

    const hasChanges =
      JSON.stringify(currentSnapshot) !==
      JSON.stringify(lastSavedSnapshot.current);

    if (!hasChanges) {
      return;
    }

    setIsAutosaving(true);

    const timeoutId = window.setTimeout(() => {
      try {
        const productData = mapFormDataToProductPayload(formData, user);

        dispatch(updateCourseProductDetails(productData))
          .unwrap()
          .then(() => {
            lastSavedSnapshot.current = currentSnapshot;
            setLastSavedAt(new Date());
          })
          .catch((error) => {
            console.error('Autosave failed:', error);
          })
          .finally(() => {
            setIsAutosaving(false);
          });
      } catch (e) {
        console.error('Autosave mapping error:', e);
        setIsAutosaving(false);
      }
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [formData, user, showRestOfForm, dispatch]);

  return { isAutosaving, lastSavedAt };
};
