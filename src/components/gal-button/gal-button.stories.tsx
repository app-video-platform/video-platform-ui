import type { Meta, StoryObj } from '@storybook/react-webpack5';

import GalButton from './gal-button.component';

const meta: Meta<typeof GalButton> = {
  title: 'Components/GalButton',
  component: GalButton,
  tags: ['autodocs'],
  args: {
    text: 'Click me',
    type: 'neutral',
    htmlType: 'button',
    disabled: false,
  },
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: ['neutral', 'primary', 'secondary'],
    },
    htmlType: {
      control: { type: 'radio' },
      options: ['button', 'submit', 'reset'],
    },
    customClassName: { control: 'text' },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof GalButton>;

export const Neutral: Story = {};

export const Primary: Story = {
  args: { type: 'primary', text: 'Primary' },
};

export const Secondary: Story = {
  args: { type: 'secondary', text: 'Secondary' },
};

export const Disabled: Story = {
  args: { disabled: true, text: 'Disabled' },
};

export const AsSubmit: Story = {
  args: { htmlType: 'submit', text: 'Submit' },
};

export const WithCustomClass: Story = {
  args: { customClassName: 'my-custom-class', text: 'With class' },
};
