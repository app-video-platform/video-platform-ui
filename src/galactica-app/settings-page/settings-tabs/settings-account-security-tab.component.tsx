import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';

import { selectAuthUser } from '../../../store/auth-store/auth.selectors';
import GalFormInput from '../../../components/gal-form-input/gal-form-input.component';

export interface AccountSecurityFormData {
  newPassword: string;
  confirmPassword: string;
}

const SettingsAccountSecurityTab: React.FC = () => {
  const user = useSelector(selectAuthUser);

  const methods = useForm<AccountSecurityFormData>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });
  const { control, getValues } = methods;

  return (
    <FormProvider {...methods}>
      <h2>Public Profile Picture</h2>
      <h4>Add a photo of yourself</h4>
      <div className="category-subheading-line">
        <span className="category-subheading">Change Password</span>
        <hr className="category-line" />
      </div>

      <div className="settings-input-wrapper">
        <Controller
          name="newPassword"
          control={control}
          rules={{
            required: { value: true, message: 'This field is required' },
            minLength: { value: 8, message: 'Min 8 chars' },
          }}
          render={({ field, fieldState }) => {
            const hasError = !!fieldState.error;
            return (
              <>
                <label className="settings-input-label">New Password</label>
                <GalFormInput
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                  name={field.name}
                  className={`form-input settings-form-input settings-form-input${
                    hasError ? ' settings-form-input__error' : ''
                  }`}
                  passwordField={{ isFieldPassword: true, isMainField: true }}
                />
              </>
            );
          }}
        />
      </div>

      <div className="settings-input-wrapper">
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: { value: true, message: 'This field is required' },
            minLength: { value: 8, message: 'Min 8 chars' },
            validate: (value: string) =>
              value === getValues('newPassword') || 'Passwords do not match',
          }}
          render={({ field, fieldState }) => {
            const hasError = !!fieldState.error;
            return (
              <>
                <label className="settings-input-label">Confirm Password</label>
                <GalFormInput
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                  name={field.name}
                  className={`form-input settings-form-input settings-form-input${
                    hasError ? ' settings-form-input__error' : ''
                  }`}
                  passwordField={{ isFieldPassword: true, isMainField: false }}
                />
                {fieldState.error?.type === 'validate' && (
                  <p className="form-field-error error-text-red">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            );
          }}
        />
      </div>
    </FormProvider>
  );
};

export default SettingsAccountSecurityTab;
