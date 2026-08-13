export type ProductLandingPageHeroLayout = 'MEDIA_RIGHT' | 'MEDIA_LEFT';

export type ProductLandingPageSectionId = 'ABOUT' | 'CONTENTS' | 'CREATOR';

export interface ProductLandingPageConfig {
  id?: string;
  productId: string;
  marketingDescription?: string;
  heroLayout: ProductLandingPageHeroLayout;
  visibleSections: ProductLandingPageSectionId[];
  sectionOrder: ProductLandingPageSectionId[];
  updatedAt?: string;
}

export type ProductLandingPageConfigUpdateRequest = Pick<
  ProductLandingPageConfig,
  'marketingDescription' | 'heroLayout' | 'visibleSections' | 'sectionOrder'
>;
