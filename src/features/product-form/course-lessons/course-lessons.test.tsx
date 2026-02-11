/**
 * @file CourseLessons.test.tsx
 */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// ── 1) MOCK LessonEditor ────────────────────────────────────────────────────────────
// Props in real component:
//   index, lesson, sectionId, removeLessonFromList, onChange
jest.mock('../editors/lesson-editor/lesson-editor.component', () => ({
  __esModule: true,
  default: ({
    index,
    lesson,
    sectionId,
    removeLessonFromList,
    onChange,
  }: {
    index: number;
    lesson: any;
    sectionId: string;
    removeLessonFromList: (idx: number) => void;
    onChange: (idx: number, nextLesson: any) => void;
  }) => (
    <div data-testid={`lesson-editor-${index}`}>
      <span data-testid={`lesson-title-${index}`}>{lesson.title ?? ''}</span>
      <button
        data-testid={`remove-lesson-${index}`}
        onClick={() => removeLessonFromList(index)}
      >
        Remove
      </button>
    </div>
  ),
}));

// ── 2) MOCK @shared/ui (Button + VPIcon) ──────────────────────────────────────────
jest.mock('@shared/ui', () => ({
  __esModule: true,
  Button: ({
    children,
    onClick,
    type,
    className,
    variant,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    className?: string;
    variant?: string;
  }) => (
    <button
      data-testid="btn-add-lesson"
      type={type ?? 'button'}
      onClick={onClick}
      className={className}
      data-variant={variant}
    >
      {children}
    </button>
  ),
  VPIcon: () => <span data-testid="gal-icon" />,
}));

// ── 3) Import the component under test ──────────────────────────────────────────────
import CourseLessons from './course-lessons.component';

// ── 4) Begin tests ─────────────────────────────────────────────────────────────────
describe('<CourseLessons />', () => {
  afterEach(() => {
    cleanup();
  });

  const sectionId = 'section-abc';

  function makeLessons(count: number): any[] {
    return Array.from({ length: count }).map((_, i) => ({
      title: `Lesson ${i + 1}`,
      description: `Desc ${i + 1}`,
      sectionId,
    }));
  }

  it('renders no LessonEditor when lessons prop is empty', () => {
    const onLessonsChange = jest.fn();

    render(
      <CourseLessons
        sectionId={sectionId}
        lessons={[]}
        onLessonsChange={onLessonsChange}
      />,
    );

    // Should render the header
    expect(screen.getByText('Course Lessons')).toBeInTheDocument();

    // No lesson-editor-* elements
    expect(screen.queryByTestId(/lesson-editor-/)).not.toBeInTheDocument();
  });

  it('renders one LessonEditor per item in lessons prop', () => {
    const initialLessons = makeLessons(2);
    const onLessonsChange = jest.fn();

    render(
      <CourseLessons
        sectionId={sectionId}
        lessons={initialLessons}
        onLessonsChange={onLessonsChange}
      />,
    );

    // We expect exactly two lesson-editor-0 and lesson-editor-1
    for (let i = 0; i < 2; i++) {
      expect(screen.getByTestId(`lesson-editor-${i}`)).toBeInTheDocument();
      expect(screen.getByTestId(`lesson-title-${i}`)).toHaveTextContent(
        `Lesson ${i + 1}`,
      );
      expect(screen.getByTestId(`remove-lesson-${i}`)).toBeInTheDocument();
    }
  });

  it('adds a new blank lesson when the “Add Lesson” button is clicked (via onLessonsChange)', () => {
    const initialLessons = makeLessons(1);
    const onLessonsChange = jest.fn();

    render(
      <CourseLessons
        sectionId={sectionId}
        lessons={initialLessons}
        onLessonsChange={onLessonsChange}
      />,
    );

    // Initially, one lesson-editor-0
    expect(screen.getByTestId('lesson-editor-0')).toBeInTheDocument();

    // Click the “Add Lesson” button
    fireEvent.click(screen.getByTestId('btn-add-lesson'));

    // Component is controlled → we assert onLessonsChange was called correctly
    expect(onLessonsChange).toHaveBeenCalledTimes(1);
    const updatedLessons = onLessonsChange.mock.calls[0][0] as any[];

    expect(updatedLessons).toHaveLength(2);
    // First lesson is unchanged
    expect(updatedLessons[0].title).toBe('Lesson 1');
    // New lesson is blank with correct sectionId
    expect(updatedLessons[1].title).toBe('');
    expect(updatedLessons[1].description).toBe('');
    expect(updatedLessons[1].sectionId).toBe(sectionId);
  });

  it('removes a lesson when "Remove" is clicked on a LessonEditor (via onLessonsChange)', () => {
    const initialLessons = makeLessons(3);
    const onLessonsChange = jest.fn();

    render(
      <CourseLessons
        sectionId={sectionId}
        lessons={initialLessons}
        onLessonsChange={onLessonsChange}
      />,
    );

    for (let i = 0; i < 3; i++) {
      expect(screen.getByTestId(`lesson-editor-${i}`)).toBeInTheDocument();
    }

    // Click “Remove” on the middle one (index = 1)
    fireEvent.click(screen.getByTestId('remove-lesson-1'));

    // Controlled component → check callback
    expect(onLessonsChange).toHaveBeenCalledTimes(1);
    const updatedLessons = onLessonsChange.mock.calls[0][0] as any[];

    expect(updatedLessons).toHaveLength(2);
    // Remaining titles should be Lesson 1 and Lesson 3
    expect(updatedLessons[0].title).toBe('Lesson 1');
    expect(updatedLessons[1].title).toBe('Lesson 3');
  });

  it('reflects changes when the lessons prop changes from outside', () => {
    const onLessonsChange = jest.fn();

    const { rerender } = render(
      <CourseLessons
        sectionId={sectionId}
        lessons={makeLessons(1)}
        onLessonsChange={onLessonsChange}
      />,
    );

    // Initially 1 editor
    expect(screen.getAllByTestId(/lesson-editor-/)).toHaveLength(1);
    expect(screen.getByTestId('lesson-title-0')).toHaveTextContent('Lesson 1');

    // Rerender with 4 lessons
    rerender(
      <CourseLessons
        sectionId={sectionId}
        lessons={makeLessons(4)}
        onLessonsChange={onLessonsChange}
      />,
    );

    // There should now be exactly 4 LessonEditor stubs
    expect(screen.getAllByTestId(/lesson-editor-/)).toHaveLength(4);
    for (let i = 0; i < 4; i++) {
      expect(screen.getByTestId(`lesson-title-${i}`)).toHaveTextContent(
        `Lesson ${i + 1}`,
      );
    }
  });
});
