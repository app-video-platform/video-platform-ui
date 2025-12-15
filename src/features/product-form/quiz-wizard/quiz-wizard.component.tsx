import React, { useEffect, useMemo, useState } from 'react';

import { Button, Input, Radio, RadioGroup } from '@shared/ui';
import { MCQQuestion, QuizDraft, QuizQuestion } from '@api/models';
import QuestionCard from './question-card/question-card.component';

import './quiz-wizard.styles.scss';

interface QuizWizardProps {
  initial?: Partial<QuizDraft>;
  // eslint-disable-next-line no-unused-vars
  onSave?: (quiz: QuizDraft) => Promise<void> | void; // hook for API integration
}

const uid = () => Math.random().toString(36).slice(2, 10);

const getEmptyMCQ = (position: number): MCQQuestion => ({
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

const QuizWizard: React.FC<QuizWizardProps> = ({ initial, onSave }) => {
  const [quiz, setQuiz] = useState<QuizDraft>(() => ({
    id: initial?.id ?? uid(),
    questions: initial?.questions ?? [getEmptyMCQ(1)],
    passingScore: initial?.passingScore ?? 70,
  }));

  const [scoreType, setScoreType] = useState<'auto' | 'manual'>('auto');

  const totalPoints = useMemo(
    () => quiz.questions.reduce((sum, q) => sum + q.points, 0),
    [quiz.questions],
  );

  useEffect(() => {
    if (scoreType !== 'auto') {
      return;
    }

    setQuiz((qz) => {
      const count = qz.questions.length;
      if (!count) {
        return qz;
      }

      const total = qz.totalScore ?? totalPoints;
      const perQuestion = splitPointsEvenly(total, count);

      let changed = false;
      const nextQuestions = qz.questions.map((q, idx) => {
        const nextPoints = perQuestion[idx];
        if (q.points !== nextPoints) {
          changed = true;
          return { ...q, points: nextPoints };
        }
        return q;
      });

      if (!changed) {
        return qz;
      }
      return { ...qz, questions: nextQuestions };
    });
  }, [scoreType, quiz.totalScore, quiz.questions.length, totalPoints]);

  // Manual mode: keep totalScore in sync with sum of question points
  useEffect(() => {
    if (scoreType !== 'manual') {
      return;
    }

    setQuiz((qz) => {
      if (qz.totalScore === totalPoints) {
        return qz;
      }
      return { ...qz, totalScore: totalPoints };
    });
  }, [scoreType, totalPoints]);

  const updateQuestion = (qid: string, next: QuizQuestion) => {
    setQuiz((qz) => ({
      ...qz,
      questions: qz.questions.map((q) => (q.id === qid ? next : q)),
    }));
  };

  const removeQuestion = (qid: string) => {
    setQuiz((qz) => ({
      ...qz,
      questions: qz.questions.filter((q) => q.id !== qid),
    }));
  };

  const moveQuestion = (qid: string, dir: -1 | 1) => {
    setQuiz((qz) => {
      const idx = qz.questions.findIndex((q) => q.id === qid);
      if (idx < 0) {
        return qz;
      }
      const next = [...qz.questions];
      const newIdx = Math.min(next.length - 1, Math.max(0, idx + dir));
      const [spliced] = next.splice(idx, 1);
      next.splice(newIdx, 0, spliced);
      return { ...qz, questions: next };
    });
  };

  const addQuestion = () => {
    const position = quiz.questions.length + 1;
    setQuiz((qz) => ({
      ...qz,
      questions: [...qz.questions, getEmptyMCQ(position)],
    }));
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
          value={quiz.passingScore ?? 80}
          label="Passing Score"
          name="passingScore"
          type="number"
          className="score-input"
          onChange={(e: { target: { value: any } }) =>
            setQuiz((q) => ({
              ...q,
              passingScore: Number(e.target.value || 0),
            }))
          }
        />
        <Input
          value={scoreType === 'auto' ? (quiz.totalScore ?? 0) : totalPoints}
          label="Total points"
          name="totalPoints"
          className="score-input"
          type="number"
          readOnly={scoreType === 'manual'}
          onChange={(e) => {
            if (scoreType === 'manual') {
              return;
            }
            const value = Number(e.target.value || 0);
            setQuiz((q) => ({
              ...q,
              totalScore: value,
            }));
          }}
        />
      </div>

      <section className="questions">
        {quiz.questions.map((q, idx) => (
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
