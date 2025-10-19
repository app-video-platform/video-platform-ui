import { LessonType } from './product.types';

// export interface ILesson {
//   id: string;
//   sectionId: string; // ID of the section to which this lesson belongs
//   userId: string; // ID of the user who created the lesson
//   title: string;
//   position: number; // Position in the section
//   type?: LessonType;
//   description?: string;
//   content?: string; // URL or text content
//   duration?: number; // Duration in seconds
//   videoUrl?: string; // URL for video content
// }

// export interface ICreateLessonPayload {
//   title: string;
//   description?: string;
//   type?: LessonType;
//   position: number; // Position in the section
//   sectionId: string; // ID of the section to which this lesson belongs
//   userId: string; // ID of the user creating the lesson
// }

export interface CourseLesson {
  id?: string;
  title?: string;
  type?: LessonType;
  videoUrl?: string;
  content?: string;
  position?: number;
  sectionId: string;
  description: string;
  userId?: string;
}

export interface LessonCreate {
  title: string;
  type: LessonType;
  sectionId: string;
  userId: string;
  videoUrl?: string;
  content?: string;
  description: string;
  position?: number;
}
