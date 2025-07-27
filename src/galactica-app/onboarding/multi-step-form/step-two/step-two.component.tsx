import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { MultiStepFormData } from '../multi-step-form.component';
import GalFormInput from '../../../../components/gal-form-input/gal-form-input.component';

import './step-two.styles.scss';

const StepTwo: React.FC = () => {
  const { control } = useFormContext<MultiStepFormData>();

  return (
    <div className="step-two">
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <>
            <label className="onboarding-input-label">Title</label>
            <GalFormInput
              type="text"
              value={field.value}
              onChange={field.onChange}
              name={field.name}
              className="form-input onboarding-form-input"
              placeholder="E.g. Teacher, Creator, etc."
            />
          </>
        )}
      />
    </div>
  );
};

export default StepTwo;
