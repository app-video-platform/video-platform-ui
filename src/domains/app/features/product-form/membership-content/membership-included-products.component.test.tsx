import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('react-redux', () => ({
  __esModule: true,
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('core/store/product-store', () => ({
  __esModule: true,
  getProductSummariesByOwner: jest.fn(),
  selectProductSummaries: jest.fn((state) => state.products.productSummaries),
  selectProductsLoading: jest.fn((state) => state.products.loading),
  selectProductsError: jest.fn((state) => state.products.error),
}));

import { useDispatch, useSelector } from 'react-redux';
import { ProductMinimised } from 'core/api/models';
import { getProductSummariesByOwner } from 'core/store/product-store';
import MembershipIncludedProducts from './membership-included-products.component';

const productSummaries: ProductMinimised[] = [
  {
    id: 'course-1',
    title: 'Course One',
    description: 'A full course',
    type: 'COURSE',
    status: 'DRAFT',
  },
  {
    id: 'download-1',
    title: 'Download Kit',
    type: 'DOWNLOAD',
    status: 'PUBLISHED',
  },
  {
    id: 'membership-2',
    title: 'Other Membership',
    type: 'MEMBERSHIP',
    status: 'DRAFT',
  },
];

const mockedUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
const mockedGetProductSummariesByOwner =
  getProductSummariesByOwner as jest.MockedFunction<
    typeof getProductSummariesByOwner
  >;

const renderIncludedProducts = ({
  ownerId = 'creator-1',
  currentProductId = 'membership-1',
  products = productSummaries,
  loading = false,
  error = null,
}: {
  ownerId?: string;
  currentProductId?: string;
  products?: ProductMinimised[] | null;
  loading?: boolean;
  error?: string | null;
} = {}) => {
  const dispatch = jest.fn();

  mockedUseDispatch.mockReturnValue(dispatch as any);
  mockedUseSelector.mockImplementation((selector) =>
    selector({
      products: {
        productSummaries: products,
        loading,
        error,
      },
    } as any),
  );
  mockedGetProductSummariesByOwner.mockImplementation(
    ((id: string) =>
      ({
        type: 'products/getProductSummariesByOwner',
        payload: id,
      }) as any) as typeof getProductSummariesByOwner,
  );

  render(
    <MembershipIncludedProducts
      ownerId={ownerId}
      currentProductId={currentProductId}
    />,
  );

  return { dispatch };
};

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('<MembershipIncludedProducts />', () => {
  it('loads creator-owned product summaries when they are not cached', () => {
    const { dispatch } = renderIncludedProducts({ products: null });

    expect(mockedGetProductSummariesByOwner).toHaveBeenCalledWith('creator-1');
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'products/getProductSummariesByOwner',
        payload: 'creator-1',
      }),
    );
  });

  it('renders the local empty state before products are selected', () => {
    renderIncludedProducts();

    expect(screen.getByText('Included Products')).toBeInTheDocument();
    expect(screen.getByText('No products included yet.')).toBeInTheDocument();
  });

  it('opens the inline picker and adds selected products locally', async () => {
    renderIncludedProducts();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Product' }));
    fireEvent.click(screen.getByLabelText('Select Course One'));
    fireEvent.click(screen.getByRole('button', { name: 'Add selected' }));

    await waitFor(() => {
      expect(screen.getByText('Course One')).toBeInTheDocument();
    });
    expect(
      screen.queryByPlaceholderText('Search products...'),
    ).not.toBeInTheDocument();
  });

  it('prevents adding the same product twice', () => {
    renderIncludedProducts();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Product' }));
    fireEvent.click(screen.getByLabelText('Select Course One'));
    fireEvent.click(screen.getByRole('button', { name: 'Add selected' }));

    fireEvent.click(screen.getByRole('button', { name: '+ Add Product' }));

    expect(screen.queryByLabelText('Select Course One')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Select Download Kit')).toBeInTheDocument();
  });

  it('allows an included product to be removed and selected again', () => {
    renderIncludedProducts();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Product' }));
    fireEvent.click(screen.getByLabelText('Select Course One'));
    fireEvent.click(screen.getByRole('button', { name: 'Add selected' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    fireEvent.click(screen.getByRole('button', { name: '+ Add Product' }));

    expect(screen.getByLabelText('Select Course One')).toBeInTheDocument();
  });

  it('keeps memberships out of the picker candidates', () => {
    renderIncludedProducts();

    fireEvent.click(screen.getByRole('button', { name: '+ Add Product' }));

    expect(screen.queryByText('Other Membership')).not.toBeInTheDocument();
  });
});
