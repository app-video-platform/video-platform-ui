/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { toast } from 'sonner';

import { ProductMinimised, UserRole } from 'core/api/models';
import authReducer from 'core/store/auth-store/auth.slice';
import shopCartReducer, {
  ShopCartState,
} from 'core/store/shop-cart/shop-cart.slice';
import wishlistReducer from 'core/store/wishlist/wishlist.slice';
import {
  createCommerceCheckoutSessionAPI,
  enrollInFreeProductAPI,
  getCommerceOrderAPI,
} from 'core/api/services';
import Cart from './cart.component';

jest.mock('../../../../../assets/image-placeholder.png', () => 'placeholder.png');

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('core/api/services', () => ({
  createCommerceCheckoutSessionAPI: jest.fn(),
  enrollInFreeProductAPI: jest.fn(),
  getCommerceOrderAPI: jest.fn(),
}));

const paidProduct = (
  overrides: Partial<ProductMinimised> = {},
): ProductMinimised => ({
  id: 'product-1',
  title: 'Paid product',
  price: 25,
  status: 'PUBLISHED',
  createdById: 'creator-1',
  createdByName: 'Creator One',
  ...overrides,
});

const renderCart = (products: ProductMinimised[]) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      shopCart: shopCartReducer,
      wishlist: wishlistReducer,
    },
    preloadedState: {
      auth: {
        user: {
          id: 'buyer-1',
          firstName: 'Buyer',
          lastName: 'One',
          email: 'buyer@example.test',
          roles: [UserRole.USER],
        },
        loading: false,
        error: null,
        isUserLoggedIn: true,
      },
      shopCart: {
        products,
        loading: false,
        total: products.reduce(
          (sum, product) =>
            sum + (product.price === 'free' ? 0 : Number(product.price ?? 0)),
          0,
        ),
      } satisfies ShopCartState,
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/app/cart']}>
        <Routes>
          <Route path="/app/cart" element={<Cart />} />
          <Route
            path="/app/library/all-products"
            element={<div>Library products route</div>}
          />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );

  return store;
};

const mockCryptoRandomUUID = () => {
  Object.defineProperty(global, 'crypto', {
    value: { randomUUID: jest.fn(() => 'checkout-key') },
    configurable: true,
  });
};

describe('<Cart /> Commerce checkout', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    jest.clearAllMocks();
    mockCryptoRandomUUID();
  });

  it('keeps free enrollment out of paid Commerce checkout', async () => {
    (enrollInFreeProductAPI as jest.Mock).mockResolvedValue({});
    const store = renderCart([paidProduct({ id: 'free-1', price: 'free' })]);

    fireEvent.click(screen.getByRole('button', { name: 'Proceed to checkout' }));

    await waitFor(() => {
      expect(enrollInFreeProductAPI).toHaveBeenCalled();
    });
    expect((enrollInFreeProductAPI as jest.Mock).mock.calls[0][0]).toBe(
      'free-1',
    );
    expect(createCommerceCheckoutSessionAPI).not.toHaveBeenCalled();
    expect(store.getState().shopCart.products).toEqual([]);
  });

  it('rejects mixed free and paid carts in the UI', () => {
    renderCart([
      paidProduct(),
      paidProduct({ id: 'free-1', price: 'free' }),
    ]);

    fireEvent.click(screen.getByRole('button', { name: 'Proceed to checkout' }));

    expect(toast.error).toHaveBeenCalledWith(
      'Free and paid products cannot be checked out together. Please split your cart.',
    );
    expect(createCommerceCheckoutSessionAPI).not.toHaveBeenCalled();
  });

  it('clears the cart only after a paid order is confirmed', async () => {
    (createCommerceCheckoutSessionAPI as jest.Mock).mockResolvedValue({
      orderId: 'order-1',
      status: 'PENDING',
      provider: 'fake',
    });
    (getCommerceOrderAPI as jest.Mock).mockResolvedValue({
      orderId: 'order-1',
      status: 'PAID',
      currency: 'EUR',
      totalMinor: 2500,
    });
    const store = renderCart([paidProduct()]);

    fireEvent.click(screen.getByRole('button', { name: 'Proceed to checkout' }));

    await waitFor(() => {
      expect(store.getState().shopCart.products).toEqual([]);
    });
    expect(createCommerceCheckoutSessionAPI).toHaveBeenCalledWith(
      ['product-1'],
      'checkout-key',
    );
    expect(screen.getByText('Library products route')).toBeInTheDocument();
  });

  it('retains the cart while a paid order is pending', async () => {
    (createCommerceCheckoutSessionAPI as jest.Mock).mockResolvedValue({
      orderId: 'order-1',
      status: 'PENDING',
      provider: 'fake',
    });
    (getCommerceOrderAPI as jest.Mock).mockResolvedValue({
      orderId: 'order-1',
      status: 'PENDING',
    });
    const store = renderCart([paidProduct()]);

    fireEvent.click(screen.getByRole('button', { name: 'Proceed to checkout' }));

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith(
        'Payment is still pending. Your cart has been saved.',
      );
    });
    expect(store.getState().shopCart.products).toHaveLength(1);
  });

  it('retains the cart for terminal unsuccessful paid statuses', async () => {
    (createCommerceCheckoutSessionAPI as jest.Mock).mockResolvedValue({
      orderId: 'order-1',
      status: 'PENDING',
      provider: 'fake',
    });
    (getCommerceOrderAPI as jest.Mock).mockResolvedValue({
      orderId: 'order-1',
      status: 'FAILED',
    });
    const store = renderCart([paidProduct()]);

    fireEvent.click(screen.getByRole('button', { name: 'Proceed to checkout' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Payment was not completed. Your cart has been saved.',
      );
    });
    expect(store.getState().shopCart.products).toHaveLength(1);
  });
});
