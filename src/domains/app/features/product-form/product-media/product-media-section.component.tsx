import React, { useRef, useState } from 'react';

import {
  ProductGalleryImage,
  ProductMediaStatus,
  ProductPromoVideo,
} from 'core/api/models';
import { Button, StatusBadge, UppyFileUploader } from '@shared/ui';
import placeholderImage from '../../../../../assets/image-placeholder.png';

import './product-media-section.styles.scss';

interface ProductMediaSectionProps {
  productId?: string;
  productTitle?: string;
  thumbnailUrl?: string;
  galleryImages?: ProductGalleryImage[];
  promoVideo?: ProductPromoVideo | null;
  // eslint-disable-next-line no-unused-vars
  onUploadThumbnail: (file: File) => Promise<string>;
  onRemoveThumbnail: () => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  onAddGalleryImage: (file: File) => Promise<ProductGalleryImage>;
  // eslint-disable-next-line no-unused-vars
  onRemoveGalleryImage: (imageId: string) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  onReorderGalleryImages: (imageIds: string[]) => Promise<ProductGalleryImage[]>;
  // eslint-disable-next-line no-unused-vars
  onUploadPromoVideo: (file: File) => Promise<ProductPromoVideo>;
  onRemovePromoVideo: () => Promise<void>;
}

type OperationStatus = 'idle' | 'uploading' | 'saved' | 'error';

const productMediaStatusLabel: Record<ProductMediaStatus, string> = {
  UPLOADING: 'Uploading',
  PROCESSING: 'Processing',
  READY: 'Ready',
  FAILED: 'Failed',
};

const productMediaStatusTone: Record<
  ProductMediaStatus,
  'success' | 'warning' | 'danger' | 'neutral'
> = {
  UPLOADING: 'warning',
  PROCESSING: 'warning',
  READY: 'success',
  FAILED: 'danger',
};

const getFileSignature = (file: File) =>
  `${file.name}:${file.size}:${file.lastModified}`;

const getSortedGalleryImages = (images: ProductGalleryImage[] = []) =>
  images.slice().sort((first, second) => first.position - second.position);

