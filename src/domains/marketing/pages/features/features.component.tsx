import React from 'react';

import { Button } from '@shared/ui';
import { CTASection } from '@domains/marketing/shared';

import './features.styles.scss';

const pillars = [
  {
    title: 'Build',
    text: 'Create courses, downloads, and consultation sessions from one unified product builder.',
    items: ['Courses', 'Downloads', 'Sessions'],
  },
  {
    title: 'Customize',
    text: 'Shape your storefront and product pages so your brand feels like your own universe.',
    items: ['Storefront', 'Branding', 'Product pages'],
  },
  {
    title: 'Sell',
    text: 'Set prices, publish offers, and give customers a simple path to purchase.',
    items: ['Pricing', 'Checkout', 'Products'],
  },
  {
    title: 'Grow',
    text: 'Track sales, understand performance, and build stronger relationships with your audience.',
    items: ['Analytics', 'Marketing', 'Reviews'],
  },
];

const deepDives = [
  {
    icon: '🎓',
    title: 'Course Builder',
    text: 'Organize knowledge into sections, lessons, and multiple content types.',
    bullets: [
      'Sections & lessons',
      'Video, text, files',
      'Draft-friendly editing',
    ],
  },
  {
    icon: '📦',
    title: 'Digital Downloads',
    text: 'Package templates, guides, media, and files into sellable digital products.',
    bullets: ['Large file uploads', 'Grouped assets', 'Simple delivery'],
  },
  {
    icon: '🎧',
    title: 'Consultation Sessions',
    text: 'Sell 1:1 sessions with clear duration, buffers, and meeting preferences.',
    bullets: ['Session duration', 'Meeting method', 'Daily limits'],
  },
  {
    icon: '🪐',
    title: 'Creator Storefront',
    text: 'Give customers a public place to discover who you are and what you sell.',
    bullets: ['Profile page', 'Product listing', 'Shareable link'],
  },
  {
    icon: '💰',
    title: 'Sales Dashboard',
    text: 'See how your products perform and understand what is generating revenue.',
    bullets: ['Total sales', 'Product revenue', 'Performance overview'],
  },
  {
    icon: '📣',
    title: 'Marketing & Engagement',
    text: 'Create stronger relationships through campaigns, messages, and reviews.',
    bullets: ['Campaigns', 'Messages', 'Reviews'],
  },
];

const workflow = ['Create', 'Customize', 'Publish', 'Sell', 'Grow'];

const FeaturesPage: React.FC = () => (
  <main className="features-page">
    <section className="features-hero">
      <div className="features-hero__content">
        <span className="features-kicker">Platform features</span>
        <h1>Everything you need to sell your knowledge</h1>
        <p>
          Build digital products, launch your storefront, and manage your
          creator business from one cosmic command center.
        </p>

        <div className="features-hero__actions">
          <Button type="button" variant="primary">
            Start building
          </Button>
          <Button type="button" variant="secondary">
            View demo
          </Button>
        </div>
      </div>

      <div className="features-hero__visual">
        <div className="features-command-panel">
          <span>Creator command center</span>
          <h3>Launch-ready workspace</h3>

          <div className="features-command-panel__grid">
            <div>Course</div>
            <div>Download</div>
            <div>Session</div>
            <div>Storefront</div>
          </div>

          <div className="features-command-panel__metric">
            <strong>$4,820</strong>
            <span>Revenue tracked</span>
          </div>
        </div>

        <div className="features-floating-orb features-floating-orb--one" />
        <div className="features-floating-orb features-floating-orb--two" />
      </div>
    </section>

    <section className="feature-pillars-section">
      <div className="section-heading">
        <span className="features-kicker">The creator stack</span>
        <h2>One platform. Four missions.</h2>
        <p>
          Each part of the platform supports a different stage of your creator
          business.
        </p>
      </div>

      <div className="feature-pillars-grid">
        {pillars.map((pillar) => (
          <article className="feature-pillar-card" key={pillar.title}>
            <h3>{pillar.title}</h3>
            <p>{pillar.text}</p>

            <div className="feature-pillar-card__chips">
              {pillar.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="product-engine-section">
      <div className="product-engine-visual">
        <div className="builder-preview-card">
          <span>Product creation engine</span>
          <h3>Nebula Photography Masterclass</h3>

          <div className="builder-preview-card__row">
            <span>Type</span>
            <strong>Course</strong>
          </div>
          <div className="builder-preview-card__row">
            <span>Status</span>
            <strong>Draft</strong>
          </div>
          <div className="builder-preview-card__tree">
            <div>Section: Introduction</div>
            <div>↳ Lesson: Welcome video</div>
            <div>↳ Lesson: Equipment guide</div>
          </div>
        </div>
      </div>

      <div className="product-engine-content">
        <span className="features-kicker">Core engine</span>
        <h2>Create any product from one builder</h2>
        <p>
          Courses, downloads, and consultations all start from the same simple
          flow — then expand with the fields and tools each product type needs.
        </p>

        <ul>
          <li>Unified product creation flow</li>
          <li>Draft-first editing built for interruptions</li>
          <li>Sections, lessons, files, and scheduling tools</li>
          <li>Large-file upload friendly architecture</li>
        </ul>
      </div>
    </section>

    <section className="feature-deep-dives-section">
      <div className="section-heading">
        <span className="features-kicker">Feature universe</span>
        <h2>Tools for every part of your creator business</h2>
      </div>

      <div className="feature-deep-dives-grid">
        {deepDives.map((feature) => (
          <article className="feature-deep-card" key={feature.title}>
            <div className="feature-deep-card__orb">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>

            <ul>
              {feature.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>

    <section className="workflow-section">
      <div className="section-heading">
        <span className="features-kicker">Workflow</span>
        <h2>From idea to income</h2>
      </div>

      <div className="workflow-orbit">
        {workflow.map((item, index) => (
          <div className="workflow-step" key={item}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item}</strong>
          </div>
        ))}
      </div>
    </section>

    <CTASection
      title={<span>Ready to build your creator universe?</span>}
      primaryText="Launch now"
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onPrimaryClick={() => {}}
    />
  </main>
);

export default FeaturesPage;
