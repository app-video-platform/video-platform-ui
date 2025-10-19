/* eslint-disable indent */
import React from 'react';
import GalFormInput from '../../../../../../components/gal-form-input/gal-form-input.component';
import GalSelect, {
  GalSelectOption,
} from '../../../../../../components/gal-select/gal-select.component';
import MCQEditor from '../../editors/mcq-editor/mcq-editor.component';
import TrueFalseEditor from '../../editors/true-false-editor/true-false-editor.component';
import {
  MCQQuestion,
  QuestionType,
  QuizQuestion,
} from '../quiz-wizard.component';

import './question-card.styles.scss';

interface QuestionCardProps {
  question: QuizQuestion;
  index: number;
  // eslint-disable-next-line no-unused-vars
  // onTypeChange: (type: QuestionType) => void;
  // eslint-disable-next-line no-unused-vars
  onChange: (q: QuizQuestion) => void;
  onRemove: () => void;
  // eslint-disable-next-line no-unused-vars
  onMove: (dir: -1 | 1) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  // onTypeChange,
  onChange,
  onRemove,
  onMove,
}) => {
  const typeOptions: GalSelectOption[] = [
    {
      label: 'Multiple choice - single answer',
      value: 'multiple_choice_single',
    },
    {
      label: 'Multiple choice - multiple answers',
      value: 'multiple_choice_multi',
    },
    {
      label: 'True - false',
      value: 'true_false',
    },
  ];

  const handleTypeChange = (type: string) => {
    console.log('type change', type);
    const newType = type as QuestionType;
    const updatedQuestion = { ...question, type: newType } as QuizQuestion;
    onChange(updatedQuestion);
  };

  const isQuestionMCType = (ques: QuizQuestion): ques is MCQQuestion =>
    ques.type === 'multiple_choice_single' ||
    ques.type === 'multiple_choice_multi';

  return (
    <div className="question-card">
      <section className="question-card-top">
        <div className="qc-meta">
          <span className="qc-badge">{index + 1}</span>
        </div>
        <div className="qc-actions">
          <button onClick={() => onMove(-1)} disabled={index === 0}>
            ↑
          </button>
          <button onClick={() => onMove(1)}>↓</button>
          <button className="is-danger" onClick={onRemove}>
            Delete
          </button>
        </div>
      </section>

      <div className="question-card-body">
        <div className="qc-title-row">
          <div className="qc-question">
            <GalFormInput
              value={question.title}
              name="question"
              label="Question"
              inputType="text"
              onChange={(e: { target: { value: string } }) =>
                onChange({ ...question, title: e.target.value } as QuizQuestion)
              }
            />
          </div>

          <div className="qc-points">
            <GalFormInput
              value={question.points}
              name="points"
              label="Points"
              inputType="number"
              onChange={(e: { target: { value: string } }) =>
                onChange({
                  ...question,
                  points: Number(e.target.value || 0),
                } as QuizQuestion)
              }
            />
          </div>
        </div>

        <GalFormInput
          value={question.explanation ?? ''}
          name="explanation"
          label="Explanation (shown after submit)"
          inputType="text"
          onChange={(e: { target: { value: string } }) =>
            onChange({
              ...question,
              explanation: e.target.value,
            } as QuizQuestion)
          }
        />

        <GalSelect
          value={question.type}
          name="type"
          label="Question type"
          options={typeOptions}
          onChange={(e: { target: { value: string } }) =>
            handleTypeChange(e.target.value)
          }
        />
      </div>

      <div>
        {isQuestionMCType(question) ? (
          <MCQEditor
            question={question}
            questionType="choice"
            onChange={(next) => onChange(next)}
          />
        ) : (
          <MCQEditor
            question={question}
            questionType="true_false"
            onChange={(next) => onChange(next)}
          />
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
