import {
  MCQQuestion,
  QuizOption,
  TrueFalseQuestion,
  QuestionType,
} from 'core/api/models';

const uid = () => Math.random().toString(36).slice(2, 10);

export type AnyQuestion = MCQQuestion | TrueFalseQuestion;

export function normalizeQuestionForType(
  question: AnyQuestion,
  targetType: QuestionType,
): AnyQuestion {
  let options: QuizOption[] = [...(question.options || [])];

  // --- RULE #2: true/false → only 2 answers remain ---
  if (targetType === 'true_false') {
    if (options.length < 2) {
      // not enough options, create default ones
      options = [
        { id: uid(), text: 'True', isCorrect: true, position: 1 },
        { id: uid(), text: 'False', isCorrect: false, position: 2 },
      ];
    } else {
      // keep just the first two
      options = options.slice(0, 2);
    }
  }

  // --- RULE #1: only one correct for single or true/false ---
  if (targetType !== 'multiple_choice_multi') {
    const correctIndexes = options
      .map((o, i) => (o.isCorrect ? i : -1))
      .filter((i) => i !== -1);

    if (correctIndexes.length > 1) {
      const keepIndex = correctIndexes[0]; // keep the first correct
      options = options.map((o, i) => ({
        ...o,
        isCorrect: i === keepIndex,
      }));
    }
  }

  return {
    ...question,
    type: targetType,
    options,
  } as AnyQuestion;
}
