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
  primaryType?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  secondaryType?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  primaryLoading?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subTitle,
  primaryLabel,
  secondaryLabel,
  onPrimaryClick,
  onSecondaryClick,
  primaryType = 'button',
  secondaryType = 'button',
  primaryLoading = false,
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
            <Button type={secondaryType} variant="secondary" onClick={onSecondaryClick}>
              {secondaryLabel}
            </Button>
          )}
          {primaryLabel && (
            <Button type={primaryType} variant="primary" loading={primaryLoading} onClick={onPrimaryClick}>
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
