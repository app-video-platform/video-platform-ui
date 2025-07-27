import React, { useEffect, useState } from 'react';

import LessonEditor from '../editors/lesson-editor/lesson-editor.component';

import { IoIosAddCircleOutline } from 'react-icons/io';
import './course-lessons.styles.scss';
import GalIcon from '../../../../components/gal-icon-component/gal-icon.component';

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
    setLocalLessons(lessons);
  }, [lessons]);

  const handleAddLesson = () => {
    const newLesson = {
      title: '',
      description: '',
    };

    setLocalLessons((prevLessons) => {
      const updated = [...prevLessons, newLesson];
      return updated;
    });
  };

  const handleRemoveLessonFromList = (index: number) => {
    setLocalLessons((prevLessons) => {
      const updated = [...prevLessons];
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <div>
      <div className="course-lessons-header">
        <h3>Course Lessons</h3>
        <button
          onClick={handleAddLesson}
          className="add-lesson-button"
          type="button"
        >
          <GalIcon icon={IoIosAddCircleOutline} color="blue" size={24} />
        </button>
      </div>
      {localLessons &&
        localLessons.length > 0 &&
        localLessons.map((lesson, index) => (
          <LessonEditor
            key={index}
            index={index}
            lesson={lesson}
            sectionId={sectionId}
            removeLessonFromList={handleRemoveLessonFromList}
          />
        ))}
    </div>
  );
};

export default CourseLessons;
