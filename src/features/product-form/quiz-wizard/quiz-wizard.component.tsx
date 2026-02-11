import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Button, Input, Radio, RadioGroup } from '@shared/ui';
import { CourseLesson, QuizDraft, QuizQuestion } from '@api/models';
import QuestionCard from './question-card/question-card.component';

import './quiz-wizard.styles.scss';
import {
  autoSplitQuizPoints,
  getEmptyMCQ,
  normalizeQuestionPositions,
  syncTotalScoreToPoints,
} from '../utils/quiz.utils';

interface QuizWizardProps {
  lesson?: Partial<CourseLesson>;
  // eslint-disable-next-line no-unused-vars
  updateLesson: (quiz: Partial<CourseLesson>) => void; // hook for API integration
}

const QuizWizard: React.FC<QuizWizardProps> = ({ lesson, updateLesson }) => {
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) {
      return;
    }
    didInit.current = true;

    const nextQuiz = ensureQuizDefaults(lesson);
    // Only write if lesson.quiz is missing or incomplete
    const shouldWrite =
      !lesson?.quiz ||
      !lesson.quiz.questions?.length ||
      lesson.quiz.passingScore === null ||
      lesson.quiz.totalScore === null;

    if (shouldWrite) {
      updateLesson({ quiz: nextQuiz });
    }
  }, []);

  const [scoreType, setScoreType] = useState<'auto' | 'manual'>('auto');

  const totalPoints = useMemo(
    () => lesson?.quiz?.questions?.reduce((sum, q) => sum + q.points, 0),
    [lesson?.quiz?.questions],
  );

  const ensureQuizDefaults = (lesson?: Partial<CourseLesson>): QuizDraft => {
    const existing = lesson?.quiz;

    return {
      passingScore: existing?.passingScore ?? 80,
      totalScore: existing?.totalScore ?? 100,
      questions: existing?.questions?.length
        ? existing.questions
        : [getEmptyMCQ(1)],
    };
  };

  useEffect(() => {
    if (scoreType !== 'auto') {
      return;
    }

    const current = lesson?.quiz;
    if (!current?.questions?.length) {
      return;
    }

    const nextQuiz = autoSplitQuizPoints(current);

    // Important: only update if something changed (function returns same object if no change)
    if (nextQuiz !== current) {
      updateLesson({ quiz: nextQuiz });
    }
  }, [scoreType, lesson?.quiz, updateLesson]);

  // Manual mode: keep totalScore in sync with sum of question points
  useEffect(() => {
    if (scoreType !== 'manual') {
      return;
    }

    const current = lesson?.quiz;
    if (!current?.questions?.length) {
      return;
    }

    const nextQuiz = syncTotalScoreToPoints(current);

    if (nextQuiz !== current) {
      updateLesson({ quiz: nextQuiz });
    }
  }, [scoreType, lesson?.quiz, updateLesson]);

  const updateQuestion = (qid: string, next: QuizQuestion) => {
    const current = lesson?.quiz ?? ensureQuizDefaults(lesson);
    const nextQuestions = current.questions?.map((q) =>
      q.id === qid ? next : q,
    );

    // keep positions in sync if you want:
    // const normalized = nextQuestions.map((q, i) => ({ ...q, position: i + 1 }));

    updateLesson({ quiz: { ...current, questions: nextQuestions } });
  };

  const removeQuestion = (qid: string) => {
    const current = lesson?.quiz ?? ensureQuizDefaults(lesson);

    updateLesson({
      quiz: {
        ...current,
        questions: current.questions?.filter((q) => q.id !== qid),
      },
    });
  };

  const moveQuestion = (qid: string, dir: -1 | 1) => {
    const current = lesson?.quiz ?? ensureQuizDefaults(lesson);
    const questions = current.questions ?? [];

    const idx = questions.findIndex((q) => q.id === qid);
    if (idx < 0) {
      return;
    }

    const next = [...questions];
    const newIdx = Math.min(next.length - 1, Math.max(0, idx + dir));
    if (newIdx === idx) {
      return;
    }

    const [spliced] = next.splice(idx, 1);
    next.splice(newIdx, 0, spliced);

    updateLesson({
      quiz: {
        ...current,
        questions: normalizeQuestionPositions(next),
      },
    });
  };

  const addQuestion = () => {
    const current = lesson?.quiz ?? ensureQuizDefaults(lesson);
    const questions = current.questions ?? [];

    const next = [...questions, getEmptyMCQ(questions.length + 1)];

    updateLesson({
      quiz: {
        ...current,
        questions: normalizeQuestionPositions(next),
      },
    });
  };

  const updateQuiz = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const quiz = { ...lesson?.quiz, [name]: value };
    updateLesson({ quiz });
  };

  return (
    <div className="quiz-wizard">
      <RadioGroup
        name="scoreType"
        value={scoreType}
        onChange={(v) => setScoreType(v as 'auto' | 'manual')}
        label="Points distribution"
        className="score-radios"
      >
        <Radio
          value="auto"
          label="Auto-Split"
          description="Distribute the total points evenly across all questions."
        />
        <Radio
          value="manual"
          label="Manual Split"
          description="Set points on each question individually."
        />
      </RadioGroup>

      <div className="scores-row">
        <Input
          value={lesson?.quiz?.passingScore ?? 80}
          label="Passing Score"
          name="passingScore"
          type="number"
          className="score-input"
          onChange={updateQuiz}
        />
        <Input
          value={
            scoreType === 'auto'
              ? (lesson?.quiz?.totalScore ?? 0)
              : (totalPoints ?? 100)
          }
          label="Total points"
          name="totalPoints"
          className="score-input"
          type="number"
          readOnly={scoreType === 'manual'}
          onChange={updateQuiz}
        />
      </div>

      <section className="questions">
        {lesson?.quiz?.questions?.map((q, idx) => (
          <QuestionCard
            key={idx}
            question={q}
            index={idx}
            readOnly={scoreType === 'auto'}
            // onTypeChange={(type) => onTypeChange(q, type)}
            onChange={(next) => updateQuestion(q.id, next)}
            onRemove={() => removeQuestion(q.id)}
            onMove={(dir) => moveQuestion(q.id, dir)}
          />
        ))}
      </section>

      <section>
        <Button type="button" variant="primary" onClick={() => addQuestion()}>
          Add question
        </Button>
      </section>
    </div>
  );
};

export default QuizWizard;
