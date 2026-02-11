import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import { useState } from 'react';
import Input from './input.component';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Example Input',
    name: 'example',
    value: '',
    required: false,
    type: 'text',
    isMaxLengthShown: false,
    passwordField: { isFieldPassword: false, isMainField: false },
    maxLength: 50,
  },
  argTypes: {
    label: { control: 'text', description: 'Field label text' },
    name: { control: 'text', description: 'Input name/id' },
    value: { control: 'text', description: 'Controlled input value' },
    required: { control: 'boolean', description: 'Marks field as required' },
    type: {
      control: 'radio',
      options: ['text', 'textarea', 'number'],
      description: 'Type of input field',
    },
    onChange: { action: 'changed', description: 'Change event handler' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// Controlled wrapper for interactive story
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Template = (args: any) => {
  const [value, setValue] = useState(args.value);
  return (
    <div style={{ width: 400 }}>
      <Input
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
