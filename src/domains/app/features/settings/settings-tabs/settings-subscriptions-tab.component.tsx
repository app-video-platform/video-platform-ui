import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { Input } from '@shared/ui';

export interface SubscriptionsFormData {
  profileImage: string;
  title: string;
  bio: string;
  website: string;
}

const SettingsSubscriptionsTab: React.FC = () => {
  const methods = useForm<SubscriptionsFormData>({
    defaultValues: {
      title: '',
      bio: '',
      website: '',
      profileImage: '',
    },
    mode: 'onTouched',
  });
  const { control, trigger } = methods;

  return (
    <FormProvider {...methods}>
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
              <Input
                type="text"
                label="Subscriptions"
                value={field.value}
                onChange={field.onChange}
                name={field.name}
                className={`form-input onboarding-form-input${
                  hasError ? ' onboarding-form-input__error' : ''
                }`}
                placeholder="Subscriptions"
                error={fieldState.error?.message}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  field.onChange(e.currentTarget.value.trim());
                  field.onBlur();
                  void trigger(field.name);
                }}
              />
            </>
          );
        }}
      />
    </FormProvider>
  );
};

export default SettingsSubscriptionsTab;
