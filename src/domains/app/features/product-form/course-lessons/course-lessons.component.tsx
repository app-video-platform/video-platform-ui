import React from 'react';
import { IoAddOutline } from 'react-icons/io5';

import LessonEditor from '../editors/lesson-editor/lesson-editor.component';
import { Button, GalIcon } from '@shared/ui';
import { CourseLesson } from 'core/api/models';
import { getCssVar } from '@shared/utils';

import './course-lessons.styles.scss';

interface CourseLessonsProps {
  sectionId: string;
  lessons: CourseLesson[];
  // eslint-disable-next-line no-unused-vars
  onLessonsChange: (lessons: CourseLesson[]) => void;
}

const CourseLessons: React.FC<CourseLessonsProps> = ({
  sectionId,
  lessons,
  onLessonsChange,
}) => {
  const handleAddLesson = () => {
    const newLesson: CourseLesson = {
      title: '',
      description: '',
      sectionId,
    };

    onLessonsChange([...lessons, newLesson]);
  };

  const handleLessonChange = (index: number, nextLesson: CourseLesson) => {
    const updated = lessons.map((lesson: CourseLesson, i: number) =>
      i === index ? nextLesson : lesson,
    );
    onLessonsChange(updated);
  };

  const handleRemoveLessonFromList = (index: number) => {
    const updated = lessons.filter((_: CourseLesson, i: number) => i !== index);
    onLessonsChange(updated);
  };

  return (
    <div>
      <div className="course-lessons-header">
        <h3>Course Lessons</h3>
      </div>
      {lessons &&
        lessons.length > 0 &&
        lessons.map((lesson, index) => (
          <LessonEditor
            key={index}
            index={index}
            lesson={lesson}
            sectionId={sectionId}
            removeLessonFromList={handleRemoveLessonFromList}
            onChange={handleLessonChange}
          />
        ))}
      <Button
        onClick={handleAddLesson}
        className="add-lesson-button"
        type="button"
        variant="tertiary"
      >
        <GalIcon
          icon={IoAddOutline}
          color={getCssVar('--text-primary')}
          size={18}
        />
        <span>Add Lesson</span>
      </Button>
    </div>
  );
};

export default CourseLessons;
