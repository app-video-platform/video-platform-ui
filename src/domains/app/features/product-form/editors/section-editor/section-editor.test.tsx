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
import { selectAuthUser } from 'core/store/auth-store';

jest.mock('@store/product-store', () => ({
  __esModule: true,
  createProductSection: jest.fn(),
  deleteProductSection: jest.fn(),
  uploadDownloadSectionFile: jest.fn(),
  deleteDownloadSectionFile: jest.fn(),
}));
import {
  createProductSection,
  deleteDownloadSectionFile,
  deleteProductSection,
  uploadDownloadSectionFile,
} from 'core/store/product-store';

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
  // GalUppyFileUploader stub
  GalUppyFileUploader: ({
    onFilesChange,
  }: {
    onFilesChange: (files: File[]) => void;
  }) => (
    <button
      data-testid="file-uploader"
      onClick={() =>
        onFilesChange(
          (
            globalThis as typeof globalThis & {
              __sectionEditorUploaderFiles?: File[];
            }
          ).__sectionEditorUploaderFiles ?? [
            new File(['dummy'], 'dummy.txt', { type: 'text/plain' }),
          ],
        )
      }
    >
      Upload File
    </button>
  ),
  // GalIcon stub
  GalIcon: () => <span data-testid="gal-icon" />,
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
import { SectionDraft } from 'domains/app/features/product-form/models';

