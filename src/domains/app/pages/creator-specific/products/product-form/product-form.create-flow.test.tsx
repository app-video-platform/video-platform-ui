/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { render, screen, waitFor, within, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import httpClient from 'core/api/http-client';
import { AbstractProduct, ProductType, UserRole } from 'core/api/models';
import { getUserProfile, logout, setUserProfile } from 'core/store/auth-store/auth.slice';
import { rootReducer } from 'core/store/root-reducer';
import { createSessionMiddleware } from 'core/store/session.middleware';
import ProtectedRoute from 'core/providers/protected-route.util';

import ProductForm from './product-form.component';

jest.mock('@shared/ui/uppy-file-uploader', () => ({ UppyFileUploader: () => <div>Upload fixture</div> }));

jest.mock('../../../../../../assets/image-placeholder.png', () => 'placeholder.png');

const productLabels: Record<ProductType, string> = {
  COURSE: 'Course',
  DOWNLOAD: 'Download',
  CONSULTATION: 'Consultation',
  MEMBERSHIP: 'Membership',
};

const expectedPrimaryTab: Record<ProductType, string> = {
  COURSE: 'Curriculum',
  DOWNLOAD: 'Files',
  CONSULTATION: 'Availability',
  MEMBERSHIP: 'Content',
};

const makeCreatedProduct = (
  type: ProductType,
  overrides: Partial<AbstractProduct> = {},
): AbstractProduct => ({
  id: `${type.toLowerCase()}-created`,
  type,
  name: `${productLabels[type]} Draft`,
  description: '',
  status: 'DRAFT',
  price: 'free',
  userId: 'creator-1',
  ...(type === 'COURSE' || type === 'DOWNLOAD' ? { sections: [] } : {}),
  ...overrides,
} as AbstractProduct);

const LocationProbe = () => {
  const location = useLocation();

  return <span data-testid="location">{location.pathname}</span>;
};

const renderCreateFlow = (entry = '/app/products/create') => {
  const testStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefault) => getDefault().prepend(createSessionMiddleware()),
  });
  const creator = {
    id: 'creator-1', firstName: 'Maya', lastName: 'Chen', email: 'maya@example.test',
    roles: [UserRole.CREATOR], onboardingCompleted: true,
  };
  testStore.dispatch(setUserProfile(creator));
  const workspace = <ProtectedRoute allowedRoles={[UserRole.CREATOR, UserRole.ADMIN]}><ProductForm /></ProtectedRoute>;

  const view = render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route
            path="/app/products/create"
            element={
              <>
                <LocationProbe />
                {workspace}
              </>
            }
          />
          <Route path="/app/products/edit/:type/:id" element={<><LocationProbe />{workspace}</>} />
          <Route path="/app/products" element={<h1>Products destination</h1>} />
          <Route path="/app/products/:id/preview" element={<h1>Preview destination</h1>} />
          <Route
            path="/app/products/edit/:id"
            element={
              <>
                <LocationProbe />
                {workspace}
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
  return { ...view, testStore };
};

