import { useMemo } from 'react';

import { CourseProductSection, CourseLesson } from '@api/models';
import { BuilderSectionNavItem } from '../builder-sidebar';
import { ProductDraft } from '../models/product-form';

export const useSidebarSections = (
  formData: ProductDraft,
): BuilderSectionNavItem[] | undefined =>
  useMemo(() => {
    if (formData.type === 'CONSULTATION') {
      return;
    }

    if (formData.type === 'COURSE') {
      return (formData.sections || []).map((section, idx) => ({
        id: section.id,
        title: section.title,
        position: idx + 1,
        lessons: ((section as CourseProductSection).lessons || []).map(
          (lesson: CourseLesson, index) => ({
            id: lesson.id ?? index.toString(),
            title: lesson.title ?? '',
            position: lesson.position ?? index,
            type: lesson.type,
          }),
        ),
      }));
    }

    if (formData.type === 'DOWNLOAD') {
      // whatever you want here later
      return (formData.sections || []).map((section, idx) => ({
        id: section.id,
        title: section.title,
        position: idx + 1,
        lessons: [],
      }));
    }

    return;
  }, [formData.type, formData.sections]);

export const useSidebarScroll = () => {
  const handleSidebarSectionClick = (sectionId: string) => {
    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSidebarLessonClick = (lessonId: string) => {
    const el = document.getElementById(`lesson-${lessonId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return { handleSidebarSectionClick, handleSidebarLessonClick };
};
