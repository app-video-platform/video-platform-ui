import React, { useMemo, useState } from 'react';
import GalButton from '../../../../../components/gal-button/gal-button.component';
import GalFormInput from '../../../../../components/gal-form-input/gal-form-input.component';
import QuestionCard from './question-card/question-card.component';

import './quiz-wizard.styles.scss';

export type QuestionType =
  | 'multiple_choice_single'
  | 'multiple_choice_multi'
  | 'true_false';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean; // for MCQ types
}

export interface QuizQuestionBase {
  id: string;
  title: string;
  type: QuestionType;
  points: number; // award on full correctness
  explanation?: string; // shown after submit
}

export interface MCQQuestion extends QuizQuestionBase {
  type: 'multiple_choice_single' | 'multiple_choice_multi';
  options: QuizOption[];
}

export interface TrueFalseQuestion extends QuizQuestionBase {
  type: 'true_false';
  options: QuizOption[];
}

export type QuizQuestion = MCQQuestion | TrueFalseQuestion;

export interface QuizDraft {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore?: number; // optional passing threshold in %
}

interface QuizWizardProps {
  initial?: Partial<QuizDraft>;
  onSave?: (quiz: QuizDraft) => Promise<void> | void; // hook for API integration
}

const uid = () => Math.random().toString(36).slice(2, 10);

const emptyMCQ: MCQQuestion = {
  id: uid(),
  title: 'How many cats do I have?',
  type: 'multiple_choice_single',
  points: 1,
  explanation: '',
  options: [
    { id: uid(), text: '0', isCorrect: false },
    { id: uid(), text: 'more than 0', isCorrect: true },
  ],
};

const QuizWizard: React.FC<QuizWizardProps> = ({ initial, onSave }) => {
  const [quiz, setQuiz] = useState<QuizDraft>(() => ({
    id: initial?.id ?? uid(),
    title: initial?.title ?? 'Untitled Quiz',
    description: initial?.description ?? '',
    questions: initial?.questions ?? [emptyMCQ],
    passingScore: initial?.passingScore ?? 70,
  }));

  const totalPoints = useMemo(
    () => quiz.questions.reduce((sum, q) => sum + q.points, 0),
    [quiz.questions],
  );

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
    setQuiz((qz) => ({
      ...qz,
      questions: [...qz.questions, emptyMCQ],
    }));
  };

  // const onTypeChange = (quest: QuizQuestion, type: QuestionType) => {
  //   const foundQuestion = quiz.questions.find((q) => quest.id === q.id);
  //   if (foundQuestion) {
  //     const updatedQuestion: QuizQuestion = { ...foundQuestion, type: type };
  //     setQuiz((qz) => ({
  //       ...qz,
  //       questions: qz.questions.map((q) =>
  //         q.id === quest.id ? updatedQuestion : q,
  //       ),
  //     }));
  //   }
  // };

  return (
    <div className="quiz-wizard">
      <GalFormInput
        value={quiz.title}
        label="Title"
        name="title"
        inputType="text"
        onChange={(e: { target: { value: any } }) =>
          setQuiz((q) => ({ ...q, title: e.target.value }))
        }
      />

      <GalFormInput
        value={quiz.description ?? ''}
        label="Description"
        name="description"
        inputType="textarea"
        onChange={(e: { target: { value: any } }) =>
          setQuiz((q) => ({ ...q, description: e.target.value }))
        }
      />

      <div className="quiz-wiz-content">
        <div>
          Total points: <strong>{totalPoints}</strong>
        </div>
        <GalFormInput
          value={quiz.passingScore ?? 80}
          label="Passing Score"
          name="passing_score"
          inputType="text"
          onChange={(e: { target: { value: any } }) =>
            setQuiz((q) => ({
              ...q,
              passingScore: Number(e.target.value || 0),
            }))
          }
        />

        <section className="space-y-4">
          {quiz.questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
              // onTypeChange={(type) => onTypeChange(q, type)}
              onChange={(next) => updateQuestion(q.id, next)}
              onRemove={() => removeQuestion(q.id)}
              onMove={(dir) => moveQuestion(q.id, dir)}
            />
          ))}
        </section>

        <section>
          <GalButton
            text="Add question"
            type="primary"
            onClick={() => addQuestion()}
          />
        </section>
      </div>
    </div>
  );
};

export default QuizWizard;
