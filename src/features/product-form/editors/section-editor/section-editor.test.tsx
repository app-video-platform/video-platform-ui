/**
 * SectionEditor.test.tsx
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

// ── 1) MOCK react-redux ───────────────────────────────────────────
jest.mock('react-redux', () => ({
  __esModule: true,
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
import { useDispatch, useSelector } from 'react-redux';

// ── 2) MOCK selectors / store thunks with UPDATED PATHS ────────────
jest.mock('@store/auth-store', () => ({
  __esModule: true,
  selectAuthUser: jest.fn(),
}));
import { selectAuthUser } from '@store/auth-store';

jest.mock('@store/product-store', () => ({
  __esModule: true,
  createSection: jest.fn(),
  deleteSection: jest.fn(),
}));
import { createSection, deleteSection } from '@store/product-store';

// ── 3) MOCK shared UI barrel used by SectionEditor ─────────────────
jest.mock('@shared/ui', () => ({
  __esModule: true,
  // Minimal Button – we only care about the Remove button
  Button: ({
    children,
    onClick,
    type,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
  }) => (
    <button
      data-testid={
        typeof children === 'string' &&
        children.toLowerCase().includes('remove')
          ? 'btn-remove'
          : 'btn-generic'
      }
      type={type ?? 'button'}
      onClick={onClick}
    >
      {children}
    </button>
  ),
  // Simple ExpansionPanel stub that just renders header + children
  ExpansionPanel: ({
    header,
    children,
  }: {
    header: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div data-testid="expansion-panel">
      <div>{header}</div>
      <div>{children}</div>
    </div>
  ),
  // Simple textarea stub
  Textarea: ({
    value,
    onChange,
    ...rest
  }: {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  }) => (
    <textarea
      data-testid="section-description"
      value={value}
      onChange={onChange}
      {...rest}
    />
  ),
  // UppyFileUploader stub
  UppyFileUploader: ({
    onFilesChange,
  }: {
    onFilesChange: (files: File[]) => void;
  }) => (
    <button
      data-testid="file-uploader"
      onClick={() =>
        onFilesChange([
          new File(['dummy'], 'dummy.txt', { type: 'text/plain' }),
        ])
      }
    >
      Upload File
    </button>
  ),
  // VPIcon stub
  VPIcon: () => <span data-testid="gal-icon" />,
}));

// ── 4) MOCK EditableTitle (local import) ───────────────────────────
jest.mock('../editable-title', () => ({
  __esModule: true,
  EditableTitle: ({
    value,
    onChange,
    placeholder,
  }: {
    value?: string;
    placeholder?: string;
    onChange: (value: string) => void;
  }) => (
    <input
      data-testid="editable-title"
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange((e.target as HTMLInputElement).value ?? '')}
    />
  ),
}));

// ── 5) MOCK CourseLessons (same relative path as component) ────────
jest.mock('../../course-lessons/course-lessons.component', () => ({
  __esModule: true,
  default: ({ sectionId, lessons }: { sectionId: string; lessons: any[] }) => (
    <div data-testid="course-lessons">
      Lessons: {sectionId}, count={lessons.length}
    </div>
  ),
}));

// ── 6) MOCK autosave hook ──────────────────────────────────────────
jest.mock('@features/product-form/hooks', () => ({
  __esModule: true,
  useSectionAutosave: () => ({
    isAutosaving: false,
    lastSavedAt: null,
  }),
}));

// ── 7) IMPORT component & types ────────────────────────────────────
import SectionEditor from './section-editor.component';
import { SectionDraft } from '@features/product-form/models';

// ── 8) TESTS ───────────────────────────────────────────────────────
describe('<SectionEditor />', () => {
  afterEach(() => {
    cleanup();
  });

  const mockedUseDispatch = useDispatch as jest.MockedFunction<
    typeof useDispatch
  >;
  const mockedUseSelector = useSelector as jest.MockedFunction<
    typeof useSelector
  >;
  const mockedCreateSection = createSection as jest.MockedFunction<
    typeof createSection
  >;
  const mockedDeleteSection = deleteSection as jest.MockedFunction<
    typeof deleteSection
  >;

  let fakeDispatch: jest.Mock<any, any>;
  let removeParentMock: jest.Mock<any, any>;
  let changeParentMock: jest.Mock<any, any>;

  const baseSection: SectionDraft = {
    // shape doesn’t need to be perfect at runtime
    id: '',
    title: '',
    description: '',
    position: 0,
    lessons: [],
    files: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    fakeDispatch = jest.fn((action: any) => ({
      unwrap: () =>
        Promise.resolve({
          ...action?.payload,
          id: 'section-xyz',
          title: action?.payload?.title,
          description: action?.payload?.description,
        }),
    }));
    mockedUseDispatch.mockReturnValue(fakeDispatch as any);

    mockedUseSelector.mockImplementation((selector: any) => {
      if (selector === selectAuthUser) {
        return { id: 'user-123' };
      }
      return undefined;
    });

    mockedCreateSection.mockReset();
    mockedDeleteSection.mockReset();

    removeParentMock = jest.fn();
    changeParentMock = jest.fn();
  });

  // --- Removing a new (unsaved) section ----------------------------
  it('removes a new (unsaved) section immediately', () => {
    render(
      <SectionEditor
        index={5}
        section={{ ...baseSection }} // id = ''
        productType="COURSE"
        showRemoveButton={true}
        productId="pid-1"
        onRemove={removeParentMock}
        onChange={changeParentMock}
      />,
    );

    const removeBtn = screen.getByTestId('btn-remove');
    expect(removeBtn).toBeInTheDocument();

    fireEvent.click(removeBtn);

    expect(mockedDeleteSection).not.toHaveBeenCalled();
    expect(removeParentMock).toHaveBeenCalledWith(5);
  });

  // --- Removing an existing section via thunk ----------------------
  it('removes an existing section via thunk then parent callback', async () => {
    const existing: SectionDraft = {
      id: 'to-remove',
      title: 'Title',
      description: 'Desc',
      position: 8,
      lessons: [],
      files: [],
    };

    const fakeThunk = Symbol('fakeThunk');
    mockedDeleteSection.mockReturnValue(fakeThunk as any);

    fakeDispatch.mockImplementation((action: any) => ({
      unwrap: () => Promise.resolve({}),
    }));

    render(
      <SectionEditor
        index={7}
        section={existing}
        productType="COURSE"
        showRemoveButton={true}
        productId="pid-1"
        onRemove={removeParentMock}
        onChange={changeParentMock}
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-remove'));
    });

    expect(mockedDeleteSection).toHaveBeenCalledWith({
      id: 'to-remove',
      userId: 'user-123',
    });
    expect(fakeDispatch).toHaveBeenCalledWith(fakeThunk);

    await act(async () => {
      await Promise.resolve();
    });

    expect(removeParentMock).toHaveBeenCalledWith(7);
  });
});
