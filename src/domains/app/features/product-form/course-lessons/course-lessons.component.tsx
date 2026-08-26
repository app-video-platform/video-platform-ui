import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoAddOutline } from 'react-icons/io5';

import LessonEditor from '../editors/lesson-editor/lesson-editor.component';
import { Button, Icon, Input, Radio, RadioGroup } from '@shared/ui';
import { AppDispatch, CourseLesson, LessonCreate, LessonType } from 'core/api/models';
import { selectAuthUser } from 'core/store/auth-store';
import {
  createCourseLesson,
  updateCourseLesson,
} from 'core/store/product-store';
import { getCssVar } from '@shared/utils';

import './course-lessons.styles.scss';

interface CourseLessonsProps {
  productId: string;
  sectionId: string;
  lessons: CourseLesson[];
  // eslint-disable-next-line no-unused-vars
  onLessonsChange: (lessons: CourseLesson[]) => void;
}

const LESSON_TYPE_OPTIONS: Array<{
  type: LessonType;
  label: string;
  description: string;
}> = [
  {
    type: 'VIDEO',
    label: 'Video',
    description: 'A video-based lesson with an intended uploaded asset.',
  },
  {
    type: 'ARTICLE',
    label: 'Article',
    description: 'A written lesson with rich text content.',
  },
  {
    type: 'QUIZ',
    label: 'Quiz',
    description: 'A scored knowledge check with MVP question types.',
  },
];

const normalizeLessonPositions = (lessons: CourseLesson[]) =>
  lessons.map((lesson, index) => ({
    ...lesson,
    position: index + 1,
  }));

const CourseLessons: React.FC<CourseLessonsProps> = ({
  productId,
  sectionId,
  lessons,
  onLessonsChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectAuthUser);
  const [isCreating, setIsCreating] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftType, setDraftType] = useState<LessonType>('VIDEO');
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSavingCreate, setIsSavingCreate] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  const resetCreate = () => {
    setDraftTitle('');
    setDraftType('VIDEO');
    setCreateError(null);
    setIsCreating(false);
  };

  const handleCreateLesson = async () => {
    const title = draftTitle.trim();

    if (!title) {
      setCreateError('Lesson title is required.');
      return;
    }

    if (!user?.id) {
      setCreateError('Creator session is required before lessons can be created.');
      return;
    }

    const payload: LessonCreate = {
      title,
      type: draftType,
      description: '',
      position: lessons.length + 1,
      productId,
      sectionId,
    };

    setIsSavingCreate(true);
    setCreateError(null);

    try {
      const created = await dispatch(createCourseLesson(payload)).unwrap();
      onLessonsChange(normalizeLessonPositions([...lessons, created]));
      resetCreate();
    } catch (error) {
      setCreateError(
        typeof error === 'string' ? error : 'Could not create this lesson.',
      );
    } finally {
      setIsSavingCreate(false);
    }
  };

  const handleLessonChange = (index: number, nextLesson: CourseLesson) => {
    const updated = lessons.map((lesson: CourseLesson, i: number) =>
      i === index ? nextLesson : lesson,
    );
    onLessonsChange(updated);
  };

  const handleRemoveLessonFromList = (index: number) => {
    const updated = lessons.filter((_: CourseLesson, i: number) => i !== index);
    onLessonsChange(normalizeLessonPositions(updated));
  };

  const persistLessonPosition = (lesson: CourseLesson, position: number) => {
    if (!lesson.id) {
      return;
    }

    dispatch(
      updateCourseLesson({
        ...lesson,
        productId,
        sectionId,
        position,
      }),
    )
      .unwrap()
      .catch(() => {
        setOperationError('Could not save lesson order.');
      });
  };

  const handleMoveLesson = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= lessons.length) {
      return;
    }

    const next = [...lessons];
    const [moved] = next.splice(index, 1);
    next.splice(nextIndex, 0, moved);
    const normalized = normalizeLessonPositions(next);

    onLessonsChange(normalized);
    persistLessonPosition(normalized[index], normalized[index].position ?? index + 1);
    persistLessonPosition(
      normalized[nextIndex],
      normalized[nextIndex].position ?? nextIndex + 1,
    );
  };

  return (
    <div className="course-lessons">
      <div className="course-lessons-header">
        <div>
          <h3>Lessons</h3>
          <p>{lessons.length} lessons in this section</p>
        </div>
        {!isCreating && (
          <Button
            onClick={() => setIsCreating(true)}
            className="add-lesson-button"
            type="button"
            variant="secondary"
            size="sm"
          >
            <Icon
              icon={IoAddOutline}
              color={getCssVar('--text-primary')}
              size={18}
            />
            <span>Add lesson</span>
          </Button>
        )}
      </div>

      {operationError && (
        <p className="course-lessons__error" role="alert">
          {operationError}
        </p>
      )}

      {lessons.length === 0 && !isCreating && (
        <div className="course-lessons__empty">
          <h4>This section has no lessons yet.</h4>
          <p>Add a Video, Article, or Quiz lesson to continue building it.</p>
          <Button type="button" variant="secondary" onClick={() => setIsCreating(true)}>
            Add lesson
          </Button>
        </div>
      )}

      {isCreating && (
        <section
          className="course-lessons__create"
          aria-labelledby={`create-lesson-${sectionId}`}
        >
          <div>
            <h4 id={`create-lesson-${sectionId}`}>Add lesson</h4>
            <p>Create the lesson first, then configure its content.</p>
          </div>
          <Input
            name={`lesson-title-${sectionId}`}
            label="Lesson title"
            value={draftTitle}
            error={createError ?? undefined}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setDraftTitle(event.target.value)
            }
          />
          <RadioGroup
            name={`lesson-type-${sectionId}`}
            label="Lesson type"
            value={draftType}
            onChange={(value) => setDraftType(value as LessonType)}
            className="course-lessons__type-options"
          >
            {LESSON_TYPE_OPTIONS.map((option) => (
              <Radio
                key={option.type}
                value={option.type}
                label={option.label}
                description={option.description}
              />
            ))}
          </RadioGroup>
          <div className="course-lessons__create-actions">
            <Button type="button" variant="tertiary" onClick={resetCreate}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateLesson}
              loading={isSavingCreate}
            >
              Create lesson
            </Button>
          </div>
        </section>
      )}

      <div className="course-lessons__list">
        {lessons.map((lesson, index) => (
          <LessonEditor
            key={lesson.id ?? index}
            index={index}
            lesson={lesson}
            productId={productId}
            sectionId={sectionId}
            removeLessonFromList={handleRemoveLessonFromList}
            onChange={handleLessonChange}
            onMoveUp={() => handleMoveLesson(index, -1)}
            onMoveDown={() => handleMoveLesson(index, 1)}
            canMoveUp={index > 0}
            canMoveDown={index < lessons.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseLessons;
