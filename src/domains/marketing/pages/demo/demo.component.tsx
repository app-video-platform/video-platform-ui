import React, { useState } from 'react';
import clsx from 'clsx';

import { Button } from '@shared/ui';

import './demo.styles.scss';

type DemoStep = {
  id: number;
  title: string;
  description: string;
  preview: React.ReactNode;
};

const DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    title: 'Choose what to sell',
    description: 'Pick between courses, memberships, or consultation sessions.',
    preview: (
      <div className="demo-preview__types">
        <div className="demo-pill">🎓 Course</div>
        <div className="demo-pill">🪐 Membership</div>
        <div className="demo-pill">🎧 Consultation</div>
      </div>
    ),
  },
  {
    id: 2,
    title: 'Build your product',
    description:
      'Structure your content, upload materials, and configure details.',
    preview: (
      <div className="demo-preview__builder">
        <div className="demo-card">Section 1</div>
        <div className="demo-card">Lesson A</div>
        <div className="demo-card">Lesson B</div>
      </div>
    ),
  },
  {
    id: 3,
    title: 'Publish your storefront',
    description:
      'Launch your public page and make your products available instantly.',
    preview: (
      <div className="demo-preview__storefront">
        <div className="demo-card large">Your Storefront</div>
      </div>
    ),
  },
  {
    id: 4,
    title: 'Track your growth',
    description:
      'Monitor sales, engagement, and performance from your dashboard.',
    preview: (
      <div className="demo-preview__analytics">
        <div className="demo-bar" />
        <div className="demo-bar" />
        <div className="demo-bar" />
      </div>
    ),
  },
];

const Demo: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  const step = DEMO_STEPS.find((s) => s.id === activeStep)!;

  return (
    <main className="demo-page">
      {/* HERO */}
      <section className="demo-hero">
        <h1>See Galactica in action</h1>
        <p>
          Walk through how creators build, publish, and sell their products.
        </p>

        <Button variant="primary" onClick={() => setActiveStep(1)}>
          Start demo
        </Button>
      </section>

      {/* WALKTHROUGH */}
      <section className="demo-walkthrough">
        <div className="demo-steps">
          {DEMO_STEPS.map((s) => (
            <div
              key={s.id}
              className={clsx('demo-step', {
                active: s.id === activeStep,
              })}
              onClick={() => setActiveStep(s.id)}
            >
              <span className="step-index">{s.id}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="demo-preview">
          <div key={activeStep} className="demo-preview-inner">
            {step.preview}
          </div>
        </div>
      </section>

      {/* PRODUCT TYPES */}
      <section className="demo-products">
        <h2>Explore what you can build</h2>

        <div className="demo-product-grid">
          <div className="demo-product-card">
            <h3>Courses</h3>
            <p>Structured learning experiences with lessons and sections.</p>
          </div>

          <div className="demo-product-card">
            <h3>Memberships</h3>
            <p>Recurring revenue with exclusive content feeds.</p>
          </div>

          <div className="demo-product-card">
            <h3>Consultations</h3>
            <p>1:1 sessions, coaching, and calls with your audience.</p>
          </div>
        </div>
      </section>

      {/* LEARN */}
      <section className="demo-learn">
        <h2>What you’ll learn</h2>
        <ul>
          <li>How to create and structure products</li>
          <li>How publishing works</li>
          <li>How customers access your content</li>
          <li>How to track performance</li>
        </ul>
      </section>

      {/* CTA */}
      <section className="demo-cta">
        <h2>Ready to launch your creator universe?</h2>

        <Button variant="primary">Get Started</Button>
      </section>
    </main>
  );
};

export default Demo;
