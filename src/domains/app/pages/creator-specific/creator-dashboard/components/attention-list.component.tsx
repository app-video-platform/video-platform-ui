import React from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { Button } from '@shared/ui';
import { AttentionItem } from '../fixtures/dashboard-inspection-fixture';

import './attention-list.styles.scss';

interface AttentionListProps {
  items: AttentionItem[];
}

const severityLabel: Record<AttentionItem['severity'], string> = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
};

const AttentionList: React.FC<AttentionListProps> = ({ items }) => {
  const navigate = useNavigate();

  return (
    <div className="attention-list">
      {items.map((item) => (
        <article key={item.id} className="attention-list__item">
          <div className="attention-list__content">
            <span
              className={clsx(
                'attention-list__severity',
                `attention-list__severity--${item.severity}`,
              )}
            >
              {severityLabel[item.severity]}
            </span>
            <h3>{item.issue}</h3>
            <p>{item.context}</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            disabled={!item.actionPath}
            title={item.actionDisabledReason}
            onClick={() => {
              if (item.actionPath) {
                navigate(item.actionPath);
              }
            }}
          >
            {item.actionLabel}
          </Button>
        </article>
      ))}
    </div>
  );
};

export default AttentionList;
