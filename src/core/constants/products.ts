import { getCssVar } from '@shared/utils';
import { CiText } from 'react-icons/ci';
import { FaList } from 'react-icons/fa';
import { FaListCheck } from 'react-icons/fa6';
import {
  MdFilterNone,
  MdOutlineQuiz,
  MdOutlineSlowMotionVideo,
  MdSpellcheck,
} from 'react-icons/md';

import { TypeMeta, LessonType, ProductType, QuestionType } from '../api';

export const LESSON_META: Record<LessonType, TypeMeta> = {
  VIDEO: {
    icon: MdOutlineSlowMotionVideo,
    color: getCssVar('--brand-secondary'),
  },
  ARTICLE: {
    icon: CiText,
    color: getCssVar('--brand-secondary'),
  },
  ASSIGNMENT: {
    icon: MdFilterNone,
    color: getCssVar('--brand-secondary'),
  },
  QUIZ: {
    icon: MdOutlineQuiz,
    color: getCssVar('--brand-secondary'),
  },
};

export const PRODUCT_META: Record<ProductType, TypeMeta> = {
  COURSE: {
    icon: MdOutlineSlowMotionVideo,
    color: getCssVar('--brand-primary'),
  },
  CONSULTATION: {
    icon: CiText,
    color: getCssVar('--ambient-cyan'),
  },

  DOWNLOAD: {
    icon: MdFilterNone,
    color: getCssVar('--accent-secondary'),
  },
};

export const QUESTION_META: Record<QuestionType, TypeMeta> = {
  multiple_choice_single: {
    icon: FaList,
    color: getCssVar('--text-primary'),
  },
  multiple_choice_multi: {
    icon: FaListCheck,
    color: getCssVar('--text-primary'),
  },

  true_false: {
    icon: MdSpellcheck,
    color: getCssVar('--text-primary'),
  },
};
