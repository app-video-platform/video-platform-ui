import React, { useState } from 'react';

import './step-three.styles.scss';
import { MultiStepFormData } from '../multi-step-form.component';
import GalFormInput from '../../../../components/gal-form-input/gal-form-input.component';

interface StepThreeProps {
  initialData: MultiStepFormData;
  setData: any;
  // nextStep: (data: Partial<FormData>) => void;
}

const StepThree: React.FC<StepThreeProps> = ({ initialData, setData }) => {
  const handleSubmit = (e: React.FormEvent) => {
    // e.preventDefault();
    // if (!bio) {
    //   alert('Please enter your bio.');
    //   return;
    // }
    // submitForm({ description });
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setData({ ...initialData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="form-step">
      <h2 className="step-header">About You</h2>
      <div>
        <GalFormInput
          type="text"
          value={initialData.bio}
          label="Your Bio"
          name="bio"
          onChange={handleChange}
        />
        <GalFormInput
          type="text"
          value={initialData.tagline}
          label="Your Tagline / Mission"
          name="tagline"
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

export default StepThree;
