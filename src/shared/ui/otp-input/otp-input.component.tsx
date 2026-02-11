import React from 'react';
import OtpInput from 'react-otp-input';

import './otp-input.styles.scss';

interface OTPInputProps {
  value?: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (otp: string) => void;
  numInputs?: number;
}

const OTPInput: React.FC<OTPInputProps> = ({ value, onChange, numInputs }) => (
  <OtpInput
    value={value}
    onChange={onChange}
    numInputs={numInputs}
    inputStyle="otp-input"
    containerStyle="otp-container"
    renderInput={(props, index) => <input {...props} key={index} />}
  />
);

export default OTPInput;
