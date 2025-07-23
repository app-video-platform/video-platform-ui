import React from 'react';

import { MultiStepFormData } from '../multi-step-form.component';
import GalFormInput from '../../../../components/gal-form-input/gal-form-input.component';

import './step-four.styles.scss';

interface StepFourProps {
  initialData: MultiStepFormData;
  setData: any;
}

const StepFour: React.FC<StepFourProps> = ({ initialData, setData }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('multi step form data', initialData);
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setData({ ...initialData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="form-step">
      <h2 className="step-header">Additional information</h2>
      <GalFormInput
        type="text"
        value={initialData.website}
        label="Your Website"
        name="website"
        onChange={handleChange}
      />
      <GalFormInput
        type="text"
        value={initialData.location}
        label="Your Location"
        name="location"
        onChange={handleChange}
      />
      <GalFormInput
        type="text"
        value={initialData.socialLinks}
        label="Your Social Media Links"
        name="socialLinks"
        onChange={handleChange}
      />
      {/* <div>
        <label>Bio:</label>
        <textarea
          value={initialData.bio}
          onChange={handleChange}
          required
        ></textarea>
      </div> */}
    </form>
  );
};

export default StepFour;
