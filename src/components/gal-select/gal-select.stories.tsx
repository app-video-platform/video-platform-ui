import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import { useState } from 'react';
import GalSelect, { GalSelectOption } from './gal-select.component';

const meta: Meta<typeof GalSelect> = {
  title: 'Components/GalSelect',
  component: GalSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A reusable select/dropdown input component with floating label styling and full keyboard support.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Field label text',
    },
    name: {
      control: 'text',
      description: 'HTML name/id of the select input',
    },
    required: {
      control: 'boolean',
      description: 'Marks field as required',
    },
    onChange: {
      action: 'changed',
      description: 'Callback triggered when the value changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GalSelect>;

const sampleOptions: GalSelectOption[] = [
  { value: 'course', label: 'Course' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'download', label: 'Download Package' },
];

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: 300 }}>
        <GalSelect
          {...args}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            args.onChange?.(e);
          }}
          options={sampleOptions}
        />
        <p style={{ marginTop: '1rem', color: '#444' }}>
          Selected: <strong>{value || '(none)'}</strong>
        </p>
      </div>
    );
  },
  args: {
    label: 'Product Type',
    name: 'type',
    required: true,
  },
};

export const WithNumbers: Story = {
  render: (args) => {
    const [value, setValue] = useState<number | string>('');
    const numberOptions: GalSelectOption[] = [
      { value: 1, label: 'Option One' },
      { value: 2, label: 'Option Two' },
      { value: 3, label: 'Option Three' },
    ];

    return (
      <div style={{ width: 300 }}>
        <GalSelect
          {...args}
          value={value}
          onChange={(e) => {
            setValue(Number(e.target.value));
            args.onChange?.(e);
          }}
          options={numberOptions}
        />
        <p style={{ marginTop: '1rem', color: '#444' }}>
          Selected: <strong>{String(value) || '(none)'}</strong>
        </p>
      </div>
    );
  },
  args: {
    label: 'Numeric Value',
    name: 'numericSelect',
  },
};
