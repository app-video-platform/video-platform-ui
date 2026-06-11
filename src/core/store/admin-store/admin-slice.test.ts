import { UserRole } from 'core/api/models';
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
    const productsPage = {
      content: [{ id: 'product-1', title: 'Course', type: 'COURSE' }],
      totalElements: 1,
      totalPages: 1,
      size: 20,
      number: 0,
      first: true,
      last: true,
      empty: false,
    };

    const state = adminReducer(initialState, {
      type: fetchAdminProducts.fulfilled.type,
      payload: productsPage,
    });

    expect(state.productsPage).toEqual(productsPage);
  });
});
