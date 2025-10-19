import React, { useEffect, useState } from 'react';
import {
  MCQQuestion,
  QuizOption,
  TrueFalseQuestion,
} from '../../../../../../api/models/product/quiz';
import GalFormInput from '../../../../../../components/gal-form-input/gal-form-input.component';

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
  const [options, setOptions] = useState<QuizOption[]>([]);
  useEffect(() => {
    if (questionType === 'choice') {
      setOptions(question.options);
    } else {
      const trueFalseOptions: QuizOption[] = [
        {
          id: uid(),
          text: 'True',
          isCorrect: true,
        },
        {
          id: uid(),
          text: 'False',
          isCorrect: true,
        },
      ];
      setOptions(trueFalseOptions);
    }
  }, [question, questionType]);

  const toggleCorrect = (id: string) => {
    if (question.type === 'multiple_choice_single') {
      onChange({
        ...question,
        options: question.options.map((o) => ({
          ...o,
          isCorrect: o.id === id,
        })),
      });
    } else {
      onChange({
        ...question,
        options: question.options.map((o) =>
          o.id === id ? { ...o, isCorrect: !o.isCorrect } : o,
        ),
      });
    }
  };

  const addOption = () =>
    onChange({
      ...question,
      options: [...question.options, { id: uid(), text: '', isCorrect: false }],
    });
  const removeOption = (id: string) =>
    onChange({
      ...question,
      options: question.options.filter((o) => o.id !== id),
    });
  const updateText = (id: string, text: string) =>
    onChange({
      ...question,
      options: question.options.map((o) => (o.id === id ? { ...o, text } : o)),
    });

  return (
    <div className="qb-editor qb-editor__mcq">
      {options.map((o, i) => (
        <div key={o.id} className="qb-row">
          <input
            className="qb-check"
            type={
              question.type === 'multiple_choice_multi' ? 'checkbox' : 'radio'
            }
            name={`correct-${question.id}`}
            checked={!!o.isCorrect}
            onChange={() => toggleCorrect(o.id)}
          />
          <GalFormInput
            placeholder={`Option ${i + 1}`}
            value={o.text}
            onChange={(e: { target: { value: string } }) =>
              updateText(o.id, e.target.value)
            }
          />
          <button onClick={() => removeOption(o.id)} aria-label="Remove option">
            Remove
          </button>
        </div>
      ))}
      <button onClick={addOption}>+ Add option</button>
    </div>
  );
};

export default MCQEditor;
