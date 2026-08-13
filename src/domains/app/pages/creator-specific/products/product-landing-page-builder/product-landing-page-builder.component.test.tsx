/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import httpClient from 'core/api/http-client';
import { AbstractProduct, UserRole } from 'core/api/models';
import authReducer from 'core/store/auth-store/auth.slice';
import productLandingPageReducer from 'core/store/product-landing-page-store/product-landing-page.slice';
import productReducer from 'core/store/product-store/product.slice';
import storefrontReducer from 'core/store/storefront-store/storefront.slice';

import ProductLandingPageBuilder from './product-landing-page-builder.component';

jest.mock('../../../../../../assets/image-placeholder.png', () => 'placeholder.png');

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
      ],
    },
  ],
};

const renderBuilder = (initialEntry = '/app/products/course-1/landing-page') => {
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
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route
            path="/app/products/:productId/landing-page"
            element={<ProductLandingPageBuilder />}
          />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

describe('<ProductLandingPageBuilder />', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(httpClient, { delayResponse: 0 });
    mock.onGet('api/products/course-1').reply(200, courseProduct);
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
    mock.onGet('api/creator/products/course-1/landing-page').reply(200, {
      id: 'landing-course-1',
      productId: 'course-1',
      marketingDescription: 'Persisted public marketing copy.',
      heroLayout: 'MEDIA_LEFT',
      visibleSections: ['ABOUT', 'CONTENTS', 'CREATOR'],
      sectionOrder: ['ABOUT', 'CONTENTS', 'CREATOR'],
    });
    mock.onPatch('api/creator/products/course-1/landing-page').reply((request) => [
      200,
      {
        id: 'landing-course-1',
        productId: 'course-1',
        ...JSON.parse(request.data ?? '{}'),
        updatedAt: '2026-08-13T12:00:00.000Z',
      },
    ]);
  });

  afterEach(() => {
    mock.restore();
  });

  it('renders Product-owned fields read-only and previews persisted config', async () => {
    const { container } = renderBuilder();

    expect(
      await screen.findAllByRole('heading', {
        name: 'Creator Product Growth System',
      }),
    ).not.toHaveLength(0);
    expect(screen.getAllByText('Persisted public marketing copy.').length)
      .toBeGreaterThan(1);
    expect(screen.getByText('Maya Chen')).toBeInTheDocument();
    expect(screen.getAllByText('€149').length).toBeGreaterThan(1);
    expect(container.querySelector('.product-landing__hero'))
      .toHaveClass('product-landing__hero--media-left');
    expect(screen.queryByDisplayValue('Creator Product Growth System')).toBeNull();
  });

  it('updates the shared preview from a local draft before saving', async () => {
    const { container } = renderBuilder();

    const textarea = await screen.findByRole('textbox');
    fireEvent.change(textarea, {
      target: { value: 'Live draft marketing copy.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Media right' }));

    expect(screen.getAllByText('Live draft marketing copy.').length)
      .toBeGreaterThan(1);
    expect(container.querySelector('.product-landing__hero'))
      .toHaveClass('product-landing__hero--media-right');
    expect(mock.history.patch).toHaveLength(0);
  });

  it('toggles and reorders supported secondary sections', async () => {
    renderBuilder();

    await waitFor(() => {
      expect(screen.getAllByText('Persisted public marketing copy.').length)
        .toBeGreaterThan(1);
    });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Creator' }));
    expect(screen.queryByText('Maya Chen')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Move Creator up' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(mock.history.patch).toHaveLength(1));
    const payload = JSON.parse(mock.history.patch[0].data);
    expect(payload.visibleSections).toEqual(['ABOUT', 'CONTENTS']);
    expect(payload.sectionOrder).toEqual(['ABOUT', 'CREATOR', 'CONTENTS']);
  });

  it('resets local changes to the last persisted config', async () => {
    renderBuilder();

    const textarea = await screen.findByRole('textbox');
    fireEvent.change(textarea, {
      target: { value: 'Temporary draft copy.' },
    });
    expect(screen.getAllByText('Temporary draft copy.').length)
      .toBeGreaterThan(1);

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

    expect(screen.getAllByText('Persisted public marketing copy.').length)
      .toBeGreaterThan(1);
    expect(screen.queryByText('Temporary draft copy.')).toBeNull();
  });

  it('opens customization controls in the shared Drawer on mobile', async () => {
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query === '(max-width: 768px)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });

    renderBuilder();

    await screen.findAllByRole('heading', {
      name: 'Creator Product Growth System',
    });
    fireEvent.click(screen.getByRole('button', { name: 'Customize' }));

    expect(screen.getByRole('dialog')).toHaveTextContent('Customize landing page');

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });
});
