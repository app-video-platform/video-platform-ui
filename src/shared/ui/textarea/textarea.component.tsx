import React, { useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';

import './textarea.styles.scss';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  value: string;
  required?: boolean;
  isMaxLengthShown?: boolean;
  maxLength?: number;
  error?: string;
  block?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  value,
  isMaxLengthShown = false,
  maxLength = 999,
  className,
  block = false,
  error,
  ...otherProps
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  // After each render where `value` changed, adjust height
  useLayoutEffect(() => {
    const ta = ref.current;
    if (!ta) {
      return;
    }
    ta.style.height = 'auto'; // reset
    ta.style.height = ta.scrollHeight + 'px'; // expand
  }, [value]);

  return (
    <div className={clsx('textarea-wrapper', className)}>
      {label && <label className="input-label">{label}</label>}
      <div className="textarea-wrapper">
        <textarea
          className={clsx('textarea-field', { block })}
          ref={ref}
          value={value}
          {...otherProps}
          maxLength={maxLength}
        />
        {isMaxLengthShown && (
          <span className="textarea-max-value">
            {String(value ?? '').length} / {maxLength}
          </span>
        )}
      </div>

      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Textarea;
