/* eslint-disable indent */
import React, { useState } from 'react';

import MultiStepProgressBar from './multi-step-progress-bar/multi-step-progress-bar.component';

import './multi-step-form.styles.scss';
import StepOne from './step-one/step-one.component';
import StepTwo from './step-two/step-two.component';
import StepThree from './step-three/step-three.component';
import StepFour from './step-four/step-four.component';
import StepFive from './step-five/step-five.component';
import { useNavigate } from 'react-router-dom';
import GalButton from '../../../components/gal-button/gal-button.component';

export interface MultiStepFormData {
  profileImage: string;
  title: string;
  bio: string;
  socialLinks: string;
  website: string;
  location: string;
  tagline: string;
}

const MultiStepForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const [formData, setFormData] = useState({
    profileImage: '',
    title: '',
    bio: '',
    socialLinks: '',
    website: '',
    location: '',
    tagline: '',
  });

  const handleNextStep = (type: 'next' | 'continue') => {
    switch (type) {
      case 'next':
        if (step === 4) {
          console.log('SHOULD SAVE HERE', formData);
        }
        console.log('continue on step', step);
        console.log('save now form', formData);

        nextStep();
        break;
      case 'continue':
        console.log('SHOULD CONTINUE ONBOARDING');
        navigate('/app');
        break;

      default:
        break;
    }
  };

  const handleUpdate = () => {
    console.log('form data', formData);
  };

  const handleSkip = () => {
    console.log('SHOULD SET onboardingCompleted TO TRUE');
    navigate('/app');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepOne key={step} />;
      case 2:
        return (
          <StepTwo
            key={step}
            initialData={formData}
            setData={setFormData}
            submitForm={handleUpdate}
          />
        );
      case 3:
        return (
          <StepThree
            key={step}
            initialData={formData}
            setData={formData}
            submitForm={handleUpdate}
          />
        );
      case 4:
        return (
          <StepFour
            key={step}
            initialData={formData}
            setData={formData}
            submitForm={handleUpdate}
          />
        );
      case 5:
        return <StepFive key={step} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="multi-step-container">
      <MultiStepProgressBar step={step} totalSteps={5} />
      <div className="step-container">{renderStep()}</div>
      <div className="step-action-buttons">
        <GalButton onClick={() => handleSkip()} text="Skip" type="neutral" />
        {step !== 1 && (
          <GalButton onClick={prevStep} text="Back" type="primary" />
        )}
        {step !== 5 && (
          <GalButton
            onClick={() => handleNextStep('next')}
            type="primary"
            text="Next"
          />
        )}

        {step === 5 && (
          <GalButton
            onClick={() => handleNextStep('continue')}
            text="Continue"
            type="primary"
          />
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
