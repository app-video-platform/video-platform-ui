/* eslint-disable indent */
import React, { ReactNode, useState } from 'react';

import './gal-tabs.styles.scss';

export interface TabItem {
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
}

const GalTabs: React.FC<TabsProps> = ({ items, defaultIndex = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <div className="gal-tabs">
      {/* Tab List */}
      <div className="gal-tabs-header">
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`gal-tab-button
                ${isActive ? ' gal-tab-button__active' : ''}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="gal-tab-content">{items[activeIndex]?.content}</div>
    </div>
  );
};

export default GalTabs;
