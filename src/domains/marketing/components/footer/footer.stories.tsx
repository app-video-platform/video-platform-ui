import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import { MemoryRouter } from 'react-router-dom';
import Footer from './footer.component';

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ background: '#f8f9fa', paddingTop: '2rem' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A site-wide footer section containing grouped navigation links and social icons.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};

export const DarkModePreview: Story = {
  render: () => (
    <div style={{ background: '#1c1c1c', color: '#fff', paddingTop: '2rem' }}>
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Renders the footer on a dark background for contrast testing.',
      },
    },
  },
};
