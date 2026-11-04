import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

import { ProductMinimised } from 'core/api/models';
import { getAllProductsMinimalAPI } from 'core/api/services';

import ExplorePage from './explore-page.component';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('core/api/services', () => ({
  getAllProductsMinimalAPI: jest.fn(),
}));

jest.mock('../../../../assets/image-placeholder.png', () => 'placeholder.png');

describe('ExplorePage', () => {
  const navigate = jest.fn();
  const dispatch = jest.fn();
  const product: ProductMinimised = {
    id: 'product-1',
    title: 'Navigation Course',
    type: 'COURSE',
    price: 'free',
    createdById: 'creator-1',
    createdByName: 'Ada',
    createdByTitle: 'Instructor',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(navigate);
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        shopCart: { products: [], total: 0 },
        wishlist: { products: [] },
      }),
    );
    (getAllProductsMinimalAPI as jest.Mock).mockResolvedValue([product]);
  });

  it('navigates Explore product cards to the app product detail route', async () => {
    render(<MemoryRouter><ExplorePage /></MemoryRouter>);

    const viewProductButton = await screen.findByRole('button', {
      name: /view product/i,
    });
    fireEvent.click(viewProductButton);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/app/product/product-1/COURSE');
    });
  });

  it('links the Creator name to the canonical public Storefront route', async () => {
    render(<MemoryRouter><ExplorePage /></MemoryRouter>);

    expect(
      await screen.findByRole('link', { name: /Ada, Instructor/i }),
    ).toHaveAttribute('href', '/app/store/creator-1');
  });

  it('does not create a broken Creator link when identity is unavailable', async () => {
    (getAllProductsMinimalAPI as jest.Mock).mockResolvedValueOnce([
      { ...product, createdById: undefined },
    ]);
    render(<MemoryRouter><ExplorePage /></MemoryRouter>);

    expect(await screen.findByText('Ada, Instructor')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Ada/i })).not.toBeInTheDocument();
  });
});
