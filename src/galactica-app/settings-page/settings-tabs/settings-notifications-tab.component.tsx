import React from 'react';
import { useSelector } from 'react-redux';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';

import { selectAuthUser } from '../../../store/auth-store/auth.selectors';
import GalFormInput from '../../../components/gal-form-input/gal-form-input.component';

export interface NotificationsFormData {
  profileImage: string;
  title: string;
  bio: string;
  website: string;
}

const SettingsNotificationsTab: React.FC = () => {
  const user = useSelector(selectAuthUser);

  const methods = useForm<NotificationsFormData>({
    defaultValues: {
      title: '',
      bio: '',
      website: '',
      profileImage: '',
    },
    mode: 'onTouched',
  });
  const { control } = methods;

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
              <label className="onboarding-input-label">Notifications</label>
              <GalFormInput
                type="text"
                value={field.value}
                onChange={field.onChange}
                name={field.name}
                className={`form-input onboarding-form-input${
                  hasError ? ' onboarding-form-input__error' : ''
                }`}
                placeholder="Notifications"
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
    </FormProvider>
  );
};

export default SettingsNotificationsTab;
