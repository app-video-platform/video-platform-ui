/* eslint-disable no-console */
import { IRemoveProductPayload, AppDispatch } from '@api/models';
import { selectAuthUser } from '@store/auth-store';
import {
  updateCourseProductDetails,
  deleteProduct,
} from '@store/product-store';
import { ProductDraft, FormErrors } from '../models/product-form';
import { mapFormDataToProductPayload } from '../utils/form-data-mapper.utils';

interface UseProductActionsParams {
  formData: ProductDraft;
  user: ReturnType<typeof selectAuthUser> | null;
  dispatch: AppDispatch;
  validateForm: () => boolean;
  // eslint-disable-next-line no-unused-vars
  setErrors: (errors: FormErrors) => void;
  // eslint-disable-next-line no-unused-vars
  setShowLoadingRestOfForm: (value: boolean) => void;
}

export const useProductActions = ({
  formData,
  user,
  dispatch,
  validateForm,
  setErrors,
  setShowLoadingRestOfForm,
}: UseProductActionsParams) => {
  const handleUpdateProduct = async () => {
    if (!formData.id) {
      console.error('Product ID is not set. Cannot update product details.');
      setErrors({
        api: 'Product ID is not set. Cannot update product details.',
      });
      return;
    }

    const productData = mapFormDataToProductPayload(formData, user);

    dispatch(updateCourseProductDetails(productData))
      .unwrap()
      .then((data) => {
        if (data) {
          window.alert('Course product updated successfully!');
        }
      })
      .catch((error) => {
        console.error('Error updating course product:', error);
        setErrors({
          api: 'Failed to update course product. Please try again.',
        });
      })
      .finally(() => {
        setShowLoadingRestOfForm(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    await handleUpdateProduct();
  };

  const handleProductRemove = async () => {
    if (!formData.id) {
      console.error('Product ID is not set. Cannot remove product.');
      return;
    }
    if (!user || !user.id) {
      console.error('User ID is not available for product removal');
      return;
    }

    const payload: IRemoveProductPayload = {
      id: formData.id,
      userId: user.id,
      productType: formData.type,
    };

    dispatch(deleteProduct(payload))
      .unwrap()
      .then(() => {
        window.alert('Product removed successfully');
      })
      .catch((error) => {
        console.error('Failed to remove product:', error);
        window.alert('Failed to remove product. Please try again.');
      });
  };

  return { handleSubmit, handleProductRemove };
};
