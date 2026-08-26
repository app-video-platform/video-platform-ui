/* eslint-disable indent */
import React, { useMemo, useState } from 'react';
import { JSONContent } from '@tiptap/react';
import {
  HiArrowDown,
  HiArrowUp,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';

import QuizWizard from '../../quiz-wizard/quiz-wizard.component';
import {
  Button,
  Drawer,
  Icon,
  Radio,
  RadioGroup,
  RichTextEditor,
  StatusBadge,
  Textarea,
  UppyFileUploader,
} from '@shared/ui';
import { AppDispatch, CourseLesson, LessonType } from 'core/api/models';
import { deleteCourseLesson } from 'core/store/product-store';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthUser } from 'core/store/auth-store';
import { EditableTitle } from '../editable-title';
import { LESSON_META } from 'core/constants';
import { useLessonAutosave } from 'domains/app/features/product-form/hooks';
import { getCssVar } from '@shared/utils';

import './lesson-editor.styles.scss';

interface LessonEditorProps {
  lesson: CourseLesson;
  index: number;
  productId: string;
  sectionId: string;
  // eslint-disable-next-line no-unused-vars
  removeLessonFromList: (index: number) => void;
  // eslint-disable-next-line no-unused-vars
  onChange: (index: number, lesson: CourseLesson) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

const editableLessonTypes: Array<{
  type: LessonType;
  label: string;
  description: string;
}> = [
  {
    type: 'VIDEO',
    label: 'Video',
    description: 'Use for lessons centered on a video asset.',
  },
  {
    type: 'ARTICLE',
    label: 'Article',
    description: 'Use for written lessons with rich text content.',
  },
  {
    type: 'QUIZ',
    label: 'Quiz',
    description: 'Use for MVP single-choice, multi-choice, and true/false checks.',
  },
];

const getTypeLabel = (type?: LessonType) => {
  switch (type) {
    case 'VIDEO':
      return 'Video';
    case 'ARTICLE':
      return 'Article';
    case 'QUIZ':
      return 'Quiz';
    default:
      return 'Lesson';
  }
};

const parseArticleContent = (content?: string): JSONContent | undefined => {
  if (!content) {
    return undefined;
  }

  try {
    return JSON.parse(content) as JSONContent;
  } catch {
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: content }],
        },
      ],
    };
  }
};

