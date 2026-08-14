import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { getMyEntitlementsAPI } from 'core/api/services';
import LibraryProducts from './library-products.component';

jest.mock('core/api/services', () => ({
  getMyEntitlementsAPI: jest.fn(),
}));

const mockedGetMyEntitlementsAPI =
  getMyEntitlementsAPI as jest.MockedFunction<typeof getMyEntitlementsAPI>;

describe('LibraryProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads and renders entitled products', async () => {
    mockedGetMyEntitlementsAPI.mockResolvedValueOnce([
      {
        id: 'entitlement-1',
        source: 'FREE_ENROLLMENT',
        createdAt: '2026-07-24T10:00:00Z',
        product: {
          id: 'product-1',
          title: 'Accessible course',
          type: 'COURSE',
          description: 'Course description',
        },
      },
    ]);

    render(
      <MemoryRouter>
        <LibraryProducts type="COURSE" />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Accessible course')).toBeTruthy();
    expect(mockedGetMyEntitlementsAPI).toHaveBeenCalledWith({
      type: 'COURSE',
    });
    expect(screen.getByRole('button', { name: 'Open' })).toBeTruthy();
  });

  it('shows the empty state', async () => {
    mockedGetMyEntitlementsAPI.mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <LibraryProducts />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(
        screen.getByText(
          'You do not have any products in this section yet.',
        ),
      ).toBeTruthy(),
    );
  });

  it('shows an API error', async () => {
    mockedGetMyEntitlementsAPI.mockRejectedValueOnce(new Error('failed'));

    render(
      <MemoryRouter>
        <LibraryProducts />
      </MemoryRouter>,
    );

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Your library could not be loaded.',
    );
  });
});
