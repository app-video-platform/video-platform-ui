import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import { useState } from 'react';
import GalPasswordsContainer from './gal-passwords-container.component';

const meta: Meta<typeof GalPasswordsContainer> = {
  title: 'Components/GalPasswordsContainer',
  component: GalPasswordsContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Renders password + confirm password fields with show/hide toggle and live validation rules.',
      },
    },
  },
  argTypes: {
    passwordErrors: {
      control: 'text',
      description: 'Error message for password field',
    },
    confirmPasswordErrors: {
      control: 'text',
      description: 'Error message for confirm password field',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GalPasswordsContainer>;

export const Default: Story = {
  render: (args) => {
    const [form, setForm] = useState({
      passwordInput: '',
      confirmPasswordInput: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };

    return (
      <div style={{ width: 400 }}>
        <GalPasswordsContainer
          {...args}
          passwordInput={form.passwordInput}
          confirmPasswordInput={form.confirmPasswordInput}
          passwordErrors={
            form.passwordInput.length > 0 && form.passwordInput.length < 8
              ? 'Password too short'
              : ''
          }
          confirmPasswordErrors={
            form.confirmPasswordInput.length > 0 &&
            form.confirmPasswordInput !== form.passwordInput
              ? 'Passwords do not match'
              : ''
          }
          handleChange={handleChange}
        />
      </div>
    );
  },
};

export const WithErrors: Story = {
  args: {
    passwordInput: '12345',
    confirmPasswordInput: '54321',
    passwordErrors: 'Password too short',
    confirmPasswordErrors: 'Passwords do not match',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handleChange: () => {},
  },
};
