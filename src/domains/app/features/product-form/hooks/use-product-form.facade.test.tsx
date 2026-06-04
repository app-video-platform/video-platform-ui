import { renderHook } from '@testing-library/react';

import { useProductFormFacade } from './use-product-form.facade';

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockUseProductLoader = jest.fn();
const mockUseProductAutosave = jest.fn();
const mockUseProductFormState = jest.fn();
const mockUseProductActions = jest.fn();
const mockUseSidebarSections = jest.fn();
const mockUseSidebarScroll = jest.fn();

let mockParams = { id: 'product-1', type: 'COURSE' as string | undefined };
let mockFormName = 'Initial product';

jest.mock('react-redux', () => ({
  __esModule: true,
  useDispatch: () => mockDispatch,
  useSelector: () => ({ id: 'user-1' }),
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

jest.mock('./use-product-loader.hooks', () => ({
  __esModule: true,
  useProductLoader: (...args: unknown[]) => mockUseProductLoader(...args),
}));

jest.mock('./use-product-autosave.hook', () => ({
  __esModule: true,
  useProductAutosave: (...args: unknown[]) => mockUseProductAutosave(...args),
}));

jest.mock('./use-product-form-state.hook', () => ({
  __esModule: true,
  useProductFormState: (...args: unknown[]) =>
    mockUseProductFormState(...args),
}));

jest.mock('./use-product.actions.hook', () => ({
  __esModule: true,
  useProductActions: (...args: unknown[]) => mockUseProductActions(...args),
}));

jest.mock('./use-sidebar-scroll.hook', () => ({
  __esModule: true,
  useSidebarSections: (...args: unknown[]) => mockUseSidebarSections(...args),
  useSidebarScroll: (...args: unknown[]) => mockUseSidebarScroll(...args),
}));

const setFormData = jest.fn();
const setErrors = jest.fn();
const setShowRestOfForm = jest.fn();

const mockFormState = () => {
  mockUseProductFormState.mockImplementation(() => ({
    formData: {
      id: 'product-1',
      name: mockFormName,
      description: '',
      type: 'COURSE',
      price: 'free',
      sections: [],
    },
    setFormData,
    setField: jest.fn(),
    errors: {},
    setErrors,
    validateForm: jest.fn(),
    handleSetPrice: jest.fn(),
    productImage: null,
    handleImageChange: jest.fn(),
    showRestOfForm: true,
    setShowRestOfForm,
    showLoadingRestOfForm: false,
    setShowLoadingRestOfForm: jest.fn(),
  }));
};

describe('useProductFormFacade', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: 'product-1', type: 'COURSE' };
    mockFormName = 'Initial product';
    mockFormState();
    mockUseProductLoader.mockReturnValue({ lastSavedSnapshot: { current: null } });
    mockUseProductAutosave.mockReturnValue({
      isAutosaving: false,
      lastSavedAt: null,
    });
    mockUseProductActions.mockReturnValue({
      handleSubmit: jest.fn(),
      handleProductRemove: jest.fn(),
    });
    mockUseSidebarSections.mockReturnValue([]);
    mockUseSidebarScroll.mockReturnValue({
      handleSidebarSectionClick: jest.fn(),
      handleSidebarLessonClick: jest.fn(),
    });
  });

  it('keeps the product-loaded callback stable across form-only rerenders', () => {
    const { rerender } = renderHook(() => useProductFormFacade());

    const firstCallback = mockUseProductLoader.mock.calls[0][0].onProductLoaded;

    mockFormName = 'Typed locally';
    rerender();

    const secondCallback = mockUseProductLoader.mock.calls[1][0].onProductLoaded;
    expect(secondCallback).toBe(firstCallback);
  });

  it('redirects once when the loaded product type does not match the route type', () => {
    renderHook(() => useProductFormFacade());

    const onProductLoaded =
      mockUseProductLoader.mock.calls[0][0].onProductLoaded;

    onProductLoaded({ id: 'product-1', type: 'DOWNLOAD' });

    expect(mockNavigate).toHaveBeenCalledWith('/app/products/edit/product-1', {
      replace: true,
    });
  });
});
