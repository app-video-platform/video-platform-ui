/**
 * @file CreateProductStepOne.test.tsx
 */

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  cleanup,
} from '@testing-library/react';
import '@testing-library/jest-dom';

// ── 1) MOCK react-redux ─────────────────────────────────────────────────────
jest.mock('react-redux', () => ({
  __esModule: true,
  useDispatch: jest.fn(),
}));
import { useDispatch } from 'react-redux';

// ── 2) MOCK createCourseProduct async thunk (UPDATED PATH) ──────────────────
jest.mock('@store/product-store', () => ({
  __esModule: true,
  createCourseProduct: jest.fn(),
}));
import { createCourseProduct } from '@store/product-store';

// ── 3) MOCK child components ────────────────────────────────────────────────

// 3.1. Barrel @shared/ui: Input, Button, VPIcon
jest.mock('@shared/ui', () => ({
  __esModule: true,
  Input: ({
    type,
    name,
    value,
    readOnly,
    className,
    onChange,
    onKeyDown,
  }: {
    type: string;
    name: string;
    value: string;
    readOnly?: boolean;
    className?: string;
    onChange: (e: { target: { value: string } }) => void;
    onKeyDown?: (e: any) => void;
  }) => (
    <input
      data-testid={`input-${name}`}
      type={type}
      name={name}
      value={value}
      readOnly={readOnly}
      className={className}
      onChange={(e) =>
        onChange({ target: { value: (e.target as HTMLInputElement).value } })
      }
      onKeyDown={onKeyDown}
    />
  ),
  Button: ({
    children,
    onClick,
    type,
    className,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    className?: string;
    disabled?: boolean;
    variant?: string;
    shape?: string;
  }) => {
    const isContinue = className?.includes('create-course-continue-button');
    return (
      <button
        data-testid={isContinue ? 'btn-continue' : 'btn-generic'}
        type={type ?? 'button'}
        onClick={onClick}
        className={className}
        disabled={disabled}
      >
        {children}
      </button>
    );
  },
  VPIcon: () => <span data-testid="gal-icon" />,
}));

// 3.2. ProductTypeSelector: simple stub that can set type to COURSE
jest.mock('@features/product-form/product-type-selector', () => ({
  __esModule: true,
  ProductTypeSelector: ({
    value,
    onChange,
  }: {
    value: string | undefined;
    onChange: (type: any) => void;
  }) => (
    <div data-testid="product-type-selector">
      <button
        data-testid="type-COURSE"
        style={{ fontWeight: value === 'COURSE' ? 'bold' : 'normal' }}
        onClick={() => onChange('COURSE')}
      >
        COURSE
      </button>
      <button
        data-testid="type-CONSULTATION"
        style={{ fontWeight: value === 'CONSULTATION' ? 'bold' : 'normal' }}
        onClick={() => onChange('CONSULTATION')}
      >
        CONSULTATION
      </button>
    </div>
  ),
}));

// ── 4) Import the component under test ──────────────────────────────────────
import CreateProductStepOne from './create-product-step-one.component';
import { ProductDraft } from '@features/product-form/models';
import { FormErrors } from '@pages/app';

