import { LessonType } from './products.types';
import { QuizDraft } from './quiz';
import { QuizQuestion } from './quiz.types';

export interface CourseLesson {
  id?: string;
  title?: string;
  type?: LessonType;
  videoUrl?: string;
  content?: string;
  position?: number;
  quiz?: QuizDraft;
  productId?: string;
  sectionId: string;
  description: string;
  userId?: string;
}

export interface LessonCreate {
  title: string;
  type: LessonType;
  sectionId: string;
  productId: string;
  userId?: string;
  videoUrl?: string;
  content?: string;
  description: string;
  position?: number;
}

export interface RemoveLessonPayload {
  productId: string;
  sectionId: string;
  lessonId?: string;
  id?: string;
  userId?: string;
}

export interface QuizLesson extends CourseLesson {
  passingScore: number;
  questions: QuizQuestion[];
  totalScore?: number;
}
