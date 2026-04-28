import React from 'react';

import { Input, Button, Textarea, CheckboxInput } from '@shared/ui';

import './contact-form.styles.scss';

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
          <Input
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="inline-inputs">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Topic"
            type="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
          />
        </div>
        <Textarea
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
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
      <Button type="submit" variant="primary">
        Beam it Up
      </Button>
    </form>
  );
};

export default ContactForm;
