import clsx from 'clsx';
import React from 'react';

import './section-header.styles.scss';

interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle: string;
  className?: string;
  position?: 'center' | 'left';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  className,
  position = 'center',
}) => (
  <header
    className={clsx('section-header', className, `section-header__${position}`)}
  >
    <div className="title-row">
      {position === 'center' && <div className="title-line title-line__left" />}
      <h1 className="title">{title}</h1>
      <div className="title-line title-line__right" />
    </div>
    <p className="section-subtitle">{subtitle}</p>
  </header>
);

export default SectionHeader;
