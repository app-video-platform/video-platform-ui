import clsx from 'clsx';
import React from 'react';

import './divider-marketing.styles.scss';

interface DividerMarketingProps {
  margin?: string; // eg. 16px 24px
  big?: boolean;
  vertical?: boolean;
}

const DividerMarketing: React.FC<DividerMarketingProps> = ({
  margin = '16px 0',
  big = false,
  vertical = false,
}) => (
  <div
    className={clsx('vp-divider-marketing', {
      'vp-divider-marketing__big': big,
      'vp-divider-marketing__vertical': vertical,
    })}
    style={{ margin: margin }}
  ></div>
);

export default DividerMarketing;