describe('<ProductForm /> create flow integration', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(httpClient, { delayResponse: 0 });
  });

  afterEach(() => {
    mock.restore();
  });

  it.each<ProductType>([
    'COURSE',
    'DOWNLOAD',
    'CONSULTATION',
    'MEMBERSHIP',
  ])(
    'creates a %s Draft through the real selector/title input and loads the workspace',
    async (type) => {
      const user = userEvent.setup();
      const title = `${productLabels[type]} Draft`;
      const createdProduct = makeCreatedProduct(type, { name: title });

      mock.onPost('api/products').reply((request) => [
        200,
        {
          ...createdProduct,
          ...JSON.parse(request.data ?? '{}'),
          id: createdProduct.id,
          userId: 'creator-1',
          status: 'DRAFT',
        },
      ]);
      mock.onGet(`api/products/${createdProduct.id}`).reply(200, createdProduct);
      if (type === 'MEMBERSHIP') {
        mock.onGet('api/products?ownerId=creator-1').reply(200, []);
        mock.onGet(`api/products/${createdProduct.id}/membership`).reply(200, {
          productId: createdProduct.id,
          config: { orderingMode: 'NEWEST_FIRST' },
          content: [],
          feed: [],
        });
      }

      renderCreateFlow();

      const typeSelector = screen.getByRole('radiogroup', {
        name: 'Product type',
      });
      const selectedType = within(typeSelector).getByRole('radio', {
        name: new RegExp(productLabels[type], 'i'),
      });
      const titleInput = screen.getByRole('textbox', {
        name: 'Product title',
      });

      await user.click(selectedType);
      expect(selectedType).toHaveAttribute('aria-checked', 'true');

      await user.type(titleInput, title);
      expect(titleInput).toHaveValue(title);
      expect(selectedType).toHaveAttribute('aria-checked', 'true');

      await user.keyboard('{Enter}');

      await waitFor(() => expect(mock.history.post).toHaveLength(1));
      const createPayload = JSON.parse(mock.history.post[0].data);

      expect(createPayload).toMatchObject({
        name: title,
        type,
        userId: 'creator-1',
        status: 'DRAFT',
      });

      await waitFor(() =>
        expect(screen.getByTestId('location')).toHaveTextContent(
          `/app/products/edit/${createdProduct.id}`,
        ),
      );
      expect(await screen.findByRole('heading', { name: title }))
        .toBeInTheDocument();
      expect(screen.getAllByText(productLabels[type]).length).toBeGreaterThan(0);
      expect(
        screen.getByRole('tab', { name: expectedPrimaryTab[type] }),
      ).toBeInTheDocument();
      expect(mock.history.post).toHaveLength(1);
    },
  );

  it('preserves selected type and title, shows an inline error, and does not navigate when create fails', async () => {
    const user = userEvent.setup();

    const retryProduct = makeCreatedProduct('MEMBERSHIP', {
      id: 'membership-retry',
      name: 'Retryable Membership',
    });

    mock.onPost('api/products')
      .replyOnce(500, { message: 'Create failed' })
      .onPost('api/products')
      .reply(200, retryProduct);
    mock.onGet(`api/products/${retryProduct.id}`).reply(200, retryProduct);
    mock.onGet('api/products?ownerId=creator-1').reply(200, []);
    mock.onGet(`api/products/${retryProduct.id}/membership`).reply(200, {
      productId: retryProduct.id,
      config: { orderingMode: 'NEWEST_FIRST' },
      content: [],
      feed: [],
    });

    renderCreateFlow();

    const typeSelector = screen.getByRole('radiogroup', {
      name: 'Product type',
    });
    const membershipType = within(typeSelector).getByRole('radio', {
      name: /membership/i,
    });
    const titleInput = screen.getByRole('textbox', {
      name: 'Product title',
    });

    await user.click(membershipType);
    await user.type(titleInput, 'Retryable Membership');
    await user.keyboard('{Enter}');

    await waitFor(() => expect(mock.history.post).toHaveLength(1));

    expect(screen.getByTestId('location')).toHaveTextContent(
      '/app/products/create',
    );
    expect(titleInput).toHaveValue('Retryable Membership');
    expect(membershipType).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Create failed');

    await user.click(
      screen.getByRole('button', {
        name: 'Continue to Product workspace',
      }),
    );

    await waitFor(() => expect(mock.history.post).toHaveLength(2));
    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/app/products/edit/membership-retry',
      ),
    );
  });

  it.each<ProductType>(['COURSE', 'DOWNLOAD', 'CONSULTATION', 'MEMBERSHIP'])(
    'loads and remounts the saved %s workspace through the real facade and HTTP client', async (type) => {
      const product = makeCreatedProduct(type);
      mock.onGet(`api/products/${product.id}`).reply(200, product);
      mock.onGet('api/products?ownerId=creator-1').reply(200, []);
      mock.onGet(`api/products/${product.id}/membership`).reply(200, {
        productId: product.id, config: { orderingMode: 'NEWEST_FIRST' }, content: [], feed: [],
      });
      const first = renderCreateFlow(`/app/products/edit/${product.id}`);
      expect(await screen.findByRole('heading', { name: product.name })).toBeInTheDocument();
      expect(await screen.findByRole('tab', { name: expectedPrimaryTab[type] })).toBeInTheDocument();
      first.unmount();
      renderCreateFlow(`/app/products/edit/${product.id}`);
      expect(await screen.findByRole('tab', { name: expectedPrimaryTab[type] })).toBeInTheDocument();
      expect(mock.history.post).toHaveLength(0);
      expect(mock.history.patch).toHaveLength(0);
    },
  );

  it('normalizes a mismatched authorized legacy alias without recreating a Product', async () => {
    const product = makeCreatedProduct('COURSE');
    mock.onGet(`api/products/${product.id}`).reply(200, product);
    renderCreateFlow(`/app/products/edit/DOWNLOAD/${product.id}`);
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent(`/app/products/edit/${product.id}`));
    expect(await screen.findByRole('tab', { name: 'Curriculum' })).toBeInTheDocument();
    expect(mock.history.post).toHaveLength(0);
  });

  it.each([404, 403, 503])('renders a controlled saved-workspace error for HTTP %s', async (status) => {
    mock.onGet('api/products/missing').reply(status, { message: 'Unavailable' });
    renderCreateFlow('/app/products/edit/missing');
    expect(await screen.findByRole('heading', { name: 'Product workspace unavailable' })).toBeInTheDocument();
    expect(mock.history.post).toHaveLength(0);
  });

  it('keeps Membership failure stable until a deliberate successful retry', async () => {
    const product = makeCreatedProduct('MEMBERSHIP');
    mock.onGet(`api/products/${product.id}`).reply(200, product);
    mock.onGet('api/products?ownerId=creator-1').reply(200, []);
    const url = `api/products/${product.id}/membership`;
    mock.onGet(url).replyOnce(503, { message: 'Membership unavailable' });
    mock.onGet(url).reply(200, { productId: product.id, config: { orderingMode: 'NEWEST_FIRST' }, content: [], feed: [] });
    renderCreateFlow(`/app/products/edit/${product.id}`);
    fireEvent.click(await screen.findByRole('tab', { name: 'Content' }));
    await screen.findByRole('button', { name: 'Retry Membership load' });
    fireEvent.click(screen.getByRole('tab', { name: 'Basics' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Content' }));
    expect(mock.history.get.filter((request) => request.url === url)).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Retry Membership load' }));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Retry Membership load' })).not.toBeInTheDocument());
    expect(mock.history.get.filter((request) => request.url === url)).toHaveLength(2);
  });

  it.each(['COURSE', 'DOWNLOAD'] as ProductType[])('flushes a real pending %s section edit before switching tabs', async (type) => {
    let section = { id: 'section-1', title: 'Group', description: 'A', position: 1, lessons: [], files: [] };
    const product = makeCreatedProduct(type, { sections: [section] } as Partial<AbstractProduct>);
    mock.onGet(`api/products/${product.id}`).reply(200, product);
    mock.onPatch(`api/products/${product.id}/sections/section-1`).reply((request) => {
      section = { ...section, ...JSON.parse(request.data) };
      return [200, section];
    });
    renderCreateFlow(`/app/products/edit/${product.id}`);
    fireEvent.click(await screen.findByRole('tab', { name: expectedPrimaryTab[type] }));
    const name = type === 'DOWNLOAD' ? 'File group description' : 'Section description';
    fireEvent.change(await screen.findByRole('textbox', { name }), { target: { value: 'B' } });
    fireEvent.click(screen.getByRole('tab', { name: 'Basics' }));
    await waitFor(() => expect(section.description).toBe('B'));
    fireEvent.click(screen.getByRole('tab', { name: expectedPrimaryTab[type] }));
    expect(await screen.findByRole('textbox', { name })).toHaveValue('B');
    expect(mock.history.patch).toHaveLength(1);
  });

  it.each(['section', 'lesson'])('preserves a rejected real %s write and retries before Products departure', async (entity) => {
    let fail = true;
    const lesson = { id: 'lesson-1', title: 'Lesson', type: 'VIDEO' as const, description: 'A', position: 1 };
    const section = { id: 'section-1', title: 'Section', description: 'A', position: 1, lessons: [lesson] };
    const product = makeCreatedProduct('COURSE', { sections: [section] } as Partial<AbstractProduct>);
    mock.onGet(`api/products/${product.id}`).reply(() => [200, product]);
    const url = `api/products/${product.id}/sections/section-1` + (entity === 'lesson' ? '/lessons/lesson-1' : '');
    mock.onPatch(url).reply((request) => {
      if (fail) { return [503, { message: 'Synthetic outage' }]; }
      const target = entity === 'lesson' ? lesson : section;
      Object.assign(target, JSON.parse(request.data));
      return [200, target];
    });
    const view = renderCreateFlow(`/app/products/edit/${product.id}`);
    fireEvent.click(await screen.findByRole('tab', { name: 'Curriculum' }));
    if (entity === 'lesson') { fireEvent.click(await screen.findByRole('button', { name: 'Edit Lesson' })); }
    const name = entity === 'lesson' ? 'Lesson description' : 'Section description';
    fireEvent.change(await screen.findByRole('textbox', { name }), { target: { value: 'B' } });
    if (entity === 'lesson') { fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Close Lesson editor' })); }
    fireEvent.click(screen.getByRole('button', { name: 'Products' }));
    await screen.findByText(/Your work is still here/);
    expect((entity === 'lesson' ? lesson : section).description).toBe('A');
    fail = false;
    fireEvent.click(screen.getByRole('button', { name: 'Products' }));
    expect(await screen.findByRole('heading', { name: 'Products destination' })).toBeInTheDocument();
    expect((entity === 'lesson' ? lesson : section).description).toBe('B');
    expect(mock.history.patch).toHaveLength(2);
    view.unmount();
    renderCreateFlow(`/app/products/edit/${product.id}`);
    fireEvent.click(await screen.findByRole('tab', { name: 'Curriculum' }));
    if (entity === 'lesson') { fireEvent.click(await screen.findByRole('button', { name: 'Edit Lesson' })); }
    expect(await screen.findByRole('textbox', { name })).toHaveValue('B');
  });

  it.each(['section', 'lesson'])('preserves dirty %s work through M1 profile outage and retry', async (entity) => {
    const lesson = { id: 'lesson-1', title: 'Lesson', type: 'VIDEO' as const, description: 'A', position: 1 };
    const section = { id: 'section-1', title: 'Section', description: 'A', position: 1, lessons: [lesson] };
    const product = makeCreatedProduct('COURSE', { sections: [section] } as Partial<AbstractProduct>);
    mock.onGet(`api/products/${product.id}`).reply(200, product);
    const url = `api/products/${product.id}/sections/section-1` + (entity === 'lesson' ? '/lessons/lesson-1' : '');
    mock.onPatch(url).reply((request) => [200, { ...(entity === 'lesson' ? lesson : section), ...JSON.parse(request.data) }]);
    mock.onGet('api/user/userInfo').replyOnce(503, { message: 'Profile unavailable' });
    mock.onGet('api/user/userInfo').reply(200, {
      id: 'creator-1', firstName: 'Maya', roles: [UserRole.CREATOR], onboardingCompleted: true,
    });
    const { testStore } = renderCreateFlow(`/app/products/edit/${product.id}`);
    fireEvent.click(await screen.findByRole('tab', { name: 'Curriculum' }));
    if (entity === 'lesson') { fireEvent.click(await screen.findByRole('button', { name: 'Edit Lesson' })); }
    const name = entity === 'lesson' ? 'Lesson description' : 'Section description';
    fireEvent.change(await screen.findByRole('textbox', { name }), { target: { value: 'preserved dirty content' } });
    if (entity === 'lesson') { fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Close Lesson editor' })); }
    await act(async () => { await testStore.dispatch(getUserProfile()); });
    expect(screen.getByRole('alert', { name: 'Session unavailable' })).toBeVisible();
    expect(mock.history.patch).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    await waitFor(() => expect(screen.queryByRole('alert', { name: 'Session unavailable' })).not.toBeInTheDocument());
    if (entity === 'lesson') { fireEvent.click(screen.getByRole('button', { name: 'Edit Lesson' })); }
    expect(screen.getByRole('textbox', { name })).toHaveValue('preserved dirty content');
    if (entity === 'lesson') { fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Close Lesson editor' })); }
    fireEvent.click(screen.getByRole('button', { name: 'Products' }));
    await screen.findByRole('heading', { name: 'Products destination' });
    expect(mock.history.patch).toHaveLength(1);
    expect(JSON.parse(mock.history.patch[0].data).description).toBe('preserved dirty content');
  });

  it('rejects an old-session nested response after a batched account change', async () => {
    const section = { id: 'section-1', title: 'Section', description: 'A', position: 1, lessons: [] };
    const product = makeCreatedProduct('COURSE', { sections: [section] } as Partial<AbstractProduct>);
    let otherAccount = false;
    mock.onGet(`api/products/${product.id}`).reply(() => otherAccount ? [403] : [200, product]);
    // eslint-disable-next-line no-unused-vars
    let finish!: (value: [number, typeof section]) => void;
    const url = `api/products/${product.id}/sections/section-1`;
    mock.onPatch(url).reply(() => new Promise((resolve) => { finish = resolve; }));
    const { testStore } = renderCreateFlow(`/app/products/edit/${product.id}`);
    fireEvent.click(await screen.findByRole('tab', { name: 'Curriculum' }));
    fireEvent.change(await screen.findByRole('textbox', { name: 'Section description' }), { target: { value: 'private account A' } });
    fireEvent.click(screen.getByRole('button', { name: 'Products' }));
    await waitFor(() => expect(mock.history.patch).toHaveLength(1));
    otherAccount = true;
    act(() => {
      testStore.dispatch(logout());
      testStore.dispatch(setUserProfile({ id: 'creator-2', firstName: 'Other', lastName: 'Creator', email: 'other@example.test',
        roles: [UserRole.CREATOR], onboardingCompleted: true }));
    });
    await screen.findByRole('heading', { name: 'Product workspace unavailable' });
    await act(async () => { finish([200, section]); });
    expect(testStore.getState().products.currentProduct).toBeNull();
    expect(screen.queryByDisplayValue('private account A')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Products destination' })).not.toBeInTheDocument();
    expect(mock.history.patch).toHaveLength(1);
  });
});
