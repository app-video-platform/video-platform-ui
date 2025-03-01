import React from 'react';

import './button.styles.scss';

interface ButtonProps {
  text: string;
  type: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, type = 'primary', onClick }) => <button onClick={onClick} className={`vp-button vp-button--${type}`}>{text}</button>;

export default Button;