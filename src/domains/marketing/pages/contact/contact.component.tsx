import React from 'react';

import { GalExpansionPanel } from '@shared/ui';
import { ContactForm, CTASection } from '@domains/marketing/shared';

import './contact.styles.scss';

const Contact: React.FC = () => (
  <main className="contact-page">
    <section className="contact-hero-section">
      <div className="contact-hero-content">
        <span className="contact-hero-kicker">Transmission channel open</span>

        <div className="contact-hero-header">
          <h1>Send us a signal</h1>
          <p>
            Got questions, ideas, or support requests? Beam them our way and
            we’ll get back to you.
          </p>
        </div>

        <div className="contact-hero-socials">
          <span>Find us on our socials</span>

          <ul className="contact-hero-socials-list">
            <li>f</li>
            <li>IG</li>
            <li>In</li>
            <li>TT</li>
          </ul>
        </div>

        <p className="contact-response-note">
          Average response time: 1–2 business days
        </p>
      </div>

      <div className="contact-form-container">
        <div className="contact-form-orbit" />
        <ContactForm />
      </div>
    </section>

    <section className="faq-section">
      <span className="faq-kicker">Signal archive</span>
      <h1>Frequently Asked Questions</h1>
      <p className="subheading">Find answers to some common questions.</p>

      <div className="faq-list">
        <GalExpansionPanel header="How do I reset my password?">
          <p>
            Click on &quot;Forgot Password&quot; at the login page and follow
            the instructions.
          </p>
        </GalExpansionPanel>

        <GalExpansionPanel
          header="Where can I find my purchase history?"
          defaultExpanded
        >
          <p>
            You can find your purchase history from your account dashboard under
            purchases.
          </p>
        </GalExpansionPanel>

        <GalExpansionPanel header="How can I contact support?">
          <p>You can reach our support team through the contact form above.</p>
        </GalExpansionPanel>
      </div>
    </section>

    <CTASection
      title={<span>Ready to launch?</span>}
      primaryText="Launch now"
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onPrimaryClick={() => {}}
    />
  </main>
);

export default Contact;
