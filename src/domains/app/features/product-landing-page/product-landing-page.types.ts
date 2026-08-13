import {
  ProductLandingPageHeroLayout,
  ProductLandingPageSectionId,
  ProductType,
  StorefrontTheme,
} from 'core/api/models';

export interface ProductLandingCreatorViewModel {
  displayName: string;
  title?: string;
  bio?: string;
  imageUrl?: string;
  website?: string;
  publicEmail?: string;
}

export interface ProductLandingPriceViewModel {
  label: string;
  cadence?: string;
  isFree: boolean;
  isRecurring: boolean;
}

export interface ProductLandingCourseSection {
  id?: string;
  title: string;
  description?: string;
  lessonCount: number;
  lessons: Array<{
    id?: string;
    title: string;
    type?: string;
  }>;
}

export interface ProductLandingDownloadSection {
  id?: string;
  title: string;
  description?: string;
  fileCount: number;
  files: Array<{
    id?: string;
    fileName: string;
  }>;
}

export interface ProductLandingDetailRow {
  label: string;
  value: string;
}

export type ProductLandingTypeSummary =
  | {
      type: 'COURSE';
      sectionCount: number;
      lessonCount: number;
      sections: ProductLandingCourseSection[];
    }
  | {
      type: 'DOWNLOAD';
      sectionCount: number;
      fileCount: number;
      sections: ProductLandingDownloadSection[];
    }
  | {
      type: 'CONSULTATION';
      details: ProductLandingDetailRow[];
    }
  | {
      type: 'MEMBERSHIP';
      recurringLabel?: string;
    };

export interface ProductLandingCtaViewModel {
  label: string;
  description: string;
}

export interface ProductLandingPageViewModel {
  id: string;
  type: ProductType;
  typeLabel: string;
  name: string;
  description?: string;
  imageUrl?: string;
  imageAlt: string;
  price: ProductLandingPriceViewModel;
  cta: ProductLandingCtaViewModel;
  theme: StorefrontTheme;
  creator?: ProductLandingCreatorViewModel;
  heroLayout: ProductLandingPageHeroLayout;
  marketingDescription?: string;
  sections: ProductLandingPageSectionId[];
  summary: ProductLandingTypeSummary;
}
