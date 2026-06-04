import React from 'react';

import { Button } from '@shared/ui';
import { CTASection } from '@domains/marketing/shared';

import './getting-started.styles.scss';

const steps = [
  {
    number: '01',
    title: 'Create your account',
    text: 'Set up your creator profile and prepare your workspace in just a few minutes.',
    visualTitle: 'Creator profile',
  },
  {
    number: '02',
    title: 'Build your product',
    text: 'Create courses, download packages, or consultation sessions from one simple builder.',
    visualTitle: 'Product builder',
  },
  {
    number: '03',
    title: 'Customize your storefront',
    text: 'Shape your public page so customers understand who you are and what you offer.',
    visualTitle: 'Storefront preview',
  },
  {
    number: '04',
    title: 'Publish and start earning',
    text: 'Launch your product, share your page, and track sales from your creator dashboard.',
    visualTitle: 'Sales overview',
  },
];

const productTypes = [
  {
    icon: '🎓',
    title: 'Courses',
    text: 'Sell structured learning experiences with sections, lessons, and media.',
  },
  {
    icon: '⬇️',
    title: 'Downloads',
    text: 'Package files, templates, guides, videos, or digital assets.',
  },
  {
    icon: '🎧',
    title: 'Consultations',
    text: 'Offer paid 1:1 sessions with duration, buffers, and meeting options.',
  },
];

const GettingStarted: React.FC = () => (
  <main className="getting-started-page">
    <section className="getting-started-hero">
      <div className="getting-started-hero__content">
        <span className="getting-started-kicker">Getting started</span>
        <h1>Start building your creator universe</h1>
        <p>
          From your first idea to your first sale, Galactica gives you a simple
          path to launch products your audience can buy.
        </p>

        <div className="getting-started-hero__actions">
          <Button type="button" variant="primary">
            Get Started
          </Button>
          <Button type="button" variant="secondary">
            View Demo
          </Button>
        </div>
      </div>

      <div className="getting-started-hero__visual">
        <div className="hero-orbit" />
        <div className="hero-panel hero-panel--main">
          <span>Product Builder</span>
          <h3>Nebula Photography Masterclass</h3>
          <div className="hero-panel__line hero-panel__line--wide" />
          <div className="hero-panel__line" />
          <div className="hero-panel__chips">
            <span>Course</span>
            <span>Draft</span>
            <span>$99</span>
          </div>
        </div>

        <div className="hero-panel hero-panel--floating">
          <strong>3</strong>
          <span>Product types</span>
        </div>
      </div>
    </section>

    <section className="launch-steps-section">
      <div className="section-heading">
        <span className="getting-started-kicker">Launch flow</span>
        <h2>Launch in four steps</h2>
        <p>
          A simple path designed to help creators move from setup to selling
          without getting lost in complex tools.
        </p>
      </div>

      <div className="launch-steps-list">
        {steps.map((step, index) => (
          <article className="launch-step" key={step.number}>
            <div className="launch-step__content">
              <span className="launch-step__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>

            <div className="launch-step__visual">
              <div className="mock-ui-card">
                <span>{step.visualTitle}</span>
                <div className="mock-ui-card__header-line" />
                <div className="mock-ui-card__line" />
                <div className="mock-ui-card__line mock-ui-card__line--short" />

                {index === 1 && (
                  <div className="mock-ui-card__tree">
                    <div>Section 1</div>
                    <div>↳ Lesson 1</div>
                    <div>↳ Lesson 2</div>
                  </div>
                )}

                {index === 3 && (
                  <div className="mock-ui-card__metric">
                    <strong>$1,240</strong>
                    <span>Total sales</span>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="product-types-section">
      <div className="section-heading">
        <span className="getting-started-kicker">What you can create</span>
        <h2>Three ways to sell your knowledge</h2>
      </div>

      <div className="product-types-grid">
        {productTypes.map((type) => (
          <article className="product-type-card" key={type.title}>
            <div className="product-type-card__orb">{type.icon}</div>
            <h3>{type.title}</h3>
            <p>{type.text}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="demo-preview-section">
      <div className="demo-preview-card">
        <div>
          <span className="getting-started-kicker">Demo preview</span>
          <h2>Want to see the flow in action?</h2>
          <p>
            Explore a guided walkthrough of creating a product, setting up a
            storefront, and preparing for launch.
          </p>
        </div>

        <Button type="button" variant="primary">
          Try Demo
        </Button>
      </div>
    </section>

    <CTASection
      title={<span>Ready to launch your first product?</span>}
      primaryText="Launch now"
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onPrimaryClick={() => {}}
    />
  </main>
);

export default GettingStarted;
