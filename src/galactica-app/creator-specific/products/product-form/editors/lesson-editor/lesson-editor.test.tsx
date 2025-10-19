/**
 * @file LessonEditor.test.tsx
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

// ── 1) MOCK react-redux useDispatch ───────────────────────────────────────────────
jest.mock('react-redux', () => ({
  __esModule: true,
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
import { useDispatch, useSelector } from 'react-redux';

jest.mock('../../../../../../store/auth-store/auth.selectors', () => ({
  selectAuthUser: jest.fn(),
}));
import { selectAuthUser } from '../../../../../../store/auth-store/auth.selectors';

// ── 2) MOCK the async thunks from product.slice ───────────────────────────────────
jest.mock('../../../../../../store/product-store/product.slice', () => ({
  createLesson: jest.fn(),
  updateLessonDetails: jest.fn(),
  deleteLesson: jest.fn(),
}));
import {
  createLesson,
  updateLessonDetails,
  deleteLesson,
} from '../../../../../../store/product-store/product.slice';

// ── 3) MOCK child components ──────────────────────────────────────────────────────

// 3.1. GalFormInput: render <input data-testid="input-<name>" onChange calls onChange({target:{value}})>
jest.mock(
  '../../../../../../components/gal-form-input/gal-form-input.component',
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
            target: { name: name, value: (e.target as HTMLInputElement).value },
          })
        }
      />
    ),
  }),
);

// 3.2. GalBoxSelector: render a button per availableOption, data-testid="box-<opt>"
jest.mock(
  '../../../../../../components/gal-box-selector/gal-box-selector.component',
  () => ({
    __esModule: true,
    default: ({
      selectedOption,
      onSelect,
      availableOptions,
    }: {
      selectedOption: string;
      onSelect: (opt: string) => void;
      availableOptions: string[];
      disabledOptions: string[]; // prop exists but we ignore
    }) => (
      <div data-testid="box-selector">
        {availableOptions.map((opt) => (
          <button
            key={opt}
            data-testid={`box-${opt}`}
            style={{ fontWeight: selectedOption === opt ? 'bold' : 'normal' }}
            onClick={() => onSelect(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    ),
  }),
);

// 3.3. GalUppyFileUploader: render a button data-testid="file-uploader" that calls onFilesChange([mockFile])
jest.mock(
  '../../../../../../components/gal-uppy-file-uploader/gal-uppy-file-uploader.component',
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
          const fakeFile = new File(['video content'], 'video.mp4', {
            type: 'video/mp4',
          });
          onFilesChange([fakeFile]);
        }}
      >
        Upload Video
      </button>
    ),
  }),
);

// 3.4. GalRichTextEditor: render a <div data-testid="rich-text-editor">, and call onChange({ somejson }) on click
jest.mock(
  '../../../../../../components/rich-text-editor/gal-rich-text-editor.component',
  () => ({
    __esModule: true,
    default: ({
      initialContent,
      onChange,
    }: {
      initialContent: any;
      onChange: (json: any) => void;
    }) => (
      <div
        data-testid="rich-text-editor"
        onClick={() => onChange({ delta: 'some-delta' })}
      >
        GalRichTextEditor
      </div>
    ),
  }),
);

// 3.5. GalButton: render <button data-testid="btn-<text>">text</button>
jest.mock(
  '../../../../../../components/gal-button/gal-button.component',
  () => ({
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
      customClassName?: string;
      type?: string;
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
  }),
);

// ── 4) Import the component under test ───────────────────────────────────────────────
import LessonEditor from './lesson-editor.component';
import { CourseLesson } from '../../../../../../api/models/product/lesson';
import { LessonType } from '../../../../../../api/types/products.types';

// ── 5) Begin tests ───────────────────────────────────────────────────────────────────
describe('<LessonEditor />', () => {
  afterEach(() => {
    cleanup();
  });

  // Create typed mocks for useDispatch and thunks
  const mockedUseDispatch = useDispatch as jest.MockedFunction<
    typeof useDispatch
  >;
  const mockedUseSelector = useSelector as jest.MockedFunction<
    typeof useSelector
  >;
  const mockedCreateLesson = createLesson as jest.MockedFunction<
    typeof createLesson
  >;
  const mockedUpdateLesson = updateLessonDetails as jest.MockedFunction<
    typeof updateLessonDetails
  >;
  const mockedDeleteLesson = deleteLesson as jest.MockedFunction<
    typeof deleteLesson
  >;

  let fakeDispatch: jest.Mock<any, any>;
  let removeLessonMock: jest.Mock<any, any>;

  const baseLesson: CourseLesson = {
    id: '',
    title: '',
    description: '',
    content: '',
    type: '' as LessonType,
    sectionId: '',
    position: 1,
    userId: 'user-123', // Mocked user ID
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // A fake dispatch fn that returns { unwrap: () => Promise.resolve(...) }
    fakeDispatch = jest.fn((action: any) => ({
      unwrap: () =>
        Promise.resolve({ ...action.payload, id: 'lesson-xyz', type: 'VIDEO' }),
    }));
    mockedUseDispatch.mockReturnValue(fakeDispatch as any);

    mockedUseSelector.mockImplementation((selector) => {
      if (selector === selectAuthUser) {
        return { id: 'user-123' };
      }
      return undefined;
    });

    mockedCreateLesson.mockReset();
    mockedUpdateLesson.mockReset();
    mockedDeleteLesson.mockReset();

    removeLessonMock = jest.fn();
  });

  it('renders “existing lesson” correctly (show Update mode)', () => {
    const existingLesson: CourseLesson = {
      id: 'abc123',
      title: 'Existing Title',
      description: 'Existing Desc',
      content: 'Existing Content',
      type: 'ARTICLE',
      sectionId: 'sec-1',
      position: 2,
      userId: 'user-123',
    };
    render(
      <LessonEditor
        lesson={existingLesson}
        index={1}
        sectionId="sec-1"
        removeLessonFromList={removeLessonMock}
      />,
    );

    // Header should show “Lesson 2” (index + 1)
    expect(screen.getByText('Lesson 2')).toBeInTheDocument();

    // Title and Description inputs should be pre-filled
    const titleInput = screen.getByTestId('input-title') as HTMLInputElement;
    expect(titleInput.value).toBe('Existing Title');
    const descInput = screen.getByTestId(
      'input-description',
    ) as HTMLInputElement;
    expect(descInput.value).toBe('Existing Desc');

    // GalBoxSelector should have selected “TEXT”
    // The “box-TEXT” button should be bold (we set style based on selectedOption)
    const textButton = screen.getByTestId('box-ARTICLE');
    expect(textButton).toBeInTheDocument();

    // Because lesson.id exists, isLessonCreated → true:
    // Show “Update Lesson” button and render content field for TEXT (GalRichTextEditor)
    const updateBtn = screen.getByTestId('btn-update-lesson');
    expect(updateBtn).toBeInTheDocument();

    // // Since type='ARTICLE', GalRichTextEditor should be in the DOM
    // expect(screen.getByTestId('rich-text-editor')).toBeInTheDocument();
  });

  it('renders “new lesson” correctly and allows creation', async () => {
    // Pass a lesson with empty id → isLessonCreated starts false
    const newLesson: CourseLesson = {
      id: '',
      title: '',
      description: '',
      content: '',
      type: '' as LessonType,
      sectionId: 'sec-1',
      position: 1,
      userId: 'user-123',
    };

    render(
      <LessonEditor
        lesson={newLesson}
        index={0}
        sectionId="sec-1"
        removeLessonFromList={removeLessonMock}
      />,
    );

    // Header: “Lesson 1”
    expect(screen.getByText('Lesson 1')).toBeInTheDocument();

    // Title & Description initially blank
    const titleInput = screen.getByTestId('input-title') as HTMLInputElement;
    expect(titleInput.value).toBe('');
    const descInput = screen.getByTestId(
      'input-description',
    ) as HTMLInputElement;
    expect(descInput.value).toBe('');

    // GalBoxSelector: no option selected initially, but buttons exist
    expect(screen.getByTestId('box-VIDEO')).toBeInTheDocument();
    expect(screen.getByTestId('box-ARTICLE')).toBeInTheDocument();
    expect(screen.getByTestId('box-QUIZ')).toBeInTheDocument();

    // Since isLessonCreated=false, “Create Lesson” button should show, disabled because title is empty
    const createBtn = screen.getByTestId('btn-create-lesson');
    expect(createBtn).toBeInTheDocument();
    expect(createBtn).toBeDisabled();

    // Type a title → onChange should call setFormData, enabling the button
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    fireEvent.click(screen.getByTestId('box-VIDEO'));
    expect(createBtn).toBeEnabled();

    // Mock createLesson to return a fake thunk
    const fakeThunk = Symbol('fakeThunk');
    mockedCreateLesson.mockReturnValue(fakeThunk as any);

    // Simulate clicking “Create Lesson”
    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-create-lesson'));
    });

    // createLesson should have been called with payload {title, description, position, sectionId}
    expect(mockedCreateLesson).toHaveBeenCalledWith({
      title: 'New Title',
      description: '',
      position: 1,
      type: 'VIDEO',
      sectionId: 'sec-1',
      userId: 'user-123', // from mocked useSelector
    });

    // Dispatch should have been called with fakeThunk
    expect(fakeDispatch).toHaveBeenCalledWith(fakeThunk);

    // Wait for unwrap() → Promise.resolve, then state updates (isLessonCreated → true)
    await act(async () => {
      // give time for .unwrap().then(...) to run
      await Promise.resolve();
    });

    // After creation, isLessonCreated=true, so “Update Lesson” appears
    expect(screen.getByTestId('btn-update-lesson')).toBeInTheDocument();

    // Default type in setFormData after creation is 'VIDEO', so GalUppyFileUploader should appear
    expect(screen.getByTestId('file-uploader')).toBeInTheDocument();
  });

  it('allows selecting a type and updating an existing lesson', async () => {
    const existingLesson: CourseLesson = {
      id: 'l1',
      title: 'T1',
      description: 'D1',
      content: 'C1',
      type: 'VIDEO',
      sectionId: 'sec-1',
      position: 0,
      userId: 'user-123',
    };

    render(
      <LessonEditor
        lesson={existingLesson}
        index={0}
        sectionId="sec-1"
        removeLessonFromList={removeLessonMock}
      />,
    );

    // Initially formData.type === '', so no content field yet.
    // Click “VIDEO” to set formData.type = "VIDEO"
    fireEvent.click(screen.getByTestId('box-VIDEO'));
    // Now GalUppyFileUploader (video uploader) should appear
    expect(screen.getByTestId('file-uploader')).toBeInTheDocument();

    // Select “TEXT” type
    fireEvent.click(screen.getByTestId('box-ARTICLE'));

    // Now GalRichTextEditor should be in the DOM instead of file-uploader
    expect(screen.getByTestId('rich-text-editor')).toBeInTheDocument();

    // Mock updateLessonDetails to return a fake thunk
    const fakeUpdateThunk = Symbol('fakeUpdate');
    mockedUpdateLesson.mockReturnValue(fakeUpdateThunk as any);

    // Click “Update Lesson”
    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-update-lesson'));
    });

    // updateLessonDetails should have been called with an CourseLesson object containing:
    // id = 'l1', title='T1', description='D1', content='C1', type='ARTICLE', sectionId='sec-1', position=1
    expect(mockedUpdateLesson).toHaveBeenCalledWith({
      id: 'l1',
      title: 'T1',
      description: 'D1',
      content: 'C1',
      type: 'ARTICLE',
      sectionId: 'sec-1',
      position: 1,
      // userId: 'user-123', // from mocked useSelector
    });

    // Dispatch should have been called with fakeUpdateThunk
    expect(fakeDispatch).toHaveBeenCalledWith(fakeUpdateThunk);
  });

  it('deletes a new (unsaved) lesson by calling removeLessonFromList immediately', () => {
    // new lesson with no id
    const newLesson: CourseLesson = {
      id: '',
      title: 'T2',
      description: 'D2',
      content: '',
      type: '' as LessonType,
      sectionId: 'sec-1',
      position: 0,
      userId: 'user-123',
    };

    render(
      <LessonEditor
        lesson={newLesson}
        index={2}
        sectionId="sec-1"
        removeLessonFromList={removeLessonMock}
      />,
    );

    // Click delete icon
    fireEvent.click(screen.getByRole('button', { name: '' }));
    // Since no id, dispatch(deleteLesson) should NOT be called, but removeLessonFromList should:
    expect(mockedDeleteLesson).not.toHaveBeenCalled();
    expect(removeLessonMock).toHaveBeenCalledWith(2);
  });

  it('deletes an existing lesson by dispatching then calling removeLessonFromList', async () => {
    const existingLesson: CourseLesson = {
      id: 'to-delete',
      title: 'T3',
      description: 'D3',
      content: '',
      type: 'QUIZ',
      sectionId: 'sec-1',
      position: 3,
      userId: 'user-123',
    };

    // Mock deleteLesson to return a thunk
    const fakeDeleteThunk = Symbol('fakeDelete');
    mockedDeleteLesson.mockReturnValue(fakeDeleteThunk as any);

    // Set up dispatch to handle the thunk and unwrap
    fakeDispatch.mockImplementation((action) => ({
      unwrap: () => Promise.resolve({}),
    }));

    render(
      <LessonEditor
        lesson={existingLesson}
        index={3}
        sectionId="sec-1"
        removeLessonFromList={removeLessonMock}
      />,
    );

    // Click the delete icon
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '' }));
    });

    expect(mockedDeleteLesson).toHaveBeenCalledWith({
      id: 'to-delete',
      userId: 'user-123',
    });
    expect(fakeDispatch).toHaveBeenCalledWith(fakeDeleteThunk);
    expect(removeLessonMock).toHaveBeenCalledWith(3);
  });
});
