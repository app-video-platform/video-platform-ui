import React from 'react';

import './gal-button.styles.scss';

interface GalButtonProps {
  text: string;
  type: 'neutral' | 'primary' | 'secondary';
  onClick?: () => void;
  htmlType?: 'button' | 'submit' | 'reset';
  customClassName?: string;
  disabled?: boolean;
}

const GalButton: React.FC<GalButtonProps> = ({
  text,
  type = 'neutral',
  onClick,
  htmlType,
  customClassName,
  disabled = false,
}) => (
  <button
    onClick={onClick}
    type={htmlType}
    className={`vp-button vp-button--${type} ${customClassName}`}
    disabled={disabled}
  >
    {text}
  </button>
);

export default GalButton;
