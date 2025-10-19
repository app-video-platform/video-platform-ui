import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { MultiStepFormData } from '../multi-step-form.component';
import GalFormInput from '../../../../components/gal-form-input/gal-form-input.component';
import {
  GalLocation,
  OSMLocationSearch,
} from '../../../../components/gal-location-search/gal-location-search.component';

import './step-four.styles.scss';
import GalSocialMediaInput from '../../../../components/gal-social-media-input/gal-social-media-input.component';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../../../../store/auth-store/auth.selectors';
import {
  SocialMediaLink,
  SocialPlatforms,
} from '../../../../api/models/socials/social-media-link';

interface StepFourProps {
  // eslint-disable-next-line no-unused-vars
  onSocialMediaChange: (links: SocialMediaLink[]) => void;
}

const StepFour: React.FC<StepFourProps> = ({ onSocialMediaChange }) => {
  const user = useSelector(selectAuthUser);
  const { control, setValue } = useFormContext<MultiStepFormData>();
  const [initialLinks, setInitialLinks] = useState<SocialMediaLink[]>([]);

  // URL regex:
  // ^(https?:\/\/)?      optional “http://” or “https://”
  // (www\.)?             optional “www.”
  // [\w-]+               domain label (letters, digits, underscore, hyphen)
  // (\.[\w-]+)+          one or more “.something” (e.g. .com, .co.uk)
  // ([/?#].*)?           optional path, query or anchor
  // $                    end of string
  const URL_PATTERN = /^(https?:\/\/)?(www\.)?[\w-]+(\.[\w-]+)+([/?#].*)?$/i;

  useEffect(() => {
    if (user && user.socialLinks) {
      setInitialLinks(user.socialLinks);
    } else {
      setInitialLinks([
        {
          id: 'id_1',
          platform: SocialPlatforms.IG,
          url: 'InstagramURL',
        },
        {
          id: 'id_2',
          platform: SocialPlatforms.TT,
          url: 'TiktokURL',
        },
      ]);
    }
  }, [user]);

  const handleSelect = (location: GalLocation) => {
    setValue('city', location.city, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue('country', location.country, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue('lat', String(location.lat), {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue('long', String(location.lon), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleSocialMediaChange = (socialLinks: SocialMediaLink[]) => {
    onSocialMediaChange(socialLinks);
  };

  return (
    <div className="step-four">
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
              <GalFormInput
                className={`form-input onboarding-form-input${
                  hasError ? ' onboarding-form-input__error' : ''
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

      <div className="user-location-search-container">
        <OSMLocationSearch onSelect={handleSelect} />
      </div>

      <div className="social-media-circle-container">
        <GalSocialMediaInput
          initialSocialLinks={initialLinks}
          onChange={handleSocialMediaChange}
        />
      </div>
    </div>
  );
};

export default StepFour;
