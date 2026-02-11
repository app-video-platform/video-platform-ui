/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import MultiStepProgressBar from './multi-step-progress-bar/multi-step-progress-bar.component';
import StepOne from './step-one/step-one.component';
import StepTwo from './step-two/step-two.component';
import StepThree from './step-three/step-three.component';
import StepFour from './step-four/step-four.component';
import StepFive from './step-five/step-five.component';
import { Button } from '@shared/ui';
import { SocialMediaLink, UpdateUserRequest, AppDispatch } from '@api/models';
import { selectAuthUser, updateUserDetails } from '@store/auth-store';

import './multi-step-form.styles.scss';

export interface MultiStepFormData {
  profileImage: string;
  title: string;
  bio: string;
  website: string;
  tagline: string;
  city: string;
  country: string;
  lat: string;
  long: string;
}

const MultiStepForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectAuthUser);
  const [step, setStep] = useState(1);
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const methods = useForm<MultiStepFormData>({
    defaultValues: {
      title: '',
      bio: '',
      website: '',
      city: '',
      country: '',
      lat: '',
      long: '',
      tagline: '',
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (user) {
      methods.reset({
        title: user.title,
        bio: user.bio,
        website: user.website,
        city: user.city,
        country: user.country,
        lat: user.lat,
        long: user.long,
        tagline: user.taglineMission,
      });
    }
  }, [user, methods]);

  const onStepValid = (data: MultiStepFormData) => {
    if (step === 1) {
      nextStep();
      return;
    }

    const userDetails: UpdateUserRequest = {
      userId: user!.id!,
      title: data.title,
      bio: data.bio,
      website: data.website,
      city: data.city,
      country: data.country,
      taglineMission: data.tagline,
      socialLinks: socialLinks,
    };

    console.log('[UPDATE USER DETAILS] userDetails', userDetails);
    // Save partial data to Redux or back-end
    dispatch(updateUserDetails(userDetails));
    nextStep();
  };

  return (
    <div className="multi-step-container">
      <MultiStepProgressBar step={step} totalSteps={5} />
      <FormProvider {...methods}>
        <div className="step-container">
          {step === 1 && (
            <>
              <h1 className="step-header">
                Welcome, {user?.firstName} {user?.lastName}...
              </h1>
              <div className="step-content">
                <StepOne />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h1 className="step-header">Basic Profile</h1>
              <div className="step-content">
                <StepTwo />
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h1 className="step-header">About You</h1>
              <div className="step-content">
                <StepThree />
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <h1 className="step-header">Additional information</h1>
              <div className="step-content">
                <StepFour
                  onSocialMediaChange={(links) => setSocialLinks(links)}
                />
              </div>
            </>
          )}
          {step === 5 && (
            <div className="step-content">
              <StepFive />
            </div>
          )}
        </div>
        <div className="step-action-buttons">
          <Button
            type="button"
            variant="neutral"
            onClick={() => navigate('/app')}
          >
            Skip
          </Button>
          {step !== 1 && (
            <Button type="button" variant="primary" onClick={prevStep}>
              Back
            </Button>
          )}
          {step !== 5 && (
            <Button
              type="button"
              variant="primary"
              onClick={methods.handleSubmit(onStepValid)}
            >
              Next
            </Button>
          )}

          {step === 5 && (
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate('/app')}
            >
              Continue
            </Button>
          )}
        </div>
      </FormProvider>
    </div>
  );
};

export default MultiStepForm;
