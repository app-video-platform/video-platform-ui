import { MCQQuestion, TrueFalseQuestion } from '../models/product/quiz';

export type QuestionType =
  | 'multiple_choice_single'
  | 'multiple_choice_multi'
  | 'true_false';

export type QuizQuestion = MCQQuestion | TrueFalseQuestion;
