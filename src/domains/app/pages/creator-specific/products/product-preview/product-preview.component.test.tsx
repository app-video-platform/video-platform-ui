/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import httpClient from 'core/api/http-client';
import { AbstractProduct, ProductStatus, UserRole } from 'core/api/models';
import authReducer from 'core/store/auth-store/auth.slice';
import productLandingPageReducer from 'core/store/product-landing-page-store/product-landing-page.slice';
import productReducer from 'core/store/product-store/product.slice';
import storefrontReducer from 'core/store/storefront-store/storefront.slice';

import ProductPreview from './product-preview.component';

jest.mock('../../../../../../assets/image-placeholder.png', () => 'placeholder.png');

const makeProduct = (status: ProductStatus): AbstractProduct => ({
  id: `${status.toLowerCase()}-product`,
  type: 'COURSE',
  name: `${status} Growth Course`,
  description: 'A real Product landing-page preview.',
  status,
  price: 149,
  currency: 'EUR',
  userId: 'creator-1',
  imageUrl: 'https://cdn.example.com/course.jpg',
  sections: [
    {
      id: 'section-1',
      title: 'Preview foundations',
      description: 'Reusable public presentation content.',
      position: 1,
      lessons: [
        {
          id: 'lesson-1',
          sectionId: 'section-1',
          title: 'Shape the offer',
          description: '',
          type: 'VIDEO',
        },
      ],
    },
  ],
});

const LocationProbe = () => {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
};

const renderPreview = (productId = 'draft-product') => {
  const testStore = configureStore({
    reducer: {
      auth: authReducer,
      productLandingPage: productLandingPageReducer,
      products: productReducer,
      storefront: storefrontReducer,
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
          title: 'Creator strategist',
          bio: 'Helps creators package useful products.',
        },
        loading: false,
        error: null,
        isUserLoggedIn: true,
      },
    },
  });

  return render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[`/app/products/${productId}/preview`]}>
        <Routes>
          <Route
            path="/app/products/:productId/preview"
            element={
              <>
                <LocationProbe />
                <ProductPreview />
              </>
            }
          />
          <Route
            path="/app/products/edit/:id"
            element={
              <>
                <LocationProbe />
                <span>Workspace route</span>
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

describe('<ProductPreview />', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(httpClient, { delayResponse: 0 });
    mock.onGet('api/creator/storefront').reply(200, {
      id: 'creator-storefront-config',
      featuredProductId: null,
      productOrderIds: [],
      theme: {
        appearance: 'LIGHT',
        accentColor: '#0ea5e9',
        typography: 'FRIENDLY',
      },
    });
    mock.onGet(/api\/creator\/products\/[^/]+\/landing-page$/).reply((request) => {
      const parts = request.url?.split('/') ?? [];
      const productId = parts[parts.length - 2] ?? '';

      return [
        200,
        {
          id: `config-${productId}`,
          productId,
          marketingDescription: `Private marketing copy for ${productId}.`,
          heroLayout: 'MEDIA_LEFT',
          visibleSections: ['ABOUT', 'CONTENTS', 'CREATOR'],
          sectionOrder: ['ABOUT', 'CONTENTS', 'CREATOR'],
        },
      ];
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it.each<ProductStatus>(['DRAFT', 'HIDDEN', 'PUBLISHED'])(
    'renders a creator-only %s Product through the shared landing page',
    async (status) => {
      const product = makeProduct(status);
      mock.onGet(`api/products/${product.id}`).reply(200, product);

      const { container } = renderPreview(product.id);

      expect(
        await screen.findByRole('heading', { name: product.name }),
      ).toBeInTheDocument();
      expect(screen.getByText(`${status[0]}${status.slice(1).toLowerCase()}`))
        .toBeInTheDocument();
      expect(screen.getByText(`${status[0]}${status.slice(1).toLowerCase()} Product preview`))
        .toBeInTheDocument();
      expect(screen.getByText(`Private marketing copy for ${product.id}.`))
        .toBeInTheDocument();
      expect(screen.getByText('Preview foundations')).toBeInTheDocument();
      expect(screen.getByText('Maya Chen')).toBeInTheDocument();
      expect(container.querySelector('.product-landing')).toBeInTheDocument();
      expect(container.querySelector('.product-landing__hero'))
        .toHaveClass('product-landing__hero--media-left');
    },
  );

  it('uses creator preview data without weakening the public Product endpoints', async () => {
    const product = makeProduct('DRAFT');
    mock.onGet(`api/products/${product.id}`).reply(200, product);

    renderPreview(product.id);

    await screen.findByRole('heading', { name: product.name });

    expect(
      mock.history.get.some((request) =>
        request.url === `api/creator/products/${product.id}/landing-page`,
      ),
    ).toBe(true);
    expect(
      mock.history.get.some((request) =>
        request.url === `api/products/${product.id}/landing-page`,
      ),
    ).toBe(false);
    expect(
      mock.history.get.some((request) =>
        request.url === 'api/storefronts/creator-1',
      ),
    ).toBe(false);
  });

  it('returns to the Product workspace from the preview wrapper', async () => {
    const product = makeProduct('HIDDEN');
    mock.onGet(`api/products/${product.id}`).reply(200, product);

    renderPreview(product.id);

    await screen.findByRole('heading', { name: product.name });
    fireEvent.click(screen.getByRole('button', { name: 'Back to workspace' }));

    expect(screen.getByText('Workspace route')).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent(
      `/app/products/edit/${product.id}`,
    );
  });

  it('shows loading, then an honest preview error when the Product cannot load', async () => {
    mock.onGet('api/products/missing-product').reply(404, {
      message: 'Product was not found.',
    });

    renderPreview('missing-product');

    expect(screen.getByRole('heading', { name: 'Loading Product preview' }))
      .toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Product preview unavailable' }))
      .toBeInTheDocument();
    expect(screen.getByText('Product was not found.')).toBeInTheDocument();
  });

  it('does not render stale presentation when creator landing-page config fails', async () => {
    const product = makeProduct('PUBLISHED');
    mock.resetHandlers();
    mock.onGet('api/creator/storefront').reply(200, {
      id: 'creator-storefront-config',
      featuredProductId: null,
      productOrderIds: [],
      theme: {
        appearance: 'LIGHT',
        accentColor: '#0ea5e9',
        typography: 'FRIENDLY',
      },
    });
    mock.onGet(`api/products/${product.id}`).reply(200, product);
    mock.onGet(`api/creator/products/${product.id}/landing-page`).reply(500, {
      message: 'Landing-page preview config unavailable.',
    });

    renderPreview(product.id);

    expect(await screen.findByRole('heading', { name: 'Product preview unavailable' }))
      .toBeInTheDocument();
    expect(screen.getByText('Landing-page preview config unavailable.'))
      .toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: product.name })).toBeNull();
  });
});
