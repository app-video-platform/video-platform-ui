import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import { useState } from 'react';
import GalExpansionPanel from './gal-expansion-panel.component';

const meta: Meta<typeof GalExpansionPanel> = {
  title: 'Components/GalExpansionPanel',
  component: GalExpansionPanel,
  tags: ['autodocs'],
  args: {
    header: 'Click to expand',
    children: (
      <p style={{ margin: 0 }}>
        This is some expandable content that can be toggled open and closed.
      </p>
    ),
    defaultExpanded: false,
    disabled: false,
  },
  argTypes: {
    header: {
      control: 'text',
      description: 'The clickable header text of the panel',
    },
    defaultExpanded: {
      control: 'boolean',
      description: 'Whether the panel is expanded by default',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables expansion/collapse when true',
    },
    onToggle: {
      action: 'toggled',
      description: 'Callback triggered when panel is toggled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GalExpansionPanel>;

export const Default: Story = {};

export const InitiallyOpen: Story = {
  args: { defaultExpanded: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithExternalControl: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ width: '400px' }}>
        <button
          onClick={() => setOpen(!open)}
          style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}
        >
          {open ? 'Close externally' : 'Open externally'}
        </button>
        <GalExpansionPanel
          {...args}
          defaultExpanded={open}
          onToggle={(isOpen) => {
            setOpen(isOpen);
            args.onToggle?.(isOpen);
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates using external state to control expansion programmatically.',
      },
    },
  },
};
