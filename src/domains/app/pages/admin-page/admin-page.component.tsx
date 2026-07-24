import React from 'react';
import { Link } from 'react-router-dom';

import './admin-page.styles.scss';

const AdminPage: React.FC = () => (
  <section className="admin-page">
    <header className="admin-page__header">
      <h1>Admin</h1>
      <p>Manage platform users, products, and admin audit history.</p>
    </header>

    <div className="admin-page__grid">
      <Link className="admin-page__tile" to="/app/admin/users">
        <span>Users</span>
        <small>Search users and change their single platform role.</small>
      </Link>
      <Link className="admin-page__tile" to="/app/admin/products">
        <span>Products</span>
        <small>View, edit, delete, and create products for creators.</small>
      </Link>
      <Link className="admin-page__tile" to="/app/admin/audit">
        <span>Audit</span>
        <small>Review admin role and product management actions.</small>
      </Link>
    </div>
  </section>
);

export default AdminPage;
