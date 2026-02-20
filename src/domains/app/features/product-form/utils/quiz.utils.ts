import { MCQQuestion, QuizDraft, QuizQuestion } from 'core/api/models';

const uid = () => Math.random().toString(36).slice(2, 10);

const splitPointsEvenly = (total: number, count: number): number[] => {
  if (count <= 0) {
    return [];
  }
  const base = Math.floor(total / count);
  let remainder = total - base * count;

  return Array.from({ length: count }, () => {
    const extra = remainder > 0 ? 1 : 0;
    if (remainder > 0) {
      remainder -= 1;
    }
    return base + extra;
  });
};

export const getEmptyMCQ = (position: number): MCQQuestion => ({
  id: uid(),
  title: 'How many cats do I have?',
  type: 'multiple_choice_single',
  points: 1,
  explanation: '',
  position,
  shuffle: true,
  options: [
    { id: uid(), text: '0', isCorrect: false, position: 1 },
    { id: uid(), text: 'more than 0', isCorrect: true, position: 2 },
  ],
});

export const autoSplitQuizPoints = (quiz: QuizDraft): QuizDraft => {
  const count = quiz.questions?.length ?? 0;
  if (!count) {
    return quiz;
  }

  const total = quiz.totalScore ?? 0;
  const perQuestion = splitPointsEvenly(total, count);

  let changed = false;
  const nextQuestions = quiz.questions?.map((q, idx) => {
    const nextPoints = perQuestion[idx] ?? q.points;
    if (q.points !== nextPoints) {
      changed = true;
      return { ...q, points: nextPoints };
    }
    return q;
  });

  return changed ? { ...quiz, questions: nextQuestions } : quiz;
};

export const syncTotalScoreToPoints = (quiz: QuizDraft): QuizDraft => {
  const sum = quiz.questions?.reduce((s, q) => s + (q.points ?? 0), 0);
  return quiz.totalScore === sum ? quiz : { ...quiz, totalScore: sum };
};

export const normalizeQuestionPositions = (
  questions: QuizQuestion[],
): QuizQuestion[] => questions.map((q, idx) => ({ ...q, position: idx + 1 }));
