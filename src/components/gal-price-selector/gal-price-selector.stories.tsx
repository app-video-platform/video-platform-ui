import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import { useState } from 'react';
import GalPriceSelector from './gal-price-selector.component';

const meta: Meta<typeof GalPriceSelector> = {
  title: 'Components/GalPriceSelector',
  component: GalPriceSelector,
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
type Story = StoryObj<typeof GalPriceSelector>;

export const Default: Story = {
  render: (args) => {
    const [price, setPrice] = useState<'free' | number>('free');
    return (
      <div style={{ width: 300 }}>
        <GalPriceSelector {...args} price={price} setPrice={setPrice} />
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
        <GalPriceSelector {...args} price={price} setPrice={setPrice} />
      </div>
    );
  },
};
