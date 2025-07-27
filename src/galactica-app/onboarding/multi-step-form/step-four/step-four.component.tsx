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
import { SocialLink, SocialPlatforms } from '../../../../api/models/user/user';

interface StepFourProps {
  onSocialMediaChange: (links: SocialLink[]) => void;
}

const StepFour: React.FC<StepFourProps> = ({ onSocialMediaChange }) => {
  const user = useSelector(selectAuthUser);
  const { control, setValue } = useFormContext<MultiStepFormData>();
  const [initialLinks, setInitialLinks] = useState<SocialLink[]>([]);

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
  };

  const handleSocialMediaChange = (socialLinks: SocialLink[]) => {
    onSocialMediaChange(socialLinks);
  };

  return (
    <div className="step-four">
      <Controller
        name="website"
        control={control}
        render={({ field }) => (
          <GalFormInput
            className="form-input onboarding-form-input"
            placeholder="Website"
            type="text"
            value={field.value}
            onChange={field.onChange}
            name={field.name}
          />
        )}
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