// ── 8) TESTS ───────────────────────────────────────────────────────
describe('<SectionEditor />', () => {
  afterEach(() => {
    cleanup();
    delete (
      globalThis as typeof globalThis & {
        __sectionEditorUploaderFiles?: File[];
      }
    ).__sectionEditorUploaderFiles;
  });

  const mockedUseDispatch = useDispatch as jest.MockedFunction<
    typeof useDispatch
  >;
  const mockedUseSelector = useSelector as jest.MockedFunction<
    typeof useSelector
  >;
  const mockedCreateSection = createProductSection as jest.MockedFunction<
    typeof createProductSection
  >;
  const mockedDeleteSection = deleteProductSection as jest.MockedFunction<
    typeof deleteProductSection
  >;
  const mockedDeleteUploadedFile =
    deleteDownloadSectionFile as jest.MockedFunction<
      typeof deleteDownloadSectionFile
    >;
  const mockedUploadSectionFile =
    uploadDownloadSectionFile as jest.MockedFunction<
      typeof uploadDownloadSectionFile
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
    mockedDeleteUploadedFile.mockReset();
    mockedUploadSectionFile.mockReset();

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
      productId: 'pid-1',
      sectionId: 'to-remove',
    });
    expect(fakeDispatch).toHaveBeenCalledWith(fakeThunk);

    await act(async () => {
      await Promise.resolve();
    });

    expect(removeParentMock).toHaveBeenCalledWith(7);
  });

  it('merges uploaded files against the latest section state when uploads resolve out of order', async () => {
    const uploadSection: SectionDraft = {
      id: 'section-download',
      title: 'Assets',
      description: '',
      position: 0,
      lessons: [],
      files: [],
    };
    const firstFile = new File(['first'], 'first.txt', {
      type: 'text/plain',
    });
    const secondFile = new File(['second'], 'second.txt', {
      type: 'text/plain',
    });

    (
      globalThis as typeof globalThis & {
        __sectionEditorUploaderFiles?: File[];
      }
    ).__sectionEditorUploaderFiles = [firstFile, secondFile];

    mockedUploadSectionFile.mockImplementation(
      ({ file }: { file: File }) =>
        ({
          meta: {
            arg: {
              file,
            },
          },
        }) as any,
    );

    let resolveFirstUpload: ((value: unknown) => void) | undefined;
    let resolveSecondUpload: ((value: unknown) => void) | undefined;

    fakeDispatch.mockImplementation((action: any) => ({
      unwrap: () =>
        new Promise((resolve) => {
          const fileName = action?.meta?.arg?.file?.name;

          if (fileName === 'first.txt') {
            resolveFirstUpload = resolve;
            return;
          }

          if (fileName === 'second.txt') {
            resolveSecondUpload = resolve;
            return;
          }

          resolve({});
        }),
    }));

    render(
      <SectionEditor
        index={0}
        section={uploadSection}
        productType="DOWNLOAD"
        showRemoveButton={true}
        productId="product-download"
        onRemove={removeParentMock}
        onChange={changeParentMock}
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('file-uploader'));
    });

    expect(mockedUploadSectionFile).toHaveBeenCalledTimes(2);
    expect(resolveFirstUpload).toBeDefined();
    expect(resolveSecondUpload).toBeDefined();

    await act(async () => {
      resolveSecondUpload?.({
        file: {
          id: 'file-2',
          name: 'second.txt',
        },
      });
      await Promise.resolve();
    });

    expect(changeParentMock).toHaveBeenLastCalledWith(
      0,
      expect.objectContaining({
        files: [expect.objectContaining({ id: 'file-2' })],
      }),
    );

    await act(async () => {
      resolveFirstUpload?.({
        file: {
          id: 'file-1',
          name: 'first.txt',
        },
      });
      await Promise.resolve();
    });

    const finalSection =
      changeParentMock.mock.calls[changeParentMock.mock.calls.length - 1]?.[1];

    expect(finalSection.files).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'file-1' }),
        expect.objectContaining({ id: 'file-2' }),
      ]),
    );
    expect(finalSection.files).toHaveLength(2);
  });

  it('allows re-uploading the same file after it has been removed', async () => {
    const uploadSection: SectionDraft = {
      id: 'section-download',
      title: 'Assets',
      description: '',
      position: 0,
      lessons: [],
      files: [],
    };
    const sameFile = new File(['asset'], 'asset.zip', {
      type: 'application/zip',
      lastModified: 12345,
    });
    const deleteThunk = Symbol('delete-uploaded-file');

    (
      globalThis as typeof globalThis & {
        __sectionEditorUploaderFiles?: File[];
      }
    ).__sectionEditorUploaderFiles = [sameFile];

    mockedUploadSectionFile.mockImplementation(
      ({ file }: { file: File }) =>
        ({
          meta: {
            arg: {
              file,
            },
          },
        }) as any,
    );
    mockedDeleteUploadedFile.mockReturnValue(deleteThunk as any);

    fakeDispatch.mockImplementation((action: any) => ({
      unwrap: () => {
        if (action === deleteThunk) {
          return Promise.resolve({});
        }

        const uploadedFile = action?.meta?.arg?.file;
        if (uploadedFile) {
          return Promise.resolve({
            file: {
              id: 'file-1',
              fileName: uploadedFile.name,
              fileType: uploadedFile.type,
            },
          });
        }

        return Promise.resolve({});
      },
    }));

    const { rerender } = render(
      <SectionEditor
        index={0}
        section={uploadSection}
        productType="DOWNLOAD"
        showRemoveButton={true}
        productId="product-download"
        onRemove={removeParentMock}
        onChange={changeParentMock}
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('file-uploader'));
      await Promise.resolve();
    });

    expect(mockedUploadSectionFile).toHaveBeenCalledTimes(1);

    const uploadedSection =
      changeParentMock.mock.calls[changeParentMock.mock.calls.length - 1]?.[1];

    rerender(
      <SectionEditor
        index={0}
        section={uploadedSection}
        productType="DOWNLOAD"
        showRemoveButton={true}
        productId="product-download"
        onRemove={removeParentMock}
        onChange={changeParentMock}
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getAllByTestId('btn-remove')[1]);
      await Promise.resolve();
    });

    expect(mockedDeleteUploadedFile).toHaveBeenCalledWith({
      productId: 'product-download',
      sectionId: 'section-download',
      fileId: 'file-1',
    });

    const sectionAfterRemoval =
      changeParentMock.mock.calls[changeParentMock.mock.calls.length - 1]?.[1];

    rerender(
      <SectionEditor
        index={0}
        section={sectionAfterRemoval}
        productType="DOWNLOAD"
        showRemoveButton={true}
        productId="product-download"
        onRemove={removeParentMock}
        onChange={changeParentMock}
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('file-uploader'));
      await Promise.resolve();
    });

    expect(mockedUploadSectionFile).toHaveBeenCalledTimes(2);
  });
});
