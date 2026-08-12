/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import StorefrontPublicPage from './storefront-public-page.component';
import { getProfileFromUser, getStorefrontViewModel } from '../storefront.utils';
import {
  storefrontInspectionFeaturedProductId,
  storefrontInspectionProducts,
  storefrontInspectionUser,
} from '../storefront.fixtures';

jest.mock('../../../../../assets/image-placeholder.png', () => 'placeholder.png');

const renderStorefront = (products = storefrontInspectionProducts) =>
  render(
    <MemoryRouter>
      <StorefrontPublicPage
        storefront={getStorefrontViewModel({
          profile: getProfileFromUser(storefrontInspectionUser),
          products,
          featuredProductId: storefrontInspectionFeaturedProductId,
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
      storefrontInspectionProducts.map((product) => ({
        ...product,
        status: 'DRAFT' as const,
      })),
    );

    expect(screen.getByText('No products are public right now')).toBeInTheDocument();
    expect(screen.queryByText('Featured product')).toBeNull();
  });
});
