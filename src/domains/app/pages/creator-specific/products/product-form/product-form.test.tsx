/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * product-form.test.tsx
 */

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';

const mockProductStoreState = {
  products: {
    productSummaries: null as any[] | null,
    loading: false,
    error: null as string | null,
  },
  membership: {
    byProductId: {} as Record<string, any>,
    loading: false,
    error: null as string | null,
    saving: false,
    saveError: null as string | null,
  },
};
const mockNavigate = jest.fn();
const mockUpdateProductDetailsUnwrap = jest.fn(() =>
  Promise.resolve({ status: 'PUBLISHED' }),
);
const mockDispatch = jest.fn(() => ({
  unwrap: mockUpdateProductDetailsUnwrap,
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  useNavigate: () => mockNavigate,
}));

// ── 1) Mock @shared/ui (UppyFileUploader) ────────────────────────────
jest.mock('@shared/ui', () => ({
  __esModule: true,
  Button: ({
    children,
    onClick,
    type,
    variant,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    variant?: string;
  }) => (
    <button type={type ?? 'button'} data-variant={variant} onClick={onClick}>
      {children}
    </button>
  ),
  UppyFileUploader: ({
    onFilesChange,
  }: {
    onFilesChange: (files: File[]) => void;
    allowedFileTypes?: string[];
    disableImporters?: boolean;
  }) => (
    <button data-testid="file-uploader" onClick={() => onFilesChange([])}>
      Upload Image
    </button>
  ),
}));

jest.mock('react-redux', () => ({
  __esModule: true,
  useDispatch: jest.fn(() => mockDispatch),
  useSelector: jest.fn((selector) => selector(mockProductStoreState)),
}));

// ── 2) Mock app features barrel used by ProductForm ──────────────────────
const mockUseProductFormFacade = jest.fn();
const mockUseProductFormAnimation = jest.fn();
const mockProductWorkspaceShell = jest.fn();
const mockProductMediaSection = jest.fn();
const mockUseGlobalSaveStatus = jest.fn(() => 'idle');
const mockEvaluateProductReadiness = jest.fn(
  ({
    formData,
    recurringPricing,
    membershipNativeContentItems = [],
    membershipIncludedProducts = [],
    isMembershipLoading = false,
  }: any) => ({
    blockers:
      isMembershipLoading || formData.price === 0 || recurringPricing?.amount === 0
        ? [
          {
            id: 'mock-blocker',
            severity: 'BLOCKER',
            title: 'Mock blocker',
            description: 'Resolve mock blocker.',
            destination: 'pricing',
          },
        ]
        : [],
    warnings: formData.imageUrl
      ? []
      : [
        {
          id: 'missing-thumbnail',
          severity: 'WARNING',
          title: 'Add a thumbnail',
          description: 'Products with thumbnails are easier to recognize.',
          destination: 'media',
        },
      ],
    isReadyToPublish:
      !isMembershipLoading &&
      Boolean(formData.name?.trim()) &&
      (formData.type !== 'MEMBERSHIP' ||
        (
          recurringPricing?.amount > 0 &&
          (membershipNativeContentItems.some(
            (item: any) => item.status === 'PUBLISHED',
          ) ||
            membershipIncludedProducts.some(
              (product: any) => product.status === 'PUBLISHED',
            ))
        )),
    isEvaluating: isMembershipLoading,
  }),
);
const mockEvaluateMembershipReadiness = jest.fn(
  ({
    formData,
    recurringPricing,
    nativeContentItems,
    includedProducts,
  }: any) => ({
    canPublish:
      Boolean(formData.name?.trim()) &&
      recurringPricing.amount > 0 &&
      (nativeContentItems.some((item: any) => item.status === 'PUBLISHED') ||
        includedProducts.some((product: any) => product.status === 'PUBLISHED')),
    errors:
      recurringPricing.amount > 0
        ? []
        : [
          {
            code: 'INVALID_RECURRING_PRICE',
            severity: 'ERROR',
            message: 'Set a valid recurring price.',
          },
        ],
    warnings: [],
  }),
);
const mockResolveMembershipIncludedProducts = jest.fn(
  (includedProductEntries: any[], productSummaries: any[] | null) =>
    includedProductEntries
      .map((entry) =>
        (productSummaries ?? []).find(
          (product) => product.id === entry.productId,
        ),
      )
      .filter(Boolean),
);

