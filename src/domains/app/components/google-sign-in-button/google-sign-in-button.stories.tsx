import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import GoogleSignInButton from './google-sign-in-button.component';

const meta: Meta<typeof GoogleSignInButton> = {
  title: 'Components/GoogleSignInButton',
  component: GoogleSignInButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Integrates Google Identity Services to handle user authentication with Google accounts. Requires the GSI script to be loaded globally.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GoogleSignInButton>;

/**
 * Mocked version for Storybook — does not load the real Google SDK.
 */
export const Default: Story = {
  render: () => (
    <div
      style={{
        border: '1px dashed #ccc',
        padding: '2rem',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#666',
      }}
    >
      <p>Google Sign-In button placeholder</p>
      <div
        style={{
          background: '#fff',
          border: '1px solid #dadce0',
          borderRadius: '4px',
          padding: '10px 20px',
          display: 'inline-block',
          cursor: 'pointer',
          marginTop: '1rem',
        }}
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          width="18"
          height="18"
          style={{ verticalAlign: 'middle', marginRight: '8px' }}
        />
        <span style={{ verticalAlign: 'middle' }}>Sign in with Google</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'In Storybook, this is rendered as a placeholder because Google’s SDK cannot initialize in the preview environment.',
      },
    },
  },
};
