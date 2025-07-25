import React from 'react';
import ContactForm from '../../components/gal-contact-form/gal-contact-form.component';

import './contact.styles.scss';
import GalCtaSection from '../../components/gal-cta-section/gal-cta-section.component';
import GalExpansionPanel from '../../components/gal-expansion-panel/gal-expansion-panel.component';

const Contact: React.FC = () => (
  <main className="contact-page">
    <div className="contact-hero-section">
      <div className="contact-hero-content">
        <div className="contact-hero-header">
          <h1>Let us know how we can help</h1>
          <p>Got ideas or questions? Let&apos;s talk</p>
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
      </div>
      <div className="contact-form-container">
        <ContactForm />
      </div>
    </div>
    <div className="faq-section">
      <h1>Frequently Asked Questions</h1>
      <p className="subheading">Find here answers to some common questions</p>
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
            {' '}
            You can reach our support team via the contact form above or email
            us directly.
          </p>
        </GalExpansionPanel>

        <GalExpansionPanel header="How can I contact support?">
          <p>This panel can’t be opened because it’s disabled. (haha no)</p>
        </GalExpansionPanel>
      </div>
    </div>

    <GalCtaSection
      headerText="Not a member yet?"
      descriptionText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    />
  </main>
);

export default Contact;
