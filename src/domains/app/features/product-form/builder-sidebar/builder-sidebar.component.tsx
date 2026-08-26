/* eslint-disable indent */
import React from 'react';
import clsx from 'clsx';
import { IconType } from 'react-icons';
import { TbListDetails, TbSection } from 'react-icons/tb';
import { IoIosPricetags } from 'react-icons/io';
import { MdFactCheck, MdGroups, MdPermMedia } from 'react-icons/md';
import { CgDetailsMore } from 'react-icons/cg';
import { PiRectangleDashed } from 'react-icons/pi';

import { LessonType, ProductType } from 'core/api/models';
import { Icon } from '@shared/ui';
import { getCssVar } from '@shared/utils';
import { LESSON_META } from 'core/constants';

import './builder-sidebar.styles.scss';

export type BuilderTab =
  | 'basics'
  | 'sections'
  | 'consultation-details'
  | 'membership-content'
  | 'pricing'
  | 'media'
  | 'readiness';

export interface BuilderLessonNavItem {
  id: string;
  title: string;
  position: number;
  type?: LessonType;
}

export interface BuilderSectionNavItem {
  id?: string;
  title: string;
  position: number;
  lessons?: BuilderLessonNavItem[];
}

interface ProductTab {
  id: BuilderTab;
  label: string;
  icon: IconType;
  position: number;
}

export const getProductTabs = (productType: ProductType): ProductTab[] => {
  const baseTabs = [
    {
      id: 'basics' as BuilderTab,
      label: 'Basics',
      icon: TbListDetails as IconType,
      position: 1,
    },
    {
      id: 'pricing' as BuilderTab,
      label: 'Pricing',
      icon: IoIosPricetags as IconType,
      position: 2,
    },
    {
      id: 'media' as BuilderTab,
      label: 'Media',
      icon: MdPermMedia as IconType,
      position: 4,
    },
    {
      id: 'readiness' as BuilderTab,
      label: 'Readiness',
      icon: MdFactCheck as IconType,
      position: 5,
    },
  ];

  if (productType === 'COURSE' || productType === 'DOWNLOAD') {
    return [
      ...baseTabs,
      {
        id: 'sections' as BuilderTab,
        label: productType === 'COURSE' ? 'Curriculum' : 'Files',
        icon: TbSection,
        position: 3,
      },
    ].sort((a, b) => a.position - b.position);
  }

  if (productType === 'CONSULTATION') {
    return [
      ...baseTabs,
      {
        id: 'consultation-details' as BuilderTab,
        label: 'Availability',
        icon: CgDetailsMore,
        position: 3,
      },
    ].sort((a, b) => a.position - b.position);
  }

  if (productType === 'MEMBERSHIP') {
    return [
      ...baseTabs,
      {
        id: 'membership-content' as BuilderTab,
        label: 'Content',
        icon: MdGroups,
        position: 3,
      },
    ].sort((a, b) => a.position - b.position);
  }

  return baseTabs.sort((a, b) => a.position - b.position);
};

interface BuilderTabsProps {
  activeTab: BuilderTab;
  productType: ProductType;
  sections?: BuilderSectionNavItem[];
  // eslint-disable-next-line no-unused-vars
  onChange: (tab: BuilderTab) => void;
  // eslint-disable-next-line no-unused-vars
  onSectionClick?: (sectionId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onLessonClick?: (lessonId: string) => void;
}

const BuilderSidebar: React.FC<BuilderTabsProps> = ({
  activeTab,
  productType,
  sections = [],
  onChange,
  onSectionClick,
  onLessonClick,
}) => {
  const productTabs = getProductTabs(productType).sort(
    (a, b) => a.position - b.position,
  );

  const tabClass = (isActive: boolean) =>
    clsx('sidebar-tab', { 'sidebar-tab__active': isActive });

  const sortedSections = [...sections].sort((a, b) => a.position - b.position);

  return (
    <aside className="builder-sidebar" aria-label="Workspace sections">
      <ul className="builder-sidebar-tabs" role="tablist" aria-orientation="vertical">
        {productTabs.map((tab) => (
          <React.Fragment key={tab.id}>
            {/* Top-level tab */}
            <li>
              <button
                id={`builder-tab-${tab.id}`}
                type="button"
                className={tabClass(activeTab === tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tab-panel-${tab.id}`}
                onClick={() => onChange(tab.id)}
              >
                <Icon
                  icon={tab.icon}
                  size={16}
                  color={getCssVar(
                    activeTab === tab.id ? '--brand-primary' : '--text-primary',
                  )}
                />
                <span>{tab.label}</span>
              </button>
            </li>

            {/* Insert sections + lessons RIGHT AFTER the Sections tab */}
            {tab.id === 'sections' &&
              (productType === 'COURSE' || productType === 'DOWNLOAD') &&
              sortedSections.length > 0 && (
                <>
                  {sortedSections.map((section) => (
                    <li key={section.id}>
                      <button
                        type="button"
                        className="sidebar-outline-section"
                        onClick={() => {
                          // optional: make sure Sections tab is active
                          onChange('sections');
                          if (section.id) {
                            onSectionClick?.(section.id);
                          }
                        }}
                      >
                        <Icon
                          icon={PiRectangleDashed}
                          size={16}
                          color={getCssVar('--text-primary')}
                        />
                        <span className="sidebar-outline-section__title">
                          {section.title || 'Untitled section'}
                        </span>
                      </button>

                      {section.lessons && section.lessons.length > 0 && (
                        <ul className="builder-sidebar-outline-lessons">
                          {[...section.lessons]
                            .sort((a, b) => a.position - b.position)
                            .map((lesson) => (
                              <li key={lesson.id}>
                                <button
                                  type="button"
                                  className="sidebar-outline-lesson"
                                  onClick={() => {
                                    // same: ensure Sections tab, then notify parent
                                    onChange('sections');
                                    onLessonClick?.(lesson.id);
                                  }}
                                >
                                  <Icon
                                    icon={
                                      LESSON_META[lesson.type ?? 'ASSIGNMENT']
                                        .icon
                                    }
                                    size={16}
                                    color={getCssVar('--text-primary')}
                                  />
                                  <span className="sidebar-outline-lesson__title">
                                    {lesson.title || 'Untitled lesson'}
                                  </span>
                                </button>
                              </li>
                            ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </>
              )}
          </React.Fragment>
        ))}
      </ul>
    </aside>
  );
};

export default BuilderSidebar;
