import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import { MemoryRouter } from 'react-router-dom';
import CtaSection from './cta-section.component';

const meta: Meta<typeof CtaSection> = {
  title: 'Components/CtaSection',
  component: CtaSection,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      // MemoryRouter allows useNavigate to work in Storybook
      <MemoryRouter>
        <div style={{ padding: '2rem', background: '#f8f9fa' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  args: {
    title: 'Join the community of creators',
    subtitle:
      'Create, share, and sell your content. Empower your business with Galactica.',
    primaryText: 'Launch Your Universe',
    onPrimaryClick: () => undefined,
    secondaryText: 'See pricing',
    onSecondaryClick: () => undefined,
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Main heading for the CTA section',
    },
    subtitle: {
      control: 'text',
      description: 'Descriptive text shown below the header',
    },
    primaryText: {
      control: 'text',
      description: 'Label for the primary CTA button',
    },
    secondaryText: {
      control: 'text',
      description: 'Optional label for the secondary CTA button',
    },
    onPrimaryClick: {
      action: 'primary-click',
      description: 'Primary CTA click handler',
    },
    onSecondaryClick: {
      action: 'secondary-click',
      description: 'Secondary CTA click handler',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CtaSection>;

export const Default: Story = {};

export const CustomCopy: Story = {
  args: {
    title: 'Upgrade your journey',
    subtitle: 'Discover new ways to grow your audience and revenue.',
    primaryText: 'Start now',
    secondaryText: 'Talk to sales',
  },
};
