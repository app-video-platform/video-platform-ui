/* eslint-disable indent */
import React, { useState } from 'react';

import {
  Input,
  Textarea,
  Toggle,
  InfoPopover,
  ExpansionPanel,
} from '@shared/ui';
import { MCQQuestion, QuestionType, QuizQuestion } from 'core/api/models';
import MCQEditor from '../../editors/mcq-editor/mcq-editor.component';
import { EditableTitle } from 'domains/app/features/product-form/editors';
import { GalBoxSelector } from 'domains/app/components';
import { normalizeQuestionForType } from './answer-normalizer.util';

import './question-card.styles.scss';

interface QuestionCardProps {
  question: QuizQuestion;
  index: number;
  readOnly?: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange: (q: QuizQuestion) => void;
  onRemove: () => void;
  // eslint-disable-next-line no-unused-vars
  onMove: (dir: -1 | 1) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  readOnly = true,
  onChange,
  onRemove,
  onMove,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleTypeChange = (type: string) => {
    const newType = type as QuestionType;
    const updatedQuestion = normalizeQuestionForType(question, newType);
    // const updatedQuestion = { ...question, type: newType } as QuizQuestion;
    onChange(updatedQuestion);
  };

  const isQuestionMCType = (ques: QuizQuestion): ques is MCQQuestion =>
    ques.type === 'multiple_choice_single' ||
    ques.type === 'multiple_choice_multi';

  return (
    <ExpansionPanel
      className="question-card"
      defaultExpanded={true}
      header={
        <>
          <h4 className="question-index">Question {index + 1}</h4>
          <EditableTitle
            value={question.title ?? ''}
            placeholder="How many cats does Taylor Swift have? (click here to edit)"
            onChange={(title: string) =>
              onChange({ ...question, title } as QuizQuestion)
            }
            smaller
          />
        </>
      }
    >
      <div className="question-row">
        <GalBoxSelector<QuestionType>
          selectedOption={question.type}
          selectFor="question"
          onSelect={(type) => handleTypeChange(type)}
          availableOptions={[
            'multiple_choice_single',
            'multiple_choice_multi',
            'true_false',
          ]}
        />

        <Input
          value={question.points}
          name="points"
          label="Points"
          type="number"
          readOnly={readOnly}
          className="points-input"
          onChange={(e: { target: { value: string } }) =>
            onChange({
              ...question,
              points: Number(e.target.value || 0),
            } as QuizQuestion)
          }
        />
      </div>

      <span className="answers-label">Answers</span>
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

      <div className="shuffle-row">
        <Toggle
          label="Suffle answers"
          checked={question.shuffle}
          name="shuffle"
          onChange={(e: { target: { checked: boolean } }) =>
            onChange({
              ...question,
              shuffle: e.target.checked,
            } as QuizQuestion)
          }
        />

        <InfoPopover>
          <span>
            If you check this, the question order displayed to your students
            will be randomized
          </span>
        </InfoPopover>
      </div>

      <Textarea
        value={question.explanation ?? ''}
        label="Explanation (shown after submit)"
        name="explanation"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange({
            ...question,
            explanation: e.target.value,
          } as QuizQuestion)
        }
        placeholder="What's the reasoning behind your answer?"
        isMaxLengthShown={true}
        maxLength={250}
      />
    </ExpansionPanel>
  );
};

export default QuestionCard;
