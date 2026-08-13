import React from 'react';
import clsx from 'clsx';

import { ProductLandingPageViewModel } from './product-landing-page.types';

import './product-landing-page.styles.scss';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../../../assets/image-placeholder.png');

interface ProductLandingPageProps {
  product: ProductLandingPageViewModel;
}

const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

const ProductLandingPage: React.FC<ProductLandingPageProps> = ({ product }) => {
  const priceLabel = product.price.cadence
    ? `${product.price.label} / ${product.price.cadence}`
    : product.price.label;

  const renderTypeSummary = () => {
    if (product.summary.type === 'COURSE') {
      return (
        <section className="product-landing__section" aria-labelledby="product-course-heading">
          <div className="product-landing__section-heading">
            <span>Course content</span>
            <h2 id="product-course-heading">What&apos;s inside</h2>
            <p>
              {pluralize(product.summary.sectionCount, 'module')} and{' '}
              {pluralize(product.summary.lessonCount, 'lesson')} from the current curriculum.
            </p>
          </div>
          {product.summary.sections.length > 0 ? (
            <div className="product-landing__outline">
              {product.summary.sections.map((section, index) => (
                <article key={section.id ?? `${section.title}-${index}`}>
                  <div>
                    <span>Module {index + 1}</span>
                    <h3>{section.title}</h3>
                    {section.description && <p>{section.description}</p>}
                  </div>
                  <strong>{pluralize(section.lessonCount, 'lesson')}</strong>
                  {section.lessons.length > 0 && (
                    <ul>
                      {section.lessons.map((lesson) => (
                        <li key={lesson.id ?? lesson.title}>
                          <span>{lesson.title}</span>
                          {lesson.type && <em>{lesson.type.toLowerCase()}</em>}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="product-landing__empty">
              Curriculum details are not available yet.
            </p>
          )}
        </section>
      );
    }

    if (product.summary.type === 'DOWNLOAD') {
      return (
        <section className="product-landing__section" aria-labelledby="product-download-heading">
          <div className="product-landing__section-heading">
            <span>Download package</span>
            <h2 id="product-download-heading">Included resources</h2>
            <p>
              {pluralize(product.summary.sectionCount, 'section')} and{' '}
              {pluralize(product.summary.fileCount, 'file')} from the loaded product package.
            </p>
          </div>
          {product.summary.sections.length > 0 ? (
            <div className="product-landing__outline">
              {product.summary.sections.map((section, index) => (
                <article key={section.id ?? `${section.title}-${index}`}>
                  <div>
                    <span>Section {index + 1}</span>
                    <h3>{section.title}</h3>
                    {section.description && <p>{section.description}</p>}
                  </div>
                  <strong>{pluralize(section.fileCount, 'file')}</strong>
                  {section.files.length > 0 && (
                    <ul>
                      {section.files.map((file) => (
                        <li key={file.id ?? file.fileName}>
                          <span>{file.fileName}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="product-landing__empty">
              Resource details are not available yet.
            </p>
          )}
        </section>
      );
    }

    if (product.summary.type === 'CONSULTATION') {
      return (
        <section className="product-landing__section" aria-labelledby="product-consultation-heading">
          <div className="product-landing__section-heading">
            <span>Consultation details</span>
            <h2 id="product-consultation-heading">Session format</h2>
            <p>Configured public-relevant details for this consultation.</p>
          </div>
          {product.summary.details.length > 0 ? (
            <dl className="product-landing__details">
              {product.summary.details.map((detail) => (
                <div key={detail.label}>
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="product-landing__empty">
              Session details are not available yet.
            </p>
          )}
        </section>
      );
    }

    return (
      <section className="product-landing__section" aria-labelledby="product-membership-heading">
        <div className="product-landing__section-heading">
          <span>Membership</span>
          <h2 id="product-membership-heading">Ongoing access product</h2>
          <p>
            {product.summary.recurringLabel
              ? `${product.summary.recurringLabel} is configured on this Product.`
              : 'Membership pricing details are not available yet.'}
          </p>
        </div>
      </section>
    );
  };

  const renderPageSection = (section: string) => {
    if (section === 'ABOUT' && product.marketingDescription) {
      return (
        <section className="product-landing__section" aria-labelledby="product-about-heading">
          <div className="product-landing__section-heading">
            <span>About</span>
            <h2 id="product-about-heading">A closer look</h2>
          </div>
          <p>{product.marketingDescription}</p>
        </section>
      );
    }

    if (section === 'CONTENTS') {
      return <React.Fragment key="contents">{renderTypeSummary()}</React.Fragment>;
    }

    if (section === 'CREATOR' && product.creator) {
      return (
        <section className="product-landing__creator" aria-labelledby="product-creator-heading">
          {product.creator.imageUrl ? (
            <img src={product.creator.imageUrl} alt="" />
          ) : (
            <span aria-hidden="true">
              {product.creator.displayName.slice(0, 2).toUpperCase()}
            </span>
          )}
          <div>
            <span>Creator</span>
            <h2 id="product-creator-heading">{product.creator.displayName}</h2>
            {product.creator.title && <p>{product.creator.title}</p>}
            {product.creator.bio && <p>{product.creator.bio}</p>}
            <div className="product-landing__creator-links">
              {product.creator.website && (
                <a href={product.creator.website} target="_blank" rel="noreferrer">
                  Website
                </a>
              )}
              {product.creator.publicEmail && (
                <a href={`mailto:${product.creator.publicEmail}`}>
                  Contact
                </a>
              )}
            </div>
          </div>
        </section>
      );
    }

    return null;
  };

  return (
    <article
      className={clsx(
        'product-landing',
        `product-landing--${product.theme.appearance.toLowerCase()}`,
        `product-landing--type-${product.theme.typography.toLowerCase()}`,
      )}
      style={
        {
          '--product-landing-accent': product.theme.accentColor,
        } as React.CSSProperties
      }
    >
      <header
        className={clsx(
          'product-landing__hero',
          `product-landing__hero--${product.heroLayout.toLowerCase().replace('_', '-')}`,
        )}
      >
        <div className="product-landing__hero-copy">
          <span className="product-landing__eyebrow">{product.typeLabel}</span>
          <h1>{product.name}</h1>
          {product.description && <p>{product.description}</p>}
          <div className="product-landing__hero-facts" aria-label="Product summary">
            <span>{product.typeLabel}</span>
            <strong>{priceLabel}</strong>
          </div>
        </div>

        <aside className="product-landing__commerce" aria-labelledby="product-purchase-heading">
          <img
            src={product.imageUrl || placeholderImage}
            alt={product.imageAlt}
          />
          <div>
            <span>Price</span>
            <h2 id="product-purchase-heading">{priceLabel}</h2>
            <div className="product-landing__unavailable" role="status">
              <strong>{product.cta.label}</strong>
              <p>{product.cta.description}</p>
            </div>
          </div>
        </aside>
      </header>

      <main className="product-landing__body">
        {product.sections.map((section) => (
          <React.Fragment key={section}>
            {renderPageSection(section)}
          </React.Fragment>
        ))}
      </main>
    </article>
  );
};

export default ProductLandingPage;