jest.mock('domains/app/features/product-form', () => ({
  __esModule: true,
  // hooks
  useProductFormFacade: (...args: any[]) => mockUseProductFormFacade(...args),
  useProductFormAnimation: (...args: any[]) =>
    mockUseProductFormAnimation(...args),
  useGlobalSaveStatus: () => mockUseGlobalSaveStatus(),
  evaluateProductReadiness: (input: any) =>
    mockEvaluateProductReadiness(input),
  evaluateMembershipReadiness: (input: any) =>
    mockEvaluateMembershipReadiness(input),
  resolveMembershipIncludedProducts: (
    includedProductEntries: any[],
    productSummaries: any[] | null,
  ) =>
    mockResolveMembershipIncludedProducts(
      includedProductEntries,
      productSummaries,
    ),

  // step one: just a button that can toggle showRestOfForm
  CreateProductStepOne: ({
    setShowRestOfForm,
  }: {
    setShowRestOfForm: (show: boolean) => void;
  }) => (
    <button
      data-testid="step-one-continue"
      onClick={() => setShowRestOfForm(true)}
    >
      Continue
    </button>
  ),

  // basic info tab stub
  BasicInfo: () => <div data-testid="basic-info">BasicInfo</div>,
  ProductPricingSection: ({
    formData,
    onMembershipRecurringPricingChange,
  }: {
    formData: { price: number; currency?: string; billingInterval?: string };
    onMembershipRecurringPricingChange: (value: {
      amount: number;
      currency: string;
      interval: string;
    }) => void;
  }) => (
    <>
      <div data-testid="product-pricing-section">
        ProductPricingSection (price: {String(formData.price)})
      </div>
      <button
        data-testid="set-valid-membership-price"
        onClick={() =>
          onMembershipRecurringPricingChange({
            amount: 25,
            currency: 'EUR',
            interval: 'MONTH',
          })
        }
      >
        Set valid price
      </button>
    </>
  ),

  // consultation details tab stub
  ConsultationDetailsSection: () => (
    <div data-testid="consultation-details">ConsultationDetails</div>
  ),

  MembershipContentSection: () => (
    <div data-testid="membership-content">Included Products</div>
  ),

  ProductMediaSection: (props: any) => {
    mockProductMediaSection(props);
    return <div data-testid="product-media-section">ProductMediaSection</div>;
  },

  ProductReadinessSection: ({
    result,
    publishError,
    onNavigateToDestination,
  }: any) => (
    <div data-testid="product-readiness-section">
      <h3>Readiness</h3>
      <div>{result.isReadyToPublish ? 'Ready to publish' : 'Blockers'}</div>
      {publishError && <div role="alert">{publishError}</div>}
      <button
        data-testid="readiness-go-pricing"
        onClick={() => onNavigateToDestination('pricing')}
      >
        Go to Pricing
      </button>
    </div>
  ),

  // sections editor stub
  CreateProductSections: ({
    productType,
    productId,
  }: {
    productType: string;
    productId: string;
  }) => (
    <div data-testid="create-sections">
      CreateProductSections (type: {productType}, id: {productId})
    </div>
  ),

  // sidebar stub with tab buttons
  BuilderSidebar: ({
    activeTab,
    onChange,
    onSectionClick,
    onLessonClick,
  }: {
    activeTab: string | null;
    onChange: (tab: any) => void;
    onSectionClick?: (id: string) => void;
    onLessonClick?: (id: string) => void;
  }) => (
    <div data-testid="builder-sidebar">
      <span data-testid="active-tab">{activeTab ?? 'none'}</span>
      <button data-testid="tab-basics" onClick={() => onChange('basics')}>
        Basics
      </button>
      <button data-testid="tab-pricing" onClick={() => onChange('pricing')}>
        Pricing
      </button>
      <button data-testid="tab-sections" onClick={() => onChange('sections')}>
        Sections
      </button>
      <button
        data-testid="tab-consultation-details"
        onClick={() => onChange('consultation-details')}
      >
        Consultation
      </button>
      <button
        data-testid="tab-membership-content"
        onClick={() => onChange('membership-content')}
      >
        Membership
      </button>
      <button data-testid="tab-media" onClick={() => onChange('media')}>
        Media
      </button>
      <button
        data-testid="tab-readiness"
        onClick={() => onChange('readiness')}
      >
        Readiness
      </button>
      <button
        data-testid="sidebar-section-link"
        onClick={() => onSectionClick?.('section-1')}
      >
        Go section
      </button>
      <button
        data-testid="sidebar-lesson-link"
        onClick={() => onLessonClick?.('lesson-1')}
      >
        Go lesson
      </button>
    </div>
  ),

  // runtime placeholders for types (not actually used at runtime)
  BuilderTab: {} as any,
  DEFAULT_RECURRING_PRICING: {
    amount: 0,
    currency: 'EUR',
    interval: 'MONTH',
  },
  SectionDraft: {} as any,
  RecurringPriceSelector: ({
    value,
    onChange,
  }: {
    value: { amount: number; currency: string; interval: string };
    onChange: (value: { amount: number; currency: string; interval: string }) => void;
  }) => (
    <>
      <div data-testid="recurring-price-selector">
        RecurringPriceSelector ({value.amount} {value.currency} {value.interval})
      </div>
      <button
        data-testid="set-valid-membership-price"
        onClick={() => onChange({ amount: 25, currency: 'EUR', interval: 'MONTH' })}
      >
        Set valid price
      </button>
    </>
  ),
  PriceSelector: ({ price }: { price: number }) => (
    <div data-testid="price-selector">
      PriceSelector (price: {String(price)})
    </div>
  ),
}));

