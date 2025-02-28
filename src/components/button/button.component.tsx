import React from 'react';

import './button.styles.scss';

interface ButtonProps {
  text: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => <button onClick={onClick} className="button">{text}</button>;

export default Button;