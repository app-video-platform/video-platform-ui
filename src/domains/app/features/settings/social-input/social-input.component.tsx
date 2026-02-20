import React from 'react';
import { Control, Controller } from 'react-hook-form';

import { ProfileFormData } from '../settings-tabs/settings-profile-tab.component';
import { Input } from '@shared/ui';

import './social-input.styles.scss';
import clsx from 'clsx';

interface SocialInputProps {
  label: string;
  value: string;
  name:
    | 'title'
    | 'firstName'
    | 'lastName'
    | 'bio'
    | 'tagline'
    | 'website'
    | 'publicEmail'
    | 'phone'
    | 'imageUrl'
    | 'facebook'
    | 'instagram'
    | 'xPlatform'
    | 'youtube'
    | 'tiktok';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<ProfileFormData, any>;
  margin?: boolean;
}

const SocialInput: React.FC<SocialInputProps> = ({
  label,
  value,
  name,
  control,
  margin = false,
}) => (
  <div className={clsx('social-row', { margin })}>
    <Input
      label={label}
      type="text"
      value={value}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onChange={() => {}}
      className="social-link"
      disabled
    />
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          placeholder="exampleName"
          type="text"
          value={field.value ?? ''}
          onChange={field.onChange}
          name={field.name}
          className="social-link-input"
        />
      )}
    />
  </div>
);

export default SocialInput;