jest.mock('domains/app/layouts/product-workspace-shell', () => ({
  __esModule: true,
  ProductWorkspaceShell: (props: any) => {
    mockProductWorkspaceShell(props);
    return (
      <div data-testid="product-workspace-shell">
        <div data-testid="workspace-navigation">{props.navigation}</div>
        <div>{props.children}</div>
      </div>
    );
  },
}));

// ── 3) Mock app components barrel used by ProductForm ────────────────────
jest.mock('domains/app/components', () => ({
  __esModule: true,
  PriceSelector: ({ price }: { price: number }) => (
    <div data-testid="price-selector">
      PriceSelector (price: {String(price)})
    </div>
  ),
}));

// ── 4) Import component under test (after mocks) ────────────────────────
import ProductForm from './product-form.component';

// ── 5) Helpers ───────────────────────────────────────────────────────────
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

beforeEach(() => {
  mockProductStoreState.products.productSummaries = null;
  mockProductStoreState.products.loading = false;
  mockProductStoreState.products.error = null;
  mockProductStoreState.membership.byProductId = {};
  mockProductStoreState.membership.loading = false;
  mockProductStoreState.membership.error = null;
  mockProductStoreState.membership.saving = false;
  mockProductStoreState.membership.saveError = null;
});

const makeFacadeState = (overrides: Partial<any> = {}) => ({
  user: { id: 'user-123' },
  isEditMode: false,
  productOwnerId: 'user-123',
  formData: {
    id: 'prod-1',
    name: 'My Product',
    description: '',
    type: 'COURSE',
    price: 0,
    sections: [],
  },
  setFormData: jest.fn(),
  setField: jest.fn(),
  handleSetPrice: jest.fn(),
  productImage: null,
  handleImageChange: jest.fn(),
  showRestOfForm: true,
  setShowRestOfForm: jest.fn(),
  showLoadingRestOfForm: false,
  setShowLoadingRestOfForm: jest.fn(),
  errors: {},
  handleSubmit: jest.fn((e?: React.FormEvent) => e && e.preventDefault()),
  handleSidebarSectionClick: jest.fn(),
  handleSidebarLessonClick: jest.fn(),
  sidebarSections: [],
  isAutosaving: false,
  hasPendingAutosave: false,
  flushAutosave: jest.fn(() => Promise.resolve()),
  lastSavedAt: null,
  ...overrides,
});

