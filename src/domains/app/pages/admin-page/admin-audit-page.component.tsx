import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch } from 'core/api/models';
import {
  fetchAdminAuditLogs,
  selectAdminAuditPage,
  selectAdminError,
  selectAdminLoading,
} from 'core/store/admin-store';

import './admin-page.styles.scss';

const AdminAuditPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auditPage = useSelector(selectAdminAuditPage);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);
  const [action, setAction] = useState('');
  const [targetType, setTargetType] = useState('');
  const [targetId, setTargetId] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(
      fetchAdminAuditLogs({ action, targetType, targetId, page, size: 20 }),
    );
  }, [dispatch, action, targetType, targetId, page]);

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1>Audit</h1>
        <p>Admin role changes and admin product actions.</p>
      </header>

      <div className="admin-toolbar">
        <input
          aria-label="Action"
          placeholder="Action"
          value={action}
          onChange={(event) => {
            setPage(0);
            setAction(event.target.value);
          }}
        />
        <input
          aria-label="Target type"
          placeholder="Target type"
          value={targetType}
          onChange={(event) => {
            setPage(0);
            setTargetType(event.target.value);
          }}
        />
        <input
          aria-label="Target id"
          placeholder="Target id"
          value={targetId}
          onChange={(event) => {
            setPage(0);
            setTargetId(event.target.value);
          }}
        />
      </div>

      {error && <p className="admin-error">{error}</p>}
      {loading && <p>Loading...</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Target</th>
              <th>Before</th>
              <th>After</th>
            </tr>
          </thead>
          <tbody>
            {auditPage?.content.map((entry) => (
              <tr key={entry.id}>
                <td>{new Date(entry.createdAt).toLocaleString()}</td>
                <td>{entry.actorUserId}</td>
                <td>{entry.action}</td>
                <td>
                  <span>{entry.targetType}</span>
                  <small>{entry.targetId}</small>
                </td>
                <td>{entry.beforeSummary ?? '-'}</td>
                <td>{entry.afterSummary ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-pagination">
        <button disabled={page === 0} onClick={() => setPage((value) => value - 1)}>
          Previous
        </button>
        <span>
          Page {auditPage ? auditPage.number + 1 : page + 1} of{' '}
          {auditPage?.totalPages || 1}
        </span>
        <button
          disabled={Boolean(auditPage?.last)}
          onClick={() => setPage((value) => value + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default AdminAuditPage;
