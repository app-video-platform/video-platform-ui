import React from 'react';

import { GalFormInput, GalCheckboxInput, GalButton } from '@shared/ui';

import './gal-contact-form.styles.scss';

const GalContactForm: React.FC = () => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    topic: '',
    message: '',
    agree: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-inputs">
        <div className="inline-inputs">
          <GalFormInput
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <GalFormInput
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="inline-inputs">
          <GalFormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <GalFormInput
            label="Topic"
            type="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
          />
        </div>
        <GalFormInput
          label="Message"
          type="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          inputType="textarea"
          required
        />
        <GalCheckboxInput
          label="I agree to the terms and conditions"
          name="agree"
          checked={formData.agree}
          onChange={handleChange}
          disabled={false}
        />
      </div>
      <GalButton htmlType="submit" text="Beam it up!" type="primary" />
    </form>
  );
};

export default GalContactForm;
