/* eslint-disable no-unused-vars */
import React from 'react';
import { useDispatch } from 'react-redux';

import { GalBoxSelector } from '@components';
import { AbstractProduct, ProductType } from '@api/types';
import { GalButton, GalFormInput } from '@shared/ui';
import { NewProductFormData, FormErrors } from '@pages/app';
import { createCourseProduct } from '@store/product-store';
import { AppDispatch } from '@store/store';

import './create-product-step-one.styles.scss';

interface CreateProductStepOneProps {
  formData: NewProductFormData;
  setField: <K extends keyof NewProductFormData>(
    field: K,
    value: NewProductFormData[K],
  ) => void;
  errors: FormErrors;
  showRestOfForm: boolean;
  userId: string;
  setShowLoadingRestOfForm: (loading: boolean) => void;
  setShowRestOfForm: (show: boolean) => void;
}

const AVAILABLE_TYPES: ProductType[] = ['COURSE', 'DOWNLOAD', 'CONSULTATION'];

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

    const newProductPayload: AbstractProduct = {
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
          if (data) {
            // formData.id = data.id; // Set the product ID in formData
            setField('id', data.id ?? ''); // Ensure the formData is updated with the new ID
            // formData.sections = data.sections || []; // Initialize sections if they exist
            if (data.type !== 'CONSULTATION') {
              setField('sections', data.sections || []); // Update sections in formData
            }
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
      <GalFormInput
        label="Title"
        type="text"
        name="name"
        value={formData.name}
        onChange={(e: { target: { value: string } }) =>
          setField('name', e.target.value)
        }
      />
      {errors.name && <p className="error-text-red">{errors.name}</p>}

      <GalFormInput
        label="Description"
        type="text"
        name="description"
        inputType="textarea"
        value={formData.description}
        onChange={(e: { target: { value: string } }) =>
          setField('description', e.target.value)
        }
      />
      <h3>Choose a type</h3>

      <div className="type-selectors">
        <GalBoxSelector<ProductType>
          selectedOption={formData.type}
          onSelect={(t) => setField('type', t)}
          disabledOptions={[]}
          availableOptions={AVAILABLE_TYPES}
        />

        {errors.type && <p className="error-text-red">{errors.type}</p>}
      </div>

      {!showRestOfForm && (
        <div className="course-continue-button-wrapper">
          <GalButton
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
