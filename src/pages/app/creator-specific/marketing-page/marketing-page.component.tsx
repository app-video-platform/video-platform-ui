import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  EmailTab,
  MessagesTab,
  OverviewTab,
  ReviewsTab,
  SessionsTab,
  WhatTab,
} from '@features/marketing';
import { Tabs } from '@shared/ui';

import './marketing-page.styles.scss';

type MarketingTabSlug =
  | 'overview'
  | 'email'
  | 'messages'
  | 'reviews'
  | 'sessions'
  | 'what';

const MarketingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabsConfig = useMemo(
    () => [
      {
        slug: 'overview' as MarketingTabSlug,
        label: 'Overview',
        content: (
          <div className="settings-tab-content">
            <OverviewTab />
          </div>
        ),
      },
      {
        slug: 'email' as MarketingTabSlug,
        label: 'Email',
        content: (
          <div className="settings-tab-content">
            <EmailTab />
          </div>
        ),
      },
      {
        slug: 'messages' as MarketingTabSlug,
        label: 'Message',
        content: (
          <div className="settings-tab-content">
            <MessagesTab />
          </div>
        ),
      },
      {
        slug: 'reviews' as MarketingTabSlug,
        label: 'Reviews',
        content: (
          <div className="settings-tab-content">
            <ReviewsTab />
          </div>
        ),
      },
      {
        slug: 'sessions' as MarketingTabSlug,
        label: 'Live Sessions',
        content: (
          <div className="settings-tab-content">
            <SessionsTab />
          </div>
        ),
      },
      {
        slug: 'what' as MarketingTabSlug,
        label: 'What',
        content: (
          <div className="settings-tab-content">
            <WhatTab />
          </div>
        ),
      },
    ],
    [],
  );

  const tabFromUrl =
    (searchParams.get('tab') as MarketingTabSlug) || 'overview';

  const activeIndex = (() => {
    const idx = tabsConfig.findIndex((t) => t.slug === tabFromUrl);
    return idx === -1 ? 0 : idx;
  })();

  const handleTabChange = (index: number) => {
    const next = tabsConfig[index];
    if (!next) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', next.slug);
    setSearchParams(nextParams, { replace: true }); // avoid polluting history if you want
  };

  return (
    <div className="marketing-page">
      <Tabs
        items={tabsConfig.map(({ label, content }) => ({ label, content }))}
        activeIndex={activeIndex}
        onChange={handleTabChange}
      />
    </div>
  );
};

export default MarketingPage;
