/* eslint-disable no-unused-vars */
import React from 'react';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store/store';

import {
  FormErrors,
  NewProductFormData,
} from '../create-new-product.component';
import ProductTypeSelector from '../../../../components/product-type-selector/product-type-selector.component';
import FormInput from '../../../../components/form-input/form-input.component';
import Button from '../../../../components/button/button.component';
import { INewProductPayload } from '../../../../models/product/product';
import { ProductType } from '../../../../models/product/product.types';
import { createCourseProduct } from '../../../../store/product-store/product.slice';

import './create-product-step-one.styles.scss';

interface CreateProductStepOneProps {
  formData: NewProductFormData;
  setField: <K extends keyof NewProductFormData>(
    field: K,
    value: NewProductFormData[K]
  ) => void;
  errors: FormErrors;
  showRestOfForm: boolean;
  userId: string;
  setShowLoadingRestOfForm: (loading: boolean) => void;
  setShowRestOfForm: (show: boolean) => void;
}

const CreateProductStepOne: React.FC<CreateProductStepOneProps> = ({
  formData,
  setField,
  errors,
  showRestOfForm,
  userId,
  setShowLoadingRestOfForm,
  setShowRestOfForm,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleContinue = () => {
    setShowLoadingRestOfForm(true);

    const { name, description, type } = formData;

    console.log('handleContinue', name, description, type);

    const newProductPayload: INewProductPayload = {
      name,
      description,
      type: type as ProductType,
      userId: userId ?? '',
      status: 'draft',
    };

    setTimeout(() => {
      dispatch(createCourseProduct(newProductPayload))
        .unwrap()
        .then((data) => {
          console.log('response', data);
          if (data) {
            // formData.id = data.id; // Set the product ID in formData
            setField('id', data.id); // Ensure the formData is updated with the new ID
            // formData.sections = data.sections || []; // Initialize sections if they exist
            setField('sections', data.sections || []); // Update sections in formData
            setShowRestOfForm(true);
          }
        })
        .catch((error) => {
          console.error('Error creating course product:', error);
        })
        .finally(() => {
          setShowLoadingRestOfForm(false);
        });
    }, 500);
  };

  return (
    <div>
      <FormInput
        label="Title"
        type="text"
        name="name"
        value={formData.name}
        onChange={(e: { target: { value: string } }) =>
          setField('name', e.target.value)
        }
      />
      {errors.name && <p className="error-text-red">{errors.name}</p>}

      <FormInput
        label="Description"
        type="text"
        name="description"
        value={formData.description}
        onChange={(e: { target: { value: string } }) =>
          setField('description', e.target.value)
        }
      />
      <h3>Choose a type</h3>

      <div className="type-selectors">
        <ProductTypeSelector
          selectedType={formData.type}
          onSelect={(t) => setField('type', t)}
        />
        {errors.type && <p className="error-text-red">{errors.type}</p>}
      </div>

      {!showRestOfForm && (
        <div className="course-continue-button-wrapper">
          <Button
            type="primary"
            htmlType="button"
            onClick={() => handleContinue()}
            text="Continue"
            customClassName="create-course-continue-button"
            disabled={!formData.name}
          />
        </div>
      )}
    </div>
  );
};

export default CreateProductStepOne;
