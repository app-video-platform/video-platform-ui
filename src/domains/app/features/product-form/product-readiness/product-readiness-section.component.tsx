import React from 'react';

import { Button, StatusBadge } from '@shared/ui';
import { BuilderTab } from '../builder-sidebar';
import {
  ProductReadinessIssue,
  ProductReadinessResult,
} from './product-readiness.utils';

import './product-readiness-section.styles.scss';

interface ProductReadinessSectionProps {
  result: ProductReadinessResult;
  publishError?: string | null;
  // eslint-disable-next-line no-unused-vars
  onNavigateToDestination: (destination: BuilderTab) => void;
}

const destinationLabel: Partial<Record<BuilderTab, string>> = {
  basics: 'Basics',
  pricing: 'Pricing',
  sections: 'Content',
  'consultation-details': 'Availability',
  'membership-content': 'Content',
  media: 'Media',
};

const renderIssue = (
  issue: ProductReadinessIssue,
  // eslint-disable-next-line no-unused-vars
  onNavigateToDestination: (destination: BuilderTab) => void,
) => (
  <li className="product-readiness-issue" key={issue.id}>
    <div className="product-readiness-issue__content">
      <StatusBadge
        label={issue.severity === 'BLOCKER' ? 'Blocker' : 'Warning'}
        tone={issue.severity === 'BLOCKER' ? 'danger' : 'warning'}
        size="sm"
      />
      <div>
        <h4>{issue.title}</h4>
        <p>{issue.description}</p>
      </div>
    </div>
    {issue.destination && (
      <Button
        type="button"
        variant={issue.severity === 'BLOCKER' ? 'secondary' : 'tertiary'}
        size="sm"
        className="product-readiness-issue__action"
        aria-label={`Go to ${destinationLabel[issue.destination] ?? 'destination'} to resolve ${issue.title}`}
        onClick={() => onNavigateToDestination(issue.destination as BuilderTab)}
      >
        Go to {destinationLabel[issue.destination] ?? 'destination'}
      </Button>
    )}
  </li>
);

const ProductReadinessSection: React.FC<ProductReadinessSectionProps> = ({
  result,
  publishError,
  onNavigateToDestination,
}) => {
  const blockerCount = result.blockers.length;
  const warningCount = result.warnings.length;

  return (
    <div className="product-readiness" aria-live="polite">
      <section className="product-readiness__summary" aria-labelledby="readiness-summary-title">
        <StatusBadge
          label={
            result.isEvaluating
              ? 'Evaluating'
              : result.isReadyToPublish
                ? 'Ready to publish'
                : `${blockerCount} blocker${blockerCount === 1 ? '' : 's'} remaining`
          }
          tone={
            result.isEvaluating
              ? 'neutral'
              : result.isReadyToPublish
                ? 'success'
                : 'danger'
          }
        />
        <div>
          <h3 id="readiness-summary-title">
            {result.isEvaluating
              ? 'Checking readiness'
              : result.isReadyToPublish
                ? 'Ready to publish'
                : 'Needs attention before publishing'}
          </h3>
          <p>
            {result.isEvaluating
              ? 'Some required Product data is still loading. Readiness will update when it is available.'
              : result.isReadyToPublish
                ? 'Frontend readiness checks have passed. Backend Publish validation is still the future authority.'
                : 'Resolve blockers before publishing. Warnings are worth reviewing but do not block Publish.'}
          </p>
        </div>
      </section>

      {publishError && (
        <div className="product-readiness__error" role="alert">
          {publishError}
        </div>
      )}

      {result.blockers.length > 0 && (
        <section className="product-readiness__group" aria-labelledby="readiness-blockers-title">
          <div className="product-readiness__group-header">
            <h3 id="readiness-blockers-title">Blockers</h3>
            <span>{result.blockers.length}</span>
          </div>
          <ul>
            {result.blockers.map((issue) =>
              renderIssue(issue, onNavigateToDestination),
            )}
          </ul>
        </section>
      )}

      <section className="product-readiness__group" aria-labelledby="readiness-warnings-title">
        <div className="product-readiness__group-header">
          <h3 id="readiness-warnings-title">Warnings</h3>
          <span>{warningCount}</span>
        </div>
        {result.warnings.length > 0 ? (
          <ul>
            {result.warnings.map((issue) =>
              renderIssue(issue, onNavigateToDestination),
            )}
          </ul>
        ) : (
          <p className="product-readiness__empty">
            No warnings from the current frontend checks.
          </p>
        )}
      </section>
    </div>
  );
};

export default ProductReadinessSection;
