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
}

export interface ICreateLessonPayload {
  title: string;
  description?: string;
  type?: LessonType;
  position: number; // Position in the section
  sectionId: string; // ID of the section to which this lesson belongs
}

export interface ICreateLessonResponse {
  id: string;
  title: string;
  description?: string;
  type?: LessonType;
  sectionId: string;
  position: number;
}
