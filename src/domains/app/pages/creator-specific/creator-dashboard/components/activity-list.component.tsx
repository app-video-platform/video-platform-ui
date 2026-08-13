import React from 'react';
import { Link } from 'react-router-dom';
import {
  HiCheckCircle,
  HiArrowPath,
  HiCreditCard,
  HiExclamationCircle,
  HiShoppingBag,
  HiUserPlus,
  HiXCircle,
} from 'react-icons/hi2';

import { Icon } from '@shared/ui';
import { getCssVar } from '@shared/utils';
import { DashboardActivity, DashboardActivityKind } from 'core/api/models';

import './activity-list.styles.scss';

const activityIcon: Record<DashboardActivityKind, typeof HiShoppingBag> = {
  sale: HiShoppingBag,
  customer: HiUserPlus,
  'membership-started': HiUserPlus,
  'membership-renewed': HiArrowPath,
  'membership-cancelled': HiXCircle,
  'failed-payment': HiExclamationCircle,
  'product-published': HiCheckCircle,
  'product-updated': HiCreditCard,
};

interface ActivityListProps {
  items: DashboardActivity[];
}

const ActivityList: React.FC<ActivityListProps> = ({ items }) => (
  <div className="activity-list">
    {items.map((item) => {
      const ActivityIcon = activityIcon[item.kind];
      const content = (
        <>
          <span className="activity-list__icon" aria-hidden="true">
            <Icon
              icon={ActivityIcon}
              size={16}
              color={getCssVar('--text-primary')}
            />
          </span>
          <div className="activity-list__content">
            <div className="activity-list__headline">
              <h3>{item.title}</h3>
              <time>{item.timestamp}</time>
            </div>
            {item.context && <p>{item.context}</p>}
            {(item.value || item.status) && (
              <div className="activity-list__meta">
                {item.value && <strong>{item.value}</strong>}
                {item.status && <span>{item.status}</span>}
              </div>
            )}
          </div>
        </>
      );

      if (item.destinationPath) {
        return (
          <Link
            key={item.id}
            className="activity-list__item activity-list__item--interactive"
            to={item.destinationPath}
            aria-label={`Open ${item.title}: ${item.context ?? item.timestamp}`}
          >
            {content}
          </Link>
        );
      }

      return (
        <article key={item.id} className="activity-list__item">
          {content}
        </article>
      );
    })}
  </div>
);

export default ActivityList;
