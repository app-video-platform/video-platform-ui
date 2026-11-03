import { useNestedAutosave } from './use-nested-autosave.hook';

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
}: UseLessonAutosaveParams) => useNestedAutosave({ ...lesson, productId, sectionId }, Boolean(lesson.id && user?.id),
  (value) => dispatch(updateLessonDetails(value)).unwrap());
