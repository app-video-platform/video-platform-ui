/* eslint-disable indent */
import React, { useState } from 'react';

import { Button } from '@shared/ui';
import {
  ChangePassword,
  EnterCode,
  EnterEmail,
} from 'domains/app/features/password-change';

import './forgot-password.styles.scss';

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
    setStep(step + 1);
  };

  const sendEmail = () => {
    console.info('SENDING CALL TO BE WITH EMAIL', emailInput);
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
      <Button type="button" variant="neutral" className="back-btn">
        Back to Sign In
      </Button>
    </div>
  );
};

export default ForgotPassword;
