import React from 'react';

import './button.styles.scss';

interface ButtonProps {
  text: string;
  type: 'neutral' | 'primary' | 'secondary';
  onClick?: () => void;
  htmlType?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ text, type = 'neutral', onClick, htmlType }) => <button onClick={onClick} type={htmlType} className={`vp-button vp-button--${type}`}>{text}</button>;

export default Button;