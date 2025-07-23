/* eslint-disable indent */
import React, { useState } from 'react';

import './forgot-password.styles.scss';
import GalButton from '../../components/gal-button/gal-button.component';
import EnterEmail from './enter-email/enter-email.component';
import EnterCode from './enter-code/enter-code.component';
import ChangePassword from './change-password/change-password.component';

const ForgotPassword: React.FC = () => {
  const [emailInput, setEmailInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState(1);

  const handleChange = (e: { target: { value: string } }) => {
    setEmailInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (!emailInput) {
      setError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(emailInput)) {
      setError('Invalid email format');
      return;
    }
    e.preventDefault();
    console.log('change password email', emailInput);

    setStep(step + 1);
  };

  const sendEmail = () => {
    console.log('SENDING CALL TO BE WITH EMAIL', emailInput);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <EnterEmail
            emailInput={emailInput}
            error={error}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        );
      case 2:
        return (
          <EnterCode
            emailInput={emailInput}
            sendEmail={sendEmail}
            setStep={setStep}
          />
        );
      case 3:
        return <ChangePassword />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="forgot-password-page">
      {renderStep()}

      <GalButton
        text="Back to Sign In"
        htmlType="button"
        type="neutral"
        customClassName="back-btn"
      />
    </div>
  );
};

export default ForgotPassword;
