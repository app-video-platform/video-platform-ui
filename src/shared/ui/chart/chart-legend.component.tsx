import React from 'react';

import './chart.styles.scss';

export interface ChartLegendItem {
  label: string;
  color: string;
  marker?: 'line' | 'bar';
}

interface ChartLegendProps {
  items: ChartLegendItem[];
}

const ChartLegend: React.FC<ChartLegendProps> = ({ items }) => (
  <ul className="chart-legend" aria-label="Chart legend">
    {items.map((item) => (
      <li key={item.label}>
        <span
          className={`chart-legend__marker chart-legend__marker--${item.marker ?? 'line'}`}
          style={{ background: item.color }}
          aria-hidden="true"
        />
        <span>{item.label}</span>
      </li>
    ))}
  </ul>
);

export default ChartLegend;
