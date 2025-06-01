import { LessonType } from './product.types';

export interface ILesson {
  id?: string;
  title?: string;
  description?: string;
  type: LessonType;
  content?: string; // URL or text content
  duration?: number; // Duration in seconds
  position: number; // Position in the section
  videoUrl?: string; // URL for video content
}
