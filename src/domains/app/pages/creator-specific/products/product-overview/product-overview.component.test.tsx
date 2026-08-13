/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import httpClient from 'core/api/http-client';
import productReducer from 'core/store/product-store/product.slice';
import { AbstractProduct } from 'core/api/models';

import ProductOverview from './product-overview.component';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const courseProduct: AbstractProduct = {
  id: 'course-1',
  type: 'COURSE',
  name: 'Creator Product Growth System',
  description: 'A complete system for packaging and launching creator offers.',
  status: 'PUBLISHED',
  price: 149,
  createdAt: new Date('2026-07-01T09:00:00.000Z'),
  updatedAt: new Date('2026-08-08T09:00:00.000Z'),
  sections: [
    {
      id: 'section-1',
      title: 'Positioning foundations',
      description: 'Clarify the buyer, promise, and launch thesis.',
      position: 1,
      lessons: [
        {
          id: 'lesson-1',
          sectionId: 'section-1',
          title: 'Define the transformation',
          description: 'Frame the business outcome buyers actually want.',
          type: 'VIDEO',
        },
        {
          id: 'lesson-2',
          sectionId: 'section-1',
          title: 'Price the offer',
          description: 'Choose a clear price point.',
          type: 'ARTICLE',
        },
      ],
    },
  ],
};

const membershipProduct: AbstractProduct = {
  id: 'membership-1',
  type: 'MEMBERSHIP',
  name: 'Creator Systems Lab membership',
  status: 'DRAFT',
  price: 39,
  pricingModel: 'RECURRING',
  billingInterval: 'MONTH',
  currency: 'EUR',
  createdAt: new Date('2026-07-27T09:00:00.000Z'),
  updatedAt: new Date('2026-08-10T09:00:00.000Z'),
};

const renderOverview = (
  initialEntry = '/app/products/course-1',
  preloadedCurrentProduct: AbstractProduct | null = null,
) => {
  const testStore = configureStore({
    reducer: {
      products: productReducer,
    },
    preloadedState: {
      products: {
        products: null,
        productSummaries: null,
        currentProduct: preloadedCurrentProduct,
        loading: false,
        error: null,
      },
    },
  });

  return render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/app/products/:productId" element={<ProductOverview />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

describe('<ProductOverview />', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    mock = new MockAdapter(httpClient, { delayResponse: 0 });
  });

  afterEach(() => {
    mock.restore();
  });

  it('renders a loaded Course product with status, pricing, dates, and content summary', async () => {
    mock.onGet('api/products/course-1').reply(200, courseProduct);

    renderOverview();

    expect(await screen.findByRole('heading', {
      name: 'Creator Product Growth System',
    })).toBeInTheDocument();
    expect(screen.getAllByText('Published').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Course').length).toBeGreaterThan(0);
    expect(screen.getByText('€149')).toBeInTheDocument();
    expect(screen.getByText('Positioning foundations')).toBeInTheDocument();
    expect(screen.getByText('2 lessons')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Course content' })).toBeInTheDocument();
  });

  it('clears stale product details and shows loading while the requested product loads', () => {
    mock.onGet('api/products/course-1').reply(() => new Promise(() => undefined));

    renderOverview('/app/products/course-1', membershipProduct);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Creator Systems Lab membership')).toBeNull();
  });

  it('renders an unavailable state when the product request fails', async () => {
    mock.onGet('api/products/course-1').reply(404, { message: 'Not found' });

    renderOverview();

    expect(
      await screen.findByRole('heading', {
        name: 'Product data is not available yet',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('navigates to Product Workspace from Edit product', async () => {
    mock.onGet('api/products/course-1').reply(200, courseProduct);

    renderOverview();

    fireEvent.click(await screen.findByRole('button', { name: 'Edit product' }));

    expect(mockNavigate).toHaveBeenCalledWith('/app/products/edit/course-1');
  });

  it('shows the public page action only for published products', async () => {
    mock.onGet('api/products/course-1').reply(200, courseProduct);

    renderOverview();

    fireEvent.click(await screen.findByRole('button', { name: 'View public page' }));
    expect(mockNavigate).toHaveBeenCalledWith('/app/product/course-1/COURSE');

    mock.resetHandlers();
    mock.onGet('api/products/membership-1').reply(200, membershipProduct);
    renderOverview('/app/products/membership-1');

    expect(
      await screen.findByRole('heading', {
        name: 'Creator Systems Lab membership',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: 'View public page' }),
    ).toHaveLength(1);
    expect(
      within(
        screen.getByRole('heading', {
          name: 'Membership setup',
        }).closest('.product-overview-page') as HTMLElement,
      ).queryByRole('button', {
        name: 'View public page',
      }),
    ).toBeNull();
  });

  it('renders recurring Membership pricing without unsupported member metrics', async () => {
    mock.onGet('api/products/membership-1').reply(200, membershipProduct);

    renderOverview('/app/products/membership-1');

    expect(
      await screen.findByRole('heading', {
        name: 'Creator Systems Lab membership',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('€39 / month')).toBeInTheDocument();
    expect(screen.getByText(/Member counts, subscriber access/i)).toBeInTheDocument();
    expect(screen.queryByText(/subscriber count/i)).toBeNull();
  });
});
