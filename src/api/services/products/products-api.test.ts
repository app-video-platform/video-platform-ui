/* eslint-disable @typescript-eslint/no-explicit-any */
import httpClient from '../../http-client';
import { getCookie } from '../../../utils/cookie.util';

import {
  createProductAPI,
  updateProductDetailsAPI,
  deleteProductAPI,
  createSectionAPI,
  updateSectionDetailsAPI,
  deleteSectionAPI,
  createLessonAPI,
  updateLessonDetailsAPI,
  deleteLessonAPI,
  getAllProductsByUserIdAPI,
  getProductByProductIdAPI,
  getAllProductsMinimalAPI,
  fetchProducts,
  getAllProductsMinimalByUserAPI,
  addImageToProductAPI,
  getPresignedUrlAPI,
  uploadToPresignedUrl,
  confirmFileUploadAPI,
} from './products-api';

jest.mock('../../http-client');
jest.mock('../../../utils/cookie.util', () => ({
  getCookie: jest.fn(),
}));

const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;
const mockedGetCookie = getCookie as jest.MockedFunction<typeof getCookie>;

describe('Products API', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const errorLogSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterAll(() => {
    errorLogSpy.mockRestore();
    global.fetch = originalFetch;
  });

  describe('createProductAPI', () => {
    it('POSTs payload with withCredentials:true and returns data', async () => {
      const payload = { id: 'p1', type: 'COURSE' } as any;
      const resp = { id: 'p1' };
      mockedHttpClient.post.mockResolvedValueOnce({ data: resp });

      await expect(createProductAPI(payload)).resolves.toEqual(resp);
      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        'api/products',
        payload,
        { withCredentials: true },
      );
    });

    it('rethrows and logs on error', async () => {
      const err = new Error('create failed');
      mockedHttpClient.post.mockRejectedValueOnce(err);

      await expect(createProductAPI({} as any)).rejects.toThrow(
        'create failed',
      );
      expect(errorLogSpy).toHaveBeenCalled();
    });
  });

  describe('updateProductDetailsAPI', () => {
    it('PUTs payload with withCredentials:true and returns data', async () => {
      const payload = { id: 'p1', title: 'New' } as any;
      const resp = { ...payload };
      mockedHttpClient.put.mockResolvedValueOnce({ data: resp });

      await expect(updateProductDetailsAPI(payload)).resolves.toEqual(resp);
      expect(mockedHttpClient.put).toHaveBeenCalledWith(
        'api/products',
        payload,
        { withCredentials: true },
      );
    });

    it('rethrows and logs on error', async () => {
      const err = new Error('update failed');
      mockedHttpClient.put.mockRejectedValueOnce(err);

      await expect(updateProductDetailsAPI({} as any)).rejects.toThrow(
        'update failed',
      );
      expect(errorLogSpy).toHaveBeenCalled();
    });
  });

  describe('deleteProductAPI', () => {
    it('DELETEs with composed query and returns data', async () => {
      const payload = { userId: 'u1', productType: 'COURSE', id: 'p1' } as any;
      mockedHttpClient.delete.mockResolvedValueOnce({ data: 'ok' });

      await expect(deleteProductAPI(payload)).resolves.toEqual('ok');
      expect(mockedHttpClient.delete).toHaveBeenCalledWith(
        'api/products?userId=u1&productType=COURSE&id=p1',
      );
    });

    it('rethrows and logs on error', async () => {
      const err = new Error('delete failed');
      mockedHttpClient.delete.mockRejectedValueOnce(err);

      await expect(
        deleteProductAPI({
          userId: 'u',
          productType: 'COURSE',
          id: 'x',
        } as any),
      ).rejects.toThrow('delete failed');
      expect(errorLogSpy).toHaveBeenCalled();
    });
  });

  describe('Sections', () => {
    it('createSectionAPI posts with withCredentials:true', async () => {
      const payload = { courseId: 'c1', title: 'S1' } as any;
      const resp = { id: 's1' };
      mockedHttpClient.post.mockResolvedValueOnce({ data: resp });

      await expect(createSectionAPI(payload)).resolves.toEqual(resp);
      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        'api/products/course/section',
        payload,
        { withCredentials: true },
      );
    });

    it('updateSectionDetailsAPI puts with withCredentials:true', async () => {
      const payload = { id: 's1', title: 'Renamed' } as any;
      mockedHttpClient.put.mockResolvedValueOnce({ data: 'ok' });

      await expect(updateSectionDetailsAPI(payload)).resolves.toEqual('ok');
      expect(mockedHttpClient.put).toHaveBeenCalledWith(
        'api/products/course/section',
        payload,
        { withCredentials: true },
      );
    });

    it('deleteSectionAPI deletes with correct query', async () => {
      mockedHttpClient.delete.mockResolvedValueOnce({ data: 'ok' });

      await expect(
        deleteSectionAPI({ userId: 'u1', id: 's1' } as any),
      ).resolves.toEqual('ok');
      expect(mockedHttpClient.delete).toHaveBeenCalledWith(
        'api/products/course/section?userId=u1&id=s1',
      );
    });
  });

  describe('Lessons', () => {
    it('createLessonAPI posts with withCredentials:true', async () => {
      const payload = { sectionId: 's1', title: 'L1' } as any;
      const resp = { id: 'l1' };
      mockedHttpClient.post.mockResolvedValueOnce({ data: resp });

      await expect(createLessonAPI(payload)).resolves.toEqual(resp);
      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        'api/products/course/section/lesson',
        payload,
        { withCredentials: true },
      );
    });

    it('updateLessonDetailsAPI puts with withCredentials:true', async () => {
      const payload = { id: 'l1', title: 'New' } as any;
      mockedHttpClient.put.mockResolvedValueOnce({ data: 'ok' });

      await expect(updateLessonDetailsAPI(payload)).resolves.toEqual('ok');
      expect(mockedHttpClient.put).toHaveBeenCalledWith(
        'api/products/course/section/lesson',
        payload,
        { withCredentials: true },
      );
    });

    it('deleteLessonAPI deletes with correct query', async () => {
      mockedHttpClient.delete.mockResolvedValueOnce({ data: 'ok' });

      await expect(
        deleteLessonAPI({ userId: 'u1', id: 'l1' } as any),
      ).resolves.toEqual('ok');
      expect(mockedHttpClient.delete).toHaveBeenCalledWith(
        'api/products/course/section/lesson?userId=u1&id=l1',
      );
    });
  });

  describe('Queries', () => {
    it('getAllProductsByUserIdAPI GETs with userId query', async () => {
      const list = [{ id: 'p1' }];
      mockedHttpClient.get.mockResolvedValueOnce({ data: list });

      await expect(getAllProductsByUserIdAPI('u1')).resolves.toEqual(list);
      expect(mockedHttpClient.get).toHaveBeenCalledWith(
        'api/products?userId=u1',
      );
    });

    it('getProductByProductIdAPI GETs with productId & type', async () => {
      const p = { id: 'p1' };
      mockedHttpClient.get.mockResolvedValueOnce({ data: p });

      await expect(
        getProductByProductIdAPI('p1', 'COURSE' as any),
      ).resolves.toEqual(p);
      expect(mockedHttpClient.get).toHaveBeenCalledWith(
        'api/products/getProduct?productId=p1&type=COURSE',
      );
    });

    it('getAllProductsMinimalAPI GETs min list', async () => {
      const arr = [{ id: 'm1' }];
      mockedHttpClient.get.mockResolvedValueOnce({ data: arr });

      await expect(getAllProductsMinimalAPI()).resolves.toEqual(arr);
      expect(mockedHttpClient.get).toHaveBeenCalledWith(
        'api/products/get-all-products-min',
      );
    });

    it('fetchProducts builds query with default sort createdAt,desc', async () => {
      const resp = { content: [], totalElements: 0 } as any;
      mockedHttpClient.get.mockResolvedValueOnce({ data: resp });

      await expect(
        fetchProducts({ term: 'react', page: 1, size: 20 }),
      ).resolves.toEqual(resp);

      // The exact query string should be constructed in the call:
      // /api/products/search?term=react&page=1&size=20&sort=createdAt,desc
      const call = mockedHttpClient.get.mock.calls[0][0] as string;
      expect(call).toContain('/api/products/search?');
      expect(call).toContain('term=react');
      expect(call).toContain('page=1');
      expect(call).toContain('size=20');
      expect(call).toContain('sort=createdAt%2Cdesc'); // comma is URL-encoded
    });

    it('fetchProducts builds query with provided sort field + order', async () => {
      const resp = { content: [], totalElements: 0 } as any;
      mockedHttpClient.get.mockResolvedValueOnce({ data: resp });

      await fetchProducts({
        term: 'react',
        page: 2,
        size: 10,
        sort: { field: 'title' as any, order: 'asc' },
      });

      const call = mockedHttpClient.get.mock.calls[0][0] as string;
      expect(call).toContain('page=2');
      expect(call).toContain('size=10');
      expect(call).toContain('sort=title%2Casc');
    });

    it('getAllProductsMinimalByUserAPI GETs with userId query', async () => {
      const arr = [{ id: 'm1' }];
      mockedHttpClient.get.mockResolvedValueOnce({ data: arr });

      await expect(getAllProductsMinimalByUserAPI('u1')).resolves.toEqual(arr);
      expect(mockedHttpClient.get).toHaveBeenCalledWith(
        'api/products/get-all-products-min?userId=u1',
      );
    });
  });

  describe('Media & files', () => {
    it('addImageToProductAPI POSTs file with productId', async () => {
      const file = new File(['abc'], 'a.png', { type: 'image/png' });
      mockedHttpClient.post.mockResolvedValueOnce({ data: 'ok' });

      await expect(addImageToProductAPI(file, 'p1')).resolves.toEqual('ok');
      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        'api/products/image?productId=p1',
        file,
      );
    });

    it('getPresignedUrlAPI GETs with params', async () => {
      const data = {
        fileId: 'f1',
        presignedUrl: 'https://s3/presigned',
        key: 'k',
        fileUrl: 'https://cdn/file',
      };
      mockedHttpClient.get.mockResolvedValueOnce({ data });

      await expect(getPresignedUrlAPI('s1', 'doc.pdf')).resolves.toEqual(data);
      expect(mockedHttpClient.get).toHaveBeenCalledWith(
        '/api/files/presigned-url',
        {
          params: {
            sectionId: 's1',
            folderType: 'DOWNLOAD_SECTION_FILES',
            filename: 'doc.pdf',
          },
        },
      );
    });

    describe('uploadToPresignedUrl', () => {
      it('calls fetch PUT with file and returns response on ok', async () => {
        const file = new File(['data'], 'doc.pdf', { type: 'application/pdf' });
        const mockResp = { ok: true, status: 200 } as any;
        (global.fetch as jest.Mock).mockResolvedValueOnce(mockResp);

        const resp = await uploadToPresignedUrl('https://s3/presigned', file);
        expect(global.fetch).toHaveBeenCalledWith('https://s3/presigned', {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        expect(resp).toBe(mockResp);
      });

      it('throws when response.ok is false and logs', async () => {
        const file = new File(['data'], 'doc.pdf', { type: 'application/pdf' });
        const mockResp = { ok: false, status: 403 } as any;
        (global.fetch as jest.Mock).mockResolvedValueOnce(mockResp);

        await expect(
          uploadToPresignedUrl('https://s3/presigned', file),
        ).rejects.toThrow('File upload to presigned URL failed');
        expect(errorLogSpy).toHaveBeenCalled();
      });
    });

    describe('confirmFileUploadAPI', () => {
      it('POSTs payload with CSRF header and withCredentials:true', async () => {
        mockedGetCookie.mockReturnValue('csrf123');
        const payload = {
          fileId: 'f1',
          sectionId: 's1',
          fileName: 'doc.pdf',
        } as any;
        const serverResp = { fileId: 'f1', url: 'https://cdn/doc.pdf' };
        mockedHttpClient.post.mockResolvedValueOnce({ data: serverResp });

        await expect(confirmFileUploadAPI(payload)).resolves.toEqual(
          serverResp,
        );
        expect(mockedHttpClient.post).toHaveBeenCalledWith(
          '/api/files/confirm-upload',
          payload,
          {
            withCredentials: true,
            headers: { 'X-XSRF-TOKEN': 'csrf123' },
          },
        );
      });

      it('uses empty CSRF header when cookie missing and rethrows errors', async () => {
        mockedGetCookie.mockReturnValue(null as any);
        const err = new Error('confirm failed');
        mockedHttpClient.post.mockRejectedValueOnce(err);

        await expect(confirmFileUploadAPI({} as any)).rejects.toThrow(
          'confirm failed',
        );
        // ensure header still present (empty string)
        const call = mockedHttpClient.post.mock.calls[0];
        expect(call[2]).toMatchObject({
          headers: { 'X-XSRF-TOKEN': '' },
          withCredentials: true,
        });
        expect(errorLogSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Error logging parity (spot checks)', () => {
    it('logs on getAllProductsMinimalAPI error', async () => {
      const err = new Error('boom');
      mockedHttpClient.get.mockRejectedValueOnce(err);

      await expect(getAllProductsMinimalAPI()).rejects.toThrow('boom');
      expect(errorLogSpy).toHaveBeenCalled();
    });

    it('logs on getPresignedUrlAPI error', async () => {
      const err = new Error('net');
      mockedHttpClient.get.mockRejectedValueOnce(err);

      await expect(getPresignedUrlAPI('s', 'f')).rejects.toThrow('net');
      expect(errorLogSpy).toHaveBeenCalled();
    });
  });
});
