import { ProductGalleryImage } from 'core/api/models';

export const PRODUCT_MEDIA_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const PRODUCT_MEDIA_PROMO_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/webm',
];

export const PRODUCT_MEDIA_MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const PRODUCT_MEDIA_MAX_PROMO_VIDEO_SIZE_BYTES = 100 * 1024 * 1024;
export const PRODUCT_MEDIA_MAX_GALLERY_IMAGES = 20;

export const PRODUCT_MEDIA_IMAGE_FORMAT_LABEL = 'JPEG, PNG, WebP, or GIF';
export const PRODUCT_MEDIA_PROMO_VIDEO_FORMAT_LABEL = 'MP4 or WebM';

export const validateProductImageFile = (file: File): string | null => {
  if (!PRODUCT_MEDIA_IMAGE_MIME_TYPES.includes(file.type)) {
    return `Unsupported image format. Use ${PRODUCT_MEDIA_IMAGE_FORMAT_LABEL}.`;
  }

  if (file.size > PRODUCT_MEDIA_MAX_IMAGE_SIZE_BYTES) {
    return 'Image is too large. Product images must be 10 MB or smaller.';
  }

  return null;
};

export const validateProductPromoVideoFile = (file: File): string | null => {
  if (!PRODUCT_MEDIA_PROMO_VIDEO_MIME_TYPES.includes(file.type)) {
    return `Unsupported promo-video format. Use ${PRODUCT_MEDIA_PROMO_VIDEO_FORMAT_LABEL}.`;
  }

  if (file.size > PRODUCT_MEDIA_MAX_PROMO_VIDEO_SIZE_BYTES) {
    return 'Promo video is too large. Product promo videos must be 100 MB or smaller.';
  }

  return null;
};

export const validateProductGallerySelection = (
  existingImages: ProductGalleryImage[],
  selectedFiles: File[],
): string | null => {
  if (existingImages.length + selectedFiles.length > PRODUCT_MEDIA_MAX_GALLERY_IMAGES) {
    return 'Gallery can include up to 20 images total. Remove an image before adding more.';
  }

  for (const file of selectedFiles) {
    const error = validateProductImageFile(file);

    if (error) {
      return error;
    }
  }

  return null;
};
