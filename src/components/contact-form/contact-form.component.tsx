import React from 'react';

import FormInputX from '../form-input/form-input.component';

import './contact-form.styles.scss';
import CheckboxInput from '../checkbox-input/checkbox-input.component';
import Button from '../button/button.component';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    topic: '',
    message: '',
    agree: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-inputs">
        <div className="inline-inputs">
          <FormInputX
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <FormInputX
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="inline-inputs">
          <FormInputX
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FormInputX
            label="Topic"
            type="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
          />
        </div>
        <FormInputX
          label="Message"
          type="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          inputType="textarea"
          required
        />
        <CheckboxInput
          label="I agree to the terms and conditions"
          name="agree"
          checked={formData.agree}
          onChange={handleChange}
          disabled={false}
        />
      </div>
      <Button htmlType="submit" text="Beam it up!" type="primary" />
    </form>
  );
};

export default ContactForm;
