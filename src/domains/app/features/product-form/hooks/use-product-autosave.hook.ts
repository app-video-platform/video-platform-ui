/* eslint-disable no-console */
import { useState, useRef, useEffect, useCallback } from 'react';

import { selectAuthUser } from 'core/store/auth-store';
import { updateProductDetails } from 'core/store/product-store';
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
  const [hasPendingAutosave, setHasPendingAutosave] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const lastSavedSnapshot = useRef<Partial<ProductDraft> | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const clearPendingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const saveProduct = useCallback(
    async (snapshot: Partial<ProductDraft>) => {
      const productData = mapFormDataToProductPayload(formData, user);

      setIsAutosaving(true);
      setHasPendingAutosave(false);

      try {
        await dispatch(updateProductDetails(productData)).unwrap();
        lastSavedSnapshot.current = snapshot;
        setLastSavedAt(new Date());
      } catch (error) {
        console.error('Autosave failed:', error);
        throw error;
      } finally {
        setIsAutosaving(false);
      }
    },
    [dispatch, formData, user],
  );

  const flushAutosave = useCallback(async () => {
    if (!formData.id || !user?.id || !showRestOfForm) {
      return;
    }

    const currentSnapshot = getAutosaveSnapshot(formData);
    const hasChanges =
      JSON.stringify(currentSnapshot) !==
      JSON.stringify(lastSavedSnapshot.current);

    if (!hasChanges) {
      clearPendingTimeout();
      setHasPendingAutosave(false);
      return;
    }

    clearPendingTimeout();
    await saveProduct(currentSnapshot);
  }, [clearPendingTimeout, formData, saveProduct, showRestOfForm, user?.id]);

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

    setHasPendingAutosave(true);

    const timeoutId = window.setTimeout(() => {
      try {
        void saveProduct(currentSnapshot).catch(() => undefined);
      } catch (e) {
        console.error('Autosave mapping error:', e);
        setHasPendingAutosave(false);
        setIsAutosaving(false);
      }
    }, 2000);
    timeoutRef.current = timeoutId;

    return () => {
      if (timeoutRef.current === timeoutId) {
        timeoutRef.current = null;
      }
      window.clearTimeout(timeoutId);
    };
  }, [formData, user, showRestOfForm, saveProduct]);

  return { isAutosaving, hasPendingAutosave, lastSavedAt, flushAutosave };
};
