import React, { useState } from 'react';

import './enter-code.styles.scss';
import GalButton from '../../../components/gal-button/gal-button.component';
import GalOTPInput from '../../../components/gal-otp-input/gal-otp-input.component';

interface EnterCodeProps {
  emailInput: string;
  // eslint-disable-next-line no-unused-vars
  sendEmail: () => void;
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
    console.log('eeeeeee', code);
  };

  const handleClick = () => {
    console.log('code', code);
    setStep(3);
  };

  return (
    <div className="enter-code-step">
      <h1>Enter code</h1>
      <p>
        We sent a code to <strong>{emailInput}</strong>
      </p>
      <div className="otp-container">
        <GalOTPInput value={code} onChange={handleChange} numInputs={4} />
      </div>
      <div className="button-container">
        <GalButton
          text="Continue"
          htmlType="button"
          type="primary"
          customClassName="continue-btn"
          onClick={() => handleClick()}
        />
      </div>

      <p className="resend-email">
        Did not receive an email?
        <GalButton
          text="Send it again!"
          htmlType="button"
          type="neutral"
          onClick={() => sendEmail}
          customClassName="send-again-email"
        />
      </p>
    </div>
  );
};

export default EnterCode;
