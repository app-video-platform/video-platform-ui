import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  AdminUser,
  AppDispatch,
  ProductStatus,
  ProductType,
  UserRole,
} from 'core/api/models';
import { getAdminUsersAPI } from 'core/api/services';
import {
  fetchAdminProducts,
  selectAdminProductsQueryKey,
  selectAdminProductsError,
  selectAdminProductsLoading,
  selectAdminProductsPage,
} from 'core/store/admin-store';
import { deleteProduct } from 'core/store/product-store';
import { PRODUCT_FILTER_OPTIONS } from 'core/constants';

import './admin-page.styles.scss';

const productTypes: ProductType[] = PRODUCT_FILTER_OPTIONS.map(
  (option) => option.type,
);
const productStatuses: ProductStatus[] = ['DRAFT', 'PUBLISHED', 'HIDDEN'];

const AdminProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const storedPage = useSelector(selectAdminProductsPage);
  const queryKey = useSelector(selectAdminProductsQueryKey);
  const loading = useSelector(selectAdminProductsLoading);
  const error = useSelector(selectAdminProductsError);
  const [search, setSearch] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [type, setType] = useState<ProductType | ''>('');
  const [status, setStatus] = useState<ProductStatus | ''>('');
  const [page, setPage] = useState(0);
  const [creators, setCreators] = useState<AdminUser[]>([]);
  const [selectedCreatorId, setSelectedCreatorId] = useState('');

  const latestQuery = useRef({ search, ownerId, type, status, page, size: 20 });
  latestQuery.current = { search, ownerId, type, status, page, size: 20 };
  const queryMatches = queryKey === JSON.stringify({ search, ownerId, type, status, page, size: 20 });
  const productsPage = queryMatches ? storedPage : null;

  useEffect(() => {
    dispatch(
      fetchAdminProducts({ search, ownerId, type, status, page, size: 20 }),
    );
  }, [dispatch, search, ownerId, type, status, page]);

  useEffect(() => {
    getAdminUsersAPI({ role: UserRole.CREATOR, page: 0, size: 100 })
      .then((response) => setCreators(response.content))
      .catch(() => setCreators([]));
  }, []);

  const refreshCurrentPage = () => {
    dispatch(fetchAdminProducts(latestQuery.current));
  };

  const handleDelete = (productId?: string) => {
    if (!productId || !window.confirm('Delete this product?')) {
      return;
    }
    dispatch(deleteProduct({ productId }))
      .unwrap()
      .then(refreshCurrentPage);
  };

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1>Products</h1>
        <p>Admins can manage every product and create products for creators.</p>
      </header>

      <div className="admin-toolbar">
        <input
          aria-label="Search products"
          placeholder="Search products"
          value={search}
          onChange={(event) => {
            setPage(0);
            setSearch(event.target.value);
          }}
        />
        <input
          aria-label="Owner id"
          placeholder="Owner id"
          value={ownerId}
          onChange={(event) => {
            setPage(0);
            setOwnerId(event.target.value);
          }}
        />
        <select
          aria-label="Filter by type"
          value={type}
          onChange={(event) => {
            setPage(0);
            setType(event.target.value as ProductType | '');
          }}
        >
          <option value="">All types</option>
          {productTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(event) => {
            setPage(0);
            setStatus(event.target.value as ProductStatus | '');
          }}
        >
          <option value="">All statuses</option>
          {productStatuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-create-row">
        <select
          aria-label="Creator owner"
          value={selectedCreatorId}
          onChange={(event) => setSelectedCreatorId(event.target.value)}
        >
          <option value="">Select creator owner</option>
          {creators.map((creator) => (
            <option key={creator.id} value={creator.id}>
              {`${creator.firstName ?? ''} ${creator.lastName ?? ''}`.trim() ||
                creator.email}
            </option>
          ))}
        </select>
        <button
          disabled={!selectedCreatorId}
          onClick={() =>
            navigate(`/app/admin/products/create?ownerId=${selectedCreatorId}`)
          }
        >
          Create product
        </button>
      </div>

      {queryMatches && error && <p className="admin-error" role="alert">{error}
        <button onClick={() => dispatch(fetchAdminProducts({ search, ownerId, type, status, page, size: 20 }))}>Retry</button></p>}
      {(loading || !queryMatches) && <p role="status">Loading...</p>}

      {queryMatches && !loading && !error && productsPage?.content.length === 0 && <p>No results found.</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Owner</th>
              <th>Type</th>
              <th>Status</th>
              <th>Price</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && productsPage?.content.map((product) => (
              <tr key={product.id}>
                <td>{product.title}</td>
                <td>
                  <span>{product.createdByName ?? '-'}</span>
                  <small>{product.createdById}</small>
                </td>
                <td>{product.type}</td>
                <td>{product.status}</td>
                <td>{product.price ?? 'free'}</td>
                <td>
                  {product.updatedAt
                    ? new Date(product.updatedAt).toLocaleString()
                    : '-'}
                </td>
                <td className="admin-table__actions">
                  <button onClick={() => navigate(`/app/product/${product.id}`)}>
                    View
                  </button>
                  <button onClick={() => navigate(`/app/products/edit/${product.id}`)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-pagination">
        <button disabled={loading || !queryMatches || page === 0} onClick={() => setPage((value) => value - 1)}>
          Previous
        </button>
        <span>
          Page {productsPage ? productsPage.number + 1 : page + 1} of{' '}
          {productsPage?.totalPages || 1}
        </span>
        <button
          disabled={loading || !queryMatches || Boolean(productsPage?.last)}
          onClick={() => setPage((value) => value + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default AdminProductsPage;
