import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import ContactForm from './contact-form.component';

const meta: Meta<typeof ContactForm> = {
  title: 'Components/ContactForm',
  component: ContactForm,
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
type Story = StoryObj<typeof ContactForm>;

export const Default: Story = {
  render: () => <ContactForm />,
};

export const Prefilled: Story = {
  render: () => (
    <div style={{ maxWidth: 600 }}>
      <ContactForm />
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
