import React from 'react';
import { useSelector } from 'react-redux';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { selectAuthUser } from '@store/auth-store';
import { PasswordInput } from '@components';
import { SettingsSection } from '../settings-section';
import { Button, Input } from '@shared/ui';

export interface AccountSecurityFormData {
  newPassword: string;
  confirmPassword: string;
  format?: string;
  currency?: string;
}

const SettingsAccountSecurityTab: React.FC = () => {
  const user = useSelector(selectAuthUser);

  const methods = useForm<AccountSecurityFormData>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
      format: '',
      currency: '',
    },
    mode: 'onChange',
  });
  const { control, getValues } = methods;

  return (
    <FormProvider {...methods}>
      <div className="settings-header">
        <div className="title-wrapper">
          <h2>Account Settings</h2>
          <p style={{ fontSize: 14 }}>
            Change your password and account prefferences
          </p>
        </div>
        <div className="settings-actions">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Save</Button>
        </div>
      </div>

      <hr className="category-line" />

      <SettingsSection
        title="Change Password"
        subTitle="Change your account password"
      >
        <>
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
                  <PasswordInput
                    value={field.value}
                    onChange={field.onChange}
                    name={field.name}
                    className={`form-input settings-form-input settings-form-input${
                      hasError ? ' settings-form-input__error' : ''
                    }`}
                  />
                </>
              );
            }}
          />

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
                  <label className="settings-input-label">
                    Confirm Password
                  </label>
                  <PasswordInput
                    value={field.value}
                    onChange={field.onChange}
                    name={field.name}
                    className={`form-input settings-form-input settings-form-input${
                      hasError ? ' settings-form-input__error' : ''
                    }`}
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
        </>
      </SettingsSection>

      <hr className="category-line" />

      <SettingsSection
        title="Account Prefferences"
        subTitle="Change your time format and currency"
      >
        <>
          <Controller
            name="format"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                label="Time Format"
                value={field.value ?? ''}
                onChange={field.onChange}
                name={field.name}
              />
            )}
          />

          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                label="Currency"
                value={field.value ?? ''}
                onChange={field.onChange}
                name={field.name}
              />
            )}
          />
        </>
      </SettingsSection>

      <hr className="category-line" />

      <SettingsSection
        title="Delete Account"
        subTitle="Delete your account and all your data. We will keep your data for 30 days, then it will be lost forever"
      >
        <Button variant="danger">Delete Account</Button>
      </SettingsSection>
    </FormProvider>
  );
};

export default SettingsAccountSecurityTab;
