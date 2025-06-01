import React, { use, useEffect, useState } from 'react';

import './lesson-editor.styles.scss';
import FormInput from '../../../../components/form-input/form-input.component';
import { ILesson } from '../../../../models/product/lesson';
import Button from '../../../../components/button/button.component';

interface LessonEditorProps {
  lesson: ILesson;
  index: number;
}

const LessonEditor: React.FC<LessonEditorProps> = ({ lesson, index }) => {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    content: '',
  });

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
    setIsLessonCreated(true);
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

        {isLessonCreated ? (
          <FormInput
            label="Lesson Content"
            type="text"
            name="content"
            value={formData.content}
            onChange={handleChange}
          />
        ) : (
          <Button
            type="primary"
            text="Create Lesson"
            htmlType="button"
            onClick={handleCreateLesson}
          />
        )}
      </form>
    </div>
  );
};

export default LessonEditor;
