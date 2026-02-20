/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { JSONContent } from '@tiptap/react';

import { GalBoxSelector } from 'domains/app/components';
import QuizWizard from '../../quiz-wizard/quiz-wizard.component';
import {
  GalUppyFileUploader,
  GalRichTextEditor,
  GalIcon,
  Button,
  Textarea,
  ExpansionPanel,
} from '@shared/ui';
import {
  CourseLesson,
  LessonCreate,
  IRemoveItemPayload,
  LessonType,
  AppDispatch,
} from 'core/api/models';
import { selectAuthUser } from 'core/store/auth-store';
import { createLesson, deleteLesson } from 'core/store/product-store';
import { EditableTitle } from '../editable-title';
import { LESSON_META } from 'core/constants';
import { useLessonAutosave } from 'domains/app/features/product-form/hooks';

import './lesson-editor.styles.scss';

interface LessonEditorProps {
  lesson: CourseLesson;
  index: number;
  sectionId: string;
  // eslint-disable-next-line no-unused-vars
  removeLessonFromList: (index: number) => void;
  // eslint-disable-next-line no-unused-vars
  onChange: (index: number, lesson: CourseLesson) => void;
}

const LessonEditor: React.FC<LessonEditorProps> = ({
  lesson,
  index,
  sectionId,
  removeLessonFromList,
  onChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectAuthUser);

  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [contentJSON, setContentJSON] = React.useState<JSONContent | null>(
    null,
  );

  const [isLessonCreated, setIsLessonCreated] = useState(false);

  const { isAutosaving, lastSavedAt } = useLessonAutosave({
    lesson,
    user,
    sectionId,
    dispatch,
  });

  useEffect(() => {
    if (isLessonCreated) {
      return;
    }
    if (lesson && lesson.id) {
      setIsLessonCreated(true);
    }
    if (!lesson.id && lesson.type && lesson.title) {
      handleCreateLesson();
    }
  }, [lesson]);

  const updateLesson = (patch: Partial<CourseLesson>) => {
    const next: CourseLesson = {
      ...lesson,
      ...patch,
    };
    onChange(index, next);
  };

  const handleCreateLesson = () => {
    // Logic to create a new lesson
    if (!user || !user.id) {
      console.error('User ID is not available');
      return;
    }

    if (!lesson.title) {
      window.alert('Lesson title is required');
      return;
    }
    if (!lesson.type) {
      window.alert('Lesson type is required');
      return;
    }

    const createLessonPayload: LessonCreate = {
      title: lesson.title,
      type: lesson.type, //Default to VIDEO if not specified
      description: lesson.description ?? '',
      position: index + 1, // Assuming position is based on the index
      sectionId: sectionId, // Assuming lesson has a sectionId
      userId: user.id, // User ID from the auth state
    };

    dispatch(createLesson(createLessonPayload))
      .unwrap()
      .then((response) => {
        updateLesson({ id: response.id });
        setIsLessonCreated(true);
      });
  };

  const onVideoUploadChange = (files: File[]) => {
    setUploadedVideo(files[0] || null);
  };

  const handleDeleteLesson = () => {
    if (!user || !user.id) {
      console.error('User ID is not available for deletion');
      return;
    }
    if (lesson.id) {
      const removeLessonPayload: IRemoveItemPayload = {
        id: lesson.id, //Use the ID from formData
        userId: user.id, // Ensure user ID is available
      };

      dispatch(deleteLesson(removeLessonPayload))
        .unwrap()
        .then(() => {
          console.info('Lesson deleted successfully');
          removeLessonFromList(index);
        })
        .catch((error) => {
          console.error('Failed to delete lesson:', error);
        });
    } else {
      removeLessonFromList(index);
      console.warn('No lesson ID found, removing from list only');
    }
  };

  const renderContentField = () => {
    switch (lesson.type) {
      case 'VIDEO':
        return (
          <GalUppyFileUploader
            onFilesChange={onVideoUploadChange}
            allowedFileTypes={['video/*']}
          />
        );

      case 'ARTICLE':
        return (
          <div className="form-input-group">
            <GalRichTextEditor
              initialContent={contentJSON ?? {}}
              onChange={(json) => setContentJSON(json)}
            />
          </div>
        );

      case 'QUIZ':
        return <QuizWizard lesson={lesson} updateLesson={updateLesson} />;

      case 'ASSIGNMENT':
        return (
          <div className="assignment-editor-placeholder">
            <p>Assignment editor will go here.</p>
          </div>
        );

      default:
        //If no valid type is selected, return null or a message
        return null;
    }
  };

  return (
    <ExpansionPanel
      className="lesson-editor"
      id={`lesson-${lesson.id}`}
      defaultExpanded={true}
      hideToggle={!lesson.id}
      header={
        <div className="lesson-editor-header">
          <div className="lesson-title-block">
            <GalIcon
              icon={
                LESSON_META[(lesson.type as LessonType) ?? 'ASSIGNMENT'].icon
              }
              color={
                LESSON_META[(lesson.type as LessonType) ?? 'ASSIGNMENT'].color
              }
              size={24}
            />
            <EditableTitle
              value={lesson.title ?? ''}
              placeholder={`Untitled lesson ${index + 1}`}
              onChange={(title: string) => updateLesson({ title })}
              small
            />
          </div>
          <Button type="button" onClick={handleDeleteLesson} variant="remove">
            Remove
          </Button>
        </div>
      }
    >
      <>
        <div className="lesson-type-selectors">
          <GalBoxSelector<LessonType>
            selectedOption={lesson.type}
            selectFor="lesson"
            onSelect={(type) => updateLesson({ type })}
            availableOptions={['VIDEO', 'ARTICLE', 'QUIZ']} // Example lesson types
            disabledOptions={[]} //Add any disabled options if needed
          />
        </div>
        <div className="content-field">
          {isLessonCreated && (
            <>
              <Textarea
                value={lesson.description ?? ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  updateLesson({ description: e.target.value })
                }
                placeholder="Write a short description for this lesson..."
                isMaxLengthShown={true}
                maxLength={250}
                className="lesson-description"
                block
              />
              <div className="lesson-content-wrapper">
                {renderContentField()}
              </div>
            </>
          )}
        </div>
      </>
    </ExpansionPanel>
  );
};

export default LessonEditor;
