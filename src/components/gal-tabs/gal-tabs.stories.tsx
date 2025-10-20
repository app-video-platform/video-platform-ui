/* eslint-disable indent */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5'; // or '@storybook/react-vite'
import GalTabs, { TabItem } from './gal-tabs.component';

const meta: Meta<typeof GalTabs> = {
  title: 'Components/GalTabs',
  component: GalTabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A simple, reusable tab navigation component for switching between sections of related content.',
      },
    },
  },
  argTypes: {
    defaultIndex: {
      control: { type: 'number', min: 0 },
      description: 'Index of the tab open by default',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GalTabs>;

const sampleItems: TabItem[] = [
  { label: 'Overview', content: <p>Welcome to the Overview tab.</p> },
  { label: 'Details', content: <p>This is the Details tab content.</p> },
  { label: 'Settings', content: <p>Adjust your preferences here.</p> },
];

export const Default: Story = {
  args: {
    items: sampleItems,
    defaultIndex: 0,
  },
};

export const SecondTabActive: Story = {
  args: {
    items: sampleItems,
    defaultIndex: 1,
  },
};

export const LongLabels: Story = {
  args: {
    items: [
      { label: 'General Information', content: <p>General tab.</p> },
      { label: 'Advanced Settings', content: <p>Advanced tab.</p> },
      { label: 'Analytics & Reports', content: <p>Analytics tab.</p> },
    ],
    defaultIndex: 0,
  },
};
