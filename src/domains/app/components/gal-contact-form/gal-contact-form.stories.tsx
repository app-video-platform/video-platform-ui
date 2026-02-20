import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import GalContactForm from './gal-contact-form.component';

const meta: Meta<typeof GalContactForm> = {
  title: 'Components/GalContactForm',
  component: GalContactForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onSubmit: {
      description: 'Optional: extend handleSubmit for custom form logic',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GalContactForm>;

export const Default: Story = {
  render: () => <GalContactForm />,
};

export const Prefilled: Story = {
  render: () => (
    <div style={{ maxWidth: 600 }}>
      <GalContactForm />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Displays the default contact form layout. This example centers the form and restricts width for better preview.',
      },
    },
  },
};
