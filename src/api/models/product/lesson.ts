import { LessonType } from './product.types';

export interface ILesson {
  id?: string;
  sectionId?: string; // ID of the section to which this lesson belongs
  title?: string;
  description?: string;
  type?: LessonType;
  content?: string; // URL or text content
  duration?: number; // Duration in seconds
  position: number; // Position in the section
  videoUrl?: string; // URL for video content
  userId: string; // ID of the user who created the lesson
}

export interface ICreateLessonPayload {
  title: string;
  description?: string;
  type?: LessonType;
  position: number; // Position in the section
  sectionId: string; // ID of the section to which this lesson belongs
  userId: string; // ID of the user creating the lesson
}

export interface ICreateLessonResponse {
  id: string;
  title: string;
  description?: string;
  type?: LessonType;
  sectionId: string;
  position: number;
  userId: string;
  content?: string; // URL or text content
  videoUrl?: string; // URL for video content
}
