import React, { useEffect, useState } from 'react';

import LessonEditor from '../editors/lesson-editor/lesson-editor.component';

import { IoIosAddCircleOutline } from 'react-icons/io';
import './course-lessons.styles.scss';
import IconComponent from '../../../../components/icon-component/gal-icon.component';

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

  const handleRemoveLessonFromList = (index: number) => {
    console.log(`Remove lesson at index ${index} from section ${sectionId}`);
    setLocalLessons((prevLessons) => {
      const updated = [...prevLessons];
      updated.splice(index, 1);
      console.log('Updated localLessons after removal:', updated);
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
          <IconComponent icon={IoIosAddCircleOutline} color="blue" size={24} />
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