// ── 6) Tests ─────────────────────────────────────────────────────────────
describe('<ProductForm />', () => {
  it('renders “must be logged in” if no user', () => {
    mockUseProductFormFacade.mockReturnValue(makeFacadeState({ user: null }));

    render(<ProductForm />);

    expect(
      screen.getByText('You must be logged in to create a product.'),
    ).toBeInTheDocument();
  });

  it('passes isEditMode from facade to ProductWorkspaceShell', () => {
    mockUseProductFormFacade.mockReturnValue(
      makeFacadeState({ isEditMode: true }),
    );

    render(<ProductForm />);

    expect(mockProductWorkspaceShell).toHaveBeenCalledWith(
      expect.objectContaining({
        isEditMode: true,
      }),
    );
  });

  it('passes lifecycle, preview, and pending autosave state to ProductWorkspaceShell', async () => {
    const state = makeFacadeState({
      formData: {
        id: 'published-1',
        name: 'Published Product',
        description: '',
        type: 'COURSE',
        status: 'PUBLISHED',
        price: 42,
        sections: [],
      },
      hasPendingAutosave: true,
    });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    await waitFor(() => {
      expect(mockProductWorkspaceShell).toHaveBeenLastCalledWith(
        expect.objectContaining({
          productStatus: 'PUBLISHED',
          hasPendingAutosave: true,
          canPreview: true,
        }),
      );
    });
  });

  it('shows step-one hero when user is present but showRestOfForm is false', () => {
    const state = makeFacadeState({
      showRestOfForm: false,
      formData: {
        id: '',
        name: '',
        description: '',
        type: undefined,
        price: 0,
        sections: [],
      },
    });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    // Step one button visible
    expect(screen.getByTestId('step-one-continue')).toBeInTheDocument();

    // Builder not visible yet
    expect(screen.queryByTestId('builder-sidebar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('create-sections')).not.toBeInTheDocument();
  });

  it('when showRestOfForm is true for a COURSE, shows sections builder after effect', async () => {
    const state = makeFacadeState({
      showRestOfForm: true,
      formData: {
        id: 'prod-1',
        name: 'Course Name',
        description: '',
        type: 'COURSE',
        price: 42,
        sections: [],
      },
    });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    // New Products now start in Basics, then creators can move into type-specific tabs.
    await waitFor(() => {
      expect(screen.getByTestId('builder-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('basic-info')).toBeInTheDocument();
    });

    // Hero step-one should not be rendered when showRestOfForm is true
    expect(screen.queryByTestId('step-one-continue')).not.toBeInTheDocument();
  });

  it('clicking Pricing tab shows the shared pricing panel', async () => {
    const state = makeFacadeState({
      showRestOfForm: true,
      formData: {
        id: 'prod-1',
        name: 'Course Name',
        description: '',
        type: 'COURSE',
        price: 99,
        sections: [],
      },
    });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    // Wait for builder to appear.
    await waitFor(() => {
      expect(screen.getByTestId('builder-sidebar')).toBeInTheDocument();
    });

    // Click the "Pricing" tab in our mocked sidebar
    fireEvent.click(screen.getByTestId('tab-pricing'));

    expect(screen.getByTestId('product-pricing-section')).toBeInTheDocument();
    // And sections panel should be gone
    expect(screen.queryByTestId('create-sections')).not.toBeInTheDocument();
  });

  it.each(['COURSE', 'DOWNLOAD', 'CONSULTATION'])(
    'uses the shared ProductPricingSection for %s pricing',
    async (productType) => {
      const state = makeFacadeState({
        showRestOfForm: true,
        formData: {
          id: `${productType.toLowerCase()}-1`,
          name: `${productType} Product`,
          description: '',
          type: productType,
          price: 99,
          sections: [],
        },
      });

      mockUseProductFormFacade.mockReturnValue(state);

      render(<ProductForm />);

      await waitFor(() => {
        expect(screen.getByTestId('builder-sidebar')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('tab-pricing'));

      expect(screen.getByTestId('product-pricing-section')).toBeInTheDocument();
      expect(
        screen.queryByTestId('recurring-price-selector'),
      ).not.toBeInTheDocument();
    },
  );

  it('uses RecurringPriceSelector for Membership pricing', async () => {
    const state = makeFacadeState({
      showRestOfForm: true,
      formData: {
        id: 'membership-1',
        name: 'Founders Club',
        description: '',
        type: 'MEMBERSHIP',
        price: 25,
      },
    });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    await waitFor(() => {
      expect(screen.getByTestId('builder-sidebar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('tab-pricing'));

    expect(screen.getByTestId('product-pricing-section')).toBeInTheDocument();
    expect(screen.queryByTestId('price-selector')).not.toBeInTheDocument();
  });

  it('keeps Membership Publish disabled even when readiness is satisfied', async () => {
    mockProductStoreState.membership.byProductId['membership-1'] = {
      productId: 'membership-1',
      config: { productId: 'membership-1', orderingMode: 'NEWEST_FIRST' },
      content: [
        {
          id: 'post-1',
          type: 'POST',
          title: 'Published update',
          body: 'Hello',
          status: 'PUBLISHED',
          createdAt: '2026-08-10T10:00:00.000Z',
          updatedAt: '2026-08-10T10:00:00.000Z',
        },
      ],
      feed: [],
    };
    const state = makeFacadeState({
      formData: {
        id: 'membership-1',
        name: 'Founders Club',
        description: '',
        type: 'MEMBERSHIP',
        price: 25,
      },
    });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    await waitFor(() => {
      expect(mockEvaluateProductReadiness).toHaveBeenCalledWith(
        expect.objectContaining({
          formData: state.formData,
          membershipNativeContentItems: expect.arrayContaining([
            expect.objectContaining({ status: 'PUBLISHED' }),
          ]),
        }),
      );
    });

    expect(mockProductWorkspaceShell).toHaveBeenLastCalledWith(
      expect.objectContaining({
        canPublish: false,
        publishDisabledReason: 'Membership publishing is not available yet.',
        publishHelpText: expect.stringContaining('Membership publishing is not available yet'),
      }),
    );

    await act(async () => {
      await mockProductWorkspaceShell.mock.calls[
        mockProductWorkspaceShell.mock.calls.length - 1
      ][0].onPublish();
    });

    expect(mockUpdateProductDetailsUnwrap).not.toHaveBeenCalled();
  });

  it('updates Membership readiness when recurring pricing becomes valid', async () => {
    const state = makeFacadeState({
      formData: {
        id: 'membership-1',
        name: 'Founders Club',
        description: '',
        type: 'MEMBERSHIP',
        price: 25,
      },
    });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    await waitFor(() => {
      expect(screen.getByTestId('builder-sidebar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('tab-pricing'));
    fireEvent.click(screen.getByTestId('set-valid-membership-price'));

    await waitFor(() => {
      expect(mockEvaluateProductReadiness).toHaveBeenLastCalledWith(
        expect.objectContaining({
          recurringPricing: expect.objectContaining({ amount: 25 }),
        }),
      );
    });
  });

  it('updates Membership readiness when published native content is added', async () => {
    const emptyAggregate = {
      productId: 'membership-1',
      config: { productId: 'membership-1', orderingMode: 'NEWEST_FIRST' },
      content: [],
      feed: [],
    };
    const publishedAggregate = {
      ...emptyAggregate,
      content: [
        {
          id: 'post-1',
          type: 'POST',
          title: 'Published update',
          body: 'Hello',
          status: 'PUBLISHED',
          createdAt: '2026-08-10T10:00:00.000Z',
          updatedAt: '2026-08-10T10:00:00.000Z',
        },
      ],
    };
    const state = makeFacadeState({
      formData: {
        id: 'membership-1',
        name: 'Founders Club',
        description: '',
        type: 'MEMBERSHIP',
        price: 25,
      },
    });

    mockUseProductFormFacade.mockReturnValue(state);
    mockProductStoreState.membership.byProductId['membership-1'] =
      emptyAggregate;

    const view = render(<ProductForm />);

    await waitFor(() => {
      expect(mockEvaluateProductReadiness).toHaveBeenCalledWith(
        expect.objectContaining({ membershipNativeContentItems: [] }),
      );
    });

    mockProductStoreState.membership.byProductId['membership-1'] =
      publishedAggregate;
    view.rerender(<ProductForm />);

    await waitFor(() => {
      expect(mockEvaluateProductReadiness).toHaveBeenLastCalledWith(
        expect.objectContaining({
          membershipNativeContentItems: expect.arrayContaining([
            expect.objectContaining({ status: 'PUBLISHED' }),
          ]),
        }),
      );
    });
  });

  it('updates Membership readiness when a published included Product is added', async () => {
    mockProductStoreState.products.productSummaries = [
      {
        id: 'download-1',
        title: 'Download Kit',
        type: 'DOWNLOAD',
        status: 'PUBLISHED',
      },
    ];
    mockProductStoreState.membership.byProductId['membership-1'] = {
      productId: 'membership-1',
      config: { productId: 'membership-1', orderingMode: 'NEWEST_FIRST' },
      content: [],
      feed: [
        {
          entryId: 'product:download-1',
          kind: 'PRODUCT',
          productId: 'download-1',
          addedAt: '2026-08-10T10:00:00.000Z',
        },
      ],
    };
    const state = makeFacadeState({
      formData: {
        id: 'membership-1',
        name: 'Founders Club',
        description: '',
        type: 'MEMBERSHIP',
        price: 25,
      },
    });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    await waitFor(() => {
      expect(mockEvaluateProductReadiness).toHaveBeenCalledWith(
        expect.objectContaining({
          membershipIncludedProducts: [
            expect.objectContaining({
              id: 'download-1',
              status: 'PUBLISHED',
            }),
          ],
        }),
      );
    });
  });

  it('keeps Membership readiness available when switching builder tabs', async () => {
    mockUseProductFormFacade.mockReturnValue(
      makeFacadeState({
        formData: {
          id: 'membership-1',
          name: 'Founders Club',
          description: '',
          type: 'MEMBERSHIP',
          price: 25,
        },
      }),
    );

    render(<ProductForm />);

    await waitFor(() => {
      expect(screen.getByTestId('builder-sidebar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('tab-pricing'));
    fireEvent.click(screen.getByTestId('tab-membership-content'));

    expect(mockProductWorkspaceShell).toHaveBeenLastCalledWith(
      expect.objectContaining({
        showWorkspace: true,
      }),
    );
  });

  it('when showRestOfForm is true for a MEMBERSHIP, starts on Basics after effect', async () => {
    const state = makeFacadeState({
      showRestOfForm: true,
      formData: {
        id: 'membership-1',
        name: 'Founders Club',
        description: '',
        type: 'MEMBERSHIP',
        price: 25,
      },
    });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    await waitFor(() => {
      expect(screen.getByTestId('builder-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('basic-info')).toBeInTheDocument();
    });

    expect(screen.queryByText('Included Products')).not.toBeInTheDocument();
    expect(screen.getByTestId('active-tab')).toHaveTextContent('basics');
    expect(screen.queryByTestId('create-sections')).not.toBeInTheDocument();
  });

  it('clicking Media tab shows the Product media destination', async () => {
    const state = makeFacadeState({
      showRestOfForm: true,
      formData: {
        id: 'prod-1',
        name: 'Course Name',
        description: '',
        type: 'COURSE',
        price: 0,
        sections: [],
      },
    });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    await waitFor(() => {
      expect(screen.getByTestId('builder-sidebar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('tab-media'));

    expect(screen.getByTestId('product-media-section')).toBeInTheDocument();
  });

  it('appends multiple gallery uploads from the latest form state', async () => {
    const firstImage = {
      id: 'gallery-1',
      url: 'https://cdn.example.com/one.jpg',
      position: 1,
    };
    const secondImage = {
      id: 'gallery-2',
      url: 'https://cdn.example.com/two.jpg',
      position: 2,
    };
    (mockUpdateProductDetailsUnwrap as jest.Mock)
      .mockResolvedValueOnce({ image: firstImage })
      .mockResolvedValueOnce({ image: secondImage });
    const state = makeFacadeState({
      showRestOfForm: true,
      formData: {
        id: 'prod-1',
        name: 'Course Name',
        description: '',
        type: 'COURSE',
        price: 99,
        galleryImages: [],
        sections: [],
      },
    });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    await waitFor(() => {
      expect(screen.getByTestId('builder-sidebar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('tab-media'));

    await waitFor(() => {
      expect(mockProductMediaSection).toHaveBeenLastCalledWith(
        expect.objectContaining({ onAddGalleryImage: expect.any(Function) }),
      );
    });

    await act(async () => {
      await mockProductMediaSection.mock.calls[
        mockProductMediaSection.mock.calls.length - 1
      ][0].onAddGalleryImage(
        new File(['one'], 'one.jpg', { type: 'image/jpeg' }),
      );
      await mockProductMediaSection.mock.calls[
        mockProductMediaSection.mock.calls.length - 1
      ][0].onAddGalleryImage(
        new File(['two'], 'two.jpg', { type: 'image/jpeg' }),
      );
    });

    const galleryStateUpdates = state.setFormData.mock.calls
      .map(([update]: [unknown]) => update)
      .filter((update: unknown) => typeof update === 'function') as Array<
        (currentFormData: typeof state.formData) => typeof state.formData
      >;
    const nextState = galleryStateUpdates.reduce(
      (currentFormData, update) => update(currentFormData),
      state.formData,
    );

    expect((nextState as any).galleryImages).toEqual([firstImage, secondImage]);
  });

  it('clicking Readiness tab shows the readiness foundation', async () => {
    const state = makeFacadeState({
      showRestOfForm: true,
      formData: {
        id: 'prod-1',
        name: 'Course Name',
        description: '',
        type: 'COURSE',
        price: 0,
        sections: [],
      },
    });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    await waitFor(() => {
      expect(screen.getByTestId('builder-sidebar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('tab-readiness'));

    expect(screen.getByRole('heading', { name: 'Readiness', level: 2 }))
      .toBeInTheDocument();
    expect(screen.getByTestId('product-readiness-section')).toBeInTheDocument();
  });

  it('Publish flushes pending Product autosave before publishing', async () => {
    const handleSubmitMock = jest.fn((e?: React.FormEvent) => {
      e?.preventDefault();
    });
    const flushAutosave = jest.fn(() => Promise.resolve());
    const state = makeFacadeState({
      showRestOfForm: true,
      handleSubmit: handleSubmitMock,
      flushAutosave,
      formData: {
        id: 'course-1',
        name: 'Ready Course',
        description: '',
        type: 'COURSE',
        price: 25,
        sections: [
          {
            id: 'section-1',
            title: 'Intro',
            position: 1,
            lessons: [
              {
                id: 'lesson-1',
                title: 'Welcome',
                sectionId: 'section-1',
                description: '',
              },
            ],
          },
        ],
      },
    });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    await waitFor(() => {
      expect(mockProductWorkspaceShell).toHaveBeenLastCalledWith(
        expect.objectContaining({ onPublish: expect.any(Function) }),
      );
    });

    await act(async () => {
      await mockProductWorkspaceShell.mock.calls[
        mockProductWorkspaceShell.mock.calls.length - 1
      ][0].onPublish();
    });

    await waitFor(() => {
      expect(flushAutosave).toHaveBeenCalled();
      expect(handleSubmitMock).not.toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();
      expect(state.setField).toHaveBeenCalledWith('status', 'PUBLISHED');
    });
  });

  it('keeps Membership Publish disabled when known blockers exist', async () => {
    const handleSubmitMock = jest.fn((e?: React.FormEvent) => {
      e?.preventDefault();
    });
    const state = makeFacadeState({
      showRestOfForm: true,
      handleSubmit: handleSubmitMock,
      formData: {
        id: 'membership-1',
        name: 'Founders Club',
        description: '',
        type: 'MEMBERSHIP',
        price: 0,
      },
    });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    await waitFor(() => {
      expect(mockProductWorkspaceShell).toHaveBeenLastCalledWith(
        expect.objectContaining({
          canPublish: false,
          publishDisabledReason: 'Membership publishing is not available yet.',
          onPublish: expect.any(Function),
        }),
      );
    });

    await act(async () => {
      await mockProductWorkspaceShell.mock.calls[
        mockProductWorkspaceShell.mock.calls.length - 1
      ][0].onPublish();
    });

    expect(handleSubmitMock).not.toHaveBeenCalled();
    expect(mockUpdateProductDetailsUnwrap).not.toHaveBeenCalled();
  });

  it('Publish allows warnings when there are no blockers', async () => {
    const state = makeFacadeState({
      showRestOfForm: true,
      formData: {
        id: 'course-1',
        name: 'Ready Course',
        description: '',
        type: 'COURSE',
        price: 25,
        imageUrl: undefined,
        sections: [
          {
            id: 'section-1',
            title: 'Intro',
            position: 1,
            lessons: [
              {
                id: 'lesson-1',
                title: 'Welcome',
                sectionId: 'section-1',
                description: '',
              },
            ],
          },
        ],
      },
    });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    await act(async () => {
      await mockProductWorkspaceShell.mock.calls[
        mockProductWorkspaceShell.mock.calls.length - 1
      ][0].onPublish();
    });

    expect(mockEvaluateProductReadiness).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
    expect(state.setField).toHaveBeenCalledWith('status', 'PUBLISHED');
  });

  it('failed Publish stays retryable and shows Readiness feedback', async () => {
    mockUpdateProductDetailsUnwrap.mockRejectedValueOnce(new Error('nope'));
    const state = makeFacadeState({
      showRestOfForm: true,
      formData: {
        id: 'course-1',
        name: 'Ready Course',
        description: '',
        type: 'COURSE',
        price: 25,
        sections: [
          {
            id: 'section-1',
            title: 'Intro',
            position: 1,
            lessons: [
              {
                id: 'lesson-1',
                title: 'Welcome',
                sectionId: 'section-1',
                description: '',
              },
            ],
          },
        ],
      },
    });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    await act(async () => {
      await mockProductWorkspaceShell.mock.calls[
        mockProductWorkspaceShell.mock.calls.length - 1
      ][0].onPublish();
    });

    expect(state.setField).not.toHaveBeenCalledWith('status', 'PUBLISHED');

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Publish failed');
    });

    expect(mockProductWorkspaceShell).toHaveBeenLastCalledWith(
      expect.objectContaining({
        canPublish: true,
        isPublishing: false,
      }),
    );
  });

  it('prevents duplicate Publish while already publishing', async () => {
    const state = makeFacadeState({
      showRestOfForm: true,
      formData: {
        id: 'course-1',
        name: 'Ready Course',
        description: '',
        type: 'COURSE',
        price: 25,
        sections: [
          {
            id: 'section-1',
            title: 'Intro',
            position: 1,
            lessons: [
              {
                id: 'lesson-1',
                title: 'Welcome',
                sectionId: 'section-1',
                description: '',
              },
            ],
          },
        ],
      },
    });

    let resolvePublish: (value: { status: 'PUBLISHED' }) => void = jest.fn();
    mockUpdateProductDetailsUnwrap.mockReturnValueOnce(
      new Promise((resolve) => {
        resolvePublish = resolve;
      }),
    );
    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    const publish = mockProductWorkspaceShell.mock.calls[
      mockProductWorkspaceShell.mock.calls.length - 1
    ][0].onPublish;

    await act(async () => {
      void publish();
    });

    await waitFor(() => {
      expect(mockProductWorkspaceShell).toHaveBeenLastCalledWith(
        expect.objectContaining({ isPublishing: true }),
      );
    });

    await act(async () => {
      await mockProductWorkspaceShell.mock.calls[
        mockProductWorkspaceShell.mock.calls.length - 1
      ][0].onPublish();
    });

    expect(mockUpdateProductDetailsUnwrap).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolvePublish({ status: 'PUBLISHED' });
    });
  });

  it('does not expose an active Publish action for an already published Product', async () => {
    mockUseProductFormFacade.mockReturnValue(
      makeFacadeState({
        showRestOfForm: true,
        formData: {
          id: 'published-1',
          name: 'Published Product',
          description: '',
          type: 'COURSE',
          price: 25,
          status: 'PUBLISHED',
        },
      }),
    );

    render(<ProductForm />);

    expect(mockProductWorkspaceShell).toHaveBeenLastCalledWith(
      expect.objectContaining({
        canPublish: false,
        publishDisabledReason: 'This Product is already published.',
      }),
    );

    await act(async () => {
      await mockProductWorkspaceShell.mock.calls[
        mockProductWorkspaceShell.mock.calls.length - 1
      ][0].onPublish();
    });

    expect(mockUpdateProductDetailsUnwrap).not.toHaveBeenCalled();
  });

  it('Preview navigates to the private Product preview for published Products', async () => {
    const state = makeFacadeState({
      showRestOfForm: true,
      formData: {
        id: 'published-1',
        name: 'Published Product',
        description: '',
        type: 'COURSE',
        status: 'PUBLISHED',
        price: 0,
        sections: [],
      },
    });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    await waitFor(() => {
      expect(mockProductWorkspaceShell).toHaveBeenLastCalledWith(
        expect.objectContaining({ onPreview: expect.any(Function) }),
      );
    });

    mockProductWorkspaceShell.mock.calls[
      mockProductWorkspaceShell.mock.calls.length - 1
    ][0].onPreview();

    expect(mockNavigate).toHaveBeenCalledWith('/app/products/published-1/preview');
  });

  it('enables private Preview for Draft Products once they have an ID', async () => {
    const state = makeFacadeState({
      showRestOfForm: true,
      formData: {
        id: 'draft-1',
        name: 'Draft Product',
        description: '',
        type: 'COURSE',
        status: 'DRAFT',
        price: 0,
        sections: [],
      },
    });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    await waitFor(() => {
      expect(mockProductWorkspaceShell).toHaveBeenLastCalledWith(
        expect.objectContaining({
          canPreview: true,
          previewDisabledReason: undefined,
          onPreview: expect.any(Function),
        }),
      );
    });

    mockProductWorkspaceShell.mock.calls[
      mockProductWorkspaceShell.mock.calls.length - 1
    ][0].onPreview();

    expect(mockNavigate).toHaveBeenCalledWith('/app/products/draft-1/preview');
  });

  it('Back flushes pending Product autosave before leaving the workspace', async () => {
    const flushAutosave = jest.fn(() => Promise.resolve());
    const state = makeFacadeState({ flushAutosave });

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    await waitFor(() => {
      expect(mockProductWorkspaceShell).toHaveBeenLastCalledWith(
        expect.objectContaining({ onBack: expect.any(Function) }),
      );
    });

    await mockProductWorkspaceShell.mock.calls[
      mockProductWorkspaceShell.mock.calls.length - 1
    ][0].onBack();

    expect(flushAutosave).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/app/products');
  });

  it('submitting the form calls handleSubmit from the facade', async () => {
    const handleSubmitMock = jest.fn((e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }
    });

    const state = makeFacadeState({
      showRestOfForm: true,
      handleSubmit: handleSubmitMock,
    });

    mockUseProductFormFacade.mockReturnValue(state);

    const { container } = render(<ProductForm />);

    const form = container.querySelector('form');
    expect(form).not.toBeNull();

    fireEvent.submit(form!);

    expect(handleSubmitMock).toHaveBeenCalled();
  });

  it('switches to Sections before triggering section navigation from the sidebar', async () => {
    const state = makeFacadeState();

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    await waitFor(() => {
      expect(screen.getByTestId('builder-sidebar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('tab-pricing'));
    expect(screen.getByTestId('active-tab')).toHaveTextContent('pricing');

    fireEvent.click(screen.getByTestId('sidebar-section-link'));

    await waitFor(() => {
      expect(state.handleSidebarSectionClick).toHaveBeenCalledWith('section-1');
    });

    expect(screen.getByTestId('active-tab')).toHaveTextContent('sections');
  });

  it('switches to Sections before triggering lesson navigation from the sidebar', async () => {
    const state = makeFacadeState();

    mockUseProductFormFacade.mockReturnValue(state);

    render(<ProductForm />);

    await waitFor(() => {
      expect(screen.getByTestId('builder-sidebar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('tab-media'));
    expect(screen.getByTestId('active-tab')).toHaveTextContent('media');

    fireEvent.click(screen.getByTestId('sidebar-lesson-link'));

    await waitFor(() => {
      expect(state.handleSidebarLessonClick).toHaveBeenCalledWith('lesson-1');
    });

    expect(screen.getByTestId('active-tab')).toHaveTextContent('sections');
  });
});
