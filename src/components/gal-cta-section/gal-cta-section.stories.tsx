import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import { MemoryRouter } from 'react-router-dom';
import GalCtaSection from './gal-cta-section.component';

const meta: Meta<typeof GalCtaSection> = {
  title: 'Components/GalCtaSection',
  component: GalCtaSection,
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
    headerText: 'Join the community of creators',
    descriptionText:
      'Create, share, and sell your content. Empower your business with Galactica.',
  },
  argTypes: {
    headerText: {
      control: 'text',
      description: 'Main heading for the CTA section',
    },
    descriptionText: {
      control: 'text',
      description: 'Descriptive text shown below the header',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GalCtaSection>;

export const Default: Story = {};

export const CustomCopy: Story = {
  args: {
    headerText: 'Upgrade your journey',
    descriptionText: 'Discover new ways to grow your audience and revenue.',
  },
};
