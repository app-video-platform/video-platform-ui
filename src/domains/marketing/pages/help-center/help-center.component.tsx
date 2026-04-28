import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Input } from '@shared/ui';
import { GalExpansionPanel } from '@shared/ui';

import './help-center.styles.scss';

const categories = [
  {
    title: 'Getting Started',
    description:
      'Learn how to set up your account and launch your first product.',
  },
  {
    title: 'Creating Products',
    description: 'Courses, memberships, and consultation sessions explained.',
  },
  {
    title: 'Payments & Pricing',
    description: 'Understand pricing, payments, and revenue tracking.',
  },
  {
    title: 'Account & Settings',
    description: 'Manage your profile, preferences, and account details.',
  },
  {
    title: 'Troubleshooting',
    description: 'Fix common issues and get back on track quickly.',
  },
];

const HelpCenter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="help-center-page">
      {/* HERO */}
      <section className="help-hero">
        <h1>How can we help?</h1>
        <p>Search guides, tutorials, and answers to common questions</p>

        <div className="help-search">
          <Input placeholder="Search for anything..." value={''} />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="help-categories">
        {categories.map((cat) => (
          <div key={cat.title} className="help-category-card">
            <h3>{cat.title}</h3>
            <p>{cat.description}</p>
          </div>
        ))}
      </section>

      {/* POPULAR */}
      <section className="help-popular">
        <h2>Popular articles</h2>

        <ul>
          <li>How to create your first course</li>
          <li>How memberships work</li>
          <li>Setting up a consultation session</li>
          <li>How pricing works</li>
          <li>Uploading files and content</li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="help-faq">
        <h2>Frequently Asked Questions</h2>

        <GalExpansionPanel header="How do I create my first product?">
          <p>
            Go to your dashboard, click “Create product”, choose a type, and
            follow the guided flow.
          </p>
        </GalExpansionPanel>

        <GalExpansionPanel header="Can I sell both courses and memberships?">
          <p>
            Yes. You can create multiple product types from the same account.
          </p>
        </GalExpansionPanel>

        <GalExpansionPanel header="How do I get paid?">
          <p>
            Payments are processed securely and tracked in your dashboard under
            the Sales section.
          </p>
        </GalExpansionPanel>
      </section>

      {/* CTA */}
      <section className="help-cta">
        <h2>Still need help?</h2>
        <p>Our team is here for you</p>

        <Button variant="primary" onClick={() => navigate('/contact')}>
          Contact Support
        </Button>
      </section>
    </main>
  );
};

export default HelpCenter;
