import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { selectAuthUser } from '@store/auth-store';
import {
  Button,
  Divider,
  InfoPopover,
  Input,
  Textarea,
  UserAvatar,
} from '@shared/ui';
import { getProfileNameInitials } from '@shared/utils';
import { SettingsSection } from '../settings-section';
import { SocialInput } from '../social-input';
import { PageHeader } from '@components';

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  tagline: string;
  website: string;
  publicEmail?: string;
  phone?: string;
  imageUrl?: string;
  facebook?: string;
  instagram?: string;
  xPlatform?: string;
  youtube?: string;
  tiktok?: string;
}

// interface SettingsSocials {
//   initialLinks: SocialMediaLink[];
//   newLinks: SocialMediaLink[];
// }

const SettingsProfileTab: React.FC = () => {
  const user = useSelector(selectAuthUser);
  // const [socialLinks, setSocialLinks] = useState<SettingsSocials>({
  //   initialLinks: [],
  //   newLinks: [],
  // });

  const methods = useForm<ProfileFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      title: '',
      bio: '',
      website: '',
      tagline: '',
      imageUrl: '',
      publicEmail: '',
      phone: '',
      facebook: '',
      instagram: '',
      xPlatform: '',
      tiktok: '',
      youtube: '',
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
    }
  }, [user, methods]);

  return (
    <FormProvider {...methods}>
      <PageHeader
        title="Public Profile"
        subTitle=" Update your personal info, like profile picture and display name"
        primaryLabel="Save"
        onPrimaryClick={() => {
          toast.success('Product created successfully!');
        }}
        secondaryLabel="Cancel"
      />

      <SettingsSection
        title="Basic Info"
        subTitle="Edit your name and profile image"
      >
        <>
          <div className="settings-input-row">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  label="First Name"
                  value={field.value}
                  onChange={field.onChange}
                  name={field.name}
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  label="Last Name"
                  value={field.value}
                  onChange={field.onChange}
                  name={field.name}
                />
              )}
            />
          </div>
          <Input
            type="text"
            label="Email"
            value={user?.email ?? ''}
            className="form-input settings-form-input"
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onChange={() => {}}
            disabled
          />
          <div className="image-changer">
            <div className="avatar-container">
              <div className="avatar-wrapper">
                <UserAvatar
                  imageUrl={user?.imageUrl ?? ''}
                  alt={user?.firstName}
                  large
                />
              </div>
            </div>
            <Button variant="tertiary">Change picture</Button>
            <Button variant="secondary">Remove picture</Button>
          </div>
        </>
      </SettingsSection>

      <Divider />

      <SettingsSection
        title="Public Info"
        subTitle="Tell us something about yourself and your mission"
      >
        <>
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
            render={({ field, fieldState }) => (
              <Textarea
                label="Bio"
                value={field.value}
                onChange={field.onChange}
                name={field.name}
                error={fieldState.error?.message}
                isMaxLengthShown={true}
                maxLength={250}
              />
            )}
          />
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                label="Title"
                value={field.value}
                onChange={field.onChange}
                name={field.name}
                className="settings-form-input"
              />
            )}
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
            render={({ field, fieldState }) => (
              <Input
                placeholder="Tell us what drives you"
                type="text"
                label="Tagline / Mission"
                className="settings-form-input"
                value={field.value}
                onChange={field.onChange}
                name={field.name}
                error={fieldState.error?.message}
              />
            )}
          />
        </>
      </SettingsSection>

      <Divider />

      <SettingsSection
        title="Contact Info"
        subTitle="Update your public contact information"
      >
        <>
          <div className="settings-input-row">
            <Controller
              name="publicEmail"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  label="Public email"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  name={field.name}
                />
              )}
            />

            <InfoPopover className="info-popover" position="left">
              <span>
                This is the email showed on your storefront and what your
                clients can see.
              </span>
            </InfoPopover>
          </div>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                label="Phone number"
                value={field.value ?? ''}
                onChange={field.onChange}
                name={field.name}
                className="settings-form-input"
              />
            )}
          />
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
            render={({ field, fieldState }) => (
              <Input
                label="Website"
                placeholder="my-website.com"
                type="text"
                value={field.value}
                onChange={field.onChange}
                name={field.name}
                error={fieldState.error?.message}
                className="settings-form-input"
              />
            )}
          />
        </>
      </SettingsSection>

      <Divider />

      <SettingsSection title="Social Media" subTitle="Your social media links">
        <>
          <SocialInput
            label="Facebook"
            value="www.facebook.com/"
            control={control}
            name="facebook"
          />
          <SocialInput
            label="Instagram"
            value="www.instagram.com/"
            control={control}
            name="instagram"
            margin
          />
          <SocialInput
            label="X"
            value="www.x.com/"
            control={control}
            name="xPlatform"
            margin
          />

          <SocialInput
            label="Youtube"
            value="www.youtube.com/"
            control={control}
            name="youtube"
            margin
          />

          <SocialInput
            label="TikTok"
            value="www.tiktok.com/"
            control={control}
            name="tiktok"
            margin
          />
        </>
      </SettingsSection>
    </FormProvider>
  );
};

export default SettingsProfileTab;
