/* eslint-disable indent */
import clsx from 'clsx';
import React, { ReactNode, useState } from 'react';

import './tabs.styles.scss';

export interface TabItem {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
  activeIndex?: number; // ✅ new
  // eslint-disable-next-line no-unused-vars
  onChange?: (index: number) => void; // ✅ new
}

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultIndex = 0,
  activeIndex,
  onChange,
}) => {
  // const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const [internalIndex, setInternalIndex] = useState(defaultIndex);

  const isControlled = activeIndex !== undefined;
  const currentIndex = isControlled ? activeIndex : internalIndex;

  const handleClick = (idx: number) => {
    if (!isControlled) {
      setInternalIndex(idx);
    }
    onChange?.(idx);
  };

  return (
    <div className="tabs">
      <div className="tabs-header">
        {items.map((item, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              className={clsx('tab-button', { 'tab-button__active': isActive })}
            >
              {item.label}
            </button>
          );
        })}
        <div className="tab-button tab-full-space" />
      </div>

      <div className="tab-content">{items[currentIndex]?.content}</div>
    </div>
  );
};

export default Tabs;
