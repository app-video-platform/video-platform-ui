import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import { ProductMinimised, UserRole } from 'core/api/models';

jest.mock('react-redux', () => ({
  __esModule: true,
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
import { useDispatch, useSelector } from 'react-redux';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { selectAuthUser } from 'core/store/auth-store';
import {
  getProductSummariesByOwner,
  selectProductSummaries,
  selectProductsError,
  selectProductsLoading,
} from 'core/store/product-store';
import ProductsList from './products-list.component';

jest.mock('core/store/product-store', () => {
  const actual = jest.requireActual('core/store/product-store');
  return {
    __esModule: true,
    ...actual,
    getProductSummariesByOwner: jest.fn(),
  };
});

const productsFixture: ProductMinimised[] = [
  {
    id: 'course-1',
    title: 'Creator Product Growth System',
    type: 'COURSE',
    status: 'PUBLISHED',
    price: 149,
    createdAt: new Date('2026-07-01T09:00:00.000Z'),
    updatedAt: new Date('2026-08-08T09:00:00.000Z'),
  },
  {
    id: 'membership-1',
    title: 'Creator Systems Lab membership',
    type: 'MEMBERSHIP',
    status: 'DRAFT',
    price: 39,
    createdAt: new Date('2026-07-27T09:00:00.000Z'),
    updatedAt: new Date('2026-08-10T09:00:00.000Z'),
  },
  {
    id: 'download-1',
    title: 'Launch Toolkit',
    type: 'DOWNLOAD',
    status: 'DRAFT',
    price: 'free',
    createdAt: new Date('2026-07-15T09:00:00.000Z'),
    updatedAt: new Date('2026-08-09T09:00:00.000Z'),
  },
  {
    id: 'consultation-1',
    title: 'Offer audit consultation',
    type: 'CONSULTATION',
    status: 'PUBLISHED',
    price: 325,
    createdAt: new Date('2026-07-20T09:00:00.000Z'),
    updatedAt: new Date('2026-08-06T09:00:00.000Z'),
  },
];

describe('<ProductsList />', () => {
  const mockedUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
  const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
  const mockedGetProductSummariesByOwner =
    getProductSummariesByOwner as jest.MockedFunction<
      typeof getProductSummariesByOwner
    >;

  let fakeDispatch: jest.Mock;
  let productSummaries: ProductMinimised[] | null;
  let loading: boolean;
  let error: string | null;
  const originalUseMocks = process.env.REACT_APP_USE_MOCKS;

  const renderProductsList = () =>
    render(
      <MemoryRouter initialEntries={['/app/products']}>
        <ProductsList />
      </MemoryRouter>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_USE_MOCKS = 'true';
    productSummaries = productsFixture;
    loading = false;
    error = null;
    fakeDispatch = jest.fn();

    mockedUseDispatch.mockReturnValue(
      fakeDispatch as unknown as ReturnType<typeof useDispatch>,
    );
    mockedGetProductSummariesByOwner.mockImplementation(
      ((ownerId: string) =>
        ({
          type: 'products/getProductSummariesByOwner',
          payload: ownerId,
        }) as unknown as ReturnType<
          typeof getProductSummariesByOwner
        >) as typeof getProductSummariesByOwner,
    );
    mockedUseSelector.mockImplementation((selector: unknown) => {
      const selected = selector;

      if (selected === selectAuthUser) {
        return {
          id: 'creator-1',
          firstName: 'Maya',
          roles: [UserRole.CREATOR],
        };
      }
      if (selected === selectProductSummaries) {
        return productSummaries;
      }
      if (selected === selectProductsLoading) {
        return loading;
      }
      if (selected === selectProductsError) {
        return error;
      }
      return undefined;
    });
  });

  afterEach(() => {
    process.env.REACT_APP_USE_MOCKS = originalUseMocks;
  });

  it('renders the Products title and loads summaries for the signed-in creator', () => {
    renderProductsList();

    expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'My Products' })).toBeNull();
    expect(mockedGetProductSummariesByOwner).toHaveBeenCalledWith('creator-1');
    expect(fakeDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'products/getProductSummariesByOwner',
        payload: 'creator-1',
      }),
    );
  });

  it('keeps Add product navigation on the existing create route', () => {
    renderProductsList();

    fireEvent.click(screen.getByRole('button', { name: '+ Add product' }));

    expect(mockNavigate).toHaveBeenCalledWith('create');
  });

  it('links product identity to the Product Overview route', () => {
    renderProductsList();

    expect(
      screen.getByRole('link', {
        name: 'Open Creator Product Growth System product overview',
      }),
    ).toHaveAttribute('href', '/app/products/course-1');
  });

  it('does not expose permanent Edit or fake Publish buttons', () => {
    renderProductsList();

    expect(screen.queryByRole('button', { name: /^Edit$/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /^Publish$/i })).toBeNull();
    expect(
      screen.queryByRole('button', {
        name: 'Open actions for Creator Systems Lab membership',
      }),
    ).toBeNull();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Open actions for Creator Product Growth System',
      }),
    );

    expect(screen.queryByRole('menuitem', { name: /^Publish$/i })).toBeNull();
    expect(screen.queryByRole('menuitem', { name: 'Open workspace' })).toBeNull();
    expect(screen.getByRole('menuitem', { name: /Preview/i })).toHaveAttribute(
      'href',
      '/app/product/course-1',
    );
  });

  it('searches product names and updates the result count', () => {
    renderProductsList();

    fireEvent.change(screen.getByLabelText('Search products'), {
      target: { value: 'membership' },
    });

    expect(screen.getByText('1 product')).toBeInTheDocument();
    expect(screen.getByText('Creator Systems Lab membership')).toBeInTheDocument();
    expect(screen.queryByText('Launch Toolkit')).toBeNull();
  });

  it('filters by product type and status', () => {
    renderProductsList();

    fireEvent.change(screen.getByLabelText('Filter by product type'), {
      target: { value: 'DOWNLOAD' },
    });
    expect(screen.getByText('1 product')).toBeInTheDocument();
    expect(screen.getByText('Launch Toolkit')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Filter by product status'), {
      target: { value: 'PUBLISHED' },
    });

    expect(screen.getByText('No products match these filters.')).toBeInTheDocument();
  });

  it('sorts by name where current summary data supports it', () => {
    renderProductsList();

    fireEvent.change(screen.getByLabelText('Sort products'), {
      target: { value: 'name-asc' },
    });

    const rows = screen.getAllByRole('article');
    expect(within(rows[0]).getByText('Creator Product Growth System')).toBeInTheDocument();
    expect(within(rows[1]).getByText('Creator Systems Lab membership')).toBeInTheDocument();
  });

  it('renders distinct empty states for no products, search misses, and filter misses', () => {
    productSummaries = [];
    const { rerender } = renderProductsList();
    expect(screen.getByText('Create your first product')).toBeInTheDocument();
    expect(screen.queryByLabelText('Search products')).toBeNull();
    expect(screen.queryByLabelText('Filter by product type')).toBeNull();
    expect(screen.queryByLabelText('Filter by product status')).toBeNull();
    expect(screen.queryByLabelText('Sort products')).toBeNull();
    expect(screen.queryByText('0 products')).toBeNull();

    productSummaries = productsFixture;
    rerender(
      <MemoryRouter initialEntries={['/app/products']}>
        <ProductsList />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Search products'), {
      target: { value: 'photography' },
    });
    expect(screen.getByText('No products match "photography".')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    fireEvent.change(screen.getByLabelText('Filter by product type'), {
      target: { value: 'DOWNLOAD' },
    });
    fireEvent.change(screen.getByLabelText('Filter by product status'), {
      target: { value: 'PUBLISHED' },
    });

    expect(screen.getByText('No products match these filters.')).toBeInTheDocument();
  });

  it('formats prices and fixture-only Membership recurrence clearly', () => {
    renderProductsList();

    expect(screen.getByText('€149')).toBeInTheDocument();
    expect(screen.getByText('€39 / month')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
  });
});
