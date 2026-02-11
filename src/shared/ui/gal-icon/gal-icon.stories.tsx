import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import { FaRegHeart, FaStar, FaTrash } from 'react-icons/fa';
import GalIcon from './gal-icon.component';

const meta: Meta<typeof GalIcon> = {
  title: 'Components/GalIcon',
  component: GalIcon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    icon: FaRegHeart,
    color: 'black',
    size: 24,
  },
  argTypes: {
    icon: {
      control: 'select',
      options: [FaRegHeart, FaStar, FaTrash],
      description: 'Icon component from react-icons to render',
    },
    color: {
      control: 'color',
      description: 'Icon color',
    },
    size: {
      control: { type: 'number', min: 12, max: 64, step: 2 },
      description: 'Icon size in pixels',
    },
    className: {
      control: 'text',
      description: 'Optional CSS class for styling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GalIcon>;

export const Default: Story = {};

export const Colored: Story = {
  args: {
    icon: FaStar,
    color: '#f5b301',
  },
};

export const Large: Story = {
  args: {
    icon: FaTrash,
    size: 48,
    color: 'red',
  },
};
