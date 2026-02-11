import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import { useState } from 'react';
import PriceSelector from './price-selector.component';

const meta: Meta<typeof PriceSelector> = {
  title: 'Components/PriceSelector',
  component: PriceSelector,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A pricing selector that toggles between Free and Paid modes. Displays a price input field when Paid is selected.',
      },
    },
  },
  argTypes: {
    price: {
      control: 'text',
      description: 'Current price or "free"',
    },
    setPrice: {
      action: 'setPrice',
      description: 'Callback triggered when price or mode changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PriceSelector>;

export const Default: Story = {
  render: (args) => {
    const [price, setPrice] = useState<'free' | number>('free');
    return (
      <div style={{ width: 300 }}>
        <PriceSelector {...args} price={price} setPrice={setPrice} />
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#333' }}>
          Current mode:{' '}
          <strong>
            {price === 'free' ? 'Free' : `Paid - $${Number(price).toFixed(2)}`}
          </strong>
        </p>
      </div>
    );
  },
};

export const PaidMode: Story = {
  render: (args) => {
    const [price, setPrice] = useState<'free' | number>(25);
    return (
      <div style={{ width: 300 }}>
        <PriceSelector {...args} price={price} setPrice={setPrice} />
      </div>
    );
  },
};
