import React from 'react';

import { GalFormInput, GalButton } from '@shared/ui';

import './enter-email.styles.scss';

interface EnterEmailProps {
  emailInput: string;
  error: string;
  // eslint-disable-next-line no-unused-vars
  handleChange: (e: { target: { value: string } }) => void;
  // eslint-disable-next-line no-unused-vars
  handleSubmit: (e: React.FormEvent) => void;
}

const EnterEmail: React.FC<EnterEmailProps> = ({
  emailInput,
  error,
  handleChange,
  handleSubmit,
}) => (
  <div className="enter-email-step">
    <h1>Forgot your password</h1>
    <p>
      Please enter your email address. We will send you an email with a code.
      Use that code here to be able to change your password.
    </p>
    <form onSubmit={handleSubmit} className="enter-email-form">
      <GalFormInput
        type="email"
        value={emailInput}
        label="Enter email address"
        name="emailInput"
        onChange={handleChange}
        required
      />
      {error && error !== '' && <p className="error-text-red">{error}</p>}
      <div className="button-container">
        <GalButton
          text="Continue"
          htmlType="submit"
          type="primary"
          customClassName="continue-btn"
        />
      </div>
    </form>
  </div>
);

export default EnterEmail;
