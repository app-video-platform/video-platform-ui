import {
  CourseProductSection,
  DownloadSection,
  ProductType,
  ProductStatus,
  ConsultationDetails,
} from '@api/models';
import { selectAuthUser } from '@store/auth-store';
import { BuilderSectionNavItem } from '../builder-sidebar';

export interface FormErrors {
  name?: string;
  type?: string;
  api?: string;
}

export interface ProductDraft {
  // from AbstractProductBase
  id?: string;
  type: ProductType; // 'COURSE' | 'DOWNLOAD' | 'CONSULTATION'
  name?: string;
  description?: string;
  status?: ProductStatus;
  price?: 'free' | number;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  imageUrl?: string;

  // for COURSES + DOWNLOADS (optional in the form)
  sections?: SectionDraft[];
  // CONSULTATION-only fields (all optional in draft, enforced at submit)
  consultationDetails?: ConsultationDetails;
}

export type SectionDraft = CourseProductSection | DownloadSection;

export interface UseProductFormFacadeResult {
  user: ReturnType<typeof selectAuthUser> | null;
  isEditMode: boolean;
  formData: ProductDraft;
  setFormData: React.Dispatch<React.SetStateAction<ProductDraft>>;
  setField: <K extends keyof ProductDraft>(
    // eslint-disable-next-line no-unused-vars
    field: K,
    // eslint-disable-next-line no-unused-vars
    value: ProductDraft[K],
  ) => void;
  productImage: File | null;
  // eslint-disable-next-line no-unused-vars
  handleImageChange: (files: File[]) => void;
  // eslint-disable-next-line no-unused-vars
  handleSetPrice: (price: number | 'free') => void;
  showRestOfForm: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowRestOfForm: (value: boolean) => void;
  showLoadingRestOfForm: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowLoadingRestOfForm: (value: boolean) => void;
  errors: FormErrors;
  // eslint-disable-next-line no-unused-vars
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleProductRemove: () => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  handleSidebarSectionClick: (sectionId: string) => void;
  // eslint-disable-next-line no-unused-vars
  handleSidebarLessonClick: (lessonId: string) => void;
  sidebarSections: BuilderSectionNavItem[] | undefined;
  isAutosaving: boolean;
  lastSavedAt: Date | null;
}
