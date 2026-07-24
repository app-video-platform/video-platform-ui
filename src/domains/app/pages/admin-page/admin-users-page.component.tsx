import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, UserRole } from 'core/api/models';
import {
  fetchAdminUsers,
  selectAdminError,
  selectAdminLoading,
  selectAdminUsersPage,
  selectRoleUpdatingUserId,
  updateAdminUserRole,
} from 'core/store/admin-store';

import './admin-page.styles.scss';

const roles = [UserRole.ADMIN, UserRole.CREATOR, UserRole.USER];

const AdminUsersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const usersPage = useSelector(selectAdminUsersPage);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);
  const roleUpdatingUserId = useSelector(selectRoleUpdatingUserId);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchAdminUsers({ search, role, page, size: 20 }));
  }, [dispatch, search, role, page]);

  const handleRoleChange = (userId: string, nextRole: UserRole) => {
    dispatch(updateAdminUserRole({ userId, role: nextRole }));
  };

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1>Users</h1>
        <p>Role changes replace the user role and force re-login.</p>
      </header>

      <div className="admin-toolbar">
        <input
          aria-label="Search users"
          placeholder="Search name or email"
          value={search}
          onChange={(event) => {
            setPage(0);
            setSearch(event.target.value);
          }}
        />
        <select
          aria-label="Filter by role"
          value={role}
          onChange={(event) => {
            setPage(0);
            setRole(event.target.value as UserRole | '');
          }}
        >
          <option value="">All roles</option>
          {roles.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {loading && <p>Loading...</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Provider</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {usersPage?.content.map((user) => {
              const currentRole = user.roles[0] ?? UserRole.USER;
              return (
                <tr key={user.id}>
                  <td>{`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      aria-label={`Role for ${user.email}`}
                      value={currentRole}
                      disabled={roleUpdatingUserId === user.id}
                      onChange={(event) =>
                        handleRoleChange(user.id, event.target.value as UserRole)
                      }
                    >
                      {roles.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{user.authProvider ?? 'manual'}</td>
                  <td>{user.enabled === false ? 'Disabled' : 'Enabled'}</td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="admin-pagination">
        <button disabled={page === 0} onClick={() => setPage((value) => value - 1)}>
          Previous
        </button>
        <span>
          Page {usersPage ? usersPage.number + 1 : page + 1} of{' '}
          {usersPage?.totalPages || 1}
        </span>
        <button
          disabled={Boolean(usersPage?.last)}
          onClick={() => setPage((value) => value + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default AdminUsersPage;