const LessonEditor: React.FC<LessonEditorProps> = ({
  lesson,
  index,
  productId,
  sectionId,
  removeLessonFromList,
  onChange,
  onMoveUp = () => undefined,
  onMoveDown = () => undefined,
  canMoveUp = false,
  canMoveDown = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectAuthUser);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);
  const videoBackendPendingMessage =
    'Course video asset persistence is backend-pending; this records the ' +
    'intended video lesson state without pretending the file is uploaded.';

  const { isAutosaving, lastSavedAt } = useLessonAutosave({
    lesson,
    productId,
    user,
    sectionId,
    dispatch,
  });

  const articleInitialContent = useMemo(
    () => parseArticleContent(lesson.content),
    [lesson.id],
  );

  const updateLesson = (patch: Partial<CourseLesson>) => {
    const next: CourseLesson = {
      ...lesson,
      ...patch,
      productId,
      sectionId,
    };
    onChange(index, next);
  };

  const handleDeleteLesson = () => {
    if (!lesson.id) {
      removeLessonFromList(index);
      return;
    }

    dispatch(
      deleteCourseLesson({
        productId,
        sectionId,
        lessonId: lesson.id,
      }),
    )
      .unwrap()
      .then(() => {
        removeLessonFromList(index);
      })
      .catch((error) => {
        setOperationError(
          typeof error === 'string'
            ? error
            : 'Could not delete this lesson. Try again.',
        );
      });
  };

  const onVideoUploadChange = (files: File[]) => {
    const file = files[0] ?? null;
    setVideoFileName(file?.name ?? null);
    if (file) {
      updateLesson({
        videoUrl: `pending-video-asset://${encodeURIComponent(file.name)}`,
      });
    }
  };

  const handleArticleChange = (json: JSONContent) => {
    updateLesson({ content: JSON.stringify(json) });
  };

  const renderContentField = () => {
    switch (lesson.type) {
      case 'VIDEO':
        return (
          <div className="lesson-drawer__backend-note">
            <UppyFileUploader
              onFilesChange={onVideoUploadChange}
              allowedFileTypes={['video/*']}
            />
            <p>
              {videoFileName
                ? `${videoFileName} is selected for this lesson. Durable Course video upload remains backend-pending.`
                : videoBackendPendingMessage}
            </p>
          </div>
        );

      case 'ARTICLE':
        return (
          <div className="form-input-group">
            <RichTextEditor
              initialContent={articleInitialContent}
              onChange={handleArticleChange}
            />
          </div>
        );

      case 'QUIZ':
        return <QuizWizard lesson={lesson} updateLesson={updateLesson} />;

      default:
        return (
          <p className="lesson-drawer__backend-note">
            Choose Video, Article, or Quiz for this MVP Course lesson.
          </p>
        );
    }
  };

  const lessonType = lesson.type ?? 'VIDEO';
  const typeLabel = getTypeLabel(lesson.type);
  const meta = LESSON_META[lessonType];
  const lessonTitle = lesson.title || `Untitled lesson ${index + 1}`;

  return (
    <div className="lesson-editor" id={`lesson-${lesson.id ?? index}`}>
      <div className="lesson-row">
        <span className="lesson-row__type">
          <Icon icon={meta.icon} color={meta.color} size={18} />
          <span>{typeLabel}</span>
        </span>
        <div className="lesson-row__title">
          <strong>{lessonTitle}</strong>
          {lesson.description && <span>{lesson.description}</span>}
        </div>
        <StatusBadge
          label={isAutosaving ? 'Saving' : lastSavedAt ? 'Saved' : 'Draft'}
          tone={isAutosaving ? 'info' : 'neutral'}
          size="sm"
        />
        <div className="lesson-row__actions">
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            aria-label={`Move ${lessonTitle} up`}
          >
            <Icon icon={HiArrowUp} size={16} color={getCssVar('--text-primary')} />
            <span>Up</span>
          </Button>
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            aria-label={`Move ${lessonTitle} down`}
          >
            <Icon
              icon={HiArrowDown}
              size={16}
              color={getCssVar('--text-primary')}
            />
            <span>Down</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsDrawerOpen(true)}
            aria-label={`Edit ${lessonTitle}`}
          >
            <Icon
              icon={HiOutlinePencil}
              size={16}
              color={getCssVar('--text-primary')}
            />
            <span>Edit</span>
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => setIsConfirmingDelete(true)}
            aria-label={`Delete ${lessonTitle}`}
          >
            <Icon
              icon={HiOutlineTrash}
              size={16}
              color={getCssVar('--text-primary')}
            />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {operationError && (
        <p className="lesson-row__error" role="alert">
          {operationError}
        </p>
      )}

      {isConfirmingDelete && (
        <div className="lesson-row__confirm" role="alertdialog">
          <div>
            <strong>Delete {lessonTitle}?</strong>
            <p>This removes the lesson from this Course section.</p>
          </div>
          <div>
            <Button
              type="button"
              variant="tertiary"
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={handleDeleteLesson}>
              Delete lesson
            </Button>
          </div>
        </div>
      )}

      <Drawer
        open={isDrawerOpen}
        title={
          <div className="lesson-drawer__title">
            <span>{typeLabel}</span>
            <strong>{lessonTitle}</strong>
          </div>
        }
        onClose={() => setIsDrawerOpen(false)}
        closeLabel={`Close ${lessonTitle} editor`}
        className="lesson-editor-drawer"
      >
        <div className="lesson-drawer">
          <EditableTitle
            value={lesson.title ?? ''}
            placeholder={`Untitled lesson ${index + 1}`}
            onChange={(title: string) => updateLesson({ title })}
          />

          <RadioGroup
            name={`edit-lesson-type-${lesson.id ?? index}`}
            label="Lesson type"
            value={lessonType}
            onChange={(type) => updateLesson({ type: type as LessonType })}
            className="lesson-drawer__types"
          >
            {editableLessonTypes.map((option) => (
              <Radio
                key={option.type}
                value={option.type}
                label={option.label}
                description={option.description}
              />
            ))}
          </RadioGroup>

          <Textarea
            label="Lesson description"
            name={`lesson-description-${lesson.id ?? index}`}
            value={lesson.description ?? ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              updateLesson({ description: e.target.value })
            }
            placeholder="Write a short description for this lesson."
            block
          />

          <section className="lesson-drawer__content">
            <h3>{typeLabel} content</h3>
            {renderContentField()}
          </section>
        </div>
      </Drawer>
    </div>
  );
};

export default LessonEditor;
