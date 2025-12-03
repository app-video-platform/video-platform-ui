/* eslint-disable no-unused-vars */
import React from 'react';
import { useDispatch } from 'react-redux';
import { FaArrowRight } from 'react-icons/fa';
import clsx from 'clsx';

import { AbstractProduct, CreateProductPayload, ProductType } from '@api/types';
import { Button, GalIcon, Input } from '@shared/ui';
import { FormErrors } from '@pages/app';
import { createCourseProduct } from '@store/product-store';
import { AppDispatch } from '@store/store';
import { ProductTypeSelector } from '@features/product-form/product-type-selector';
import { getCssVar } from '@shared/utils';
import { ProductDraft } from '@features/product-form/models';

import './create-product-step-one.styles.scss';

interface CreateProductStepOneProps {
  formData: ProductDraft;
  setField: <K extends keyof ProductDraft>(
    field: K,
    value: ProductDraft[K],
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
    const { name, type } = formData;
    if (!name) {
      return;
    }
    setShowLoadingRestOfForm(true);

    const newProductPayload: CreateProductPayload = {
      name,
      // description,
      type: type as ProductType,
      userId: userId ?? '',
      status: 'DRAFT',
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
          // eslint-disable-next-line no-console
          console.error('Error creating course product:', error);
        })
        .finally(() => {
          setShowLoadingRestOfForm(false);
        });
    }, 500);
  };

  const isDisabled = !formData.name || !formData.type;
  const readOnly = showRestOfForm;

  return (
    <div className={clsx('step-one', { 'step-one__readonly': readOnly })}>
      <ProductTypeSelector
        value={formData.type}
        onChange={(type) => !readOnly && setField('type', type)}
      />

      {errors.type && <p className="error-text-red">{errors.type}</p>}

      <h3 className="title-label">Give it a title</h3>
      <div className="title-input-row">
        <Input
          type="text"
          name="name"
          value={formData.name ?? ''}
          readOnly={readOnly}
          className="title-input"
          onChange={(e: { target: { value: string } }) =>
            setField('name', e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // optional
              handleContinue();
            }
          }}
        />
        {!showRestOfForm && (
          <Button
            variant="primary"
            type="button"
            shape="round"
            onClick={() => handleContinue()}
            className="create-course-continue-button"
            disabled={isDisabled}
          >
            <GalIcon
              icon={FaArrowRight}
              color={getCssVar(
                isDisabled ? '--text-secondary' : '--text-primary',
              )}
            />
          </Button>
        )}
      </div>
      {errors.name && <p className="error-text-red">{errors.name}</p>}
    </div>
  );
};

export default CreateProductStepOne;
