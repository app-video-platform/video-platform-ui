import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BiSort } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';
import { MdOutlineCalendarToday, MdOutlineFilterList } from 'react-icons/md';
import { SiStatuspal } from 'react-icons/si';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Drawer, Input, Select, SelectOption, StatusBadge } from '@shared/ui';
import { AppDispatch, SalesOrderDetail, SalesOrderListItem } from 'core/api/models';
import {
  clearCurrentOrder,
  fetchCreatorOrderDetail,
  fetchCreatorOrdersPage,
  fetchCreatorSalesSummary,
  selectCreatorOrderProductOptions,
  selectCreatorOrders,
  selectCreatorOrdersError,
  selectCreatorOrdersLoading,
  selectCreatorOrdersPage,
  selectCreatorSalesSummary,
  selectCreatorSalesSummaryError,
  selectCurrentCreatorOrder,
} from 'core/store/sales-store';

import {
  defaultSalesFilterForm,
  formatSalesDateTime,
  formatSalesMoney,
  formatSalesShortDate,
  orderStatusLabel,
  orderStatusTone,
  orderTypeLabel,
  salesPeriodOptions,
  salesSortOptions,
  salesStatusOptions,
  subscriptionStateLabel,
} from './creator-sales.utils';

import './sales-page.styles.scss';

const PAGE_SIZE = 6;

const trendSymbol: Record<string, string> = {
  up: '↑',
  down: '↓',
  flat: '—',
};

const SalesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedOrderId = searchParams.get('order');
  const summary = useSelector(selectCreatorSalesSummary);
  const summaryError = useSelector(selectCreatorSalesSummaryError);
  const ordersPage = useSelector(selectCreatorOrdersPage);
  const orders = useSelector(selectCreatorOrders);
  const productFilterOptions = useSelector(selectCreatorOrderProductOptions);
  const ordersLoading = useSelector(selectCreatorOrdersLoading);
  const ordersError = useSelector(selectCreatorOrdersError);
  const currentOrder = useSelector(selectCurrentCreatorOrder);
  const [filterForm, setFilterForm] = useState(defaultSalesFilterForm);
  const [page, setPage] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCreatorSalesSummary({ period: filterForm.period }));
  }, [dispatch, filterForm.period]);

  useEffect(() => {
    dispatch(
      fetchCreatorOrdersPage({
        page,
        pageSize: PAGE_SIZE,
        search: filterForm.search,
        status: filterForm.status,
        product: filterForm.product,
        period: filterForm.period,
        sort: filterForm.sort,
      }),
    );
  }, [dispatch, filterForm, page]);

  useEffect(() => {
    if (selectedOrderId) {
      dispatch(fetchCreatorOrderDetail(selectedOrderId));
      return;
    }

    dispatch(clearCurrentOrder());
  }, [dispatch, selectedOrderId]);

  const productOptions = useMemo<SelectOption[]>(
    () => [
      { label: 'All products', value: 'all' },
      ...productFilterOptions
        .filter((product) => Boolean(product.id))
        .map((product) => ({
          label: product.name,
          value: product.id ?? '',
        })),
    ],
    [productFilterOptions],
  );
  const selectedOrder =
    currentOrder?.id === selectedOrderId ? currentOrder : undefined;

  const hasSearch = filterForm.search.trim().length > 0;
  const hasFilters = filterForm.status !== 'all' || filterForm.product !== 'all';
  const activeFilterCount =
    Number(filterForm.status !== 'all') + Number(filterForm.product !== 'all');
  const hasActiveRefinement = hasSearch || hasFilters;
  const totalPages = ordersPage?.totalPages ?? 1;
  const currentPage = ordersPage?.number ?? page;
  const totalElements = ordersPage?.totalElements ?? 0;
  const hasOrders = totalElements > 0;
  const hasControls =
    productFilterOptions.length > 0 || orders.length > 0 || hasActiveRefinement;
  const resultCountLabel = `${totalElements} ${
    totalElements === 1 ? 'order' : 'orders'
  }`;

  const handleControlChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setPage(0);
    setFilterForm((current) => ({ ...current, [name]: value }));
  };

  const clearSearch = () => {
    setPage(0);
    setFilterForm((current) => ({ ...current, search: '' }));
  };

  const clearFilters = () => {
    setPage(0);
    setFilterForm(defaultSalesFilterForm);
  };

  const openOrder = (orderId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('order', orderId);
    setSearchParams(nextParams);
  };

  const closeOrder = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('order');
    setSearchParams(nextParams);
  };

  const renderFilters = (compact = false) => (
    <div className={compact ? 'sales-filter-stack' : 'sales-toolbar__filters'}>
      <Select
        name="period"
        value={filterForm.period}
        options={salesPeriodOptions}
        onChange={handleControlChange}
        customClassName="sales-toolbar__select"
        prefixIcon={MdOutlineCalendarToday}
        aria-label="Select sales date range"
      />
      <Select
        name="status"
        value={filterForm.status}
        options={salesStatusOptions}
        onChange={handleControlChange}
        customClassName="sales-toolbar__select"
        prefixIcon={SiStatuspal}
        aria-label="Filter orders by status"
      />
      <Select
        name="product"
        value={filterForm.product}
        options={productOptions}
        onChange={handleControlChange}
        customClassName="sales-toolbar__select"
        prefixIcon={MdOutlineFilterList}
        aria-label="Filter orders by product"
      />
      <Select
        name="sort"
        value={filterForm.sort}
        options={salesSortOptions}
        onChange={handleControlChange}
        customClassName="sales-toolbar__select sales-toolbar__sort"
        prefixIcon={BiSort}
        aria-label="Sort orders"
      />
    </div>
  );

  const renderState = (): React.ReactNode => {
    if (ordersLoading && !ordersPage) {
      return (
        <div className="sales-state" role="status">
          <h2>Loading sales</h2>
        </div>
      );
    }

    if (ordersError || summaryError) {
      return (
        <div className="sales-state" role="status">
          <h2>Sales data is not available yet</h2>
          <p>
            Orders will appear here once order, payment, refund, and entitlement
            APIs are connected.
          </p>
        </div>
      );
    }

    if (!hasOrders && !hasActiveRefinement) {
      return (
        <div className="sales-state">
          <h2>No sales yet</h2>
          <p>Orders will appear here when customers purchase your products.</p>
          <Link className="sales-state__link" to="/app/products">
            View products
          </Link>
        </div>
      );
    }

    if (totalElements === 0 && hasSearch) {
      return (
        <div className="sales-state">
          <h2>{`No orders match "${filterForm.search.trim()}".`}</h2>
          <Button type="button" variant="secondary" onClick={clearSearch}>
            Clear search
          </Button>
        </div>
      );
    }

    if (totalElements === 0 && hasFilters) {
      return (
        <div className="sales-state">
          <h2>No orders match these filters.</h2>
          <Button type="button" variant="secondary" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="sales-page">
      <header className="sales-header">
        <div>
          <h1>Sales</h1>
          <p>Track orders, payments, refunds, and failed charges.</p>
        </div>
      </header>

      {summary?.metrics && (
        <section className="sales-metrics" aria-label="Financial summary">
          {summary.metrics.map((metric) => (
            <article
              className={`sales-metric sales-metric--${metric.sentiment}`}
              key={metric.label}
            >
              <span className="sales-metric__label">{metric.label}</span>
              <strong>{metric.value}</strong>
              <span className="sales-metric__trend">
                {trendSymbol[metric.direction]} {metric.comparison}
              </span>
            </article>
          ))}
        </section>
      )}

      {hasControls && (
        <section className="sales-toolbar" aria-label="Sales controls">
          <Input
            value={filterForm.search}
            prefixIcon={FaSearch}
            onChange={handleControlChange}
            placeholder="Search customer, email, or order ID..."
            name="search"
            aria-label="Search customer, email, or order ID"
            className="sales-toolbar__search"
          />
          <div className="sales-toolbar__desktop-filters">{renderFilters()}</div>
          <Button
            type="button"
            variant="secondary"
            className="sales-toolbar__mobile-filter"
            onClick={() => setFiltersOpen(true)}
          >
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </Button>
        </section>
      )}

      {hasControls && (
        <div className="sales-collection-meta">
          <span>{resultCountLabel}</span>
          {hasActiveRefinement && (
            <Button type="button" variant="tertiary" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      )}

      {renderState() || (
        <>
          <section className="sales-ledger" aria-label="Orders ledger">
            <div className="sales-ledger__header" aria-hidden="true">
              <span>Date</span>
              <span>Customer</span>
              <span>Product</span>
              <span>Status</span>
              <span>Type</span>
              <span>Amount</span>
            </div>
            <div className="sales-ledger__rows">
              {orders.map((order) => (
                <OrderLedgerRow
                  key={order.id}
                  order={order}
                  onOpen={() => openOrder(order.id)}
                />
              ))}
            </div>
          </section>

          {totalPages > 1 && (
            <nav className="sales-pagination" aria-label="Order pages">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={currentPage === 0}
                onClick={() => setPage((value) => Math.max(0, value - 1))}
              >
                Previous
              </Button>
              <span>
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={currentPage >= totalPages - 1}
                onClick={() =>
                  setPage((value) => Math.min(totalPages - 1, value + 1))
                }
              >
                Next
              </Button>
            </nav>
          )}
        </>
      )}

      <OrderDetailDrawer order={selectedOrder} open={Boolean(selectedOrder)} onClose={closeOrder} />

      <Drawer
        open={filtersOpen}
        title={<h2 className="sales-filter-title">Filters</h2>}
        onClose={() => setFiltersOpen(false)}
        className="sales-filters-drawer"
      >
        {renderFilters(true)}
      </Drawer>
    </div>
  );
};

interface OrderLedgerRowProps {
  order: SalesOrderListItem;
  onOpen: () => void;
}

const OrderLedgerRow: React.FC<OrderLedgerRowProps> = ({ order, onOpen }) => {
  const customerContent = (
    <>
      <span className="sales-ledger-row__primary">{order.customer.name}</span>
      <span>{order.customer.email}</span>
    </>
  );
  const productContent = (
    <>
      <span className="sales-ledger-row__primary">{order.product.name}</span>
      <span>{order.product.type}</span>
    </>
  );

  return (
    <article className="sales-ledger-row">
      <button
        type="button"
        className="sales-ledger-row__date"
        onClick={onOpen}
        aria-label={`Open ${order.id} order detail`}
      >
        <span>{formatSalesShortDate(order.orderedAt)}</span>
        <span>{order.id}</span>
      </button>

      <div className="sales-ledger-row__customer">
        {order.customer.id ? (
          <Link
            to={`/app/customers/${order.customer.id}`}
            aria-label={`Open ${order.customer.name} customer profile`}
          >
            {customerContent}
          </Link>
        ) : (
          <span className="sales-ledger-row__stack">{customerContent}</span>
        )}
      </div>

      <div className="sales-ledger-row__product">
        {order.product.id ? (
          <Link
            to={`/app/products/edit/${order.product.id}`}
            aria-label={`Open ${order.product.name} workspace`}
          >
            {productContent}
          </Link>
        ) : (
          <span className="sales-ledger-row__stack">{productContent}</span>
        )}
      </div>

      <div className="sales-ledger-row__status">
        <StatusBadge
          label={orderStatusLabel[order.status]}
          tone={orderStatusTone[order.status]}
        />
      </div>
      <div className="sales-ledger-row__type">{orderTypeLabel[order.type]}</div>
      <div className="sales-ledger-row__amount">
        {formatSalesMoney(order.amountCents, order.currency)}
      </div>
    </article>
  );
};

interface OrderDetailDrawerProps {
  order?: SalesOrderDetail;
  open: boolean;
  onClose: () => void;
}

const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = ({
  order,
  open,
  onClose,
}) => {
  if (!order) {
    return null;
  }

  return (
    <Drawer
      open={open}
      title={
        <div className="order-detail-title">
          <span>Order #{order.id}</span>
          <StatusBadge
            label={orderStatusLabel[order.status]}
            tone={orderStatusTone[order.status]}
          />
        </div>
      }
      onClose={onClose}
      className="order-detail-drawer"
    >
      <div className="order-detail">
        <section className="order-detail-hero" aria-label="Order summary">
          <strong>{formatSalesMoney(order.amountCents, order.currency)}</strong>
          <span>{orderTypeLabel[order.type]}</span>
          <time dateTime={order.orderedAt}>{formatSalesDateTime(order.orderedAt)}</time>
        </section>

        <DetailSection title="Customer">
          <p className="order-detail__primary">{order.customer.name}</p>
          <p>{order.customer.email}</p>
          {order.customer.id && (
            <Link to={`/app/customers/${order.customer.id}`}>View customer</Link>
          )}
        </DetailSection>

        <DetailSection title="Product">
          <div className="order-detail-product">
            {order.product.thumbnailUrl && (
              <img src={order.product.thumbnailUrl} alt="" aria-hidden="true" />
            )}
            <div>
              <p className="order-detail__primary">{order.product.name}</p>
              <p>{order.product.type}</p>
              {order.product.id && (
                <Link to={`/app/products/edit/${order.product.id}`}>
                  Open product workspace
                </Link>
              )}
            </div>
          </div>
        </DetailSection>

        <DetailSection title="Payment">
          <DefinitionList
            rows={[
              ['Provider', order.provider],
              ['Payment method', order.paymentMethod],
              ['Transaction ID', order.transactionId],
              ['Payment date', formatSalesDateTime(order.paymentDate)],
              ['Currency', order.currency],
            ]}
          />
        </DetailSection>

        <DetailSection title="Order Summary">
          <DefinitionList
            rows={order.summaryRows.map((row) => [
              row.label,
              formatSalesMoney(row.amountCents, order.currency),
            ])}
          />
        </DetailSection>

        <DetailSection title="Access">
          <p className="order-detail__primary">{order.access.label}</p>
          {order.access.detail && <p>{order.access.detail}</p>}
        </DetailSection>

        {order.subscription && (
          <DetailSection title="Subscription">
            <DefinitionList
              rows={[
                ['Membership', order.product.name],
                [
                  'Billing price',
                  `${formatSalesMoney(
                    order.subscription.priceCents,
                    order.subscription.currency,
                  )} / ${order.subscription.interval}`,
                ],
                ['State', subscriptionStateLabel[order.subscription.state]],
                ['Next billing', formatSalesDateTime(order.subscription.nextBillingAt)],
              ]}
            />
          </DetailSection>
        )}

        {order.refund && (
          <DetailSection title="Refund">
            <DefinitionList
              rows={[
                [
                  'Amount refunded',
                  formatSalesMoney(order.refund.amountCents, order.currency),
                ],
                ['Refund date', formatSalesDateTime(order.refund.refundedAt)],
                ['Reason', order.refund.reason],
                ['Access result', order.access.label],
              ]}
            />
          </DetailSection>
        )}

        {order.failure && (
          <DetailSection title="Failed payment">
            <p className="order-detail__primary">Payment failed</p>
            <p>{order.failure.message}</p>
            {order.failure.retryAt && (
              <p>Retry scheduled {formatSalesDateTime(order.failure.retryAt)}</p>
            )}
          </DetailSection>
        )}
      </div>
    </Drawer>
  );
};

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section className="order-detail-section">
    <h2>{title}</h2>
    {children}
  </section>
);

const DefinitionList: React.FC<{ rows: Array<[string, string | undefined]> }> = ({
  rows,
}) => {
  const visibleRows = rows.filter(([, value]) => Boolean(value));

  return (
    <dl className="order-detail-definition-list">
      {visibleRows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
};

export default SalesPage;
