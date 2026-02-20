/* eslint-disable no-console */
import { useState, useRef, useEffect } from 'react';

import { selectAuthUser } from 'core/store/auth-store';
import { updateSectionDetails } from 'core/store/product-store';
import { SectionDraft } from '../models/product-form';
import { CourseSectionUpdateRequest, AppDispatch } from 'core/api/models';

interface UseSectionAutosaveParams {
  section: SectionDraft;
  productId: string;
  user: ReturnType<typeof selectAuthUser> | null;
  dispatch: AppDispatch;
}

const getAutosaveSnapshot = (section: SectionDraft): Partial<SectionDraft> => ({
  id: section.id,
  title: section.title,
  description: section.description,
  position: section.position,
});

export const useSectionAutosave = ({
  section,
  user,
  productId,
  dispatch,
}: UseSectionAutosaveParams) => {
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const lastSavedSnapshot = useRef<Partial<SectionDraft> | null>(null);

  useEffect(() => {
    if (!section.id) {
      return;
    }
    if (!user || !user.id) {
      return;
    }

    const currentSnapshot = getAutosaveSnapshot(section);

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
        const updatedSection: CourseSectionUpdateRequest = {
          ...section,
          productId,
          id: section.id ?? '',
          userId: user.id ?? '',
        };

        dispatch(updateSectionDetails(updatedSection))
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
  }, [section, user, productId, dispatch]);

  return { isAutosaving, lastSavedAt };
};
