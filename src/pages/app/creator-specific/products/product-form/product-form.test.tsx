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

// ── 1) Mock @components (GalPriceSelector) ──────────────────────────────
jest.mock('@components', () => ({
  __esModule: true,
  GalPriceSelector: ({ price }: { price: number }) => (
    <div data-testid="price-selector">
      GalPriceSelector (price: {String(price)})
    </div>
  ),
}));

// ── 2) Mock @shared/ui (GalUppyFileUploader) ────────────────────────────
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
}));

// ── 3) Mock @features/product-form (facade + children) ──────────────────
const mockUseProductFormFacade = jest.fn();
const mockUseProductFormAnimation = jest.fn();

jest.mock('@features/product-form', () => ({
  __esModule: true,
  // hooks
  useProductFormFacade: (...args: any[]) => mockUseProductFormFacade(...args),
  useProductFormAnimation: (...args: any[]) =>
    mockUseProductFormAnimation(...args),

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
  ConsultationDetails: () => (
    <div data-testid="consultation-details">ConsultationDetails</div>
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
  }: {
    activeTab: string | null;
    onChange: (tab: any) => void;
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
      <button data-testid="tab-media" onClick={() => onChange('media')}>
        Media
      </button>
    </div>
  ),

  // runtime placeholders for types (not actually used at runtime)
  BuilderTab: {} as any,
  SectionDraft: {} as any,
}));

// ── 4) Import component under test (after mocks) ────────────────────────
import ProductForm from './product-form.component';

// ── 5) Helpers ───────────────────────────────────────────────────────────
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

const makeFacadeState = (overrides: Partial<any> = {}) => ({
  user: { id: 'user-123' },
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
});
