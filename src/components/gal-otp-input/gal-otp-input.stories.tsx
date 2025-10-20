import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import { useState } from 'react';
import GalOTPInput from './gal-otp-input.component';

const meta: Meta<typeof GalOTPInput> = {
  title: 'Components/GalOTPInput',
  component: GalOTPInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An OTP (One-Time Password) input built on top of react-otp-input. Supports custom length, controlled value, and styling.',
      },
    },
  },
  args: {
    numInputs: 6,
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Current OTP value (controlled input)',
    },
    onChange: {
      action: 'changed',
      description: 'Callback triggered when OTP value changes',
    },
    numInputs: {
      control: { type: 'number', min: 3, max: 8 },
      description: 'Number of OTP input fields',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GalOTPInput>;

export const Default: Story = {
  render: (args) => {
    const [otp, setOtp] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <GalOTPInput {...args} value={otp} onChange={setOtp} />
        <p style={{ fontSize: '0.9rem', color: '#333' }}>
          Current value: <strong>{otp || '(empty)'}</strong>
        </p>
      </div>
    );
  },
};

export const FourDigits: Story = {
  render: (args) => {
    const [otp, setOtp] = useState('');
    return <GalOTPInput {...args} value={otp} onChange={setOtp} />;
  },
  args: { numInputs: 4 },
};

export const Prefilled: Story = {
  render: (args) => {
    const [otp, setOtp] = useState('1234');
    return <GalOTPInput {...args} value={otp} onChange={setOtp} />;
  },
  args: { numInputs: 4 },
};
