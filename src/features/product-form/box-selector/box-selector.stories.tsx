import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// If using Vite: import from '@storybook/react-vite'

import GalBoxSelector, { OptionType } from './box-selector.component';
import { useState } from 'react';

// Example options (mocked ProductType / LessonType values)
const mockOptions: OptionType[] = ['CONSULTATION', 'COURSE', 'DOWNLOAD'];

const meta: Meta<typeof GalBoxSelector> = {
  title: 'Components/GalBoxSelector',
  component: GalBoxSelector,
  tags: ['autodocs'],
  args: {
    availableOptions: mockOptions,
    disabledOptions: ['DOWNLOAD'],
  },
  argTypes: {
    availableOptions: {
      control: { type: 'object' },
      description: 'Array of available options to display',
    },
    disabledOptions: {
      control: { type: 'object' },
      description: 'Options that cannot be selected',
    },
    selectedOption: {
      control: { type: 'text' },
      description: 'Currently selected option',
    },
    onSelect: {
      action: 'selected',
      description: 'Callback triggered when a user selects an option',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GalBoxSelector>;

// Helper wrapper to handle selection
const Template = (args: any) => {
  const [selected, setSelected] = useState<string | undefined>(
    args.selectedOption,
  );
  return (
    <GalBoxSelector
      {...args}
      selectedOption={selected}
      onSelect={(option) => {
        setSelected(option);
        args.onSelect(option);
      }}
    />
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
};

export const WithPreselected: Story = {
  render: (args) => <Template {...args} />,
  args: { selectedOption: 'COURSE' },
};

export const AllEnabled: Story = {
  render: (args) => <Template {...args} />,
  args: { disabledOptions: [] },
};
