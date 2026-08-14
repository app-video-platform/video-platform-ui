import React from 'react';

import './chart.styles.scss';

interface ChartEmptyStateProps {
  title: string;
  message: string;
}

const ChartEmptyState: React.FC<ChartEmptyStateProps> = ({ title, message }) => (
  <div className="chart-empty-state" role="status">
    <strong>{title}</strong>
    <span>{message}</span>
  </div>
);

export default ChartEmptyState;
