/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import httpClient from 'core/api/http-client';
import { AbstractProduct, PublicStorefront } from 'core/api/models';
import authReducer from 'core/store/auth-store/auth.slice';
import productLandingPageReducer from 'core/store/product-landing-page-store/product-landing-page.slice';
import productReducer from 'core/store/product-store/product.slice';
import storefrontReducer from 'core/store/storefront-store/storefront.slice';

import ProductPage from './product-page.component';

jest.mock('../../../../assets/image-placeholder.png', () => 'placeholder.png');

const courseProduct: AbstractProduct = {
  id: 'course-1',
  type: 'COURSE',
  name: 'Creator Product Growth System',
  description: 'Package and launch a stronger creator offer.',
  status: 'PUBLISHED',
  price: 149,
  currency: 'EUR',
  userId: 'creator-1',
  imageUrl: 'https://cdn.example.com/course.jpg',
  sections: [
    {
      id: 'section-1',
      title: 'Positioning foundations',
      description: 'Clarify the buyer and promise.',
      position: 1,
      lessons: [
        {
          id: 'lesson-1',
          sectionId: 'section-1',
          title: 'Define the transformation',
          description: '',
          type: 'VIDEO',
        },
        {
          id: 'lesson-2',
          sectionId: 'section-1',
          title: 'Price the offer',
          description: '',
          type: 'ARTICLE',
        },
      ],
    },
  ],
};

const downloadProduct: AbstractProduct = {
  id: 'download-1',
  type: 'DOWNLOAD',
  name: 'Launch Assets Pack',
  description: 'Templates for a focused launch.',
  status: 'PUBLISHED',
  price: 'free',
  userId: 'creator-1',
  sections: [
    {
      id: 'section-download',
      title: 'Planning templates',
      position: 1,
      files: [
        {
          id: 'file-1',
          fileName: 'launch-calendar.pdf',
        },
      ],
    },
  ],
};

const consultationProduct: AbstractProduct = {
  id: 'consultation-1',
  type: 'CONSULTATION',
  name: 'Launch Strategy Session',
  description: 'A focused session for your next launch.',
  status: 'PUBLISHED',
  price: 250,
  userId: 'creator-1',
  consultationDetails: {
    durationMinutes: 60,
    meetingMethod: 'ZOOM',
    cancellationPolicy: 'Cancel up to 24 hours before the session.',
  },
};

const membershipProduct: AbstractProduct = {
  id: 'membership-1',
  type: 'MEMBERSHIP',
  name: 'Creator Lab Membership',
  description: 'Ongoing creator systems support.',
  status: 'PUBLISHED',
  price: 19,
  pricingModel: 'RECURRING',
  billingInterval: 'MONTH',
  currency: 'EUR',
  userId: 'creator-1',
};

const publicStorefront: PublicStorefront = {
  id: 'storefront-1',
  creator: {
    id: 'creator-1',
    displayName: 'Maya Chen',
    title: 'Creator strategist',
    bio: 'Helps creators package useful products.',
  },
  products: [],
  theme: {
    appearance: 'LIGHT',
    accentColor: '#0ea5e9',
    typography: 'FRIENDLY',
  },
};

const LocationProbe = () => {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
};

