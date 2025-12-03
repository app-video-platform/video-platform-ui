import React, { useState, ReactNode, useRef } from 'react';

import './gal-expansion-panel.styles.scss';

interface GalExpansionPanelProps {
  /** Panel header/title */
  header: string;
  /** Content to show when expanded */
  children: ReactNode;
  /** Whether the panel is open by default */
  defaultExpanded?: boolean;
  /** Whether the panel is disabled (not clickable) */
  disabled?: boolean;
  /** Optional callback when toggled: (isOpen) => void */
  // eslint-disable-next-line no-unused-vars
  onToggle?: (isOpen: boolean) => void;
}

const GalExpansionPanel: React.FC<GalExpansionPanelProps> = ({
  header,
  children,
  defaultExpanded = false,
  disabled = false,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);

  const togglePanel = () => {
    if (disabled) {
      return;
    }
    setIsOpen((prev) => {
      const next = !prev;
      onToggle?.(next);
      return next;
    });
  };

  return (
    <div className={`gal-expansion-panel ${disabled ? 'disabled' : ''}`}>
      <button
        type="button"
        className="expansion-panel__header"
        onClick={togglePanel}
        aria-expanded={isOpen}
        aria-disabled={disabled}
        // aria-controls references the ID of the content region
        aria-controls="expansion-panel-content"
        disabled={disabled}
      >
        <span className="expansion-panel__header-text">{header}</span>
        <span
          className={`expansion-panel__icon ${
            isOpen ? 'expanded' : 'collapsed'
          }`}
          aria-hidden="true"
        >
          {isOpen ? '▾' : '▸'}
        </span>
      </button>

      <div
        id="expansion-panel-content"
        className={`expansion-panel__content ${isOpen ? 'open' : ''}`}
        ref={contentRef}
        role="region"
        aria-labelledby="expansion-panel-header"
        style={{
          maxHeight: isOpen
            ? `${contentRef.current?.scrollHeight ?? 0}px`
            : '0px',
        }}
      >
        <div className="expansion-panel__content-inner">{children}</div>
      </div>
    </div>
  );
};

export default GalExpansionPanel;
