/* eslint-disable indent */
import React, { useEffect, useRef, useState } from 'react';
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
import {
  SocialMediaLink,
  UpdateUserRequest,
  AppDispatch,
  RootState,
} from 'core/api/models';
import { selectAuthUser, updateUserDetails } from 'core/store/auth-store';

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
  const sessionVersion = useSelector(
    (state: RootState) => state.auth.sessionVersion ?? 0,
  );
  const [step, setStep] = useState(1);
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const savingRef = useRef(false);
  const stepRef = useRef(step);
  const sessionVersionRef = useRef(sessionVersion);
  const userIdRef = useRef(user?.id);
  const pendingSaveRef = useRef<UpdateUserRequest | null>(null);

  stepRef.current = step;
  sessionVersionRef.current = sessionVersion;
  userIdRef.current = user?.id;

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
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

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

  const persistStep = async (userDetails: UpdateUserRequest) => {
    if (savingRef.current) {
      return;
    }

    const saveOwner = {
      step: stepRef.current,
      sessionVersion: sessionVersionRef.current,
      userId: userIdRef.current,
    };
    savingRef.current = true;
    setIsSaving(true);
    setSaveError(null);

    try {
      await dispatch(updateUserDetails(userDetails)).unwrap();
      if (
        mountedRef.current &&
        stepRef.current === saveOwner.step &&
        sessionVersionRef.current === saveOwner.sessionVersion &&
        userIdRef.current === saveOwner.userId
      ) {
        pendingSaveRef.current = null;
        nextStep();
      }
    } catch {
      if (
        mountedRef.current &&
        stepRef.current === saveOwner.step &&
        sessionVersionRef.current === saveOwner.sessionVersion &&
        userIdRef.current === saveOwner.userId
      ) {
        pendingSaveRef.current = userDetails;
        setSaveError(
          'We could not save your profile changes. Your answers are still here; retry to continue.',
        );
      }
    } finally {
      savingRef.current = false;
      if (mountedRef.current) {
        setIsSaving(false);
      }
    }
  };

  const buildUserDetails = (data: MultiStepFormData): UpdateUserRequest | null => {
    if (!user?.id) {
      return null;
    }

    return {
      userId: user.id,
      title: data.title,
      bio: data.bio,
      website: data.website,
      city: data.city,
      country: data.country,
      taglineMission: data.tagline,
      socialLinks,
    };
  };

  const onStepValid = async (data: MultiStepFormData) => {
    if (step === 1) {
      nextStep();
      return;
    }

    const userDetails = buildUserDetails(data);
    if (!userDetails) {
      setSaveError('Your profile is unavailable. Please retry after reconnecting.');
      return;
    }

    pendingSaveRef.current = userDetails;
    await persistStep(userDetails);
  };

  const retrySave = () => {
    const latestValues = buildUserDetails(methods.getValues());
    if (latestValues) {
      pendingSaveRef.current = latestValues;
      void persistStep(latestValues);
    }
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
        <div className="step-action-buttons" aria-busy={isSaving}>
          <Button
            type="button"
            variant="neutral"
            disabled={isSaving || !!saveError}
            onClick={() => navigate('/app')}
          >
            Skip
          </Button>
          {step !== 1 && (
            <Button type="button" variant="primary" disabled={isSaving || !!saveError} onClick={prevStep}>
              Back
            </Button>
          )}
          {step !== 5 && (
            <Button
              type="button"
              variant="primary"
              disabled={isSaving}
              onClick={() => {
                if (step === 1) {
                  nextStep();
                  return;
                }
                void methods.handleSubmit(onStepValid)();
              }}
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
        {isSaving && <p role="status">Saving profile changes…</p>}
        {saveError && (
          <div role="alert" className="onboarding-save-error">
            <p>{saveError}</p>
            <Button type="button" variant="primary" disabled={isSaving} onClick={retrySave}>
              {isSaving ? 'Saving…' : 'Retry save'}
            </Button>
          </div>
        )}
      </FormProvider>
    </div>
  );
};

export default MultiStepForm;
