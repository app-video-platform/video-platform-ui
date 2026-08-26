import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

jest.mock('@shared/ui', () => {
  const actual = jest.requireActual('@shared/ui');
  type MockUploaderProps = {
    note?: string;
    // eslint-disable-next-line no-unused-vars
    onFilesChange?: (files: File[]) => void;
  };

  return {
    __esModule: true,
    ...actual,
    UppyFileUploader: ({ note, onFilesChange }: MockUploaderProps) => {
      const label = note ?? 'Select file';
      const file =
        label.includes('promo')
          ? new File(['video'], 'promo.mp4', { type: 'video/mp4' })
          : new File(['image'], `${label.replace(/\W+/g, '-').toLowerCase()}.jpg`, {
            type: 'image/jpeg',
          });

      return (
        <button type="button" onClick={() => onFilesChange?.([file])}>
          {label}
        </button>
      );
    },
  };
});

import ProductMediaSection from './product-media-section.component';

const galleryImages = [
  {
    id: 'gallery-1',
    url: 'https://cdn.example.com/one.jpg',
    fileName: 'one.jpg',
    position: 1,
    altText: 'One',
    status: 'READY' as const,
  },
  {
    id: 'gallery-2',
    url: 'https://cdn.example.com/two.jpg',
    fileName: 'two.jpg',
    position: 2,
    altText: 'Two',
    status: 'READY' as const,
  },
];

const renderSection = (overrides = {}) => {
  const props = {
    productId: 'product-1',
    productTitle: 'Creator Course',
    thumbnailUrl: 'https://cdn.example.com/thumb.jpg',
    galleryImages: [],
    promoVideo: null,
    onUploadThumbnail: jest.fn().mockResolvedValue('https://cdn.example.com/new.jpg'),
    onRemoveThumbnail: jest.fn().mockResolvedValue(undefined),
    onAddGalleryImage: jest.fn().mockResolvedValue({
      id: 'gallery-new',
      url: 'https://cdn.example.com/new-gallery.jpg',
      fileName: 'new-gallery.jpg',
      position: 1,
      status: 'READY',
    }),
    onRemoveGalleryImage: jest.fn().mockResolvedValue(undefined),
    onReorderGalleryImages: jest.fn().mockResolvedValue(galleryImages),
    onUploadPromoVideo: jest.fn().mockResolvedValue({
      id: 'promo-1',
      url: 'https://cdn.example.com/promo.mp4',
      fileName: 'promo.mp4',
      status: 'READY',
    }),
    onRemovePromoVideo: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };

  render(<ProductMediaSection {...props} />);

  return props;
};

describe('<ProductMediaSection />', () => {
  it('renders the current thumbnail', () => {
    renderSection();

    expect(
      screen.getByAltText('Creator Course thumbnail'),
    ).toHaveAttribute('src', 'https://cdn.example.com/thumb.jpg');
  });

  it('uploads or replaces the thumbnail', async () => {
    const user = userEvent.setup();
    const { onUploadThumbnail } = renderSection();

    await user.click(screen.getByRole('button', {
      name: 'Select a Product thumbnail image.',
    }));

    await waitFor(() => {
      expect(onUploadThumbnail).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('removes the thumbnail', async () => {
    const user = userEvent.setup();
    const { onRemoveThumbnail } = renderSection();

    await user.click(screen.getByRole('button', {
      name: /remove creator course thumbnail/i,
    }));

    await waitFor(() => {
      expect(onRemoveThumbnail).toHaveBeenCalledTimes(1);
    });
  });

  it('shows gallery empty state and adds an image', async () => {
    const user = userEvent.setup();
    const { onAddGalleryImage } = renderSection({ thumbnailUrl: undefined });

    expect(screen.getByText('No gallery images yet')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Add gallery images.' }));

    await waitFor(() => {
      expect(onAddGalleryImage).toHaveBeenCalledTimes(1);
    });
  });

  it('allows retrying the same gallery file after an upload failure', async () => {
    const user = userEvent.setup();
    const onAddGalleryImage = jest.fn()
      .mockRejectedValueOnce(new Error('Gallery upload failed'))
      .mockResolvedValueOnce({
        id: 'gallery-retry',
        url: 'https://cdn.example.com/retry.jpg',
        fileName: 'retry.jpg',
        position: 1,
        status: 'READY',
      });

    renderSection({ onAddGalleryImage });

    const uploadButton = screen.getByRole('button', {
      name: 'Add gallery images.',
    });

    await user.click(uploadButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Gallery upload failed',
    );

    await user.click(uploadButton);

    await waitFor(() => {
      expect(onAddGalleryImage).toHaveBeenCalledTimes(2);
    });
  });

  it('reorders and removes gallery images', async () => {
    const user = userEvent.setup();
    const { onReorderGalleryImages, onRemoveGalleryImage } = renderSection({
      galleryImages,
    });

    await user.click(screen.getByRole('button', { name: /move two.jpg left/i }));

    await waitFor(() => {
      expect(onReorderGalleryImages).toHaveBeenCalledWith([
        'gallery-2',
        'gallery-1',
      ]);
    });

    await user.click(screen.getByRole('button', { name: /remove two.jpg/i }));

    await waitFor(() => {
      expect(onRemoveGalleryImage).toHaveBeenCalledWith('gallery-2');
    });
  });

  it('uploads and removes a Product promo video', async () => {
    const user = userEvent.setup();
    const { onUploadPromoVideo, onRemovePromoVideo } = renderSection({
      promoVideo: {
        id: 'promo-1',
        url: 'https://cdn.example.com/promo.mp4',
        fileName: 'promo.mp4',
        status: 'READY',
      },
    });

    expect(
      screen.getByLabelText('Creator Course promo video'),
    ).toHaveAttribute('src', 'https://cdn.example.com/promo.mp4');

    await user.click(screen.getByRole('button', {
      name: 'Select an optional Product promo video.',
    }));

    await waitFor(() => {
      expect(onUploadPromoVideo).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByRole('button', {
      name: /remove creator course promo video/i,
    }));

    await waitFor(() => {
      expect(onRemovePromoVideo).toHaveBeenCalledTimes(1);
    });
  });

  it('keeps errors inline when upload fails', async () => {
    const user = userEvent.setup();
    renderSection({
      onUploadThumbnail: jest.fn().mockRejectedValue(new Error('Upload denied')),
    });

    await user.click(screen.getByRole('button', {
      name: 'Select a Product thumbnail image.',
    }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Upload denied');
  });
});
