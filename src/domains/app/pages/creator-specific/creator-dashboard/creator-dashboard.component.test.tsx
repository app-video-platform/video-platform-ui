import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('react-redux', () => ({
  __esModule: true,
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
import { useDispatch, useSelector } from 'react-redux';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  __esModule: true,
  useNavigate: () => mockNavigate,
}));

jest.mock('@store/auth-store', () => ({
  __esModule: true,
  selectAuthUser: jest.fn(),
}));
import { selectAuthUser } from 'core/store/auth-store';

jest.mock('@store/product-store', () => ({
  __esModule: true,
  getAllProductsByUserId: jest.fn(),
  getProductSummariesByOwner: jest.fn(),
  selectTopThreeProducts: jest.fn(),
}));
import {
  getAllProductsByUserId,
  getProductSummariesByOwner,
  selectTopThreeProducts,
} from 'core/store/product-store';

jest.mock('domains/app/components', () => ({
  __esModule: true,
  GalProductCard: ({
    product,
  }: {
    product: { title?: string; id?: string };
  }) => <div data-testid="product-card">{product.title ?? product.id}</div>,
}));

jest.mock('@shared/ui', () => ({
  __esModule: true,
  Button: ({
    children,
    onClick,
    type,
    variant,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    variant?: string;
  }) => (
    <button type={type ?? 'button'} data-variant={variant} onClick={onClick}>
      {children}
    </button>
  ),
  GalIcon: () => <span data-testid="gal-icon" />,
}));

import CreatorDashboard from './creator-dashboard.component';

describe('<CreatorDashboard />', () => {
  const mockedUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
  const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
  const mockedGetAllProductsByUserId =
    getAllProductsByUserId as jest.MockedFunction<typeof getAllProductsByUserId>;
  const mockedGetProductSummariesByOwner =
    getProductSummariesByOwner as jest.MockedFunction<
      typeof getProductSummariesByOwner
    >;

  let fakeDispatch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    fakeDispatch = jest.fn();
    mockedUseDispatch.mockReturnValue(fakeDispatch as any);

    mockedUseSelector.mockImplementation((selector: any) => {
      if (selector === selectAuthUser) {
        return {
          id: 'creator-1',
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
        };
      }
      if (selector === selectTopThreeProducts) {
        return [
          { id: 'p1', title: 'Product 1', price: 10 },
          { id: 'p2', title: 'Product 2', price: 20 },
        ];
      }
      return undefined;
    });

    mockedGetProductSummariesByOwner.mockImplementation(
      ((ownerId: string) =>
        ({
          type: 'summaries',
          payload: ownerId,
        }) as any) as typeof getProductSummariesByOwner,
    );
    mockedGetAllProductsByUserId.mockImplementation(
      ((userId: string) =>
        ({
          type: 'products',
          payload: userId,
        }) as any) as typeof getAllProductsByUserId,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('loads both summary cards and full products for the signed-in creator', () => {
    render(<CreatorDashboard />);

    expect(mockedGetProductSummariesByOwner).toHaveBeenCalledWith('creator-1');
    expect(mockedGetAllProductsByUserId).toHaveBeenCalledWith('creator-1');
    expect(fakeDispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ type: 'summaries', payload: 'creator-1' }),
    );
    expect(fakeDispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ type: 'products', payload: 'creator-1' }),
    );
    expect(screen.getAllByTestId('product-card')).toHaveLength(2);
  });

  it('navigates to preview and create-product routes from the dashboard actions', () => {
    mockedUseSelector.mockImplementation((selector: any) => {
      if (selector === selectAuthUser) {
        return {
          id: 'creator-1',
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
        };
      }
      if (selector === selectTopThreeProducts) {
        return [];
      }
      return undefined;
    });

    render(<CreatorDashboard />);

    fireEvent.click(screen.getByRole('button', { name: 'Preview' }));
    expect(mockNavigate).toHaveBeenCalledWith('my-page-preview');

    fireEvent.click(screen.getByRole('button', { name: 'Create Product' }));
    expect(mockNavigate).toHaveBeenCalledWith('products/create');
  });
});
