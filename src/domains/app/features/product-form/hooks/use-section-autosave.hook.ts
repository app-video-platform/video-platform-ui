import { useNestedAutosave } from './use-nested-autosave.hook';

import { selectAuthUser } from 'core/store/auth-store';
import { updateProductSection } from 'core/store/product-store';
import { SectionDraft } from '../models/product-form';
import { AppDispatch, ProductSectionUpdateRequest } from 'core/api/models';

interface UseSectionAutosaveParams {
  section: SectionDraft;
  productId: string;
  user: ReturnType<typeof selectAuthUser> | null;
  dispatch: AppDispatch;
}

export const useSectionAutosave = ({
  section,
  user,
  productId,
  dispatch,
}: UseSectionAutosaveParams) => {
  const snapshot: ProductSectionUpdateRequest = {
    productId, sectionId: section.id ?? '', title: section.title,
    description: section.description,
  };
  return useNestedAutosave(snapshot, Boolean(section.id && user?.id),
    (value) => dispatch(updateProductSection(value)).unwrap());
};
