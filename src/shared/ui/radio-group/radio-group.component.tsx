import React from 'react';
import clsx from 'clsx';

import './radio-group.styles.scss';
import { RadioProps } from '../radio/radio.component';

interface RadioGroupProps {
  name: string;
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;

  label?: string;
  error?: string;
  className?: string;
  children: React.ReactElement<RadioProps> | React.ReactElement<RadioProps>[];
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  label,
  error,
  children,
  className,
}) => {
  const clonedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    return React.cloneElement(child, {
      name,
      checked: child.props.value === value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value),
    });
  });

  return (
    <div className={clsx('radio-group')}>
      {label && <div className="radio-group-label">{label}</div>}
      <div className={clsx('radio-group-options', className)}>
        {clonedChildren}
      </div>
      {error && <div className="radio-group-error">{error}</div>}
    </div>
  );
};

export default RadioGroup;
