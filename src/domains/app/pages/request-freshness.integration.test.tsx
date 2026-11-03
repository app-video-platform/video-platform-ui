/* eslint-disable @typescript-eslint/no-explicit-any, no-unused-vars */
import React from 'react';
import '@testing-library/jest-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Link, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import httpClient from 'core/api/http-client';
import { rootReducer } from 'core/store/root-reducer';
import { createSessionMiddleware } from 'core/store/session.middleware';
import { setUserProfile } from 'core/store/auth-store';
import { User, UserRole } from 'core/api/models';
import ProductOverview from './creator-specific/products/product-overview/product-overview.component';
import CustomerDetail from './creator-specific/customers/customer-detail.component';
import SalesPage from './creator-specific/sales-page/sales-page.component';
import AdminAuditPage from './admin-page/admin-audit-page.component';
import AdminProductsPage from './admin-page/admin-products-page.component';
import { registerCreatorCustomersTestMocks } from 'core/api/test-fixtures/creator-customers-http.mock';
import { registerCreatorSalesTestMocks } from 'core/api/test-fixtures/creator-sales-http.mock';

const gate = () => {
  let resolve!: (response: [number, unknown]) => void;
  const promise = new Promise<[number, unknown]>((done) => { resolve = done; });
  return { promise, resolve };
};
const Probe = () => {
  const location = useLocation();
  return <span data-testid="url">{location.pathname}{location.search}</span>;
};
const show = (element: React.ReactElement, path: string, route: string, links: string[] = []) => {
  const store = configureStore({ reducer: rootReducer, middleware: (getDefault) => getDefault().prepend(createSessionMiddleware()) });
  store.dispatch(setUserProfile({ id: 'owner', roles: [UserRole.ADMIN] } as User));
  return render(<Provider store={store}><MemoryRouter initialEntries={[path]}>
    <Probe />{links.map((to, index) => <Link key={to} to={to}>Select {index}</Link>)}
    <Routes><Route path={route} element={element} /></Routes>
  </MemoryRouter></Provider>);
};
let mock: MockAdapter;
beforeEach(() => { mock = new MockAdapter(httpClient); });
afterEach(() => { mock.restore(); });
const release = async (pending: ReturnType<typeof gate>, status: number, body: unknown) => {
  await act(async () => { pending.resolve([status, body]); await pending.promise; });
};

it.each([200, 503])('keeps Product B rendered after old A finishes (%s)', async (status) => {
  const a = gate(); const b = gate();
  mock.onGet('api/products/A').reply(() => a.promise);
  mock.onGet('api/products/B').reply(() => b.promise);
  show(<ProductOverview />, '/app/products/A', '/app/products/:productId', ['/app/products/B']);
  fireEvent.click(screen.getByText('Select 0'));
  await release(b, 200, { id: 'B', name: 'Product B', type: 'COURSE', price: 'free', status: 'DRAFT' });
  expect(await screen.findByRole('heading', { name: 'Product B' })).toBeInTheDocument();
  await release(a, status, { id: 'A', name: 'Product A', type: 'COURSE', price: 'free' });
  expect(screen.getByRole('heading', { name: 'Product B' })).toBeInTheDocument();
  expect(screen.queryByText('Product not found')).not.toBeInTheDocument();
  expect(screen.getByTestId('url')).toHaveTextContent('/app/products/B');
});

it('keeps Product B loading when an older A finishes first', async () => {
  const a = gate(); const b = gate();
  mock.onGet('api/products/A').reply(() => a.promise); mock.onGet('api/products/B').reply(() => b.promise);
  show(<ProductOverview />, '/app/products/A', '/app/products/:productId', ['/app/products/B']);
  fireEvent.click(screen.getByText('Select 0'));
  await release(a, 200, { id: 'A', name: 'Product A', type: 'COURSE' });
  expect(screen.getByRole('status')).toHaveAccessibleName('Loading product');
  expect(screen.queryByText('Product not found')).not.toBeInTheDocument();
  await release(b, 404, {});
  expect(await screen.findByText(/could not load|not found|request failed/i)).toBeInTheDocument();
});

