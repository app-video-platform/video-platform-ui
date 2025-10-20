import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import { useState } from 'react';
import GalFormInput from './gal-form-input.component';

const meta: Meta<typeof GalFormInput> = {
  title: 'Components/GalFormInput',
  component: GalFormInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Example Input',
    name: 'example',
    value: '',
    required: false,
    inputType: 'text',
    isMaxLengthShown: false,
    passwordField: { isFieldPassword: false, isMainField: false },
    maxLength: 50,
  },
  argTypes: {
    label: { control: 'text', description: 'Field label text' },
    name: { control: 'text', description: 'Input name/id' },
    value: { control: 'text', description: 'Controlled input value' },
    required: { control: 'boolean', description: 'Marks field as required' },
    inputType: {
      control: 'radio',
      options: ['text', 'textarea', 'number'],
      description: 'Type of input field',
    },
    isMaxLengthShown: {
      control: 'boolean',
      description: 'Displays live character count',
    },
    maxLength: { control: 'number', description: 'Maximum input length' },
    passwordField: {
      control: 'object',
      description:
        'Password field options — e.g. `{ isFieldPassword: true, isMainField: true }`',
    },
    onChange: { action: 'changed', description: 'Change event handler' },
  },
};

export default meta;
type Story = StoryObj<typeof GalFormInput>;

// Controlled wrapper for interactive story
const Template = (args: any) => {
  const [value, setValue] = useState(args.value);
  return (
    <div style={{ width: 400 }}>
      <GalFormInput
        {...args}
        value={value}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => {
          setValue(e.target.value);
          args.onChange(e);
        }}
      />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
};

export const WithCounter: Story = {
  render: (args) => <Template {...args} />,
  args: { isMaxLengthShown: true, maxLength: 40 },
};

export const Textarea: Story = {
  render: (args) => <Template {...args} />,
  args: { inputType: 'textarea', label: 'Message' },
};

export const PasswordField: Story = {
  render: (args) => <Template {...args} />,
  args: {
    label: 'Password',
    passwordField: { isFieldPassword: true, isMainField: true },
    value: '',
  },
};
