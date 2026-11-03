import MockAdapter from 'axios-mock-adapter';

import httpClient from '../../http-client';
import {
  addImageToProductAPI,
  addProductGalleryImageAPI,
  addProductPromoVideoAPI,
} from './product-crud-api';

const contentTypeFrom = (headers: unknown) => {
  if (!headers || typeof headers !== 'object') {
    return undefined;
  }
  const entry = Object.entries(headers as Record<string, unknown>).find(
    ([name]) => name.toLowerCase() === 'content-type',
  );
  return entry?.[1];
};

describe('Product media raw-file transport', () => {
  let adapter: MockAdapter;

  beforeEach(() => {
    adapter = new MockAdapter(httpClient);
  });

  afterEach(() => {
    adapter.restore();
  });

  it.each([
    {
      path: 'api/products/image?productId=p1',
      file: new File(['png-bytes'], 'thumb.png', { type: 'image/png' }),
      upload: (file: File) => addImageToProductAPI(file, 'p1'),
      response: 'https://cdn/thumb.png',
    },
    {
      path: 'api/products/p1/media/gallery',
      file: new File(['png-gallery-bytes'], 'gallery.png', { type: 'image/png' }),
      upload: (file: File) => addProductGalleryImageAPI('p1', file),
      response: {
        id: 'gallery-png-1',
        url: 'https://cdn/gallery.png',
        position: 1,
      },
    },
    {
      path: 'api/products/p1/media/gallery',
      file: new File(['jpeg-bytes'], 'gallery.jpg', { type: 'image/jpeg' }),
      upload: (file: File) => addProductGalleryImageAPI('p1', file),
      response: {
        id: 'gallery-1',
        url: 'https://cdn/gallery.jpg',
        position: 1,
      },
    },
    {
      path: 'api/products/p1/media/promo-video',
      file: new File(['mp4-bytes'], 'promo.mp4', { type: 'video/mp4' }),
      upload: (file: File) => addProductPromoVideoAPI('p1', file),
      response: {
        id: 'promo-1',
        url: 'https://cdn/promo.mp4',
        status: 'PROCESSING',
      },
    },
  ])('sends $file.type and preserves the raw File body', async ({
    path,
    file,
    upload,
    response,
  }) => {
    let observedContentType: string | undefined;
    let observedBody: unknown;
    adapter.onPost(path).reply((config) => {
      observedContentType = contentTypeFrom(config.headers) as string | undefined;
      observedBody = config.data;
      return [200, response];
    });

    await upload(file);

    expect(observedContentType).toBe(file.type);
    expect(observedBody).toBe(file);
    expect((observedBody as File).size).toBe(file.size);
  });

  it('keeps JSON Content-Type for JSON requests', async () => {
    let observedContentType: string | undefined;
    adapter.onPost('/api/json-contract').reply((config) => {
      observedContentType = contentTypeFrom(config.headers) as string | undefined;
      return [200, { ok: true }];
    });

    await httpClient.post('/api/json-contract', { title: 'JSON remains JSON' });

    expect(observedContentType).toBe('application/json');
  });
});
