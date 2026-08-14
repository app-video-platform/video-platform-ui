import React from 'react';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

import './chart.styles.scss';

interface ChartTooltipPayloadItem {
  name?: NameType;
  value?: ValueType;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  label?: React.ReactNode;
  payload?: ChartTooltipPayloadItem[];
  // eslint-disable-next-line no-unused-vars
  valueFormatter?: (..._args: [ValueType, NameType]) => string;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  label,
  payload,
  valueFormatter,
}) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      <dl>
        {payload.map((entry) => (
          <div key={`${entry.name}`}>
            <dt>
              <span
                style={{ background: entry.color }}
                aria-hidden="true"
              />
              {entry.name}
            </dt>
            <dd>
              {valueFormatter
                ? valueFormatter(entry.value ?? '', entry.name ?? '')
                : String(entry.value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default ChartTooltip;
