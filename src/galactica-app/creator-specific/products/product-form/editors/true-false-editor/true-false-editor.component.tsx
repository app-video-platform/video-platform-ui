import React from 'react';
import { TrueFalseQuestion } from '../../quiz-wizard/quiz-wizard.component';

import './true-false-editor.styles.scss';

interface TrueFalseEditorProps {
  question: TrueFalseQuestion;
  // eslint-disable-next-line no-unused-vars
  onChange: (q: TrueFalseQuestion) => void;
}

const TrueFalseEditor: React.FC<TrueFalseEditorProps> = ({
  question,
  onChange,
}) => (
  <div>
    {/* {(
      [
        { label: 'True', value: true },
        { label: 'False', value: false },
      ] as const
    ).map((opt) => (
      <label key={String(opt.value)} className="qb-inline qb-inline--choice">
        <input
          className="qb-check"
          type="radio"
          name={`tf-${question.id}`}
          checked={question}
          onChange={() => onChange({ ...question, answer: opt.value })}
        />
        <span>{opt.label}</span>
      </label>
    ))} */}
  </div>
);

export default TrueFalseEditor;
