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

// ── 1) FULLY MOCK react-redux ─────────────────────────────────────────────────────
jest.mock('react-redux', () => ({
  __esModule: true,
  useDispatch: jest.fn(),
}));
import { useDispatch } from 'react-redux';

// ── 2) MOCK createCourseProduct async thunk ───────────────────────────────────────
jest.mock('@store/product-store/product.slice', () => ({
  createCourseProduct: jest.fn(),
}));
import { createCourseProduct } from '@store/product-store';

// ── 3) MOCK child components ──────────────────────────────────────────────────────
// 3.1. GalFormInput: render a simple input/textarea that calls `onChange({ target: { value } })`
jest.mock('@shared/ui/gal-form-input/gal-form-input.component', () => ({
  __esModule: true,
  default: ({
    label,
    type,
    name,
    value,
    inputType,
    onChange,
  }: {
    label: string;
    type: string;
    name: string;
    value: string;
    inputType?: string;
    onChange: (e: { target: { value: string } }) => void;
  }) => {
    // For testing, give data-testid="input-<name>"
    if (inputType === 'textarea') {
      return (
        <textarea
          data-testid={`input-${name}`}
          aria-label={label}
          name={name}
          value={value}
          onChange={(e) => onChange({ target: { value: e.target.value } })}
        />
      );
    }
    return (
      <input
        data-testid={`input-${name}`}
        aria-label={label}
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange({ target: { value: e.target.value } })}
      />
    );
  },
}));

