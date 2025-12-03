import { QuizQuestion } from '@api/types';
import { LessonType } from '../../types/products.types';

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

export interface QuizLesson extends CourseLesson {
  passingScore: number;
  questions: QuizQuestion[];
  totalScore?: number;
}
