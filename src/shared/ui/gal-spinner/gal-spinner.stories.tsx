import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5'; // or '@storybook/react-vite'
import GalSpinner from './gal-spinner.component';

const meta: Meta<typeof GalSpinner> = {
  title: 'Components/GalSpinner',
  component: GalSpinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A simple loading spinner component used throughout the app to indicate loading or pending states.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GalSpinner>;

export const Default: Story = {
  render: () => <GalSpinner />,
};

export const OnDarkBackground: Story = {
  render: () => (
    <div
      style={{
        background: '#222',
        padding: '2rem',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
      }}
    >
      <GalSpinner />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of how the spinner appears against a dark background.',
      },
    },
  },
};
