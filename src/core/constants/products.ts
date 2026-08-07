import { getCssVar } from '@shared/utils';
import { CiText } from 'react-icons/ci';
import { FaList } from 'react-icons/fa';
import { FaListCheck } from 'react-icons/fa6';
import {
  MdFilterNone,
  MdGroups,
  MdOutlineQuiz,
  MdOutlineSlowMotionVideo,
  MdSpellcheck,
} from 'react-icons/md';

import { TypeMeta, LessonType, ProductType, QuestionType } from '../api';

export interface ProductTypeConfig extends TypeMeta {
  type: ProductType;
  label: string;
  pluralLabel: string;
  description: string;
  displayIcon: string;
  availableInCreate: boolean;
  availableInFilters: boolean;
  createOrder: number;
  basicInfoOrder: number;
  filterOrder: number;
}

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

export const PRODUCT_TYPE_REGISTRY: Record<ProductType, ProductTypeConfig> = {
  COURSE: {
    type: 'COURSE',
    label: 'Course',
    pluralLabel: 'Courses',
    description: 'Multi-lesson video or text course',
    displayIcon: '🎓',
    icon: MdOutlineSlowMotionVideo,
    color: getCssVar('--brand-primary'),
    availableInCreate: true,
    availableInFilters: true,
    createOrder: 1,
    basicInfoOrder: 2,
    filterOrder: 1,
  },
  CONSULTATION: {
    type: 'CONSULTATION',
    label: 'Consultation',
    pluralLabel: 'Consultation Sessions',
    description: '1:1 sessions, coaching, calls',
    displayIcon: '🎧',
    icon: CiText,
    color: getCssVar('--ambient-cyan'),
    availableInCreate: true,
    availableInFilters: true,
    createOrder: 3,
    basicInfoOrder: 1,
    filterOrder: 3,
  },

  DOWNLOAD: {
    type: 'DOWNLOAD',
    label: 'Download',
    pluralLabel: 'Download Packages',
    description: 'Files, templates, digital assets',
    displayIcon: '⬇️',
    icon: MdFilterNone,
    color: getCssVar('--accent-secondary'),
    availableInCreate: true,
    availableInFilters: true,
    createOrder: 2,
    basicInfoOrder: 3,
    filterOrder: 2,
  },
  MEMBERSHIP: {
    type: 'MEMBERSHIP',
    label: 'Membership',
    pluralLabel: 'Memberships',
    description: 'Community access, member updates, and ongoing value',
    displayIcon: '👥',
    icon: MdGroups,
    color: getCssVar('--brand-secondary'),
    availableInCreate: true,
    availableInFilters: true,
    createOrder: 4,
    basicInfoOrder: 4,
    filterOrder: 4,
  },
};

const byOrder =
  (orderKey: keyof ProductTypeConfig) =>
    (a: ProductTypeConfig, b: ProductTypeConfig) =>
      Number(a[orderKey]) - Number(b[orderKey]);

export const PRODUCT_META: Record<ProductType, TypeMeta> = Object.fromEntries(
  Object.entries(PRODUCT_TYPE_REGISTRY).map(([type, config]) => [
    type,
    {
      icon: config.icon,
      color: config.color,
    },
  ]),
) as Record<ProductType, TypeMeta>;

export const PRODUCT_TYPE_CONFIGS = Object.values(PRODUCT_TYPE_REGISTRY);

export const PRODUCT_TYPES = PRODUCT_TYPE_CONFIGS.map(
  (config) => config.type,
) as ProductType[];

export const PRODUCT_CREATE_OPTIONS = PRODUCT_TYPE_CONFIGS.filter(
  (config) => config.availableInCreate,
).sort(byOrder('createOrder'));

export const PRODUCT_BASIC_INFO_OPTIONS = PRODUCT_TYPE_CONFIGS.filter(
  (config) => config.availableInCreate,
).sort(byOrder('basicInfoOrder'));

export const PRODUCT_FILTER_OPTIONS = PRODUCT_TYPE_CONFIGS.filter(
  (config) => config.availableInFilters,
).sort(byOrder('filterOrder'));

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
