import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import GalProductCard from './gal-product-box.component';
import { MemoryRouter } from 'react-router-dom';
import { ProductMinimised } from '../../api/models/product/product';

const meta: Meta<typeof GalProductCard> = {
  title: 'Components/GalProductCard',
  component: GalProductCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ width: 280 }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Displays product information with image, title, type, price, and a View Product button.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GalProductCard>;

const mockProduct: ProductMinimised = {
  id: 'p123',
  title: 'Cinematic Video Course',
  type: 'COURSE',
  price: 89,
};

export const Default: Story = {
  args: { product: mockProduct },
};

export const FreeProduct: Story = {
  args: {
    product: {
      id: 'p124',
      title: 'Beginner Photography Tips',
      type: 'DOWNLOAD',
      price: 'free',
    } as ProductMinimised,
  },
};

export const ConsultationType: Story = {
  args: {
    product: {
      id: 'p125',
      title: '1:1 Video Consultation',
      type: 'CONSULTATION',
      price: 150,
    } as ProductMinimised,
  },
};
