import React, { useState, ReactNode, useRef, useId } from 'react';
import { useExpansionGroup } from '../gal-expansion-group.component';

import './gal-expansion-panel.styles.scss';

interface GalExpansionPanelProps {
  /** Unique value to identify the panel inside a group */
  value?: string;
  /** Panel header/title */
  header: React.ReactNode;
  /** Content to show when expanded */
  children: ReactNode;
  /** Whether the panel is open by default */
  defaultExpanded?: boolean;
  /** If true, show a built-in radio when in radio group (default true) */
  showGroupRadio?: boolean;
  /** Whether the panel is disabled (not clickable) */
  disabled?: boolean;
  expanded?: boolean; // controlled standalone
  onExpandedChange?: (open: boolean) => void;
}

const GalExpansionPanel: React.FC<GalExpansionPanelProps> = ({
  value,
  header,
  children,
  defaultExpanded = false,
  expanded,
  onExpandedChange,
  disabled = false,
  showGroupRadio = true,
}) => {
  // const [isOpen, setIsOpen] = useState<boolean>(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);

  const ids = {
    header: useId().replace(/:/g, ''),
    content: useId().replace(/:/g, ''),
  };

  const group = useExpansionGroup();

  const isInRadioGroup = group?.mode === 'radio' && value !== null;

  const isOpen = (() => {
    if (isInRadioGroup && group!.accordion) {
      return group!.selectedValue === value;
    }
    if (expanded !== undefined) {
      return expanded;
    }
    return defaultExpanded;
  })();

  const setOpen = (next: boolean) => {
    if (disabled) {
      return;
    }

    if (isInRadioGroup && next) {
      // Selecting a panel in radio mode
      group!.onChangeSelected(value!);
      return;
    }

    // Standalone control
    onExpandedChange?.(next);
    // Uncontrolled standalone: keep internal state by faking via a ref if needed
    // but we can just trigger a re-render using a state:
    // To keep the component simple, rely on 'expanded' or 'defaultExpanded' pattern outside group
  };

  const handleHeaderClick = () => {
    if (disabled) {
      return;
    }
    if (isInRadioGroup) {
      group!.onChangeSelected(value!);
    } else {
      setOpen(!isOpen);
    }
  };

  const radioName = group?.name;
  const isSelected = isInRadioGroup
    ? group!.selectedValue === value
    : undefined;

  return (
    <div className={`expansion-panel ${disabled ? 'disabled' : ''}`}>
      <button
        type="button"
        className="expansion-panel__header"
        onClick={handleHeaderClick}
        aria-expanded={isOpen}
        aria-disabled={disabled}
        // aria-controls references the ID of the content region
        aria-controls="expansion-panel-content"
        disabled={disabled}
      >
        {isInRadioGroup && showGroupRadio && (
          <input
            type="radio"
            name={radioName}
            checked={!!isSelected}
            onChange={() => group!.onChangeSelected(value!)}
            onClick={(e) => e.stopPropagation()}
            aria-labelledby={ids.header}
          />
        )}
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
        id={ids.content}
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
