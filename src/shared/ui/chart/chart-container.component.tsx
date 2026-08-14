import React from 'react';
import clsx from 'clsx';

import './chart.styles.scss';

interface ChartContainerProps {
  title?: string;
  description?: string;
  height?: number;
  className?: string;
  children: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  height = 280,
  className,
  children,
}) => (
  <div
    className={clsx('chart-container', className)}
    style={{ '--chart-height': `${height}px` } as React.CSSProperties}
    role="img"
    aria-label={title}
    aria-description={description}
  >
    {children}
  </div>
);

export default ChartContainer;
