/**
 * SectionEditor.test.tsx
 * (Place this file in the same directory as section-editor.component.tsx)
 */

import React, { use } from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  cleanup,
} from '@testing-library/react';
import '@testing-library/jest-dom';

// ── 1) MOCK react-redux useDispatch ───────────────────────────────────────────
jest.mock('react-redux', () => ({
  __esModule: true,
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
import { useDispatch, useSelector } from 'react-redux';

jest.mock('../../../../../store/auth-store/auth.selectors', () => ({
  selectAuthUser: jest.fn(),
}));
import { selectAuthUser } from '../../../../../store/auth-store/auth.selectors';

// ── 2) MOCK product-store thunks ─────────────────────────────────────────────────
jest.mock('../../../../../store/product-store/product.slice', () => ({
  createSection: jest.fn(),
  updateSectionDetails: jest.fn(),
  deleteSection: jest.fn(),
}));
import {
  createSection,
  updateSectionDetails,
  deleteSection,
} from '../../../../../store/product-store/product.slice';

// ── 3) MOCK child components ──────────────────────────────────────────────────────

// 3.1. GalButton → renders a simple <button data-testid="btn-<text>">text</button>
jest.mock('../../../../../components/gal-button/gal-button.component', () => ({
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
    type?: string;
    customClassName?: string;
  }) => (
    <button
      data-testid={`btn-${text.toLowerCase().replace(/\s+/g, '-')}`}
      type={htmlType}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  ),
}));

// 3.2. GalFormInput → renders <input data-testid="input-<name>" …>
jest.mock(
  '../../../../../components/gal-form-input/gal-form-input.component',
  () => ({
    __esModule: true,
    default: ({
      label,
      type,
      name,
      value,
      onChange,
    }: {
      label: string;
      type: string;
      name: string;
      value: string;
      onChange: (e: { target: { name: string; value: string } }) => void;
    }) => (
      <input
        data-testid={`input-${name}`}
        aria-label={label}
        type={type}
        name={name}
        value={value}
        onChange={(e) =>
          onChange({
            target: {
              name,
              value: (e.target as HTMLInputElement).value,
            },
          })
        }
      />
    ),
  })
);

// 3.3. GalUppyFileUploader → renders <button data-testid="file-uploader">Upload File</button>
jest.mock(
  '../../../../../components/gal-uppy-file-uploader/gal-uppy-file-uploader.component',
  () => ({
    __esModule: true,
    default: ({
      onFilesChange,
    }: {
      onFilesChange: (files: File[]) => void;
      allowedFileTypes: string[];
      disableImporters?: boolean;
    }) => (
      <button
        data-testid="file-uploader"
        onClick={() => {
          const fakeFile = new File(['dummy'], 'dummy.txt', {
            type: 'text/plain',
          });
          onFilesChange([fakeFile]);
        }}
      >
        Upload File
      </button>
    ),
  })
);

// 3.4. CourseLessons → stubbed out
jest.mock('../../course-lessons/course-lessons.component', () => ({
  __esModule: true,
  default: ({ sectionId, lessons }: { sectionId: string; lessons: any[] }) => (
    <div data-testid="course-lessons">
      Lessons: {sectionId}, count={lessons.length}
    </div>
  ),
}));

// ── 4) IMPORT the component under test (in the same folder) ───────────────────────────────────
import SectionEditor, {
  NewProductSectionFormData,
} from './section-editor.component';

// ── 5) START TESTS ───────────────────────────────────────────────────────────────────────
describe('<SectionEditor />', () => {
  afterEach(() => {
    cleanup();
  });

  // Typed mocks for dispatch/thunks
  const mockedUseDispatch = useDispatch as jest.MockedFunction<
    typeof useDispatch
  >;
  const mockedUseSelector = useSelector as jest.MockedFunction<
    typeof useSelector
  >;
  const mockedCreateSection = createSection as jest.MockedFunction<
    typeof createSection
  >;
  const mockedUpdateSection = updateSectionDetails as jest.MockedFunction<
    typeof updateSectionDetails
  >;
  const mockedDeleteSection = deleteSection as jest.MockedFunction<
    typeof deleteSection
  >;

  let fakeDispatch: jest.Mock<any, any>;
  let removeParentMock: jest.Mock<any, any>;

  // A “blank” section object that always has title/description (even if empty)
  const baseSection: NewProductSectionFormData = {
    id: '',
    title: '',
    description: '',
    lessons: [],
    files: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Make dispatch(thunkAction) return an object whose .unwrap() resolves
    fakeDispatch = jest.fn((action: any) => ({
      unwrap: () =>
        Promise.resolve({
          ...action.payload,
          id: 'section-xyz',
          title: action.payload.title,
          description: action.payload.description,
        }),
    }));
    mockedUseDispatch.mockReturnValue(fakeDispatch as any);

    mockedUseSelector.mockImplementation((selector) => {
      if (selector === selectAuthUser) {
        return { id: 'user-123' };
      }
      return undefined;
    });
    mockedCreateSection.mockReset();
    mockedUpdateSection.mockReset();
    mockedDeleteSection.mockReset();

    removeParentMock = jest.fn();
  });

  // --- 5.3 Removing a Section (new vs existing) ---
  it('removes a new (unsaved) section immediately', () => {
    render(
      <SectionEditor
        index={5}
        sectionData={{ ...baseSection }} // id = ''
        productType="COURSE"
        showRemoveButton={true}
        productId="pid-1"
        onRemoveFromParent={removeParentMock}
      />
    );

    // “Remove” button appears
    const removeBtn = screen.getByTestId('btn-remove');
    expect(removeBtn).toBeInTheDocument();

    // Click “Remove” → no deleteSection called, immediate parent callback
    fireEvent.click(removeBtn);
    expect(mockedDeleteSection).not.toHaveBeenCalled();
    expect(removeParentMock).toHaveBeenCalledWith(5);
  });

  it('removes an existing section via thunk then parent callback', async () => {
    const existing: NewProductSectionFormData = {
      id: 'to-remove',
      title: 'Title',
      description: 'Desc',
      lessons: [],
      files: [],
    };

    // Mock deleteSection to return fake thunk
    const fakeThunk = Symbol('fakeThunk');
    mockedDeleteSection.mockReturnValue(fakeThunk as any);

    // Override fakeDispatch so unwrap resolves
    fakeDispatch.mockImplementation((action) => ({
      unwrap: () => Promise.resolve({}),
    }));

    render(
      <SectionEditor
        index={7}
        sectionData={existing}
        productType="COURSE"
        showRemoveButton={true}
        productId="pid-1"
        onRemoveFromParent={removeParentMock}
      />
    );

    // Click “Remove”
    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-remove'));
    });

    // Verify deleteSection call
    expect(mockedDeleteSection).toHaveBeenCalledWith({
      id: 'to-remove',
      userId: 'user-123',
    });
    expect(fakeDispatch).toHaveBeenCalledWith(fakeThunk);

    // Wait for unwrap() → then parent callback
    await act(async () => {
      await Promise.resolve();
    });
    expect(removeParentMock).toHaveBeenCalledWith(7);
  });
});