const renderProductPage = (initialEntry = '/app/product/course-1') => {
  const testStore = configureStore({
    reducer: {
      auth: authReducer,
      productLandingPage: productLandingPageReducer,
      products: productReducer,
      storefront: storefrontReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        loading: false,
        error: null,
        isUserLoggedIn: false,
      },
    },
  });

  return render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route
            path="/app/product/:id"
            element={
              <>
                <LocationProbe />
                <ProductPage />
              </>
            }
          />
          <Route
            path="/app/product/:id/:type"
            element={
              <>
                <LocationProbe />
                <ProductPage />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

describe('<ProductPage />', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(httpClient, { delayResponse: 0 });
    mock.onGet('api/storefronts/creator-1').reply(200, publicStorefront);
    mock.onGet(/api\/products\/[^/]+\/landing-page$/).reply((request) => {
      const parts = request.url?.split('/') ?? [];
      const productId = parts[parts.length - 2] ?? '';

      return [
        200,
        {
          id: `config-${productId}`,
          productId,
          marketingDescription: '',
          heroLayout: 'MEDIA_RIGHT',
          visibleSections: ['CONTENTS', 'CREATOR'],
          sectionOrder: ['ABOUT', 'CONTENTS', 'CREATOR'],
        },
      ];
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it('renders a published Product through the shared landing page with real data', async () => {
    mock.onGet('api/products/course-1').reply(200, courseProduct);

    const { container } = renderProductPage();

    expect(
      await screen.findByRole('heading', {
        name: 'Creator Product Growth System',
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Package and launch a stronger creator offer.').length)
      .toBeGreaterThan(0);
    expect(screen.getAllByText('Course').length).toBeGreaterThan(0);
    expect(screen.getAllByText('€149').length).toBeGreaterThan(0);
    expect(screen.getByText('Purchase currently unavailable')).toBeInTheDocument();
    expect(screen.getByAltText('Creator Product Growth System thumbnail'))
      .toHaveAttribute('src', 'https://cdn.example.com/course.jpg');

    await waitFor(() => {
      expect(screen.getByText('Maya Chen')).toBeInTheDocument();
    });

    const landing = container.querySelector('.product-landing');
    expect(landing).toHaveClass('product-landing--light');
    expect(landing).toHaveClass('product-landing--type-friendly');
    expect(landing).toHaveStyle('--product-landing-accent: #0ea5e9');
  });

  it('applies persisted public landing-page config when available', async () => {
    mock.resetHandlers();
    mock.onGet('api/storefronts/creator-1').reply(200, publicStorefront);
    mock.onGet('api/products/course-1').reply(200, courseProduct);
    mock.onGet('api/products/course-1/landing-page').reply(200, {
      id: 'config-course-1',
      productId: 'course-1',
      marketingDescription: 'A deeper promise for the public landing page.',
      heroLayout: 'MEDIA_LEFT',
      visibleSections: ['ABOUT', 'CONTENTS'],
      sectionOrder: ['ABOUT', 'CONTENTS', 'CREATOR'],
    });

    const { container } = renderProductPage();

    expect(
      await screen.findByText('A deeper promise for the public landing page.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Maya Chen')).toBeNull();
    expect(container.querySelector('.product-landing__hero'))
      .toHaveClass('product-landing__hero--media-left');
  });

  it('does not render Draft Products as public Product pages', async () => {
    mock.onGet('api/products/course-1').reply(200, {
      ...courseProduct,
      status: 'DRAFT',
    });

    renderProductPage();

    expect(await screen.findByRole('heading', { name: 'Product unavailable' }))
      .toBeInTheDocument();
    expect(screen.getByText('This Product is not publicly available.')).toBeInTheDocument();
    expect(screen.queryByText('Purchase currently unavailable')).toBeNull();
  });

  it('does not render Hidden Products as public Product pages', async () => {
    mock.onGet('api/products/course-1').reply(200, {
      ...courseProduct,
      status: 'HIDDEN',
    });

    renderProductPage();

    expect(await screen.findByRole('heading', { name: 'Product unavailable' }))
      .toBeInTheDocument();
    expect(screen.queryByText('Creator Product Growth System')).toBeNull();
  });

  it('does not preserve legacy fake public Product content', async () => {
    mock.onGet('api/products/course-1').reply(200, courseProduct);

    renderProductPage();

    expect(await screen.findByText('Purchase currently unavailable')).toBeInTheDocument();
    expect(screen.queryByText(/Rating:/i)).toBeNull();
    expect(screen.queryByText(/Swahili/i)).toBeNull();
    expect(screen.queryByText(/4733 hours/i)).toBeNull();
    expect(screen.queryByText(/This product includes/i)).toBeNull();
    expect(screen.queryByText(/The One Handed Man/i)).toBeNull();
    expect(screen.queryByRole('button', { name: /Buy Now/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Add to Cart/i })).toBeNull();
  });

  it('renders free Product access as unavailable instead of wiring fake access', async () => {
    mock.onGet('api/products/download-1').reply(200, downloadProduct);

    renderProductPage('/app/product/download-1');

    expect(await screen.findByRole('heading', { name: 'Launch Assets Pack' }))
      .toBeInTheDocument();
    expect(screen.getAllByText('Free').length).toBeGreaterThan(0);
    expect(screen.getByText('Access currently unavailable')).toBeInTheDocument();
    expect(screen.getByText('Planning templates')).toBeInTheDocument();
    expect(screen.getByText('launch-calendar.pdf')).toBeInTheDocument();
  });

  it('renders Membership recurring pricing and unavailable checkout', async () => {
    mock.onGet('api/products/membership-1').reply(200, membershipProduct);

    renderProductPage('/app/product/membership-1/MEMBERSHIP');

    expect(await screen.findByRole('heading', { name: 'Creator Lab Membership' }))
      .toBeInTheDocument();
    expect(screen.getAllByText('€19 / month').length).toBeGreaterThan(0);
    expect(screen.getByText('Membership checkout unavailable')).toBeInTheDocument();
  });

  it('renders representative Course content from loaded sections and lessons', async () => {
    mock.onGet('api/products/course-1').reply(200, courseProduct);

    renderProductPage();

    expect(await screen.findByText('1 module and 2 lessons from the current curriculum.'))
      .toBeInTheDocument();
    expect(screen.getByText('Positioning foundations')).toBeInTheDocument();
    expect(screen.getByText('Define the transformation')).toBeInTheDocument();
    expect(screen.getByText('Price the offer')).toBeInTheDocument();
  });

  it('renders representative Consultation details without fake duration claims', async () => {
    mock.onGet('api/products/consultation-1').reply(200, consultationProduct);

    renderProductPage('/app/product/consultation-1');

    expect(await screen.findByRole('heading', { name: 'Launch Strategy Session' }))
      .toBeInTheDocument();
    expect(screen.getByText('60 minutes')).toBeInTheDocument();
    expect(screen.getByText('Zoom')).toBeInTheDocument();
    expect(screen.getByText('Cancel up to 24 hours before the session.')).toBeInTheDocument();
    expect(screen.queryByText(/4733 hours/i)).toBeNull();
  });

  it('keeps type-bearing routes as compatibility paths and redirects mismatches', async () => {
    mock.onGet('api/products/course-1').reply(200, courseProduct);

    renderProductPage('/app/product/course-1/DOWNLOAD');

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/app/product/course-1');
    });
  });
});
