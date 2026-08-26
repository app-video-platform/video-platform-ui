/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import clsx from 'clsx';

import {
  CreateProductPayload,
  ProductType,
  AppDispatch,
} from 'core/api/models';
import { Button, Icon, Input } from '@shared/ui';
import { FormErrors } from 'domains/app/pages';
import { createProduct } from 'core/store/product-store';
import { ProductTypeSelector } from 'domains/app/features/product-form/product-type-selector';
import { extractErrorMessage, getCssVar } from '@shared/utils';
import { ProductDraft } from 'domains/app/features/product-form/models';
import { appRoutes } from 'domains/app/routes/routes';

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
  const navigate = useNavigate();
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    const { name, type } = formData;
    if (!name || !type || isSubmitting) {
      return;
    }

    setCreateError(null);
    setIsSubmitting(true);
    setShowLoadingRestOfForm(true);

    const newProductPayload: CreateProductPayload = {
      name,
      // description,
      type: type as ProductType,
      userId: userId ?? '',
      status: 'DRAFT',
    };

    try {
      const data = await dispatch(createProduct(newProductPayload)).unwrap();

      if (!data) {
        setCreateError('Product could not be created. Please try again.');
        return;
      }

      setField('id', data.id ?? '');
      setField('userId', data.userId ?? userId);
      if (data.type === 'COURSE' || data.type === 'DOWNLOAD') {
        setField('sections', data.sections || []);
      }
      setShowRestOfForm(true);
      if (data.id) {
        navigate(appRoutes.productsEdit(data.id), { replace: true });
      }
    } catch (error) {
      setCreateError(
        typeof error === 'string' ? error : extractErrorMessage(error),
      );
    } finally {
      setShowLoadingRestOfForm(false);
      setIsSubmitting(false);
    }
  };

  const isDisabled = !formData.name || !formData.type || isSubmitting;
  const readOnly = showRestOfForm;

  return (
    <div className={clsx('step-one', { 'step-one__readonly': readOnly })}>
      <ProductTypeSelector
        value={formData.type}
        onChange={(type) => {
          if (!readOnly) {
            setCreateError(null);
            setField('type', type);
          }
        }}
      />

      {errors.type && <p className="error-text-red">{errors.type}</p>}

      <h3 className="title-label">Give it a title</h3>
      <div className="title-input-row">
        <Input
          type="text"
          name="name"
          aria-label="Product title"
          value={formData.name ?? ''}
          readOnly={readOnly}
          className="title-input"
          onChange={(e: { target: { value: string } }) => {
            setCreateError(null);
            setField('name', e.target.value);
          }}
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
            aria-label="Continue to Product workspace"
          >
            <Icon
              icon={FaArrowRight}
              color={getCssVar(
                isDisabled ? '--text-secondary' : '--text-primary',
              )}
            />
          </Button>
        )}
      </div>
      {createError && (
        <p className="error-text-red" role="alert">
          {createError}
        </p>
      )}
      {errors.name && <p className="error-text-red">{errors.name}</p>}
    </div>
  );
};

export default CreateProductStepOne;
