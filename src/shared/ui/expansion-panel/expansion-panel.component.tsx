import clsx from 'clsx';
import React, { useState, ReactNode, useRef } from 'react';
import { IoChevronDown } from 'react-icons/io5';

import { getCssVar } from '@shared/utils';
import { GalIcon } from '../gal-icon';

import './expansion-panel.styles.scss';

interface ExpansionPanelProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  header: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
  disabled?: boolean;
  className?: string;
  hideToggle?: boolean;
  // eslint-disable-next-line no-unused-vars
  onPanelToggle?: (isOpen: boolean) => void;
}

const ExpansionPanel: React.FC<ExpansionPanelProps> = ({
  header,
  children,
  defaultExpanded = false,
  disabled = false,
  hideToggle = false,
  className,
  onPanelToggle,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);

  const togglePanel = () => {
    if (disabled) {
      return;
    }
    setIsOpen((prev) => {
      const next = !prev;
      onPanelToggle?.(next);
      return next;
    });
  };

  return (
    <div className={clsx('expansion-panel', className, { disabled })}>
      <header className="expansion-panel-header">
        <div className="panel-header-content">{header}</div>
        {!hideToggle && (
          <button
            type="button"
            className="panel-toggle-btn"
            onClick={togglePanel}
            aria-expanded={isOpen}
            aria-disabled={disabled}
            aria-controls="expansion-panel-content"
          >
            <GalIcon
              icon={IoChevronDown}
              color={getCssVar('--text-primary')}
              className={clsx('panel-chevron', { expanded: isOpen })}
            />
          </button>
        )}
      </header>

      <div
        id="expansion-panel-content"
        className={clsx('expansion-panel-content', {
          expanded: isOpen,
          collapsed: !isOpen,
        })}
        ref={contentRef}
        role="region"
        aria-labelledby="expansion-panel-header"
      >
        {children}
      </div>
    </div>
  );
};

export default ExpansionPanel;
