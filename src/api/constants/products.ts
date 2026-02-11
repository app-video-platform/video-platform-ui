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

import { TypeMeta, LessonType, ProductType, QuestionType } from '..';

export const LESSON_META: Record<LessonType, TypeMeta> = {
  VIDEO: {
    icon: MdOutlineSlowMotionVideo,
    color: getCssVar('--stellar-cyan'),
  },
  ARTICLE: {
    icon: CiText,
    color: getCssVar('--aurora-green'),
  },
  ASSIGNMENT: {
    icon: MdFilterNone,
    color: getCssVar('--deep-magenta-pulse'),
  },
  QUIZ: {
    icon: MdOutlineQuiz,
    color: getCssVar('--supernova-orange-pink'),
  },
};

export const PRODUCT_META: Record<ProductType, TypeMeta> = {
  COURSE: {
    icon: MdOutlineSlowMotionVideo,
    color: getCssVar('--accent-primary'),
  },
  CONSULTATION: {
    icon: CiText,
    color: getCssVar('--accent-tertiary'),
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
