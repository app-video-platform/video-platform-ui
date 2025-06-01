import React, { use, useEffect, useState } from 'react';

import './lesson-editor.styles.scss';
import FormInput from '../../../../components/form-input/form-input.component';
import { ILesson } from '../../../../models/product/lesson';
import Button from '../../../../components/button/button.component';
import { AppDispatch } from '../../../../store/store';
import { useDispatch } from 'react-redux';
import { createLesson } from '../../../../store/product-store/product.slice';

interface LessonEditorProps {
  lesson: ILesson;
  index: number;
  sectionId: string;
}

const LessonEditor: React.FC<LessonEditorProps> = ({
  lesson,
  index,
  sectionId,
}) => {
  const dispatch = useDispatch<AppDispatch>();

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
        // Optionally, you can update the lesson state with the new lesson ID
        // setFormData((prev) => ({
        //   ...prev,
        //   id: response.id, // Assuming response contains the new lesson ID
        // }));
        setIsLessonCreated(true);
      })
      .catch((error) => {
        console.error('Failed to create lesson:', error);
      });
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
            disabled={!formData.title}
          />
        )}
      </form>
    </div>
  );
};

export default LessonEditor;
