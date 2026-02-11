import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5'; // or '@storybook/react-vite'
import Spinner from './spinner.component';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
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
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  render: () => <Spinner />,
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
      <Spinner />
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
