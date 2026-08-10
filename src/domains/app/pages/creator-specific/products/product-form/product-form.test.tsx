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
} from '@testing-library/react';
import '@testing-library/jest-dom';

const mockProductStoreState = {
  products: {
    productSummaries: null as any[] | null,
    loading: false,
    error: null as string | null,
  },
};

// ── 1) Mock @shared/ui (UppyFileUploader) ────────────────────────────
jest.mock('@shared/ui', () => ({
  __esModule: true,
  GalUppyFileUploader: ({
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
  useDispatch: jest.fn(() => jest.fn()),
  useSelector: jest.fn((selector) => selector(mockProductStoreState)),
}));

// ── 2) Mock app features barrel used by ProductForm ──────────────────────
const mockUseProductFormFacade = jest.fn();
const mockUseProductFormAnimation = jest.fn();
const mockProductHeader = jest.fn();
const mockUseMembershipBuilderState = jest.fn();
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
  useMembershipBuilderState: (...args: any[]) =>
    mockUseMembershipBuilderState(...args),
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

  // consultation details tab stub
  ConsultationDetailsSection: () => (
    <div data-testid="consultation-details">ConsultationDetails</div>
  ),

  MembershipContentSection: () => (
    <div data-testid="membership-content">Included Products</div>
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
  ProductHeader: (props: any) => {
    mockProductHeader(props);
    return <div data-testid="product-header">ProductHeader</div>;
  },
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

// ── 3) Mock app components barrel used by ProductForm ────────────────────
jest.mock('domains/app/components', () => ({
  __esModule: true,
  GalPriceSelector: ({ price }: { price: number }) => (
    <div data-testid="price-selector">
      GalPriceSelector (price: {String(price)})
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
  mockUseMembershipBuilderState.mockReturnValue({
    nativeContentItems: [],
    feedEntries: [],
    orderingMode: 'NEWEST_FIRST',
    includedProductEntries: [],
    getNextNativeContentId: jest.fn(),
    setOrderingMode: jest.fn(),
    addNativeContentItem: jest.fn(),
    updateNativeContentItem: jest.fn(),
    deleteNativeContentItem: jest.fn(),
    addIncludedProducts: jest.fn(),
    removeIncludedProduct: jest.fn(),
    moveFeedEntry: jest.fn(),
  });
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

  it('passes isEditMode from facade to ProductHeader', () => {
    mockUseProductFormFacade.mockReturnValue(
      makeFacadeState({ isEditMode: true }),
    );

    render(<ProductForm />);

    expect(mockProductHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        isEditMode: true,
      }),
    );
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

    // Wait until builder/sections show up (activeTab is set via effect)
    await waitFor(() => {
      expect(screen.getByTestId('builder-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('create-sections')).toBeInTheDocument();
    });

    // Hero step-one should not be rendered when showRestOfForm is true
    expect(screen.queryByTestId('step-one-continue')).not.toBeInTheDocument();
  });

  it('clicking Pricing tab shows the GalPriceSelector panel', async () => {
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

    // Wait for builder to appear (activeTab initially "sections")
    await waitFor(() => {
      expect(screen.getByTestId('builder-sidebar')).toBeInTheDocument();
    });

    // Click the "Pricing" tab in our mocked sidebar
    fireEvent.click(screen.getByTestId('tab-pricing'));

    // Now the pricing panel should show our GalPriceSelector stub
    expect(screen.getByTestId('price-selector')).toBeInTheDocument();
    // And sections panel should be gone
    expect(screen.queryByTestId('create-sections')).not.toBeInTheDocument();
  });

  it.each(['COURSE', 'DOWNLOAD', 'CONSULTATION'])(
    'uses the legacy GalPriceSelector for %s pricing',
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

      expect(screen.getByTestId('price-selector')).toBeInTheDocument();
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

    expect(screen.getByTestId('recurring-price-selector')).toBeInTheDocument();
    expect(screen.getByTestId('recurring-price-selector')).toHaveTextContent(
      '0 EUR MONTH',
    );
    expect(screen.queryByTestId('price-selector')).not.toBeInTheDocument();
  });

  it('passes derived Membership readiness to ProductHeader', async () => {
    mockUseMembershipBuilderState.mockReturnValue({
      nativeContentItems: [
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
      feedEntries: [],
      orderingMode: 'NEWEST_FIRST',
      includedProductEntries: [],
      getNextNativeContentId: jest.fn(),
      setOrderingMode: jest.fn(),
      addNativeContentItem: jest.fn(),
      updateNativeContentItem: jest.fn(),
      deleteNativeContentItem: jest.fn(),
      addIncludedProducts: jest.fn(),
      removeIncludedProduct: jest.fn(),
      moveFeedEntry: jest.fn(),
    });
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
      expect(mockEvaluateMembershipReadiness).toHaveBeenCalledWith(
        expect.objectContaining({
          formData: state.formData,
          nativeContentItems: expect.arrayContaining([
            expect.objectContaining({ status: 'PUBLISHED' }),
          ]),
        }),
      );
    });

    expect(mockProductHeader).toHaveBeenLastCalledWith(
      expect.objectContaining({
        membershipReadiness: expect.objectContaining({
          canPublish: false,
        }),
      }),
    );
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
      expect(mockEvaluateMembershipReadiness).toHaveBeenLastCalledWith(
        expect.objectContaining({
          recurringPricing: expect.objectContaining({ amount: 25 }),
        }),
      );
    });
  });

  it('updates Membership readiness when published native content is added', async () => {
    const emptyBuilderState = {
      nativeContentItems: [],
      feedEntries: [],
      orderingMode: 'NEWEST_FIRST',
      includedProductEntries: [],
      getNextNativeContentId: jest.fn(),
      setOrderingMode: jest.fn(),
      addNativeContentItem: jest.fn(),
      updateNativeContentItem: jest.fn(),
      deleteNativeContentItem: jest.fn(),
      addIncludedProducts: jest.fn(),
      removeIncludedProduct: jest.fn(),
      moveFeedEntry: jest.fn(),
    };
    const publishedBuilderState = {
      ...emptyBuilderState,
      nativeContentItems: [
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
    mockUseMembershipBuilderState.mockReturnValue(emptyBuilderState);

    const view = render(<ProductForm />);

    await waitFor(() => {
      expect(mockEvaluateMembershipReadiness).toHaveBeenCalledWith(
        expect.objectContaining({ nativeContentItems: [] }),
      );
    });

    mockUseMembershipBuilderState.mockReturnValue(publishedBuilderState);
    view.rerender(<ProductForm />);

    await waitFor(() => {
      expect(mockEvaluateMembershipReadiness).toHaveBeenLastCalledWith(
        expect.objectContaining({
          nativeContentItems: expect.arrayContaining([
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
    mockUseMembershipBuilderState.mockReturnValue({
      nativeContentItems: [],
      feedEntries: [
        {
          entryId: 'product:download-1',
          kind: 'PRODUCT',
          productId: 'download-1',
          addedAt: '2026-08-10T10:00:00.000Z',
        },
      ],
      orderingMode: 'NEWEST_FIRST',
      includedProductEntries: [
        {
          entryId: 'product:download-1',
          kind: 'PRODUCT',
          productId: 'download-1',
          addedAt: '2026-08-10T10:00:00.000Z',
        },
      ],
      getNextNativeContentId: jest.fn(),
      setOrderingMode: jest.fn(),
      addNativeContentItem: jest.fn(),
      updateNativeContentItem: jest.fn(),
      deleteNativeContentItem: jest.fn(),
      addIncludedProducts: jest.fn(),
      removeIncludedProduct: jest.fn(),
      moveFeedEntry: jest.fn(),
    });
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
      expect(mockEvaluateMembershipReadiness).toHaveBeenCalledWith(
        expect.objectContaining({
          includedProducts: [
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

    expect(mockProductHeader).toHaveBeenLastCalledWith(
      expect.objectContaining({
        membershipReadiness: expect.any(Object),
      }),
    );
  });

  it('when showRestOfForm is true for a MEMBERSHIP, shows membership content after effect', async () => {
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
      expect(screen.getByTestId('membership-content')).toBeInTheDocument();
    });

    expect(screen.getByText('Included Products')).toBeInTheDocument();
    expect(screen.getByTestId('active-tab')).toHaveTextContent(
      'membership-content',
    );
    expect(screen.queryByTestId('create-sections')).not.toBeInTheDocument();
  });

  it('clicking Media tab shows the image uploader (GalUppyFileUploader)', async () => {
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

    expect(screen.getByTestId('file-uploader')).toBeInTheDocument();
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
