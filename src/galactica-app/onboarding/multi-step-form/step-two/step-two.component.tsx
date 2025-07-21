import React, { useState } from 'react';

import { MultiStepFormData } from '../multi-step-form.component';

import './step-two.styles.scss';
import FormInputX from '../../../../components/form-input/form-input.component';

interface StepTwoProps {
  initialData: MultiStepFormData;
  setData: any;
  // submitForm: (data: Partial<FormData>) => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ initialData, setData }) => {
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
      <FormInputX
        type="text"
        value={initialData.profileImage}
        label="Your Profile Picture (for now an input)"
        name="profileImage"
        onChange={handleChange}
      />
      <FormInputX
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
