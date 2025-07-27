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
        rules={{
          minLength: {
            value: 30,
            message: 'Your bio should be at least 30 characters long',
          },
          maxLength: {
            value: 250,
            // eslint-disable-next-line quotes
            message: "Your bio can't exceed 250 characters",
          },
        }}
        render={({ field, fieldState }) => {
          const hasError = !!fieldState.error;
          return (
            <>
              <label className="onboarding-input-label">Bio</label>
              <GalFormInput
                placeholder="Something about you"
                type="text"
                value={field.value}
                onChange={field.onChange}
                name={field.name}
                inputType="textarea"
                isMaxLengthShown={true}
                maxLength={250}
                className={`form-input onboarding-form-input onboarding-form-input__bio${
                  hasError ? ' onboarding-form-input__error' : ''
                }`}
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

      <Controller
        name="tagline"
        control={control}
        rules={{
          minLength: {
            value: 10,
            message: 'Your tagline should be at least 10 characters',
          },
          maxLength: {
            value: 120,
            message: 'Your tagline can not exceed 120 characters',
          },
        }}
        render={({ field, fieldState }) => {
          const hasError = !!fieldState.error;
          return (
            <>
              <label className="onboarding-input-label">
                Tagline / Mission
              </label>
              <GalFormInput
                className={`form-input onboarding-form-input${
                  hasError ? ' onboarding-form-input__error' : ''
                }`}
                placeholder="Tell us what drives you"
                type="text"
                value={field.value}
                onChange={field.onChange}
                name={field.name}
                isMaxLengthShown={true}
                maxLength={120}
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

export default StepThree;
