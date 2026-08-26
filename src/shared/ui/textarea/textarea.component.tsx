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
  const {
    ['aria-describedby']: ariaDescribedBy,
    ...textareaProps
  } = otherProps;
  const errorId =
    error && textareaProps.name ? `${textareaProps.name}-error` : undefined;
  const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;
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
      {label && (
        <label htmlFor={textareaProps.name} className="input-label">
          {label}
        </label>
      )}
      <div className="textarea-wrapper">
        <textarea
          className={clsx('textarea-field', { block, 'input-error': error })}
          ref={ref}
          value={value}
          {...textareaProps}
          id={textareaProps.name}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          maxLength={maxLength}
        />
        {isMaxLengthShown && (
          <span className="textarea-max-value">
            {String(value ?? '').length} / {maxLength}
          </span>
        )}
      </div>

      {error && (
        <span id={errorId} className="input-error-message">
          {error}
        </span>
      )}
    </div>
  );
};

export default Textarea;
