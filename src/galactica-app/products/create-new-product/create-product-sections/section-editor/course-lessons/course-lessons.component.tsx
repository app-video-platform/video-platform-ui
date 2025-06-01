import React, { useEffect, useState } from 'react';

import Button from '../../../../../../components/button/button.component';
import LessonEditor from '../../../lesson-editor/lesson-editor.component';

import './course-lessons.styles.scss';

interface CourseLessonsProps {
  sectionId: string;
  lessons: any[];
}

const CourseLessons: React.FC<CourseLessonsProps> = ({
  sectionId,
  lessons,
}) => {
  const [localLessons, setLocalLessons] = useState(lessons);

  useEffect(() => {
    console.log('CourseLessons useEffect triggered with lessons:', lessons);
    setLocalLessons(lessons);
  }, [lessons]);

  const handleAddLesson = () => {
    console.log(`Add lesson to section ${sectionId}`);
    const newLesson = {
      title: '',
      description: '',
    };

    setLocalLessons((prevLessons) => {
      const updated = [...prevLessons, newLesson];
      console.log('New localLessons:', updated);
      return updated;
    });

    console.log('new lessons', lessons);
  };

  return (
    <div>
      {localLessons &&
        localLessons.length > 0 &&
        localLessons.map((lesson, index) => (
          <LessonEditor
            key={index}
            index={index}
            lesson={lesson}
            sectionId={sectionId}
          />
        ))}

      <Button
        type="secondary"
        text="Add Lesson"
        htmlType="button"
        onClick={handleAddLesson}
      />
    </div>
  );
};

export default CourseLessons;
