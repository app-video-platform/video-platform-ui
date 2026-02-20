import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import { MemoryRouter } from 'react-router-dom';
import GalFooter from './gal-footer.component';

const meta: Meta<typeof GalFooter> = {
  title: 'Components/GalFooter',
  component: GalFooter,
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
type Story = StoryObj<typeof GalFooter>;

export const Default: Story = {};

export const DarkModePreview: Story = {
  render: () => (
    <div style={{ background: '#1c1c1c', color: '#fff', paddingTop: '2rem' }}>
      <MemoryRouter>
        <GalFooter />
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
