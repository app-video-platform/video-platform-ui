/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
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

// ── (1) ALWAYS mock react-redux at the top, so useSelector/useDispatch become Jest mocks ──
jest.mock('react-redux', () => ({
  __esModule: true,
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));
import { useSelector, useDispatch } from 'react-redux';

// ── (2) Mock selectors & action creators ──
jest.mock('@store/auth-store/auth.selectors', () => ({
  selectAuthUser: jest.fn(),
}));
import { selectAuthUser } from '@store/auth-store';

jest.mock('@store/product-store/product.slice', () => ({
  updateCourseProductDetails: jest.fn(),
}));
import { updateCourseProductDetails } from '@store/product-store';

// ── (3) Provide a “default” mock for CreateProductStepOne that *does* set fields ──
// This will be used by most tests.
jest.mock(
  '@features/product-form/editors/create-product-step-one/create-product-step-one.component',
  () => ({
    __esModule: true,
    default: ({ setField, setShowRestOfForm }: any) => (
      <button
        data-testid="step-one-continue"
        onClick={() => {
          // This mock *does* populate all required fields + showRestOfForm
          setField('id', 'test-id-123');
          setField('name', 'My Test Course');
          setField('type', 'COURSE');
          setField('description', 'Some description');
          setShowRestOfForm(true);
        }}
      >
        Continue
      </button>
    ),
  }),
);

// ── (4) Mock the other child components and <GalButton> exactly as before ──
jest.mock(
  '@components/gal-price-selector/gal-price-selector.component',
  () => ({
    __esModule: true,
    default: ({ price }: any) => (
      <div data-testid="price-selector">
        GalPriceSelector (current: {String(price)})
      </div>
    ),
  }),
);

jest.mock(
  '@shared/ui/gal-uppy-file-uploader/gal-uppy-file-uploader.component',
  () => ({
    __esModule: true,
    default: ({ onFilesChange }: any) => (
      <button
        data-testid="file-uploader"
        onClick={() => {
          const fakeFile = new File([''], 'image.png', {
            type: 'image/png',
          });
          onFilesChange([fakeFile]);
        }}
      >
        Upload Image
      </button>
    ),
  }),
);

jest.mock(
  '@features/product-form/create-product-sections/create-product-sections.component',
  () => ({
    __esModule: true,
    default: ({ productType, productId }: any) => (
      <div data-testid="create-sections">
        CreateProductSections (type: {productType}, id: {productId})
      </div>
    ),
  }),
);

jest.mock('@shared/ui/gal-button/gal-button.component', () => ({
  __esModule: true,
  default: ({ text, htmlType }: any) => (
    <button
      data-testid={`btn-${text.replace(/\s+/g, '-').toLowerCase()}`}
      type={htmlType}
    >
      {text}
    </button>
  ),
}));

// ── (5) Set up a fakeDispatch (returns an object with unwrap()) ──
const mockDispatch = jest.fn((action: any) => ({
  unwrap: () => Promise.resolve({ updated: true, id: 'test-id-123' }),
}));

// ── (6) Prepare typed aliases for the mocks (so TS doesn’t complain) ──
const mockedUseSelector = useSelector as jest.MockedFunction<
  typeof useSelector
>;
const mockedUseDispatch = useDispatch as jest.MockedFunction<
  typeof useDispatch
>;
const mockedUpdateCourse = updateCourseProductDetails as jest.MockedFunction<
  typeof updateCourseProductDetails
>;

// ── (7) Common setup: always clear mocks & have useDispatch return mockDispatch ──
beforeEach(() => {
  jest.clearAllMocks();
  mockedUseDispatch.mockReturnValue(mockDispatch as any); // “as any” silences TS here
});

afterEach(() => {
  cleanup();
});

describe('<ProductForm />', () => {
  test('renders “must be logged in” if no user', () => {
    mockedUseSelector.mockImplementation((selector) => {
      if (selector === selectAuthUser) {
        return null;
      }
      return undefined;
    });

    // Import the component normally (uses the default mock CreateProductStepOne)
    const { default: ProductForm } = require('./product-form.component');
    render(<ProductForm />);

    expect(
      screen.getByText('You must be logged in to create a product.'),
    ).toBeInTheDocument();
  });

  test('shows step-one button & hides rest of form when user is present', () => {
    mockedUseSelector.mockImplementation((selector) => {
      if (selector === selectAuthUser) {
        return { id: 'user-123' };
      }
      return undefined;
    });

    const { default: ProductForm } = require('./product-form.component');
    render(<ProductForm />);

    expect(screen.getByTestId('step-one-continue')).toBeInTheDocument();
    expect(screen.queryByTestId('price-selector')).not.toBeInTheDocument();
    expect(screen.queryByTestId('file-uploader')).not.toBeInTheDocument();
    expect(screen.queryByTestId('create-sections')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('btn-update-product-details'),
    ).not.toBeInTheDocument();
  });

  test('clicking “Continue” (default step-one) shows price selector, uploader, sections & update button', () => {
    mockedUseSelector.mockImplementation((selector) => {
      if (selector === selectAuthUser) {
        return { id: 'user-123' };
      }
      return undefined;
    });

    const { default: ProductForm } = require('./product-form.component');
    render(<ProductForm />);

    fireEvent.click(screen.getByTestId('step-one-continue'));

    expect(screen.getByTestId('price-selector')).toBeInTheDocument();
    expect(screen.getByTestId('file-uploader')).toBeInTheDocument();
    expect(screen.getByTestId('create-sections')).toBeInTheDocument();
    expect(
      screen.getByTestId('btn-update-product-details'),
    ).toBeInTheDocument();
  });

  test('submitting with all required fields dispatches + unwraps + alerts', async () => {
    mockedUseSelector.mockImplementation((selector) => {
      if (selector === selectAuthUser) {
        return { id: 'user-123' };
      }
      return undefined;
    });

    // Use the original CreateProductStepOne (the one that *does* fill id/name/type)
    // Since we mocked it at top, we can just re‐require the component:
    const { default: ProductForm } = require('./product-form.component');

    // When updateCourseProductDetails is called, return a fake thunk
    const fakeThunk = Symbol('fakeThunk');
    mockedUpdateCourse.mockReturnValue(fakeThunk as any);

    // Make dispatch(fakeThunk).unwrap() resolve successfully
    mockDispatch.mockImplementation((action) => {
      expect(action).toBe(fakeThunk);
      return {
        unwrap: () => Promise.resolve({ updated: true, id: 'test-id-123' }),
      };
    });

    // Spy on alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<ProductForm />);

    // 1) Click the “Continue” button (populates formData and sets showRestOfForm=true)
    fireEvent.click(screen.getByTestId('step-one-continue'));

    // 2) Click the “Update product details” button
    fireEvent.click(screen.getByTestId('btn-update-product-details'));

    // Wait for dispatch(fakeThunk) to have been called
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(fakeThunk);
    });

    // Wait for unwrap() → then window.alert(...)
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'Course product updated successfully!',
      );
    });

    alertSpy.mockRestore();
  });
});