// ── 5) Begin tests ──────────────────────────────────────────────────────────
describe('<CreateProductStepOne />', () => {
  const mockedUseDispatch = useDispatch as jest.MockedFunction<
    typeof useDispatch
  >;
  const mockedCreateCourse = createCourseProduct as jest.MockedFunction<
    typeof createCourseProduct
  >;

  let fakeDispatch: jest.Mock<any, any>;
  let setFieldMock: jest.Mock<any, any>;
  let setShowLoadingMock: jest.Mock<any, any>;
  let setShowRestMock: jest.Mock<any, any>;

  const baseFormData: ProductDraft = {
    id: '',
    name: '',
    description: '',
    type: 'COURSE',
    price: 'free',
    sections: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();

    fakeDispatch = jest.fn((action: any) => ({
      unwrap: () =>
        Promise.resolve({
          id: 'new-id-123',
          type: 'COURSE',
          sections: ['sec1'],
        }),
    }));
    mockedUseDispatch.mockReturnValue(fakeDispatch as any);
    mockedCreateCourse.mockReset();

    setFieldMock = jest.fn();
    setShowLoadingMock = jest.fn();
    setShowRestMock = jest.fn();
  });

  it('renders title input, type selector, and a disabled Continue button when name/type are empty', () => {
    const errors: FormErrors = {};

    render(
      <CreateProductStepOne
        formData={{ ...baseFormData }}
        setField={setFieldMock}
        errors={errors}
        showRestOfForm={false}
        userId="user-1"
        setShowLoadingRestOfForm={setShowLoadingMock}
        setShowRestOfForm={setShowRestMock}
      />,
    );

    // Title input
    expect(screen.getByTestId('input-name')).toBeInTheDocument();
    // Type selector
    expect(screen.getByTestId('product-type-selector')).toBeInTheDocument();
    // Continue button present and disabled (no name & no type)
    const continueBtn = screen.getByTestId('btn-continue');
    expect(continueBtn).toBeInTheDocument();
    expect(continueBtn).toBeDisabled();
  });

  it('calls setField when typing into Title and when selecting a type; Continue becomes enabled when both exist', () => {
    let formData: ProductDraft = { ...baseFormData };
    const errors: FormErrors = {};

    // Initial render
    const { rerender } = render(
      <CreateProductStepOne
        formData={formData}
        setField={setFieldMock}
        errors={errors}
        showRestOfForm={false}
        userId="user-1"
        setShowLoadingRestOfForm={setShowLoadingMock}
        setShowRestOfForm={setShowRestMock}
      />,
    );

    // Type into name
    const titleInput = screen.getByTestId('input-name') as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'My Course Title' } });
    expect(setFieldMock).toHaveBeenLastCalledWith('name', 'My Course Title');

    // Click type=COURSE
    const courseBtn = screen.getByTestId('type-COURSE');
    fireEvent.click(courseBtn);
    expect(setFieldMock).toHaveBeenLastCalledWith('type', 'COURSE');

    // Now update formData and rerender to reflect those changes
    formData = { ...formData, name: 'My Course Title', type: 'COURSE' };
    rerender(
      <CreateProductStepOne
        formData={formData}
        setField={setFieldMock}
        errors={errors}
        showRestOfForm={false}
        userId="user-1"
        setShowLoadingRestOfForm={setShowLoadingMock}
        setShowRestOfForm={setShowRestMock}
      />,
    );

    const continueBtn = screen.getByTestId('btn-continue');
    expect(continueBtn).toBeEnabled();
  });

  it('clicking Continue sets loading state and dispatches createCourseProduct, then sets fields and rest-of-form', async () => {
    jest.useFakeTimers();

    const fakeThunkSymbol = Symbol('fakeThunk');
    mockedCreateCourse.mockReturnValue(fakeThunkSymbol as any);

    fakeDispatch.mockImplementation((action) => {
      expect(action).toBe(fakeThunkSymbol);
      return {
        unwrap: () =>
          Promise.resolve({
            id: 'new-id-123',
            type: 'COURSE',
            sections: ['secA', 'secB'],
          }),
      };
    });

    const filledFormData: ProductDraft = {
      ...baseFormData,
      name: 'Test Course',
      type: 'COURSE',
    };
    const errors: FormErrors = {};

    render(
      <CreateProductStepOne
        formData={filledFormData}
        setField={setFieldMock}
        errors={errors}
        showRestOfForm={false}
        userId="user-1"
        setShowLoadingRestOfForm={setShowLoadingMock}
        setShowRestOfForm={setShowRestMock}
      />,
    );

    const continueBtn = screen.getByTestId('btn-continue');
    expect(continueBtn).toBeEnabled();

    // Click Continue
    fireEvent.click(continueBtn);

    // Loading set to true immediately
    expect(setShowLoadingMock).toHaveBeenCalledWith(true);

    // Advance 500ms timeout
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    // createCourseProduct called with correct payload (no description, status 'DRAFT')
    expect(mockedCreateCourse).toHaveBeenCalledWith({
      name: 'Test Course',
      type: 'COURSE',
      userId: 'user-1',
      status: 'DRAFT',
    });

    // Wait for unwrap() Promise
    await act(async () => {
      await Promise.resolve();
    });

    // Fields updated from response
    expect(setFieldMock).toHaveBeenCalledWith('id', 'new-id-123');
    expect(setFieldMock).toHaveBeenCalledWith('sections', ['secA', 'secB']);
    // Rest of form shown
    expect(setShowRestMock).toHaveBeenCalledWith(true);
    // Loading reset to false
    expect(setShowLoadingMock).toHaveBeenCalledWith(false);

    jest.useRealTimers();
  });

  it('does NOT call createCourseProduct if name is empty', () => {
    const emptyNameFormData: ProductDraft = {
      ...baseFormData,
      name: '',
      type: 'COURSE',
    };
    const errors: FormErrors = {};

    render(
      <CreateProductStepOne
        formData={emptyNameFormData}
        setField={setFieldMock}
        errors={errors}
        showRestOfForm={false}
        userId="user-1"
        setShowLoadingRestOfForm={setShowLoadingMock}
        setShowRestOfForm={setShowRestMock}
      />,
    );

    const continueBtn = screen.getByTestId('btn-continue');
    expect(continueBtn).toBeDisabled();

    // Even if user clicks, handler early-returns
    fireEvent.click(continueBtn);
    expect(mockedCreateCourse).not.toHaveBeenCalled();
  });
});
