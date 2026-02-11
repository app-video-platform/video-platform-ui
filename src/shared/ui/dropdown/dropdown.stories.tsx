import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import Dropdown from './dropdown.component';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    customClassName: 'demo-dropdown',
  },
  argTypes: {
    customClassName: {
      control: 'text',
      description: 'Custom CSS class applied to the dropdown menu container',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

// Simple styled wrapper to visualize dropdown better
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: 'relative', height: '200px', padding: '2rem' }}>
    {children}
  </div>
);

export const BasicDropdown: Story = {
  render: (args) => (
    <Wrapper>
      <Dropdown
        {...args}
        trigger={({ open, toggle }) => (
          <button
            onClick={toggle}
            aria-expanded={open}
            className="px-4 py-2 border rounded bg-white shadow-sm"
          >
            {open ? 'Close Menu' : 'Open Menu'}
          </button>
        )}
        menu={({ close }) => (
          <div
            className="absolute mt-2 w-40 bg-white border rounded shadow-md"
            style={{ zIndex: 10 }}
          >
            <ul className="divide-y">
              <li className="px-3 py-2 hover:bg-gray-100" onClick={close}>
                Profile
              </li>
              <li className="px-3 py-2 hover:bg-gray-100" onClick={close}>
                Settings
              </li>
              <li className="px-3 py-2 hover:bg-gray-100" onClick={close}>
                Logout
              </li>
            </ul>
          </div>
        )}
      />
    </Wrapper>
  ),
};

export const CustomStyled: Story = {
  render: (args) => (
    <Wrapper>
      <Dropdown
        {...args}
        customClassName="rounded-xl bg-indigo-600 text-white"
        trigger={({ open, toggle }) => (
          <button
            onClick={toggle}
            aria-expanded={open}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Menu ▼
          </button>
        )}
        menu={({ close }) => (
          <div className="p-2 text-sm">
            <div onClick={close} className="cursor-pointer hover:underline">
              Dashboard
            </div>
            <div onClick={close} className="cursor-pointer hover:underline">
              Billing
            </div>
            <div onClick={close} className="cursor-pointer hover:underline">
              Log out
            </div>
          </div>
        )}
      />
    </Wrapper>
  ),
};
