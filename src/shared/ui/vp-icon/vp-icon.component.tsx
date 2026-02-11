import React from 'react';
import { IconType } from 'react-icons';

import './vp-icon.styles.scss';

interface VPIconProps {
  icon: IconType;
  color?: string;
  size?: number;
  className?: string;
}

const VPIcon: React.FC<VPIconProps> = ({
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
      },
    )}
  </div>
);

export default VPIcon;