const ProductMediaSection: React.FC<ProductMediaSectionProps> = ({
  productId,
  productTitle = 'Product',
  thumbnailUrl,
  galleryImages = [],
  promoVideo,
  onUploadThumbnail,
  onRemoveThumbnail,
  onAddGalleryImage,
  onRemoveGalleryImage,
  onReorderGalleryImages,
  onUploadPromoVideo,
  onRemovePromoVideo,
}) => {
  const [thumbnailStatus, setThumbnailStatus] =
    useState<OperationStatus>('idle');
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [galleryStatus, setGalleryStatus] = useState<OperationStatus>('idle');
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [galleryActionId, setGalleryActionId] = useState<string | null>(null);
  const [promoStatus, setPromoStatus] = useState<OperationStatus>('idle');
  const [promoError, setPromoError] = useState<string | null>(null);
  const uploadedGallerySignaturesRef = useRef(new Set<string>());

  const sortedGalleryImages = getSortedGalleryImages(galleryImages);

  const handleThumbnailFiles = async (files: File[]) => {
    const file = files[0];

    if (!file || !productId) {
      return;
    }

    setThumbnailStatus('uploading');
    setThumbnailError(null);

    try {
      await onUploadThumbnail(file);
      setThumbnailStatus('saved');
    } catch (error) {
      setThumbnailStatus('error');
      setThumbnailError(
        error instanceof Error && error.message
          ? error.message
          : 'Thumbnail upload failed. Try again.',
      );
    }
  };

  const handleRemoveThumbnail = async () => {
    setThumbnailStatus('uploading');
    setThumbnailError(null);

    try {
      await onRemoveThumbnail();
      setThumbnailStatus('saved');
    } catch (error) {
      setThumbnailStatus('error');
      setThumbnailError(
        error instanceof Error && error.message
          ? error.message
          : 'Thumbnail removal failed. Try again.',
      );
    }
  };

  const handleGalleryFiles = async (files: File[]) => {
    if (!productId || files.length === 0) {
      return;
    }

    setGalleryStatus('uploading');
    setGalleryError(null);

    const newFiles = files.filter(
      (file) => !uploadedGallerySignaturesRef.current.has(getFileSignature(file)),
    );

    try {
      for (const file of newFiles) {
        await onAddGalleryImage(file);
        uploadedGallerySignaturesRef.current.add(getFileSignature(file));
      }
      setGalleryStatus('saved');
    } catch (error) {
      setGalleryStatus('error');
      setGalleryError(
        error instanceof Error && error.message
          ? error.message
          : 'Gallery upload failed. Try again.',
      );
    }
  };

  const handleRemoveGalleryImage = async (imageId: string) => {
    setGalleryActionId(imageId);
    setGalleryError(null);

    try {
      await onRemoveGalleryImage(imageId);
      setGalleryStatus('saved');
    } catch (error) {
      setGalleryStatus('error');
      setGalleryError(
        error instanceof Error && error.message
          ? error.message
          : 'Gallery image removal failed. Try again.',
      );
    } finally {
      setGalleryActionId(null);
    }
  };

  const handleMoveGalleryImage = async (
    imageId: string,
    direction: 'LEFT' | 'RIGHT',
  ) => {
    const currentIndex = sortedGalleryImages.findIndex(
      (image) => image.id === imageId,
    );
    const nextIndex = direction === 'LEFT' ? currentIndex - 1 : currentIndex + 1;

    if (
      currentIndex === -1 ||
      nextIndex < 0 ||
      nextIndex >= sortedGalleryImages.length
    ) {
      return;
    }

    const nextImages = [...sortedGalleryImages];
    const currentImage = nextImages[currentIndex];
    nextImages[currentIndex] = nextImages[nextIndex];
    nextImages[nextIndex] = currentImage;

    setGalleryActionId(imageId);
    setGalleryError(null);

    try {
      await onReorderGalleryImages(nextImages.map((image) => image.id));
      setGalleryStatus('saved');
    } catch (error) {
      setGalleryStatus('error');
      setGalleryError(
        error instanceof Error && error.message
          ? error.message
          : 'Gallery order could not be saved. Try again.',
      );
    } finally {
      setGalleryActionId(null);
    }
  };

  const handlePromoVideoFiles = async (files: File[]) => {
    const file = files[0];

    if (!file || !productId) {
      return;
    }

    setPromoStatus('uploading');
    setPromoError(null);

    try {
      await onUploadPromoVideo(file);
      setPromoStatus('saved');
    } catch (error) {
      setPromoStatus('error');
      setPromoError(
        error instanceof Error && error.message
          ? error.message
          : 'Promo video upload failed. Try again.',
      );
    }
  };

  const handleRemovePromoVideo = async () => {
    setPromoStatus('uploading');
    setPromoError(null);

    try {
      await onRemovePromoVideo();
      setPromoStatus('saved');
    } catch (error) {
      setPromoStatus('error');
      setPromoError(
        error instanceof Error && error.message
          ? error.message
          : 'Promo video removal failed. Try again.',
      );
    }
  };

  return (
    <div className="product-media">
      <section className="product-media-section" aria-labelledby="thumbnail-heading">
        <div className="product-media-section__header">
          <div>
            <h3 id="thumbnail-heading">Thumbnail</h3>
            <p>
              Primary Product image used in Product cards, Storefront, Overview,
              and the Product Landing Page.
            </p>
          </div>
          {thumbnailStatus === 'saved' && (
            <StatusBadge label="Saved" tone="success" size="sm" />
          )}
          {thumbnailStatus === 'uploading' && (
            <StatusBadge label="Uploading" tone="warning" size="sm" />
          )}
        </div>

        <div className="product-media-thumbnail">
          <img
            src={thumbnailUrl || placeholderImage}
            alt={thumbnailUrl ? `${productTitle} thumbnail` : ''}
          />
          <div className="product-media-upload">
            <UppyFileUploader
              allowedFileTypes={['image/*']}
              maxNumberOfFiles={1}
              disableImporters
              uploadMode="SELECT_ONLY"
              note="Select a Product thumbnail image."
              onFilesChange={handleThumbnailFiles}
            />
            <div className="product-media-actions">
              {thumbnailUrl && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  loading={thumbnailStatus === 'uploading'}
                  onClick={handleRemoveThumbnail}
                  aria-label={`Remove ${productTitle} thumbnail`}
                >
                  Remove thumbnail
                </Button>
              )}
            </div>
            {thumbnailError && (
              <p className="product-media__error" role="alert">
                {thumbnailError}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="product-media-section" aria-labelledby="gallery-heading">
        <div className="product-media-section__header">
          <div>
            <h3 id="gallery-heading">Gallery</h3>
            <p>
              Optional presentation images for the Product Landing Page. This
              is Product-owned media, not downloadable content.
            </p>
          </div>
          {galleryStatus === 'uploading' && (
            <StatusBadge label="Uploading" tone="warning" size="sm" />
          )}
        </div>

        <UppyFileUploader
          allowedFileTypes={['image/*']}
          disableImporters
          uploadMode="SELECT_ONLY"
          note="Add gallery images."
          onFilesChange={handleGalleryFiles}
        />

        {galleryError && (
          <p className="product-media__error" role="alert">
            {galleryError}
          </p>
        )}

        {sortedGalleryImages.length === 0 ? (
          <div className="product-media-empty" role="status">
            <h4>No gallery images yet</h4>
            <p>Add optional presentation images when this Product needs more context.</p>
          </div>
        ) : (
          <div className="product-media-gallery" aria-live="polite">
            {sortedGalleryImages.map((image, index) => (
              <article className="product-media-gallery__item" key={image.id}>
                <img
                  src={image.url}
                  alt={image.altText || `${productTitle} gallery image ${index + 1}`}
                />
                <div>
                  <strong>{image.fileName || `Gallery image ${index + 1}`}</strong>
                  <span>Position {index + 1}</span>
                </div>
                <div className="product-media-gallery__actions">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={index === 0 || galleryActionId === image.id}
                    onClick={() => handleMoveGalleryImage(image.id, 'LEFT')}
                    aria-label={`Move ${image.fileName || `gallery image ${index + 1}`} left`}
                  >
                    Move left
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={
                      index === sortedGalleryImages.length - 1 ||
                      galleryActionId === image.id
                    }
                    onClick={() => handleMoveGalleryImage(image.id, 'RIGHT')}
                    aria-label={`Move ${image.fileName || `gallery image ${index + 1}`} right`}
                  >
                    Move right
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    loading={galleryActionId === image.id}
                    onClick={() => handleRemoveGalleryImage(image.id)}
                    aria-label={`Remove ${image.fileName || `gallery image ${index + 1}`}`}
                  >
                    Remove
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="product-media-section" aria-labelledby="promo-video-heading">
        <div className="product-media-section__header">
          <div>
            <h3 id="promo-video-heading">Promo video</h3>
            <p>
              Optional Product-level promotional video. Course lessons and
              Membership videos remain owned by their content editors.
            </p>
          </div>
          {promoVideo && (
            <StatusBadge
              label={productMediaStatusLabel[promoVideo.status]}
              tone={productMediaStatusTone[promoVideo.status]}
              size="sm"
            />
          )}
        </div>

        {promoVideo ? (
          <div className="product-media-video">
            {promoVideo.status === 'READY' && promoVideo.url ? (
              <video src={promoVideo.url} controls aria-label={`${productTitle} promo video`} />
            ) : (
              <div className="product-media-video__pending" role="status">
                <strong>{productMediaStatusLabel[promoVideo.status]}</strong>
                <p>Video processing and playback are backend-owned.</p>
              </div>
            )}
            <div className="product-media-video__details">
              <strong>{promoVideo.fileName || 'Promo video'}</strong>
              <span>
                Product-level presentation media. It is not a Course lesson or
                Membership post.
              </span>
              <Button
                type="button"
                variant="danger"
                size="sm"
                loading={promoStatus === 'uploading'}
                onClick={handleRemovePromoVideo}
                aria-label={`Remove ${productTitle} promo video`}
              >
                Remove promo video
              </Button>
            </div>
          </div>
        ) : (
          <div className="product-media-empty" role="status">
            <h4>No promo video</h4>
            <p>Add one when this Product needs a customer-facing preview video.</p>
          </div>
        )}

        <UppyFileUploader
          allowedFileTypes={['video/*']}
          maxNumberOfFiles={1}
          disableImporters
          uploadMode="SELECT_ONLY"
          note="Select an optional Product promo video."
          onFilesChange={handlePromoVideoFiles}
        />

        {promoError && (
          <p className="product-media__error" role="alert">
            {promoError}
          </p>
        )}
      </section>
    </div>
  );
};

export default ProductMediaSection;
