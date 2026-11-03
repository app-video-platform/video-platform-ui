import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import shopCartReducer from 'core/store/shop-cart/shop-cart.slice';
import wishlistReducer from 'core/store/wishlist/wishlist.slice';
import WishlistDropdown from './wishlist-dropdown.component';

const product = {
  id: 'download-1',
  title: 'Download',
  type: 'DOWNLOAD' as const,
  price: 12.5,
  status: 'PUBLISHED' as const,
};

const Location = () => {
  const { pathname } = useLocation();
  return <p data-testid="location">{pathname}</p>;
};

const renderDropdown = (
  cartProducts: typeof product[] = [],
  wishlistProduct = product,
) => {
  window.localStorage.clear();
  const store = configureStore({
    reducer: { shopCart: shopCartReducer, wishlist: wishlistReducer },
    preloadedState: {
      shopCart: {
        products: cartProducts,
        loading: false,
        total: cartProducts.reduce((total, item) => total + item.price, 0),
      },
      wishlist: { products: [wishlistProduct] },
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/app/explore']}>
        <WishlistDropdown />
        <Routes>
          <Route path="*" element={<Location />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );

  return store;
};

describe('WishlistDropdown Add to cart', () => {
  it('adds the product, updates total, removes it from Wishlist, and supports Enter', async () => {
    const user = userEvent.setup();
    const store = renderDropdown();

    await user.click(screen.getByRole('button', { name: 'Open wishlist' }));
    const addButton = screen.getByRole('button', { name: 'Add to cart' });
    addButton.focus();
    await user.keyboard('{Enter}');

    expect(store.getState().shopCart.products).toEqual([product]);
    expect(store.getState().shopCart.total).toBe(12.5);
    expect(store.getState().wishlist.products).toEqual([]);
    expect(screen.getByTestId('location')).toHaveTextContent('/app/cart');
    expect(screen.getByText('You don\'t have anything in your wishlist')).toBeInTheDocument();
  });

  it('does not duplicate a cart item when Add to cart is activated again', async () => {
    const user = userEvent.setup();
    const store = renderDropdown([product]);

    await user.click(screen.getByRole('button', { name: 'Open wishlist' }));
    await user.click(screen.getByRole('button', { name: 'Add to cart' }));

    expect(store.getState().shopCart.products).toEqual([product]);
    expect(store.getState().shopCart.total).toBe(12.5);
    expect(store.getState().wishlist.products).toEqual([]);
  });

  it('does not navigate when an item has no valid Cart price', async () => {
    const user = userEvent.setup();
    const invalidProduct = { ...product, price: undefined } as never;
    const store = renderDropdown([], invalidProduct);

    await user.click(screen.getByRole('button', { name: 'Open wishlist' }));
    await user.click(screen.getByRole('button', { name: 'Add to cart' }));

    expect(store.getState().shopCart.products).toEqual([]);
    expect(store.getState().wishlist.products).toHaveLength(1);
    expect(screen.getByTestId('location')).toHaveTextContent('/app/explore');
  });
});
