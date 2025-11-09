import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { MultiStepFormData } from '../multi-step-form.component';
import { GalFormInput } from '@shared/ui';

import './step-two.styles.scss';

const StepTwo: React.FC = () => {
  const { control } = useFormContext<MultiStepFormData>();

  return (
    <div className="step-two">
      <Controller
        name="title"
        control={control}
        rules={{
          maxLength: {
            value: 50,
            message: 'Titles must be 50 characters or fewer',
          },
          minLength: {
            value: 2,
            message: 'Title must be at least 2 characters',
          },
        }}
        render={({ field, fieldState }) => {
          const hasError = !!fieldState.error;
          return (
            <>
              <label className="onboarding-input-label">Title</label>
              <GalFormInput
                type="text"
                value={field.value}
                onChange={field.onChange}
                name={field.name}
                className={`form-input onboarding-form-input${
                  hasError ? ' onboarding-form-input__error' : ''
                }`}
                placeholder="E.g. Teacher, Creator, etc."
                aria-describedby={
                  fieldState.error ? `${field.name}-error` : undefined
                }
                onBlur={(e: { target: { value: string } }) =>
                  field.onChange(e.target.value.trim())
                }
                isMaxLengthShown={true}
                maxLength={50}
              />
              {fieldState.error && (
                <p className="form-field-error error-text-red">
                  {fieldState.error.message}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export default StepTwo;
