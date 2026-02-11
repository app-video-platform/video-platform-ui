import React from 'react';

import { Button, Divider } from '@shared/ui';

import './page-header.styles.scss';

interface PageHeaderProps {
  title: string;
  subTitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subTitle,
  primaryLabel,
  secondaryLabel,
  onPrimaryClick,
  onSecondaryClick,
}) => (
  <>
    <div className="page-header">
      <div className="title-wrapper">
        <h2>{title}</h2>
        {subTitle && <p className="subtitle">{subTitle}</p>}
      </div>
      {primaryLabel && secondaryLabel && (
        <div className="header-actions">
          {secondaryLabel && (
            <Button variant="secondary" onClick={onSecondaryClick}>
              {secondaryLabel}
            </Button>
          )}
          {primaryLabel && (
            <Button variant="primary" onClick={onPrimaryClick}>
              {primaryLabel}
            </Button>
          )}
        </div>
      )}
    </div>
    <Divider />
  </>
);

export default PageHeader;
