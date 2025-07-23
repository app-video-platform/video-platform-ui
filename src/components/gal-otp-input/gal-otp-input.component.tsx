import React from 'react';
import OtpInput from 'react-otp-input';

import './gal-otp-input.styles.scss';

interface GalOTPInputProps {
  value?: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (otp: string) => void;
  numInputs?: number;
}

const GalOTPInput: React.FC<GalOTPInputProps> = ({
  value,
  onChange,
  numInputs,
}) => (
  <OtpInput
    value={value}
    onChange={onChange}
    numInputs={numInputs}
    inputStyle="otp-input"
    containerStyle="otp-container"
    renderInput={(props, index) => <input {...props} key={index} />}
  />
);

export default GalOTPInput;
