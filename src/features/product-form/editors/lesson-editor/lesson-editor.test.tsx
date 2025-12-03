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

// ── 1) MOCK react-redux ───────────────────────────────────────────────
jest.mock('react-redux', () => ({
  __esModule: true,
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
import { useDispatch, useSelector } from 'react-redux';

// ── 2) MOCK auth selector + product-store thunks (updated paths) ──────
jest.mock('@store/auth-store', () => ({
  __esModule: true,
  selectAuthUser: jest.fn(),
}));
import { selectAuthUser } from '@store/auth-store';

jest.mock('@store/product-store', () => ({
  __esModule: true,
  createLesson: jest.fn(),
  updateLessonDetails: jest.fn(),
  deleteLesson: jest.fn(),
}));
import {
  createLesson,
  updateLessonDetails,
  deleteLesson,
} from '@store/product-store';

// ── 3) MOCK shared UI barrel (@shared/ui) ─────────────────────────────
jest.mock('@shared/ui', () => ({
  __esModule: true,
  Button: ({
    children,
    onClick,
    type,
    variant,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    variant?: string;
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
      data-variant={variant}
    >
      {children}
    </button>
  ),
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
  Textarea: ({
    value,
    onChange,
    ...rest
  }: {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  }) => (
    <textarea
      data-testid="lesson-description"
      value={value}
      onChange={onChange}
      {...rest}
    />
  ),
  GalUppyFileUploader: ({
    onFilesChange,
  }: {
    onFilesChange: (files: File[]) => void;
    allowedFileTypes?: string[];
  }) => (
    <button
      data-testid="file-uploader"
      onClick={() =>
        onFilesChange([new File(['video'], 'video.mp4', { type: 'video/mp4' })])
      }
    >
      Upload Video
    </button>
  ),
  GalRichTextEditor: ({
    onChange,
  }: {
    initialContent?: any;
    onChange: (json: any) => void;
  }) => (
    <div
      data-testid="rich-text-editor"
      onClick={() => onChange({ delta: 'changed' })}
    >
      RichText
    </div>
  ),
  GalIcon: () => <span data-testid="gal-icon" />,
}));

// ── 4) MOCK GalBoxSelector from @components ───────────────────────────
jest.mock('@components', () => ({
  __esModule: true,
  GalBoxSelector: ({
    selectedOption,
    onSelect,
    availableOptions,
  }: {
    selectedOption?: string;
    onSelect: (opt: string) => void;
    availableOptions: string[];
    disabledOptions?: string[];
    selectFor?: string;
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
}));

// ── 5) MOCK EditableTitle, QuizWizard, autosave hook, LESSON_META ────
jest.mock('../editable-title', () => ({
  __esModule: true,
  EditableTitle: ({
    value,
    placeholder,
    onChange,
  }: {
    value?: string;
    placeholder?: string;
    onChange: (val: string) => void;
    small?: boolean;
  }) => (
    <input
      data-testid="editable-title"
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange((e.target as HTMLInputElement).value ?? '')}
    />
  ),
}));

jest.mock('../../quiz-wizard/quiz-wizard.component', () => ({
  __esModule: true,
  default: () => <div data-testid="quiz-wizard">QuizWizard</div>,
}));

jest.mock('@features/product-form/hooks', () => ({
  __esModule: true,
  useLessonAutosave: () => ({
    isAutosaving: false,
    lastSavedAt: null,
  }),
}));

jest.mock('@api/constants', () => ({
  __esModule: true,
  LESSON_META: {
    VIDEO: { icon: () => null, color: 'red' },
    ARTICLE: { icon: () => null, color: 'blue' },
    QUIZ: { icon: () => null, color: 'green' },
    ASSIGNMENT: { icon: () => null, color: 'gray' },
  },
}));

// ── 6) IMPORT component & types ───────────────────────────────────────
import LessonEditor from './lesson-editor.component';
import { CourseLesson } from '@api/models';
import { LessonType } from '@api/types';

// ── 7) TESTS ──────────────────────────────────────────────────────────
describe('<LessonEditor />', () => {
  afterEach(() => {
    cleanup();
  });

  const mockedUseDispatch = useDispatch as jest.MockedFunction<
    typeof useDispatch
  >;
  const mockedUseSelector = useSelector as jest.MockedFunction<
    typeof useSelector
  >;
  const mockedDeleteLesson = deleteLesson as jest.MockedFunction<
    typeof deleteLesson
  >;

  let fakeDispatch: jest.Mock<any, any>;
  let removeLessonMock: jest.Mock<any, any>;
  let changeLessonMock: jest.Mock<any, any>;

  const baseLesson: CourseLesson = {
    id: '',
    title: '',
    description: '',
    content: '',
    type: 'VIDEO' as LessonType,
    sectionId: 'sec-1',
    position: 1,
    userId: 'user-123',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    fakeDispatch = jest.fn((action: any) => ({
      unwrap: () => Promise.resolve({}),
    }));
    mockedUseDispatch.mockReturnValue(fakeDispatch as any);

    mockedUseSelector.mockImplementation((selector: any) => {
      if (selector === selectAuthUser) {
        return { id: 'user-123' };
      }
      return undefined;
    });

    mockedDeleteLesson.mockReset();

    removeLessonMock = jest.fn();
    changeLessonMock = jest.fn();
  });

  it('deletes a new (unsaved) lesson by calling removeLessonFromList immediately', () => {
    const newLesson: CourseLesson = {
      ...baseLesson,
      id: '',
      title: 'Draft lesson',
    };

    render(
      <LessonEditor
        lesson={newLesson}
        index={2}
        sectionId="sec-1"
        removeLessonFromList={removeLessonMock}
        onChange={changeLessonMock}
      />,
    );

    const removeBtn = screen.getByTestId('btn-remove');
    expect(removeBtn).toBeInTheDocument();

    fireEvent.click(removeBtn);

    expect(mockedDeleteLesson).not.toHaveBeenCalled();
    expect(removeLessonMock).toHaveBeenCalledWith(2);
  });

  it('deletes an existing lesson by dispatching then calling removeLessonFromList', async () => {
    const existingLesson: CourseLesson = {
      ...baseLesson,
      id: 'to-delete',
      title: 'Existing lesson',
      type: 'VIDEO',
    };

    const fakeDeleteThunk = Symbol('fakeDelete');
    mockedDeleteLesson.mockReturnValue(fakeDeleteThunk as any);

    fakeDispatch.mockImplementation((action: any) => ({
      unwrap: () => Promise.resolve({}),
    }));

    render(
      <LessonEditor
        lesson={existingLesson}
        index={3}
        sectionId="sec-1"
        removeLessonFromList={removeLessonMock}
        onChange={changeLessonMock}
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-remove'));
    });

    expect(mockedDeleteLesson).toHaveBeenCalledWith({
      id: 'to-delete',
      userId: 'user-123',
    });
    expect(fakeDispatch).toHaveBeenCalledWith(fakeDeleteThunk);

    await act(async () => {
      await Promise.resolve();
    });

    expect(removeLessonMock).toHaveBeenCalledWith(3);
  });
});