// 3.2. GalBoxSelector: render one button per availableOption that calls `onSelect(option)`
jest.mock('@components/gal-box-selector/gal-box-selector.component', () => ({
  __esModule: true,
  default: ({
    selectedOption,
    onSelect,
    availableOptions,
  }: {
    selectedOption: string;
    onSelect: (opt: string) => void;
    availableOptions: string[];
  }) => (
    <div data-testid="box-selector">
      {availableOptions.map((opt) => (
        <button
          key={opt}
          data-testid={`box-${opt}`}
          style={{
            fontWeight: selectedOption === opt ? 'bold' : 'normal',
          }}
          onClick={() => onSelect(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  ),
}));

// 3.3. GalButton: render a button with onClick, disabled, and text; give it data-testid="btn-<text>"
jest.mock('@shared/ui/gal-button/gal-button.component', () => ({
  __esModule: true,
  default: ({
    text,
    htmlType,
    onClick,
    disabled,
  }: {
    text: string;
    htmlType: 'button' | 'submit';
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button
      data-testid={`btn-${text.replace(/\s+/g, '-').toLowerCase()}`}
      type={htmlType}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  ),
}));

// ── 4) Import the component under test ──────────────────────────────────────────────
import CreateProductStepOne from './create-product-step-one.component';

// ── 5) Begin tests ─────────────────────────────────────────────────────────────────
describe('<CreateProductStepOne />', () => {
  // Keep references to the mocks in typed form:
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

  const baseFormData = {
    id: '',
    name: '',
    description: '',
    type: '' as any,
    price: 'free' as 'free' | number,
    sections: [] as any[],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();

    // A fake dispatch function that returns an object with .unwrap()
    fakeDispatch = jest.fn((action: any) => ({
      unwrap: () => Promise.resolve({ id: 'new-id-123', sections: ['sec1'] }),
    }));

    // Make useDispatch() return our fakeDispatch
    mockedUseDispatch.mockReturnValue(fakeDispatch as any);

    // Reset the createCourseProduct mock
    mockedCreateCourse.mockReset();

    // Create fresh spies for setField, setShowLoadingRestOfForm, setShowRestOfForm
    setFieldMock = jest.fn();
    setShowLoadingMock = jest.fn();
    setShowRestMock = jest.fn();
  });

  it('renders Title, Description, type selectors, and a disabled Continue button when name is empty', () => {
    render(
      <CreateProductStepOne
        formData={{ ...baseFormData }}
        setField={setFieldMock}
        errors={{}}
        showRestOfForm={false}
        userId="user-1"
        setShowLoadingRestOfForm={setShowLoadingMock}
        setShowRestOfForm={setShowRestMock}
      />,
    );

    // 1) Title input (name)
    expect(screen.getByTestId('input-name')).toBeInTheDocument();
    // 2) Description textarea
    expect(screen.getByTestId('input-description')).toBeInTheDocument();
    // 3) Type selectors (GalBoxSelector)
    expect(screen.getByTestId('box-selector')).toBeInTheDocument();
    // 4) Continue button must be present and disabled because name is empty
    const continueBtn = screen.getByTestId('btn-continue');
    expect(continueBtn).toBeInTheDocument();
    expect(continueBtn).toBeDisabled();
  });

  it('displays error messages when errors.name or errors.type are provided', () => {
    const errors = {
      name: 'Name is required!',
      type: 'Type is required!',
    };

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

    // The <p> for errors.name should appear
    expect(screen.getByText(errors.name)).toBeInTheDocument();
    // The <p> for errors.type should appear (under the selectors)
    expect(screen.getByText(errors.type)).toBeInTheDocument();
  });

  it('calls setField when typing into Title and Description, and toggles Continue button enabled', () => {
    let formData = { ...baseFormData };
    // We’ll pass our own “formData” reference so we can mutate it manually when setField is called
    // but for testing, we only care that setFieldMock is invoked correctly

    render(
      <CreateProductStepOne
        formData={formData}
        setField={setFieldMock}
        errors={{}}
        showRestOfForm={false}
        userId="user-1"
        setShowLoadingRestOfForm={setShowLoadingMock}
        setShowRestOfForm={setShowRestMock}
      />,
    );

    // Simulate typing into Title
    const titleInput = screen.getByTestId('input-name') as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'My Course Title' } });
    expect(setFieldMock).toHaveBeenLastCalledWith('name', 'My Course Title');

    // Simulate typing into Description
    const descTextarea = screen.getByTestId(
      'input-description',
    ) as HTMLTextAreaElement;
    fireEvent.change(descTextarea, { target: { value: 'A great course' } });
    expect(setFieldMock).toHaveBeenLastCalledWith(
      'description',
      'A great course',
    );

    // Simulate selecting a type (GalBoxSelector buttons)
    // AVAILABLE_TYPES = ['COURSE','DOWNLOAD','CONSULTATION']
    const courseBtn = screen.getByTestId('box-COURSE');
    fireEvent.click(courseBtn);
    expect(setFieldMock).toHaveBeenLastCalledWith('type', 'COURSE');

    // Now that title is non-empty, the Continue button should no longer be disabled.
    // However, because `formData` itself wasn’t updated (we only spied on setField),
    // the component’s `disabled={!formData.name}` is STILL true. To test the “enabled” logic,
    // we’d need to rerender with an updated formData. Let’s do that now:

    cleanup();
    formData = { ...formData, name: 'My Course Title' };
    render(
      <CreateProductStepOne
        formData={formData}
        setField={setFieldMock}
        errors={{}}
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

    // Prepare a fake thunk action (the return of createCourseProduct)
    const fakeThunkSymbol = Symbol('fakeThunk');
    mockedCreateCourse.mockReturnValue(fakeThunkSymbol as any);

    // Prepare fakeDispatch to check the action and return an object with unwrap()
    fakeDispatch.mockImplementation((action) => {
      // It should be called with the fake thunk
      expect(action).toBe(fakeThunkSymbol);
      return {
        unwrap: () =>
          Promise.resolve({ id: 'new-id-123', sections: ['secA', 'secB'] }),
      };
    });

    // Start with all required fields filled in the parent formData:
    const filledFormData = {
      ...baseFormData,
      name: 'Test Course',
      description: 'Test description',
      type: 'COURSE' as any,
    };

    render(
      <CreateProductStepOne
        formData={filledFormData}
        setField={setFieldMock}
        errors={{}}
        showRestOfForm={false}
        userId="user-1"
        setShowLoadingRestOfForm={setShowLoadingMock}
        setShowRestOfForm={setShowRestMock}
      />,
    );

    // 1) Click “Continue”
    const continueBtn = screen.getByTestId('btn-continue');
    fireEvent.click(continueBtn);

    // Immediately after click:
    expect(setShowLoadingMock).toHaveBeenCalledWith(true);

    // Advance time by 500ms to trigger the setTimeout
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    // Now the component will call: dispatch(createCourseProduct(payload)).unwrap()
    // Check that createCourseProduct was called with the correct payload:
    expect(mockedCreateCourse).toHaveBeenCalledWith({
      name: 'Test Course',
      description: 'Test description',
      type: 'COURSE',
      userId: 'user-1',
      status: 'draft',
    });

    // Wait a microtask for the Promise.resolve in unwrap()
    await act(async () => {
      // flush any pending promises
      await Promise.resolve();
    });

    // After unwrap resolves:
    // 1) setField('id', data.id)
    expect(setFieldMock).toHaveBeenCalledWith('id', 'new-id-123');
    // 2) setField('sections', data.sections)
    expect(setFieldMock).toHaveBeenCalledWith('sections', ['secA', 'secB']);
    // 3) setShowRestOfForm(true)
    expect(setShowRestMock).toHaveBeenCalledWith(true);
    // 4) Finally, setShowLoadingRestOfForm(false)
    expect(setShowLoadingMock).toHaveBeenCalledWith(false);

    jest.useRealTimers();
  });
});
