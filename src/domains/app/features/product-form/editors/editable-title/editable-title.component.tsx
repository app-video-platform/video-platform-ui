import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

import './editable-title.styles.scss';

interface EditableTitleProps {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (val: string) => void;
  placeholder?: string;
  small?: boolean;
  smaller?: boolean;
}

const EditableTitle: React.FC<EditableTitleProps> = ({
  value,
  onChange,
  placeholder = 'Untitled section',
  small = false,
  smaller = false,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const lastPropValueRef = useRef<string>(value);
  const [isFocused, setFocused] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (ref.current.textContent !== value) {
      ref.current.textContent = value;
    }

    lastPropValueRef.current = value;
  }, [value]);

  const handleBlur = () => {
    if (!ref.current) {
      return;
    }
    const text = ref.current.textContent ?? '';
    lastPropValueRef.current = text;
    onChange(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLDivElement).blur();
    }
  };

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      className={clsx('editable-title', {
        'editable-title__focused': isFocused,
        small,
        smaller,
      })}
      onFocus={() => setFocused(true)}
      data-placeholder={placeholder}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
};

export default EditableTitle;
