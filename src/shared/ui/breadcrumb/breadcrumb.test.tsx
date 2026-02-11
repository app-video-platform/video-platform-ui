// Breadcrumbs.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Breadcrumbs from './breadcrumb.component';
import '@testing-library/jest-dom';

describe('Breadcrumbs component', () => {
  // A helper to render the component with a given initial route.
  const renderWithRouter = (initialPath: string) =>
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="*" element={<Breadcrumbs />} />
        </Routes>
      </MemoryRouter>,
    );

  it('renders correct breadcrumbs for "/app/products/new"', () => {
    renderWithRouter('/app/products/new');

    // "Dashboard" and "Products" should be links while "New" is plain text (current page)
    const dashboardLink = screen.getByRole('link', { name: /app/i });
    const productsLink = screen.getByRole('link', { name: /products/i });
    const newBreadcrumb = screen.getByText(/new/i);

    expect(dashboardLink).toBeInTheDocument();
    expect(productsLink).toBeInTheDocument();
    expect(newBreadcrumb).toBeInTheDocument();

    // Verify that the links have the correct href values.
    expect(dashboardLink.getAttribute('href')).toBe('/app');
    expect(productsLink.getAttribute('href')).toBe('/app/products');
  });

  it('transforms dash-separated segments to camelCase and falls back when no labelMap match', () => {
    // When no mapping exists in labelMap, the component falls back to the original segment.
    // Given a segment like "my-perfect-formatted-page", toCamelCase returns "myPerfectFormattedPage"
    // but since "myPerfectFormattedPage" is not in labelMap, the original segment is used.
    renderWithRouter('/my-perfect-formatted-page/path-with-dashes');

    // Expect the breadcrumb to display the original segment text.
    const breadcrumb = screen.getByText('my-perfect-formatted-page');
    expect(breadcrumb).toBeInTheDocument();
  });

  it('uses labelMap when available', () => {
    // When the path segment is "myPagePreview", the labelMap should convert it to "My Page Preview"
    renderWithRouter('/app/products/create');

    // "My Page Preview" should be rendered as a link since it's not the last breadcrumb in this path.
    const mappedBreadcrumb = screen.getByRole('link', { name: 'Products' });
    expect(mappedBreadcrumb).toBeInTheDocument();
    expect(mappedBreadcrumb.getAttribute('href')).toBe('/app/products');
  });
});
