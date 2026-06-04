import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AboutSection,
  FeaturesSection,
  HowItWorksSection,
  ProductsSection,
  TrustSection,
  WordCarousel,
} from '@domains/marketing/features';
import { ButtonMarketing, CTASection } from '@domains/marketing/shared';

import './home.styles.scss';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="landing-page">
      <section className="hero-section-wrapper">
        <div className="hero-section max-w">
          <div className="hero-content">
            <h1 className="gal-huge-header hero-header">
              <span>Create Courses That</span>
              <WordCarousel />
            </h1>
            <p className="gal-subtext hero-subtext">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
              porttitor faucibus interdum. Quisque at efficitur tellus. Nulla
              sed tortor dolor.
            </p>

            <div className="hero-actions">
              <ButtonMarketing
                type="button"
                variant="primary"
                className="launch-action"
                onClick={() => navigate('pricing')}
              >
                Launch Your Universe
              </ButtonMarketing>

              <ButtonMarketing
                type="button"
                variant="secondary"
                className="see-action"
                onClick={() => navigate('pricing')}
              >
                See how it works
              </ButtonMarketing>
            </div>
          </div>
        </div>
      </section>
      <section className="section-calm trust-section">
        <TrustSection />
      </section>

      <section className="section-surface section-padding">
        <HowItWorksSection />
      </section>

      <section className="products-section section-padding">
        <ProductsSection />
      </section>

      <section className="about-section section-padding">
        <AboutSection />
      </section>

      <section className="features-section section-padding">
        <FeaturesSection />
      </section>

      <section className="section-padding">
        <CTASection
          title={
            <span>
              Launch your <span className="primary-word">Universe</span>
            </span>
          }
          subtitle="You don't need more tools. All you need is the right foundation."
          primaryText="Launch Your Universe"
          onPrimaryClick={() => navigate('/app')}
          secondaryText="See pricing"
          onSecondaryClick={() => navigate('/pricing')}
        />
      </section>
    </main>
  );
};

export default Home;
