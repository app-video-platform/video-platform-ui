import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { ProductType, AppDispatch } from 'core/api/models';
import { selectAuthUser } from 'core/store/auth-store';
import { UseProductFormFacadeResult } from '../models/product-form';
import { useProductAutosave } from './use-product-autosave.hook';
import { useProductFormState } from './use-product-form-state.hook';
import { useProductLoader } from './use-product-loader.hooks';
import { useProductActions } from './use-product.actions.hook';
import {
  useSidebarSections,
  useSidebarScroll,
} from './use-sidebar-scroll.hook';

export const useProductFormFacade = (): UseProductFormFacadeResult => {
  const { type, id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectAuthUser);
  const isEditMode = Boolean(id);

  // 1) core form state
  const {
    formData,
    setFormData,
    setField,
    errors,
    setErrors,
    validateForm,
    handleSetPrice,
    productImage,
    handleImageChange,
    showRestOfForm,
    setShowRestOfForm,
    showLoadingRestOfForm,
    setShowLoadingRestOfForm,
  } = useProductFormState();

  // 2) load existing product
  useProductLoader({
    isEditMode,
    id,
    type: type as ProductType,
    dispatch,
    setFormData,
    setErrors,
    setShowRestOfForm,
  });

  // 3) autosave
  const { isAutosaving, lastSavedAt } = useProductAutosave({
    formData,
    user,
    showRestOfForm,
    dispatch,
  });

  // 4) actions: submit / update / remove
  const { handleSubmit, handleProductRemove } = useProductActions({
    formData,
    user,
    dispatch,
    validateForm,
    setErrors,
    setShowLoadingRestOfForm,
  });

  // 5) sidebar
  const sidebarSections = useSidebarSections(formData);
  const { handleSidebarSectionClick, handleSidebarLessonClick } =
    useSidebarScroll();

  return {
    user,
    isEditMode,
    formData,
    setFormData,
    setField,
    productImage,
    handleImageChange,
    handleSetPrice,
    showRestOfForm,
    setShowRestOfForm,
    showLoadingRestOfForm,
    setShowLoadingRestOfForm,
    errors,
    handleSubmit,
    handleProductRemove,
    handleSidebarSectionClick,
    handleSidebarLessonClick,
    sidebarSections,
    isAutosaving,
    lastSavedAt,
  };
};
