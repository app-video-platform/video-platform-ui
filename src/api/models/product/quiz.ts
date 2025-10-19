import { QuestionType, QuizQuestion } from '../../types/quiz.types';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean; // for MCQ types
}

export interface QuizQuestionBase {
  id: string;
  title: string;
  type: QuestionType;
  points: number; // award on full correctness
  explanation?: string; // shown after submit
}

export interface MCQQuestion extends QuizQuestionBase {
  type: 'multiple_choice_single' | 'multiple_choice_multi';
  options: QuizOption[];
}

export interface TrueFalseQuestion extends QuizQuestionBase {
  type: 'true_false';
  options: QuizOption[];
}

export interface QuizDraft {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore?: number; // optional passing threshold in %
}
