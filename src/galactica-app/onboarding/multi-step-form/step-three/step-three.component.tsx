import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { MultiStepFormData } from '../multi-step-form.component';
import GalFormInput from '../../../../components/gal-form-input/gal-form-input.component';

import './step-three.styles.scss';

const StepThree: React.FC = () => {
  const { control } = useFormContext<MultiStepFormData>();

  return (
    <div className="step-three">
      <Controller
        name="bio"
        control={control}
        render={({ field }) => (
          <>
            <label className="onboarding-input-label">Bio</label>
            <GalFormInput
              className="form-input onboarding-form-input onboarding-form-input__bio"
              placeholder="Something about you"
              type="text"
              value={field.value}
              onChange={field.onChange}
              name={field.name}
              inputType="textarea"
            />
          </>
        )}
      />

      <Controller
        name="tagline"
        control={control}
        render={({ field }) => (
          <>
            <label className="onboarding-input-label">Tagline / Mission</label>
            <GalFormInput
              className="form-input onboarding-form-input"
              placeholder="Tell us what drives you"
              type="text"
              value={field.value}
              onChange={field.onChange}
              name={field.name}
            />
          </>
        )}
      />
    </div>
  );
};

export default StepThree;
