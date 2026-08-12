/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import StorefrontPublicPage from './storefront-public-page.component';
import {
  publicStorefrontTestFixture,
  storefrontProductSummariesTestFixture,
} from 'core/api/test-fixtures/creator-storefront-http.mock';
import { getStorefrontViewModel } from '../storefront.utils';

jest.mock('../../../../../assets/image-placeholder.png', () => 'placeholder.png');

const renderStorefront = (products = storefrontProductSummariesTestFixture) =>
  render(
    <MemoryRouter>
      <StorefrontPublicPage
        storefront={getStorefrontViewModel({
          profile: {
            id: publicStorefrontTestFixture.creator.id,
            displayName: publicStorefrontTestFixture.creator.displayName,
            title: publicStorefrontTestFixture.creator.title,
            tagline: publicStorefrontTestFixture.creator.tagline,
            bio: publicStorefrontTestFixture.creator.bio,
            website: publicStorefrontTestFixture.creator.website,
          },
          products,
          featuredProductId: publicStorefrontTestFixture.featuredProductId,
        })}
      />
    </MemoryRouter>,
  );

describe('StorefrontPublicPage', () => {
  it('renders published products and hides draft or hidden products', () => {
    renderStorefront();

    expect(screen.getAllByText('Creator Launch Studio').length).toBeGreaterThan(0);
    expect(screen.getByText('Content Calendar Kit')).toBeInTheDocument();
    expect(screen.getByText('Creator Lab Membership')).toBeInTheDocument();
    expect(screen.queryByText('Unannounced Workshop')).toBeNull();
    expect(screen.queryByText('Retired Preset Pack')).toBeNull();
  });

  it('supports Membership as a public product type', () => {
    renderStorefront();

    const membershipCards = screen.getAllByText('Membership');
    expect(membershipCards.length).toBeGreaterThan(0);
  });

  it('renders a graceful empty state when no products are published', () => {
    renderStorefront(
      storefrontProductSummariesTestFixture.map((product) => ({
        ...product,
        status: 'DRAFT' as const,
      })),
    );

    expect(screen.getByText('No products are public right now')).toBeInTheDocument();
    expect(screen.queryByText('Featured product')).toBeNull();
  });
});