it('hides stored Customer A while B loads and ignores delayed A responses', async () => {
  registerCreatorCustomersTestMocks(mock);
  const { data: customer } = await httpClient.get('api/creator/customers/cust-maya-johnson');
  mock.resetHandlers();
  const a1 = gate(); const b = gate(); const a2 = gate();
  mock.onGet('api/creator/customers/A').replyOnce(() => a1.promise);
  mock.onGet('api/creator/customers/A').replyOnce(() => a2.promise);
  mock.onGet('api/creator/customers/B').reply(() => b.promise);
  show(<CustomerDetail />, '/app/customers/A', '/app/customers/:customerId', ['/app/customers/A', '/app/customers/B']);
  await release(a1, 200, { ...customer, id: 'A', name: 'Customer A' });
  expect(await screen.findByRole('heading', { name: 'Customer A' })).toBeInTheDocument();
  fireEvent.click(screen.getByText('Select 1'));
  expect(screen.queryByRole('heading', { name: 'Customer A' })).not.toBeInTheDocument();
  expect(screen.getByText('Loading customer')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Select 0'));
  fireEvent.click(screen.getByText('Select 1'));
  await release(b, 200, { ...customer, id: 'B', name: 'Customer B' });
  expect(await screen.findByRole('heading', { name: 'Customer B' })).toBeInTheDocument();
  await release(a2, 503, {});
  expect(screen.getByRole('heading', { name: 'Customer B' })).toBeInTheDocument();
});

it.each([404, 503, 'network'])('shows safe Customer feedback and retry for %s', async (failure) => {
  registerCreatorCustomersTestMocks(mock);
  const { data: customer } = await httpClient.get('api/creator/customers/cust-maya-johnson');
  mock.resetHandlers();
  if (failure === 'network') { mock.onGet().networkErrorOnce(); }
  else { mock.onGet().replyOnce(failure as number, { message: 'private internal details' }); }
  mock.onGet().reply(200, { ...customer, id: 'missing', name: 'Recovered Customer' });
  show(<CustomerDetail />, '/app/customers/missing', '/app/customers/:customerId');
  expect(await screen.findByRole('alert')).toHaveTextContent(failure === 404 ? 'Customer not found' : 'Customer details could not be loaded');
  expect(screen.queryByText(/once.*APIs are connected|private internal details/i)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
  expect(await screen.findByRole('heading', { name: 'Recovered Customer' })).toBeInTheDocument();
});

it('keeps selected Order B open after A finishes, and never reopens on close', async () => {
  registerCreatorSalesTestMocks(mock);
  const { data: order } = await httpClient.get('api/creator/orders/ORD-2026-00124');
  mock.resetHandlers();
  const a = gate(); const b = gate(); const closed = gate();
  mock.onGet('api/creator/orders/A').replyOnce(() => a.promise);
  mock.onGet('api/creator/orders/A').replyOnce(() => closed.promise);
  mock.onGet('api/creator/orders/B').reply(() => b.promise);
  registerCreatorSalesTestMocks(mock);
  show(<SalesPage />, '/app/sales?order=A', '/app/sales', ['/app/sales?order=A', '/app/sales?order=B']);
  fireEvent.click(screen.getByText('Select 1'));
  expect(screen.getByRole('dialog')).toHaveTextContent('Loading order');
  await release(b, 200, { ...order, id: 'B' });
  expect(await screen.findByText('Order #B')).toBeInTheDocument();
  await release(a, 200, { ...order, id: 'A' });
  expect(screen.getByText('Order #B')).toBeInTheDocument();
  expect(screen.getByTestId('url')).toHaveTextContent('?order=B');
  fireEvent.click(screen.getByText('Select 0'));
  fireEvent.click(screen.getAllByRole('button', { name: 'Close drawer' })[0]);
  await release(closed, 200, { ...order, id: 'A' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByTestId('url')).not.toHaveTextContent('order=');
});

it.each([
  { name: 'Audit', component: <AdminAuditPage />, path: '/audit', field: 'Action', query: 'product_create' },
  { name: 'Products', component: <AdminProductsPage />, path: '/products', field: 'Search products', query: 'exact' },
])('keeps $name filtered rows authoritative and supports empty/error retry', async ({ component, path, field, query }) => {
  const initial = gate(); const filtered = gate();
  mock.onGet(/api\/admin\/users/).reply(200, { content: [] });
  mock.onGet(/api\/admin\/(audit|products)/).replyOnce(() => initial.promise);
  mock.onGet(/api\/admin\/(audit|products)/).replyOnce(() => filtered.promise);
  show(component, path, path);
  fireEvent.change(screen.getByLabelText(field), { target: { value: query } });
  const row = {
    id: 'current', title: 'Current Product', createdAt: '2026-11-03', action: 'product_create', targetType: 'PRODUCT', targetId: 'current' };
  await release(filtered, 200, { content: [row], number: 0, totalPages: 1, last: true });
  expect(await screen.findByText(field === 'Action' ? 'product_create' : 'Current Product')).toBeInTheDocument();
  await release(initial, 200, { content: [{ ...row, id: 'old', title: 'Wrong Product', action: 'wrong_action' }], number: 0 });
  expect(screen.queryByText('Wrong Product')).not.toBeInTheDocument();
  expect(screen.queryByText('wrong_action')).not.toBeInTheDocument();
  mock.onGet(/api\/admin\/(audit|products)/).replyOnce(503);
  fireEvent.change(screen.getByLabelText(field), { target: { value: 'retry' } });
  expect(await screen.findByRole('alert')).toHaveTextContent('Retry');
  mock.onGet(/api\/admin\/(audit|products)/).reply(200, { content: [], number: 0, last: true });
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
  expect(await screen.findByText('No results found.')).toBeInTheDocument();
});


it.each([404, 503])('keeps a failed selected Order open and permits retry (%s)', async (status) => {
  registerCreatorSalesTestMocks(mock);
  const { data: order } = await httpClient.get('api/creator/orders/ORD-2026-00124');
  mock.resetHandlers();
  mock.onGet('api/creator/orders/missing').replyOnce(status, { message: 'private order details' });
  mock.onGet('api/creator/orders/missing').reply(200, { ...order, id: 'missing' });
  registerCreatorSalesTestMocks(mock);
  show(<SalesPage />, '/app/sales?order=missing', '/app/sales');
  expect(await screen.findByRole('alert')).toHaveTextContent('Order details could not be loaded.');
  expect(screen.getByRole('dialog')).toBeVisible();
  expect(screen.getByTestId('url')).toHaveTextContent('?order=missing');
  expect(screen.queryByText('private order details')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
  expect(await screen.findByText('Order #missing')).toBeInTheDocument();
});

it.each([
  { component: <AdminAuditPage />, path: '/audit', filters: [
    ['Target id', 'target-7'], ['Target type', 'pRoDuCt'], ['Action', 'product_create'],
  ], params: { targetId: 'target-7', targetType: 'pRoDuCt', action: 'product_create' } },
  { component: <AdminProductsPage />, path: '/products', filters: [
    ['Search products', 'Exact Product'], ['Owner id', 'owner-7'], ['Filter by type', 'COURSE'], ['Filter by status', 'DRAFT'],
  ], params: { search: 'Exact Product', ownerId: 'owner-7', type: 'COURSE', status: 'DRAFT' } },
])('keeps $path combined filters authoritative over pending pagination', async ({ component, path, filters, params }) => {
  const stalePage = gate();
  const filterRequests = filters.map(() => gate());
  const row = { id: 'initial', title: 'Initial Product', action: 'initial_action', targetType: 'PRODUCT',
    targetId: 'initial', createdAt: '2026-11-03' };
  const response = (label: string) => ({ content: [{ ...row, id: label, title: label, action: label }],
    number: 0, totalPages: 2, last: false });
  mock.onGet(/api\/admin\/users/).reply(200, { content: [] });
  mock.onGet(/api\/admin\/(audit|products)/).replyOnce(200, response('Initial row'));
  mock.onGet(/api\/admin\/(audit|products)/).replyOnce(() => stalePage.promise);
  filterRequests.forEach((request) => mock.onGet(/api\/admin\/(audit|products)/).replyOnce(() => request.promise));
  show(component, path, path);
  expect(await screen.findByText('Initial row')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Next' }));
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  filters.forEach(([label, value]) => fireEvent.change(screen.getByLabelText(label), { target: { value } }));
  const latest = new URL(mock.history.get.filter((request) => /api\/admin\/(audit|products)/.test(request.url ?? '')).at(-1)?.url ?? '',
    'http://localhost');
  Object.entries(params).forEach(([key, value]) => expect(latest.searchParams.get(key)).toBe(value));
  expect(latest.searchParams.get('page')).toBe('0');
  await release(filterRequests[filterRequests.length - 1], 200, response('Matching row'));
  expect(await screen.findByText('Matching row')).toBeInTheDocument();
  await release(stalePage, 200, response('Wrong page'));
  for (const request of filterRequests.slice(0, -1)) { await release(request, 503, {}); }
  expect(screen.getByText('Matching row')).toBeInTheDocument();
  expect(screen.queryByText('Wrong page')).not.toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  filters.forEach(([label, value]) => expect(screen.getByLabelText(label)).toHaveValue(value));
  mock.onGet(/api\/admin\/(audit|products)/).reply(200, { ...response('Next page'), number: 1, last: true });
  fireEvent.click(screen.getByRole('button', { name: 'Next' }));
  expect(await screen.findByText('Next page')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled());
});
