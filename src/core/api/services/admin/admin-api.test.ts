import httpClient from 'core/api/http-client';
import { ProductType, UserRole } from 'core/api/models';
import {
  getAdminAuditAPI,
  getAdminProductsAPI,
  getAdminUsersAPI,
  updateAdminUserRoleAPI,
} from './admin-api';

jest.mock('core/api/http-client');

const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('Admin API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads admin users with search and role filters', async () => {
    mockedHttpClient.get.mockResolvedValueOnce({
      data: { content: [], totalElements: 0, totalPages: 0 },
    });

    await getAdminUsersAPI({
      search: 'ada',
      role: UserRole.CREATOR,
      page: 1,
      size: 10,
    });

    expect(mockedHttpClient.get).toHaveBeenCalledWith(
      'api/admin/users?page=1&size=10&sort=createdAt%2Cdesc&search=ada&role=CREATOR',
      { withCredentials: true },
    );
  });

  it('updates a user role through the admin endpoint', async () => {
    const response = {
      id: 'user-1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.test',
      roles: [UserRole.ADMIN],
    };
    mockedHttpClient.patch.mockResolvedValueOnce({ data: response });

    await expect(
      updateAdminUserRoleAPI('user-1', { role: UserRole.ADMIN }),
    ).resolves.toEqual(response);

    expect(mockedHttpClient.patch).toHaveBeenCalledWith(
      'api/admin/users/user-1/role',
      { role: UserRole.ADMIN },
      { withCredentials: true },
    );
  });

  it('loads admin products with owner and product filters', async () => {
    mockedHttpClient.get.mockResolvedValueOnce({
      data: {
        content: [{ id: 'p1', title: 'Course', type: 'COURSE' as ProductType }],
        totalElements: 1,
        totalPages: 1,
      },
    });

    const result = await getAdminProductsAPI({
      search: 'course',
      ownerId: 'creator-1',
      type: 'COURSE',
      status: 'DRAFT',
      page: 2,
      size: 5,
    });

    expect(result.content[0].id).toBe('p1');
    expect(mockedHttpClient.get).toHaveBeenCalledWith(
      'api/admin/products?page=2&size=5&sort=createdAt%2Cdesc&search=course&ownerId=creator-1&type=COURSE&status=DRAFT',
      { withCredentials: true },
    );
  });

  it('loads audit entries with filters', async () => {
    mockedHttpClient.get.mockResolvedValueOnce({
      data: { content: [], totalElements: 0, totalPages: 0 },
    });

    await getAdminAuditAPI({ action: 'ROLE_CHANGE', targetType: 'USER' });

    expect(mockedHttpClient.get).toHaveBeenCalledWith(
      'api/admin/audit?page=0&size=20&action=ROLE_CHANGE&targetType=USER',
      { withCredentials: true },
    );
  });
});
