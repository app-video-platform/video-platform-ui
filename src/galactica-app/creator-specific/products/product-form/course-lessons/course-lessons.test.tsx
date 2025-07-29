/**
 * @file CourseLessons.test.tsx
 */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// ── 1) MOCK LessonEditor ────────────────────────────────────────────────────────────
// We replace LessonEditor with a stub that renders:
//  - A container <div data-testid="lesson-editor-<index>">…</div>
//  - Inside it, a “Remove” button (<button data-testid="remove-lesson-<index>">)
//    that, when clicked, calls removeLessonFromList(index).

jest.mock('../editors/lesson-editor/lesson-editor.component', () => ({
  __esModule: true,
  default: ({
    index,
    lesson,
    sectionId,
    removeLessonFromList,
  }: {
    index: number;
    lesson: any;
    sectionId: string;
    removeLessonFromList: (idx: number) => void;
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

// ── 2) Import the component under test ──────────────────────────────────────────────
import CourseLessons from './course-lessons.component';

// ── 3) Begin tests ─────────────────────────────────────────────────────────────────
describe('<CourseLessons />', () => {
  afterEach(() => {
    cleanup();
  });

  const sectionId = 'section-abc';

  function makeLessons(count: number): any[] {
    return Array.from({ length: count }).map((_, i) => ({
      title: `Lesson ${i + 1}`,
      description: `Desc ${i + 1}`,
    }));
  }

  it('renders no LessonEditor when lessons prop is empty', () => {
    render(<CourseLessons sectionId={sectionId} lessons={[]} />);

    // Should render the header
    expect(screen.getByText('Course Lessons')).toBeInTheDocument();

    // No lesson-editor-* elements
    expect(screen.queryByTestId(/lesson-editor-/)).not.toBeInTheDocument();
  });

  it('renders one LessonEditor per item in lessons prop', () => {
    const initialLessons = makeLessons(2);
    render(<CourseLessons sectionId={sectionId} lessons={initialLessons} />);

    // We expect exactly two lesson-editor-0 and lesson-editor-1
    for (let i = 0; i < 2; i++) {
      expect(screen.getByTestId(`lesson-editor-${i}`)).toBeInTheDocument();
      // The mock also renders the title
      expect(screen.getByTestId(`lesson-title-${i}`)).toHaveTextContent(
        `Lesson ${i + 1}`
      );
      // And a remove button
      expect(screen.getByTestId(`remove-lesson-${i}`)).toBeInTheDocument();
    }
  });

  it('adds a new blank lesson when the “Add Lesson” button is clicked', () => {
    const initialLessons = makeLessons(1);
    render(<CourseLessons sectionId={sectionId} lessons={initialLessons} />);

    // Initially, one lesson-editor-0
    expect(screen.getByTestId('lesson-editor-0')).toBeInTheDocument();
    expect(screen.queryByTestId('lesson-editor-1')).not.toBeInTheDocument();

    // Click the “Add Lesson” button.
    // The “Add Lesson” button is the only <button> that has no text besides the icon,
    // but since our mock LessonEditor also renders a “Remove” button, we need to select carefully.
    // The “Add Lesson” button is the first button in the DOM whose data-testid is undefined but
    // has class "add-lesson-button". We can query by role and filter by className:
    const addBtn = screen.getByRole('button', { name: '' });
    // Alternatively, get by class:
    // const addBtn = container.querySelector('.add-lesson-button') as HTMLButtonElement;
    fireEvent.click(addBtn);

    // After clicking, there should now be two lesson-editors: 0 and 1
    expect(screen.getByTestId('lesson-editor-0')).toBeInTheDocument();
    expect(screen.getByTestId('lesson-editor-1')).toBeInTheDocument();

    // The new lesson-editor-1 should have empty title
    expect(screen.getByTestId('lesson-title-1')).toHaveTextContent('');
    // And it should also have a remove button
    expect(screen.getByTestId('remove-lesson-1')).toBeInTheDocument();
  });

  it('removes a lesson when "Remove" is clicked on a LessonEditor', () => {
    const initialLessons = makeLessons(3);
    render(<CourseLessons sectionId={sectionId} lessons={initialLessons} />);

    // For three initial lessons, we have lesson-editor-0,1,2
    for (let i = 0; i < 3; i++) {
      expect(screen.getByTestId(`lesson-editor-${i}`)).toBeInTheDocument();
    }

    // Click “Remove” on the middle one (index = 1)
    fireEvent.click(screen.getByTestId('remove-lesson-1'));

    // Now the state should have removed index=1, shifting index=2 → index=1
    // We expect exactly two lesson-editor-* elements: indices 0 and 1
    expect(screen.getByTestId('lesson-editor-0')).toBeInTheDocument();
    expect(screen.getByTestId('lesson-editor-1')).toBeInTheDocument();
    expect(screen.queryByTestId('lesson-editor-2')).not.toBeInTheDocument();

    // Check that lesson-editor-1 now displays “Lesson 3” (originally at index 2)
    expect(screen.getByTestId('lesson-title-1')).toHaveTextContent('Lesson 3');

    // Both still have remove buttons:
    expect(screen.getByTestId('remove-lesson-0')).toBeInTheDocument();
    expect(screen.getByTestId('remove-lesson-1')).toBeInTheDocument();
  });

  it('resets its internal list when the lessons prop changes', () => {
    const { rerender } = render(
      <CourseLessons sectionId={sectionId} lessons={makeLessons(1)} />
    );

    // Initially 1 editor
    expect(screen.getAllByTestId(/lesson-editor-/)).toHaveLength(1);
    expect(screen.getByTestId('lesson-title-0')).toHaveTextContent('Lesson 1');

    // Now rerender with a different lessons array of length 4
    rerender(<CourseLessons sectionId={sectionId} lessons={makeLessons(4)} />);

    // There should now be exactly 4 LessonEditor stubs
    expect(screen.getAllByTestId(/lesson-editor-/)).toHaveLength(4);
    for (let i = 0; i < 4; i++) {
      expect(screen.getByTestId(`lesson-title-${i}`)).toHaveTextContent(
        `Lesson ${i + 1}`
      );
    }
  });
});
