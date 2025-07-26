import React, { useState } from 'react';

import { MultiStepFormData } from '../multi-step-form.component';

import './step-two.styles.scss';
import GalFormInput from '../../../../components/gal-form-input/gal-form-input.component';

interface StepTwoProps {
  initialData: MultiStepFormData;
  setData: any;
  submitForm: (data: Partial<FormData>) => void;
}

const StepTwo: React.FC<StepTwoProps> = ({
  initialData,
  setData,
  submitForm,
}) => {
  const [bio, setBio] = useState(initialData.bio);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setData({ ...initialData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="form-step">
      <h2 className="step-header">Basic Profile</h2>
      <GalFormInput
        type="text"
        value={initialData.profileImage}
        label="Your Profile Picture (for now an input)"
        name="profileImage"
        onChange={handleChange}
      />
      <GalFormInput
        type="text"
        value={initialData.title}
        label="Your Title"
        name="title"
        onChange={handleChange}
      />
    </form>
  );
};

export default StepTwo;
