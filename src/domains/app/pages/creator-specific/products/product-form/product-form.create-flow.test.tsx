/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import httpClient from 'core/api/http-client';
import { AbstractProduct, ProductType, UserRole } from 'core/api/models';
import authReducer from 'core/store/auth-store/auth.slice';
import membershipReducer from 'core/store/membership-store/membership.slice';
import productReducer from 'core/store/product-store/product.slice';

import ProductForm from './product-form.component';

jest.mock('../../../../../../assets/image-placeholder.png', () => 'placeholder.png');

const productLabels: Record<ProductType, string> = {
  COURSE: 'Course',
  DOWNLOAD: 'Download',
  CONSULTATION: 'Consultation',
  MEMBERSHIP: 'Membership',
};

const expectedPrimaryTab: Record<ProductType, string> = {
  COURSE: 'Curriculum',
  DOWNLOAD: 'Files',
  CONSULTATION: 'Availability',
  MEMBERSHIP: 'Content',
};

const makeCreatedProduct = (
  type: ProductType,
  overrides: Partial<AbstractProduct> = {},
): AbstractProduct => ({
  id: `${type.toLowerCase()}-created`,
  type,
  name: `${productLabels[type]} Draft`,
  description: '',
  status: 'DRAFT',
  price: 'free',
  userId: 'creator-1',
  ...(type === 'COURSE' || type === 'DOWNLOAD' ? { sections: [] } : {}),
  ...overrides,
} as AbstractProduct);

const LocationProbe = () => {
  const location = useLocation();

  return <span data-testid="location">{location.pathname}</span>;
};

const renderCreateFlow = () => {
  const testStore = configureStore({
    reducer: {
      auth: authReducer,
      membership: membershipReducer,
      products: productReducer,
    },
    preloadedState: {
      auth: {
        user: {
          id: 'creator-1',
          firstName: 'Maya',
          lastName: 'Chen',
          email: 'maya@example.test',
          roles: [UserRole.CREATOR],
          onboardingCompleted: true,
        },
        loading: false,
        error: null,
        isUserLoggedIn: true,
      },
    },
  });

  return render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={['/app/products/create']}>
        <Routes>
          <Route
            path="/app/products/create"
            element={
              <>
                <LocationProbe />
                <ProductForm />
              </>
            }
          />
          <Route
            path="/app/products/edit/:id"
            element={
              <>
                <LocationProbe />
                <ProductForm />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

describe('<ProductForm /> create flow integration', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(httpClient, { delayResponse: 0 });
  });

  afterEach(() => {
    mock.restore();
  });

  it.each<ProductType>([
    'COURSE',
    'DOWNLOAD',
    'CONSULTATION',
    'MEMBERSHIP',
  ])(
    'creates a %s Draft through the real selector/title input and loads the workspace',
    async (type) => {
      const user = userEvent.setup();
      const title = `${productLabels[type]} Draft`;
      const createdProduct = makeCreatedProduct(type, { name: title });

      mock.onPost('api/products').reply((request) => [
        200,
        {
          ...createdProduct,
          ...JSON.parse(request.data ?? '{}'),
          id: createdProduct.id,
          userId: 'creator-1',
          status: 'DRAFT',
        },
      ]);
      mock.onGet(`api/products/${createdProduct.id}`).reply(200, createdProduct);
      if (type === 'MEMBERSHIP') {
        mock.onGet('api/products?ownerId=creator-1').reply(200, []);
        mock.onGet(`api/products/${createdProduct.id}/membership`).reply(200, {
          productId: createdProduct.id,
          config: { orderingMode: 'NEWEST_FIRST' },
          content: [],
          feed: [],
        });
      }

      renderCreateFlow();

      const typeSelector = screen.getByRole('radiogroup', {
        name: 'Product type',
      });
      const selectedType = within(typeSelector).getByRole('radio', {
        name: new RegExp(productLabels[type], 'i'),
      });
      const titleInput = screen.getByRole('textbox', {
        name: 'Product title',
      });

      await user.click(selectedType);
      expect(selectedType).toHaveAttribute('aria-checked', 'true');

      await user.type(titleInput, title);
      expect(titleInput).toHaveValue(title);
      expect(selectedType).toHaveAttribute('aria-checked', 'true');

      await user.keyboard('{Enter}');

      await waitFor(() => expect(mock.history.post).toHaveLength(1));
      const createPayload = JSON.parse(mock.history.post[0].data);

      expect(createPayload).toMatchObject({
        name: title,
        type,
        userId: 'creator-1',
        status: 'DRAFT',
      });

      await waitFor(() =>
        expect(screen.getByTestId('location')).toHaveTextContent(
          `/app/products/edit/${createdProduct.id}`,
        ),
      );
      expect(await screen.findByRole('heading', { name: title }))
        .toBeInTheDocument();
      expect(screen.getAllByText(productLabels[type]).length).toBeGreaterThan(0);
      expect(
        screen.getByRole('tab', { name: expectedPrimaryTab[type] }),
      ).toBeInTheDocument();
      expect(mock.history.post).toHaveLength(1);
    },
  );

  it('preserves selected type and title, shows an inline error, and does not navigate when create fails', async () => {
    const user = userEvent.setup();

    const retryProduct = makeCreatedProduct('MEMBERSHIP', {
      id: 'membership-retry',
      name: 'Retryable Membership',
    });

    mock.onPost('api/products')
      .replyOnce(500, { message: 'Create failed' })
      .onPost('api/products')
      .reply(200, retryProduct);
    mock.onGet(`api/products/${retryProduct.id}`).reply(200, retryProduct);
    mock.onGet('api/products?ownerId=creator-1').reply(200, []);
    mock.onGet(`api/products/${retryProduct.id}/membership`).reply(200, {
      productId: retryProduct.id,
      config: { orderingMode: 'NEWEST_FIRST' },
      content: [],
      feed: [],
    });

    renderCreateFlow();

    const typeSelector = screen.getByRole('radiogroup', {
      name: 'Product type',
    });
    const membershipType = within(typeSelector).getByRole('radio', {
      name: /membership/i,
    });
    const titleInput = screen.getByRole('textbox', {
      name: 'Product title',
    });

    await user.click(membershipType);
    await user.type(titleInput, 'Retryable Membership');
    await user.keyboard('{Enter}');

    await waitFor(() => expect(mock.history.post).toHaveLength(1));

    expect(screen.getByTestId('location')).toHaveTextContent(
      '/app/products/create',
    );
    expect(titleInput).toHaveValue('Retryable Membership');
    expect(membershipType).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Create failed');

    await user.click(
      screen.getByRole('button', {
        name: 'Continue to Product workspace',
      }),
    );

    await waitFor(() => expect(mock.history.post).toHaveLength(2));
    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/app/products/edit/membership-retry',
      ),
    );
  });
});
