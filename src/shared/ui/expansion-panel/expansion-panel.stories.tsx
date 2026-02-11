import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import GalExpansionPanel from './expansion-panel.component';

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
    hideToggle: false,
  },
  argTypes: {
    header: {
      control: 'text',
      description: 'The clickable header content of the panel',
    },
    defaultExpanded: {
      control: 'boolean',
      description: 'Whether the panel is expanded by default',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables expansion/collapse when true',
    },
    hideToggle: {
      control: 'boolean',
      description: 'Hides the toggle button when true',
    },
    onPanelToggle: {
      action: 'panel toggled',
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

export const WithoutToggleButton: Story = {
  args: { hideToggle: true },
  parameters: {
    docs: {
      description: {
        story:
          'Panel rendered without the toggle button. You can provide your own header interaction to call `onPanelToggle` if needed.',
      },
    },
  },
};

export const WithExternalState: Story = {
  render: (args) => {
    const [open, setOpen] = useState<boolean>(!!args.defaultExpanded);

    return (
      <div style={{ width: '400px' }}>
        <p style={{ marginBottom: '0.5rem' }}>
          External state: <strong>{open ? 'Open' : 'Closed'}</strong>
        </p>
        <GalExpansionPanel
          {...args}
          onPanelToggle={(isOpen) => {
            setOpen(isOpen);
            // Let Storybook action logger still work
            args.onPanelToggle?.(isOpen);
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          // eslint-disable-next-line max-len
          'Demonstrates syncing external state with the panel using the `onPanelToggle` callback. Note: the panel is still internally controlled; external state here is read-only from the panel’s perspective.',
      },
    },
  },
};
