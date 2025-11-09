import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// Or '@storybook/react-vite' if using Vite
import { useState } from 'react';
import GalCheckboxInput from './gal-checkbox-input.component';

const meta: Meta<typeof GalCheckboxInput> = {
  title: 'Components/GalCheckboxInput',
  component: GalCheckboxInput,
  tags: ['autodocs'],
  args: {
    label: 'Accept terms',
    name: 'terms',
    disabled: false,
    checked: false,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label displayed next to the checkbox',
    },
    name: {
      control: 'text',
      description: 'Unique name/id for the input element',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the checkbox when true',
    },
    onChange: { action: 'changed', description: 'Change event handler' },
  },
};

export default meta;
type Story = StoryObj<typeof GalCheckboxInput>;

// Controlled wrapper for interactive behavior
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Template = (args: any) => {
  const [checked, setChecked] = useState(args.checked);
  return (
    <GalCheckboxInput
      {...args}
      checked={checked}
      onChange={(e) => {
        setChecked(e.target.checked);
        args.onChange(e);
      }}
    />
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
};

export const Checked: Story = {
  render: (args) => <Template {...args} />,
  args: { checked: true },
};

export const Disabled: Story = {
  render: (args) => <Template {...args} />,
  args: { disabled: true },
};
