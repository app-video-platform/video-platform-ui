import React, { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { CourseLesson, QuizDraft, QuizQuestion } from 'core/api/models';
import QuizWizard from './quiz-wizard.component';

jest.mock('@shared/ui/icon', () => ({
  __esModule: true,
  Icon: () => null,
  default: () => null,
}));

const createQuestion = (id: string, points: number): QuizQuestion => ({
  id,
  title: `Question ${id}`,
  type: 'multiple_choice_single',
  points,
  explanation: '',
  position: Number(id.replace(/\D/g, '')) || 1,
  shuffle: true,
  options: [
    { id: `${id}-a`, text: 'First', position: 1, isCorrect: true },
    { id: `${id}-b`, text: 'Second', position: 2, isCorrect: false },
  ],
});

const initialQuiz: QuizDraft = {
  totalScore: 100,
  passingScore: 80,
  questions: [createQuestion('q1', 50), createQuestion('q2', 50)],
};

const QuizHarness = ({ initial = initialQuiz }: { initial?: QuizDraft }) => {
  const [quiz, setQuiz] = useState(initial);
  const lesson: Partial<CourseLesson> = {
    id: 'lesson-quiz',
    title: 'Assessment',
    type: 'QUIZ',
    quiz,
  };
  return (
    <div data-testid="quiz-model">
      <output>{JSON.stringify(quiz)}</output>
      <QuizWizard
        lesson={lesson}
        updateLesson={(patch) => {
          if (patch.quiz) {
            setQuiz((current) => ({ ...current, ...patch.quiz }));
          }
        }}
      />
    </div>
  );
};

const readQuiz = () => JSON.parse(
  screen.getByTestId('quiz-model').querySelector('output')?.textContent ?? '{}',
) as QuizDraft;
const readQuestionPoints = () => readQuiz().questions?.map((question) => question.points);

describe('<QuizWizard />', () => {
  it('starts at 100 and updates the canonical total and Auto-Split allocations', async () => {
    render(<QuizHarness />);
    const total = screen.getByLabelText('Total points');
    expect(total).toHaveValue(100);

    fireEvent.change(total, { target: { value: '200' } });
    await waitFor(() => expect(total).toHaveValue(200));
    expect(readQuiz().totalScore).toBe(200);
    expect(readQuestionPoints()).toEqual([100, 100]);

    fireEvent.change(total, { target: { value: '50' } });
    await waitFor(() => expect(total).toHaveValue(50));
    expect(readQuiz().totalScore).toBe(50);
    expect(readQuestionPoints()).toEqual([25, 25]);
  });

  it('distributes remainders deterministically and recalculates when questions are added or removed', async () => {
    const user = userEvent.setup();
    render(<QuizHarness initial={{
      ...initialQuiz,
      questions: [...(initialQuiz.questions ?? []), createQuestion('q3', 0)],
    }} />);

    await waitFor(() => expect(readQuestionPoints()).toEqual([34, 33, 33]));
    await user.click(screen.getByRole('button', { name: 'Remove question 1' }));
    await waitFor(() => expect(readQuestionPoints()).toEqual([50, 50]));

    await user.click(screen.getByRole('button', { name: 'Add question' }));
    await waitFor(() => expect(readQuestionPoints()).toEqual([34, 33, 33]));
  });

  it('preserves Manual Split totals, passing threshold, and recalculates after switching back', async () => {
    const user = userEvent.setup();
    render(<QuizHarness />);

    await user.click(screen.getByText('Manual Split'));
    const questionPointInputs = screen.getAllByLabelText('Points');
    fireEvent.change(questionPointInputs[0], { target: { value: '30' } });
    fireEvent.change(questionPointInputs[1], { target: { value: '70' } });

    await waitFor(() => expect(readQuestionPoints()).toEqual([30, 70]));
    expect(screen.getByLabelText('Total points')).toHaveValue(100);
    expect(readQuiz().passingScore).toBe(80);

    await user.click(screen.getByText('Auto-Split'));
    await waitFor(() => expect(readQuestionPoints()).toEqual([50, 50]));
    expect(readQuiz().totalScore).toBe(100);
  });

  it.each(['', '0', '-2', 'abc'])('explains invalid total points %p without changing saved scores', async (value) => {
    render(<QuizHarness />);
    const total = screen.getByLabelText('Total points');

    fireEvent.change(total, { target: { value } });

    expect(await screen.findByText('Enter a whole number greater than zero.'))
      .toBeInTheDocument();
    expect(readQuiz().totalScore).toBe(100);
    expect(readQuestionPoints()).toEqual([50, 50]);
  });

  it('keeps field IDs and label focus associations unique after add, remove, and reorder', async () => {
    const user = userEvent.setup();
    render(<QuizHarness />);

    await user.click(screen.getByRole('button', { name: 'Add question' }));
    const pointInputs = screen.getAllByLabelText('Points');
    const explanations = screen.getAllByLabelText('Explanation (shown after submit)');
    const ids = [...pointInputs, ...explanations].map((field) => field.id);
    expect(new Set(ids).size).toBe(ids.length);

    const secondPointsLabel = document.querySelector(`label[for="${pointInputs[1].id}"]`);
    expect(secondPointsLabel).not.toBeNull();
    if (secondPointsLabel) {await user.click(secondPointsLabel);}
    expect(document.activeElement).toBe(pointInputs[1]);
    const secondExplanationLabel = document.querySelector(`label[for="${explanations[1].id}"]`);
    expect(secondExplanationLabel).not.toBeNull();
    if (secondExplanationLabel) {await user.click(secondExplanationLabel);}
    expect(document.activeElement).toBe(explanations[1]);

    await user.click(screen.getByRole('button', { name: 'Move question 3 up' }));
    const reordered = screen.getAllByLabelText('Points');
    expect(new Set(reordered.map((field) => field.id)).size).toBe(3);
    expect(reordered[1].id).toBe(pointInputs[2].id);
    await user.click(screen.getByRole('button', { name: 'Remove question 2' }));
    const remaining = screen.getAllByLabelText('Points');
    expect(remaining).toHaveLength(2);
    expect(new Set(remaining.map((field) => field.id)).size).toBe(2);
  });
});
