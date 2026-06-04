import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { AbstractProduct, ProductMinimised } from 'core/api/models';
import ProductCard from './product-card.component';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  useNavigate: () => mockNavigate,
}));

jest.mock('@shared/ui', () => ({
  __esModule: true,
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
  StatusChip: ({ status }: { status: string }) => (
    <span data-testid="status-chip">{status}</span>
  ),
}));

describe('ProductCard', () => {
  it('renders the full product name when given a full product', () => {
    const product: AbstractProduct = {
      id: 'product-1',
      name: 'Masterclass',
      type: 'COURSE',
      status: 'PUBLISHED',
      price: 99,
      createdAt: new Date('2026-03-01T00:00:00.000Z'),
      updatedAt: new Date('2026-03-02T00:00:00.000Z'),
    };

    render(
      <ProductCard product={product} />,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Masterclass' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('status-chip')).toHaveTextContent('PUBLISHED');
  });

  it('renders the summary title when given a minimised product', () => {
    const product: ProductMinimised = {
      id: 'product-2',
      title: 'Summary title',
      type: 'DOWNLOAD',
      price: 'free',
      createdAt: new Date('2026-03-01T00:00:00.000Z'),
    };

    render(
      <ProductCard product={product} />,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Summary title' }),
    ).toBeInTheDocument();
  });

  it('falls back to DRAFT when a summary product has no status', () => {
    const product: ProductMinimised = {
      id: 'product-3',
      title: 'Draft summary',
      type: 'CONSULTATION',
      price: 50,
      createdAt: new Date('2026-03-01T00:00:00.000Z'),
    };

    render(
      <ProductCard product={product} />,
    );

    expect(screen.getByTestId('status-chip')).toHaveTextContent('DRAFT');
  });
});
