import React from 'react';
import { IconType } from 'react-icons';

interface IconComponentProps {
  icon: IconType;
  color?: string;
  size?: number;
  className?: string;
}

const IconComponent: React.FC<IconComponentProps> = ({
  icon: Icon,
  color = 'black',
  size = 24,
  className,
}) => (
  <div className="icon-container">
    {React.createElement(
      Icon as React.FC<{ size: number; color: string; className?: string }>,
      {
        size: size,
        color: color,
        className: className,
      }
    )}
  </div>
);

export default IconComponent;
