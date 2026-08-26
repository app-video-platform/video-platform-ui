import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
  AbstractProduct,
  AppDispatch,
  hasRole,
  UserRole,
} from 'core/api/models';
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectAuthUser);
  const isEditMode = Boolean(id);
  const selectedAdminOwnerId = searchParams.get('ownerId') ?? undefined;
  const isAdmin = hasRole(user?.roles, UserRole.ADMIN);

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

  const handleProductLoaded = useCallback(
    (product: AbstractProduct) => {
      if (type && product.type !== type) {
        navigate(`/app/products/edit/${product.id}`, { replace: true });
      }
    },
    [navigate, type],
  );

  // 2) load existing product
  useProductLoader({
    isEditMode,
    id,
    dispatch,
    setFormData,
    setErrors,
    setShowRestOfForm,
    onProductLoaded: handleProductLoaded,
  });

  // 3) autosave
  const {
    isAutosaving,
    hasPendingAutosave,
    lastSavedAt,
    flushAutosave,
  } = useProductAutosave({
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
    productOwnerId:
      !isEditMode && isAdmin && selectedAdminOwnerId
        ? selectedAdminOwnerId
        : formData.userId ?? user?.id,
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
    hasPendingAutosave,
    flushAutosave,
    lastSavedAt,
  };
};
