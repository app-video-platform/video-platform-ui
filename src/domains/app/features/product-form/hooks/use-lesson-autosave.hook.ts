/* eslint-disable no-console */
import { useState, useRef, useEffect } from 'react';

import { selectAuthUser } from 'core/store/auth-store';
import { updateLessonDetails } from 'core/store/product-store';
import { CourseLesson, AppDispatch } from 'core/api/models';

interface UseLessonAutosaveParams {
  lesson: CourseLesson;
  productId: string;
  sectionId: string;
  user: ReturnType<typeof selectAuthUser> | null;
  dispatch: AppDispatch;
}

export const useLessonAutosave = ({
  lesson,
  productId,
  user,
  sectionId,
  dispatch,
}: UseLessonAutosaveParams) => {
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const lastSavedSnapshot = useRef<Partial<CourseLesson> | null>(null);

  useEffect(() => {
    if (!lesson.id) {
      return;
    }
    if (!user || !user.id) {
      return;
    }

    if (!lastSavedSnapshot.current) {
      lastSavedSnapshot.current = lesson;
      return;
    }

    const hasChanges =
      JSON.stringify(lesson) !== JSON.stringify(lastSavedSnapshot.current);

    if (!hasChanges) {
      return;
    }

    setIsAutosaving(true);

    const timeoutId = window.setTimeout(() => {
      try {
        const updateLessonPayload: CourseLesson = {
          ...lesson,
          id: lesson.id,
          productId,
          sectionId,
          position: lesson.position,
        };

        dispatch(updateLessonDetails(updateLessonPayload))
          .unwrap()
          .then(() => {
            lastSavedSnapshot.current = lesson;
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
  }, [lesson, productId, user, sectionId, dispatch]);

  return { isAutosaving, lastSavedAt };
};
