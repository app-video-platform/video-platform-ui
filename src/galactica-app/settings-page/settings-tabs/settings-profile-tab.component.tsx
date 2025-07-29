import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';

import { selectAuthUser } from '../../../store/auth-store/auth.selectors';
import GalFormInput from '../../../components/gal-form-input/gal-form-input.component';
import { SocialLink } from '../../../api/models/user/user';
import GalSocialMediaInput from '../../../components/gal-social-media-input/gal-social-media-input.component';

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  tagline: string;
  website: string;
}

interface SettingsSocials {
  initialLinks: SocialLink[];
  newLinks: SocialLink[];
}

const SettingsProfileTab: React.FC = () => {
  const user = useSelector(selectAuthUser);
  const [socialLinks, setSocialLinks] = useState<SettingsSocials>({
    initialLinks: [],
    newLinks: [],
  });

  const methods = useForm<ProfileFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      title: '',
      bio: '',
      website: '',
      tagline: '',
    },
    mode: 'onTouched',
  });
  const { control } = methods;
  const URL_PATTERN = /^(https?:\/\/)?(www\.)?[\w-]+(\.[\w-]+)+([/?#].*)?$/i;

  useEffect(() => {
    if (user) {
      methods.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        bio: user.bio,
        website: user.website,
        tagline: user.taglineMission,
      });

      if (user.socialLinks && user.socialLinks.length > 0) {
        setSocialLinks({ initialLinks: user.socialLinks, newLinks: [] });
      }
    }
  }, [user, methods]);

  const handleSocialLinksChange = useCallback((links: SocialLink[]) => {
    setSocialLinks((prev) => ({ ...prev, newLinks: links }));
  }, []);

  return (
    <FormProvider {...methods}>
      <h2>Public Profile</h2>
      <h4>Add some information about yourself</h4>

      <div className="category-subheading-line">
        <span className="category-subheading">Basics</span>
        <hr className="category-line" />
      </div>

      <div className="settings-input-wrapper">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <>
              <label className="settings-input-label">First Name</label>
              <GalFormInput
                type="text"
                value={field.value}
                onChange={field.onChange}
                name={field.name}
                className="form-input settings-form-input"
              />
            </>
          )}
        />
      </div>

      <div className="settings-input-wrapper">
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <>
              <label className="settings-input-label">Last Name</label>
              <GalFormInput
                type="text"
                value={field.value}
                onChange={field.onChange}
                name={field.name}
                className="form-input settings-form-input"
              />
            </>
          )}
        />
      </div>

      <div className="settings-input-wrapper">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <>
              <label className="settings-input-label">Title</label>
              <GalFormInput
                type="text"
                value={field.value}
                onChange={field.onChange}
                name={field.name}
                className="form-input settings-form-input"
              />
            </>
          )}
        />
      </div>

      <div className="category-subheading-line">
        <span className="category-subheading">Biography</span>
        <hr className="category-line" />
      </div>
      <div className="settings-input-wrapper">
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
                <label className="settings-input-label">Bio</label>
                <GalFormInput
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                  name={field.name}
                  inputType="textarea"
                  className={`form-input settings-form-input settings-form-input__bio${
                    hasError ? ' settings-form-input__error' : ''
                  }`}
                  isMaxLengthShown={true}
                  maxLength={250}
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

      <div className="settings-input-wrapper">
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
                <label className="settings-input-label">
                  Tagline / Mission
                </label>
                <GalFormInput
                  className={`form-input settings-form-input${
                    hasError ? ' settings-form-input__error' : ''
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

      <div className="category-subheading-line">
        <span className="category-subheading">Links</span>
        <hr className="category-line" />
      </div>

      <div className="settings-input-wrapper">
        <Controller
          name="website"
          control={control}
          rules={{
            pattern: {
              value: URL_PATTERN,
              message:
                'Enter a valid URL (e.g. https://example.com or www.example.com)',
            },
          }}
          render={({ field, fieldState }) => {
            const hasError = !!fieldState.error;
            return (
              <>
                <label className="settings-input-label">Website</label>
                <GalFormInput
                  className={`form-input settings-form-input${
                    hasError ? ' settings-form-input__error' : ''
                  }`}
                  placeholder="Website"
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                  name={field.name}
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

      <div className="social-media-circle-container">
        <GalSocialMediaInput
          initialSocialLinks={socialLinks.initialLinks}
          onChange={handleSocialLinksChange}
        />
      </div>
    </FormProvider>
  );
};

export default SettingsProfileTab;
