import { AdminProductsPage, UserRole } from 'core/api/models';
import adminReducer, {
  fetchAdminProducts,
  fetchAdminUsers,
  updateAdminUserRole,
} from './admin.slice';

const initialState = {
  usersPage: null,
  productsPage: null,
  auditPage: null,
  loading: false,
  roleUpdatingUserId: null,
  error: null,
};

describe('admin slice', () => {
  it('stores loaded users', () => {
    const usersPage = {
      content: [
        {
          id: 'user-1',
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.test',
          roles: [UserRole.USER],
        },
      ],
      totalElements: 1,
      totalPages: 1,
      size: 20,
      number: 0,
      first: true,
      last: true,
      empty: false,
    };

    const state = adminReducer(initialState, {
      type: fetchAdminUsers.fulfilled.type,
      payload: usersPage,
    });

    expect(state.usersPage).toEqual(usersPage);
    expect(state.loading).toBe(false);
  });

  it('replaces a user after role update', () => {
    const stateWithUsers = {
      ...initialState,
      usersPage: {
        content: [
          {
            id: 'user-1',
            firstName: 'Ada',
            lastName: 'Lovelace',
            email: 'ada@example.test',
            roles: [UserRole.USER],
          },
        ],
        totalElements: 1,
        totalPages: 1,
        size: 20,
        number: 0,
        first: true,
        last: true,
        empty: false,
      },
      roleUpdatingUserId: 'user-1',
    };

    const state = adminReducer(stateWithUsers, {
      type: updateAdminUserRole.fulfilled.type,
      payload: {
        id: 'user-1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.test',
        roles: [UserRole.CREATOR],
      },
    });

    expect(state.roleUpdatingUserId).toBeNull();
    expect(state.usersPage?.content[0].roles).toEqual([UserRole.CREATOR]);
  });

  it('stores loaded admin products', () => {
    const productsPage: AdminProductsPage = {
      content: [{ id: 'product-1', title: 'Course', type: 'COURSE' }],
      totalElements: 1,
      totalPages: 1,
      size: 20,
      number: 0,
      first: true,
      last: true,
      empty: false,
    };

    const pending = adminReducer(initialState, fetchAdminProducts.pending('products', {}));
    const state = adminReducer(pending, fetchAdminProducts.fulfilled(productsPage, 'products', {}));

    expect(state.productsPage).toEqual(productsPage);
  });

  it('keeps Product and Audit request status independent from the Users channel', () => {
    const usersPending = adminReducer(initialState, fetchAdminUsers.pending('users', {}));
    const productsPending = adminReducer(usersPending, fetchAdminProducts.pending('products', {}));
    expect(productsPending.loading).toBe(true);

    const productsFulfilled = adminReducer(
      productsPending,
      fetchAdminProducts.fulfilled({
        content: [], totalElements: 0, totalPages: 0, size: 20, number: 0,
        first: true, last: true, empty: true,
      }, 'products', {}),
    );
    expect(productsFulfilled.loading).toBe(true);

    const productsRejected = adminReducer(
      productsPending,
      fetchAdminProducts.rejected(null, 'products', {}, 'Product failure'),
    );
    expect(productsRejected.loading).toBe(true);
    expect(productsRejected.error).toBeNull();
  });
});
