import React, { useId, useState, ReactNode, useRef, useLayoutEffect } from 'react';

import './legacy-expansion-panel.styles.scss';

interface LegacyExpansionPanelProps {
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

const LegacyExpansionPanel: React.FC<LegacyExpansionPanelProps> = ({
  header,
  children,
  defaultExpanded = false,
  disabled = false,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const headerId = useId();
  const contentId = useId();

  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) { return undefined; }
    const measure = () => setContentHeight(inner.scrollHeight);
    measure();
    if (typeof ResizeObserver === 'undefined') { return undefined; }
    const observer = new ResizeObserver(measure);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [children]);

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
    <div className={`legacy-expansion-panel ${disabled ? 'disabled' : ''}`}>
      <button
        type="button"
        id={headerId}
        className="expansion-panel__header"
        onClick={togglePanel}
        aria-expanded={isOpen}
        aria-disabled={disabled}
        // aria-controls references the ID of the content region
        aria-controls={contentId}
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
        id={contentId}
        className={`expansion-panel__content ${isOpen ? 'open' : ''}`}
        ref={contentRef}
        role="region"
        aria-labelledby={headerId}
        aria-hidden={!isOpen}
        style={{
          maxHeight: isOpen ? `${contentHeight}px` : '0px',
        }}
      >
        <div ref={innerRef} className="expansion-panel__content-inner">{children}</div>
      </div>
    </div>
  );
};

export default LegacyExpansionPanel;
