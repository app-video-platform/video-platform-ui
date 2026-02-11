import React, { useState } from 'react';

import { OTPInput, Button } from '@shared/ui';

import './enter-code.styles.scss';

interface EnterCodeProps {
  emailInput: string;
  // eslint-disable-next-line no-unused-vars
  sendEmail: () => void;
  // eslint-disable-next-line no-unused-vars
  setStep: (value: number) => void;
}

const EnterCode: React.FC<EnterCodeProps> = ({
  emailInput,
  sendEmail,
  setStep,
}) => {
  const [code, setCode] = useState('');

  const handleChange = (code: string) => {
    setCode(code);
  };

  const handleClick = () => {
    setStep(3);
  };

  return (
    <div className="enter-code-step">
      <h1>Enter code</h1>
      <p>
        We sent a code to <strong>{emailInput}</strong>
      </p>
      <div className="otp-container">
        <OTPInput value={code} onChange={handleChange} numInputs={4} />
      </div>
      <div className="button-container">
        <Button
          type="button"
          variant="primary"
          onClick={() => handleClick()}
          className="continue-btn"
        >
          Continue
        </Button>
      </div>

      <p className="resend-email">
        Did not receive an email?
        <Button
          type="button"
          variant="neutral"
          onClick={() => sendEmail()}
          className="send-again-email"
        >
          Send it again!
        </Button>
      </p>
    </div>
  );
};

export default EnterCode;
