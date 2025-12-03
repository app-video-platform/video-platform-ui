// GalProductCard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import GalProductCard from './gal-product-box.component';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { ProductStatus, ProductType } from '@api/types';

// Create a dummy placeholder value as used in your component.
// In your component, placeholderImage is imported via require.
// For testing purposes, we assume it returns a string.
jest.mock('../../assets/image-placeholder.png', () => 'placeholder-image.jpg');

describe('GalProductCard component', () => {
  const dateForTesting = new Date('2021-08-15T12:00:00Z');
  const typeForTesting: ProductType = 'DOWNLOAD';
  const statusForTesting: ProductStatus = 'DRAFT';
  const productPriceForTesting: 'free' | number = 'free';

  const formattedDate = dateForTesting.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // const baseProductWithImage = {
  //   name: 'Test Product',
  //   image: 'test-image.jpg',
  //   updatedAt: dateForTesting,
  //   type: typeForTesting,
  //   price: 20,
  //   id: '1',
  //   description: '',
  //   status: statusForTesting,
  //   userId: '',
  //   customers: 0,
  //   createdAt: dateForTesting,
  // };

  const baseProductWithoutImage = {
    name: 'Free Product',
    // image: '',
    // updatedAt: new Date('2022-01-01T00:00:00Z'),
    type: typeForTesting,
    price: productPriceForTesting,
    id: '1',
    description: '',
    status: statusForTesting,
    userId: '',
    // customers: 0,
    createdAt: dateForTesting,
  };

  it('renders product details', () => {
    render(
      <MemoryRouter>
        <GalProductCard product={baseProductWithoutImage} />
      </MemoryRouter>,
    );

    // Verify that the image src is the product image.
    // const imageEl = screen.getByRole('img', {
    //   name: baseProductWithImage.name,
    // });
    // expect(imageEl).toBeInTheDocument();
    // expect(imageEl).toHaveAttribute('src', baseProductWithImage.image);

    // Verify product name.
    const productName = screen.getByRole('heading', { level: 3 });
    expect(productName).toHaveTextContent(baseProductWithoutImage.name);

    // Verify updated date is rendered in the correct format.
    // expect(screen.getByText(formattedDate)).toBeInTheDocument();

    // Verify product type is rendered in lower case.
    expect(
      screen.getByText(baseProductWithoutImage.type.toLowerCase()),
    ).toBeInTheDocument();

    // Check the container for type and price details.
    const typeAndPriceContainer = screen.getByText(
      (content, element) =>
        !!element && element.classList.contains('type-and-price-line'),
    );
    expect(typeAndPriceContainer).toBeInTheDocument();

    // Verify that the euro symbol and price are part of the content.
    // expect(typeAndPriceContainer.textContent).toContain('€');
    expect(typeAndPriceContainer.textContent).toContain(
      String(baseProductWithoutImage.price),
    );
  });

  // it('falls back to the placeholder image when image is missing or empty', () => {
  //   render(
  //     <MemoryRouter>
  //       <GalProductCard product={baseProductWithoutImage} />
  //     </MemoryRouter>
  //   );
  //   const imageEl = screen.getByRole('img', {
  //     name: baseProductWithoutImage.name,
  //   });
  //   expect(imageEl).toBeInTheDocument();
  //   // Should use the placeholder image from our mock
  //   expect(imageEl).toHaveAttribute('src', 'placeholder-image.jpg');
  // });

  it('renders price without euro symbol when price is "free"', () => {
    render(
      <MemoryRouter>
        <GalProductCard product={baseProductWithoutImage} />
      </MemoryRouter>,
    );

    // Check the container for type and price details.
    const typeAndPriceContainer = screen.getByText(
      (content, element) =>
        !!element?.classList.contains('type-and-price-line'),
    );
    expect(typeAndPriceContainer).toBeInTheDocument();

    // Since the price is free, there should be no euro symbol.
    expect(typeAndPriceContainer.textContent).not.toContain('€');
    expect(typeAndPriceContainer.textContent).toContain('free');
  });
});
