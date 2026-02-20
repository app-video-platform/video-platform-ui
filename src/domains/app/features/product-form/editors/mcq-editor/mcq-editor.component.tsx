/* eslint-disable indent */
import React from 'react';
import clsx from 'clsx';
import { MdAdd } from 'react-icons/md';

import { MCQQuestion, QuizOption, TrueFalseQuestion } from 'core/api/models';
import { Button, CheckboxInput, Input, Radio } from '@shared/ui';

import './mcq-editor.styles.scss';

interface MCQEditorProps {
  question: MCQQuestion | TrueFalseQuestion;
  questionType: 'choice' | 'true_false';
  // eslint-disable-next-line no-unused-vars
  onChange: (q: MCQQuestion | TrueFalseQuestion) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

const MCQEditor: React.FC<MCQEditorProps> = ({
  question,
  questionType,
  onChange,
}) => {
  const isChoice = questionType === 'choice';
  const realOptions: QuizOption[] = question.options || [];

  // For MCQ, we render all real options + one ghost option at the bottom
  const hasGhostRow = isChoice;
  const displayOptions: QuizOption[] = hasGhostRow
    ? [
        ...realOptions,
        {
          id: '__ghost__',
          text: '',
          isCorrect: false,
          position: realOptions.length + 1,
        },
      ]
    : realOptions;

  const totalReal = realOptions.length;

  const toggleCorrect = (id: string) => {
    if (question.type === 'multiple_choice_single') {
      onChange({
        ...question,
        options: realOptions.map((o) => ({
          ...o,
          isCorrect: o.id === id,
        })),
      });
    } else {
      onChange({
        ...question,
        options: realOptions.map((o) =>
          o.id === id ? { ...o, isCorrect: !o.isCorrect } : o,
        ),
      });
    }
  };

  const addOption = (text: string) =>
    onChange({
      ...question,
      options: [
        ...realOptions,
        { id: uid(), text, isCorrect: false, position: realOptions.length + 1 },
      ],
    });

  const removeOption = (id: string) =>
    onChange({
      ...question,
      options: realOptions.filter((o) => o.id !== id),
    });

  const updateText = (id: string, text: string) =>
    onChange({
      ...question,
      options: realOptions.map((o) => (o.id === id ? { ...o, text } : o)),
    });

  // When typing in the ghost row, promote it to a real option
  const handleGhostChange = (text: string) => {
    if (!text.trim()) {
      return;
    }
    addOption(text);
  };

  return (
    <div className="qb-editor qb-editor__mcq">
      {displayOptions.map((o, index) => {
        const isGhost = hasGhostRow && index === totalReal;
        const hasValue = !isGhost && !!o.text.trim();

        // For true/false questions, we don’t show the ghost row and keep current behaviour
        if (!isChoice && isGhost) {
          return null;
        }
        return (
          <div
            key={index}
            className={clsx('qb-row', {
              ghost: isGhost,
              'has-value': hasValue,
            })}
          >
            <Input
              placeholder={
                isGhost
                  ? `Add option ${realOptions.length + 1}`
                  : `Option ${index + 1}`
              }
              value={isGhost ? '' : o.text}
              prefixIcon={isGhost ? MdAdd : undefined}
              onChange={(e: { target: { value: string } }) =>
                isGhost
                  ? handleGhostChange(e.target.value)
                  : updateText(o.id, e.target.value)
              }
              className={clsx({})}
            />
            <div className={clsx('answer-actions', { visible: !isGhost })}>
              <div className="is-correct-container">
                {question.type === 'multiple_choice_multi' ? (
                  <CheckboxInput
                    label="Is Correct"
                    name={`correct-${question.id}`}
                    checked={!!o.isCorrect}
                    onChange={() => toggleCorrect(o.id)}
                  />
                ) : (
                  <Radio
                    value=""
                    label="Is Correct"
                    name={`correct-${question.id}`}
                    checked={!!o.isCorrect}
                    onChange={() => toggleCorrect(o.id)}
                  />
                )}
              </div>
              {question.type !== 'true_false' && (
                <Button
                  type="button"
                  variant="remove"
                  onClick={() => removeOption(o.id)}
                  aria-label="Remove option"
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MCQEditor;
