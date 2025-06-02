/* eslint-disable indent */
import React, { useEffect, useState } from 'react';

import FormInput from '../../../../components/form-input/form-input.component';
import Button from '../../../../components/button/button.component';
import { AppDispatch } from '../../../../store/store';
import { useDispatch } from 'react-redux';
import { createLesson } from '../../../../store/product-store/product.slice';
import BoxSelector from '../../../../components/box-selector/box-selector.component';
import UppyFileUploader from '../../../../components/uppy-file-uploader/uppy-file-uploader.component';
// import RichTextEditor from '../../../../components/rich-text-editor/rich-text-editor.component';
import { ILesson } from '../../../../api/models/product/lesson';
import { LessonType } from '../../../../api/models/product/product.types';

import './lesson-editor.styles.scss';
interface LessonEditorProps {
  lesson: ILesson;
  index: number;
  sectionId: string;
}

interface LessonFormData {
  title: string;
  description: string;
  content: string;
  type?: LessonType; // Optional, depending on your requirements
}

const LessonEditor: React.FC<LessonEditorProps> = ({
  lesson,
  index,
  sectionId,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = React.useState<LessonFormData>({
    title: '',
    description: '',
    content: '',
    type: '' as LessonType,
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

    const createLessonPayload = {
      title: formData.title,
      description: formData.description,
      position: index + 1, // Assuming position is based on the index
      sectionId: sectionId, // Assuming lesson has a sectionId
    };

    dispatch(createLesson(createLessonPayload))
      .unwrap()
      .then((response) => {
        console.log('Lesson created successfully:', response);
        setIsLessonCreated(true);
      })
      .catch((error) => {
        console.error('Failed to create lesson:', error);
      });
  };

  const onVideoUploadChange = (files: File[]) => {
    console.log('Video files uploaded:', files);
    setUploadedVideo(files[0] || null);
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

      case 'TEXT':
        return (
          <div className="form-input-group">
            {/* <RichTextEditor
              initialContent={contentJSON}
              onChange={(json) => setContentJSON(json)}
            /> */}
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
      <h4>Lesson {index + 1}</h4>
      <form>
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
          availableOptions={['VIDEO', 'TEXT', 'QUIZ']} // Example lesson types
          disabledOptions={[]} // Add any disabled options if needed
        />

        {isLessonCreated ? (
          renderContentField()
        ) : (
          <Button
            type="primary"
            text="Create Lesson"
            htmlType="button"
            onClick={handleCreateLesson}
            disabled={!formData.title}
          />
        )}
      </form>
    </div>
  );
};

export default LessonEditor;
