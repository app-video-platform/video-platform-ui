/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable indent */
import React, { use, useEffect, useState } from 'react';

import FormInput from '../../../../../components/form-input/form-input.component';
import Button from '../../../../../components/button/button.component';
import { AppDispatch } from '../../../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  createLesson,
  deleteLesson,
  updateLessonDetails,
} from '../../../../../store/product-store/product.slice';
import BoxSelector from '../../../../../components/box-selector/box-selector.component';
import UppyFileUploader from '../../../../../components/uppy-file-uploader/uppy-file-uploader.component';
import RichTextEditor from '../../../../../components/rich-text-editor/rich-text-editor.component';
import {
  ICreateLessonPayload,
  ILesson,
} from '../../../../../api/models/product/lesson';
import { LessonType } from '../../../../../api/models/product/product.types';

import { MdDeleteForever } from 'react-icons/md';
import './lesson-editor.styles.scss';
import { set } from 'react-hook-form';
import { selectAuthUser } from '../../../../../store/auth-store/auth.selectors';
import { IRemoveItemPayload } from '../../../../../api/models/product/product';

interface LessonEditorProps {
  lesson: ILesson;
  index: number;
  sectionId: string;
  removeLessonFromList: (index: number) => void;
}

interface LessonFormData {
  id?: string; // Optional, will be set after lesson creation
  title: string;
  description: string;
  content: string;
  type?: LessonType; // Optional, depending on your requirements
}

const LessonEditor: React.FC<LessonEditorProps> = ({
  lesson,
  index,
  sectionId,
  removeLessonFromList,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectAuthUser);

  const [formData, setFormData] = React.useState<LessonFormData>({
    title: '',
    description: '',
    content: '',
    type: '' as LessonType,
    id: lesson.id || '', // Set the ID if it exists
  });

  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [contentJSON, setContentJSON] = React.useState<any>(null);

  const [isLessonCreated, setIsLessonCreated] = useState(false);

  useEffect(() => {
    console.log('LessonEditor useEffect triggered with lesson:', lesson);

    if (lesson) {
      console.log('Lesson data received:', lesson);

      setFormData({
        title: lesson.title || '',
        description: lesson.description || '',
        content: lesson.content || '',
        id: lesson.id || '',
        type: lesson.type || ('VIDEO' as LessonType),
      });
    }

    if (lesson && lesson.id) {
      setIsLessonCreated(true);
    }
  }, [lesson]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateLesson = () => {
    // Logic to create a new lesson
    console.log('Creating lesson with data:', formData);

    if (!user || !user.id) {
      console.error('User ID is not available');
      return;
    }

    if (!formData.title) {
      window.alert('Lesson title is required');
      return;
    }
    if (!formData.type) {
      window.alert('Lesson type is required');
      return;
    }

    const createLessonPayload: ICreateLessonPayload = {
      title: formData.title,
      type: formData.type, // Default to VIDEO if not specified
      description: formData.description,
      position: index + 1, // Assuming position is based on the index
      sectionId: sectionId, // Assuming lesson has a sectionId
      userId: user.id, // User ID from the auth state
    };

    dispatch(createLesson(createLessonPayload))
      .unwrap()
      .then((response) => {
        setFormData({
          title: response.title,
          description: response.description ?? '',
          content: '',
          id: response.id, // Set the ID after creation
          type: response.type || ('VIDEO' as LessonType), // Default to VIDEO if not specified
        });
        console.log('Lesson created successfully:', response);
        setIsLessonCreated(true);
      })
      .catch((error) => {
        console.error('Failed to create lesson:', error);
      });
  };

  const handleUpdateLesson = () => {
    if (!user || !user.id) {
      console.error('User ID is not available for update');
      return;
    }
    // Logic to update an existing lesson
    console.log('Updating lesson with data:', formData);

    const lessonId = lesson.id ?? formData.id;

    if (!lessonId) {
      console.error('Lesson ID is not available for update');
      return;
    }

    const updateLessonPayload: ILesson = {
      ...formData,
      id: lessonId,
      sectionId: sectionId, // Assuming lesson has a sectionId
      position: index + 1, // Assuming position is based on the index
      userId: user.id, // User ID from the auth state
    };

    dispatch(updateLessonDetails(updateLessonPayload))
      .unwrap()
      .then((response) => {
        console.log('Lesson updated successfully:', response);
      })
      .catch((error) => {
        console.error('Failed to update lesson:', error);
      });
  };

  const onVideoUploadChange = (files: File[]) => {
    console.log('Video files uploaded:', files);
    setUploadedVideo(files[0] || null);
  };

  const handleDeleteLesson = () => {
    if (!user || !user.id) {
      console.error('User ID is not available for deletion');
      return;
    }
    console.log('Deleting lesson:', formData.id);

    if (formData.id) {
      const removeLessonPayload: IRemoveItemPayload = {
        id: formData.id, // Use the ID from formData
        userId: user.id, // Ensure user ID is available
      };

      dispatch(deleteLesson(removeLessonPayload))
        .unwrap()
        .then(() => {
          console.log('Lesson deleted successfully');
          removeLessonFromList(index);
        })
        .catch((error) => {
          console.error('Failed to delete lesson:', error);
        });
    } else {
      removeLessonFromList(index);
      console.log('No lesson ID found, removing from list only');
    }
  };

  const renderContentField = () => {
    switch (formData.type) {
      case 'VIDEO':
        return (
          <UppyFileUploader
            onFilesChange={onVideoUploadChange}
            allowedFileTypes={['video/*']}
          />
        );

      case 'ARTICLE':
        return (
          <div className="form-input-group">
            <RichTextEditor
              initialContent={contentJSON}
              onChange={(json) => setContentJSON(json)}
            />
          </div>
        );

      case 'QUIZ':
        return (
          <div className="quiz-editor-placeholder">
            <p>Quiz editor will go here.</p>
          </div>
        );

      case 'ASSIGNMENT':
        return (
          <div className="assignment-editor-placeholder">
            <p>Assignment editor will go here.</p>
          </div>
        );

      default:
        // If no valid type is selected, return null or a message
        return null;
    }
  };

  return (
    <div className="lesson-editor">
      <div className="lesson-editor-header">
        <h4>Lesson {index + 1}</h4>
        <button
          className="remove-lesson-button"
          type="button"
          onClick={handleDeleteLesson}
        >
          {React.createElement(
            MdDeleteForever as React.FC<{ size: number; color: string }>,
            {
              size: 24,
              color: 'red',
            }
          )}
        </button>
      </div>
      <div>
        <FormInput
          label="Lesson Title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />

        <FormInput
          label="Lesson Description"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <BoxSelector<LessonType>
          selectedOption={formData.type}
          onSelect={(type) => setFormData((prev) => ({ ...prev, type }))}
          availableOptions={['VIDEO', 'ARTICLE', 'QUIZ']} // Example lesson types
          disabledOptions={[]} // Add any disabled options if needed
        />

        {}

        <div className="content-field">
          {isLessonCreated ? (
            <>
              {renderContentField()}
              <Button
                type="primary"
                text="Update Lesson"
                htmlType="button"
                onClick={handleUpdateLesson}
              />
            </>
          ) : (
            <Button
              type="primary"
              text="Create Lesson"
              htmlType="button"
              onClick={handleCreateLesson}
              disabled={!formData.title}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonEditor;
