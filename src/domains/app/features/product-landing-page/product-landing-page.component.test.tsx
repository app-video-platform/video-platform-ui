import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import ProductLandingPage from './product-landing-page.component';
import { ProductLandingPageViewModel } from './product-landing-page.types';

jest.mock('../../../../assets/image-placeholder.png', () => 'placeholder.png');

const product: ProductLandingPageViewModel = {
  id: 'product-1',
  type: 'COURSE',
  typeLabel: 'Course',
  name: 'Creator Course',
  description: 'A course for creators.',
  imageUrl: 'https://cdn.example.com/thumb.jpg',
  imageAlt: 'Creator Course thumbnail',
  galleryImages: [
    {
      id: 'gallery-1',
      url: 'https://cdn.example.com/gallery-1.jpg',
      fileName: 'gallery-1.jpg',
      position: 1,
      altText: 'Gallery one',
      status: 'READY',
    },
  ],
  promoVideo: {
    id: 'promo-1',
    url: 'https://cdn.example.com/promo.mp4',
    fileName: 'promo.mp4',
    status: 'READY',
  },
  price: {
    label: 'Free',
    isFree: true,
    isRecurring: false,
  },
  cta: {
    label: 'Checkout pending',
    description: 'Checkout is not connected yet.',
  },
  theme: {
    appearance: 'DARK',
    accentColor: '#ffbd41',
    typography: 'MODERN',
  },
  heroLayout: 'MEDIA_RIGHT',
  sections: [],
  summary: {
    type: 'COURSE',
    sectionCount: 0,
    lessonCount: 0,
    sections: [],
  },
};

describe('<ProductLandingPage /> media', () => {
  it('renders canonical Product thumbnail, gallery, and ready promo video', () => {
    render(<ProductLandingPage product={product} />);

    expect(screen.getByAltText('Creator Course thumbnail')).toHaveAttribute(
      'src',
      'https://cdn.example.com/thumb.jpg',
    );
    expect(screen.getByAltText('Gallery one')).toHaveAttribute(
      'src',
      'https://cdn.example.com/gallery-1.jpg',
    );
    expect(screen.getByLabelText('Creator Course promo video')).toHaveAttribute(
      'src',
      'https://cdn.example.com/promo.mp4',
    );
  });

  it('does not render an unready promo video as playable media', () => {
    render(
      <ProductLandingPage
        product={{
          ...product,
          promoVideo: {
            id: 'promo-1',
            fileName: 'promo.mp4',
            status: 'PROCESSING',
          },
        }}
      />,
    );

    expect(
      screen.queryByLabelText('Creator Course promo video'),
    ).not.toBeInTheDocument();
  });
});
