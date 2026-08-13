import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Breadcrumbs from './breadcrumb.component';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/dashboard/products/edit']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const DashboardProductsEdit: Story = {
  render: () => (
    <Routes>
      <Route path="*" element={<Breadcrumbs />} />
    </Routes>
  ),
};

export const SimpleTwoLevel: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/dashboard/products']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  render: () => (
    <Routes>
      <Route path="*" element={<Breadcrumbs />} />
    </Routes>
  ),
};

export const DeepPath: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/dashboard/products/new']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  render: () => (
    <Routes>
      <Route path="*" element={<Breadcrumbs />} />
    </Routes>
  ),
};
