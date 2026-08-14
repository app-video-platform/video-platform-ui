import httpClient from '../../http-client';
import {
  enrollInFreeProductAPI,
  getMyEntitlementsAPI,
  getProductAccessAPI,
  getProductFileDownloadAPI,
} from './entitlements-api';

jest.mock('../../http-client');

const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('Entitlements API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('enrolls in a free product', async () => {
    const entitlement = {
      id: 'entitlement-1',
      source: 'FREE_ENROLLMENT' as const,
      createdAt: '2026-07-24T10:00:00Z',
      product: { id: 'product-1', title: 'Course', type: 'COURSE' as const },
    };
    mockedHttpClient.post.mockResolvedValueOnce({ data: entitlement });

    await expect(enrollInFreeProductAPI('product-1')).resolves.toEqual(
      entitlement,
    );
    expect(mockedHttpClient.post).toHaveBeenCalledWith(
      'api/entitlements/products/product-1/enroll',
    );
  });

  it('loads the current user library with an optional type filter', async () => {
    mockedHttpClient.get.mockResolvedValueOnce({ data: [] });

    await expect(getMyEntitlementsAPI({ type: 'DOWNLOAD' })).resolves.toEqual(
      [],
    );
    expect(mockedHttpClient.get).toHaveBeenCalledWith(
      'api/entitlements/me',
      { params: { type: 'DOWNLOAD' } },
    );
  });

  it('checks product access', async () => {
    mockedHttpClient.get.mockResolvedValueOnce({
      data: { hasAccess: true, reason: 'ACCESS_GRANTED' },
    });

    await expect(getProductAccessAPI('product-1')).resolves.toEqual({
      hasAccess: true,
      reason: 'ACCESS_GRANTED',
    });
    expect(mockedHttpClient.get).toHaveBeenCalledWith(
      'api/entitlements/products/product-1/access',
    );
  });

  it('requests a short-lived product download URL', async () => {
    mockedHttpClient.get.mockResolvedValueOnce({
      data: { url: 'https://signed.example/file' },
    });

    await expect(
      getProductFileDownloadAPI('product-1', 'file-1'),
    ).resolves.toEqual({ url: 'https://signed.example/file' });
    expect(mockedHttpClient.get).toHaveBeenCalledWith(
      'api/entitlements/products/product-1/files/file-1/download',
    );
  });
});
