import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@shared/ui';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const heroIll = require('../../../assets/landing-hero-illustration.webp');

import './home.styles.scss';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="gal-huge-header hero-header">
            Create Courses That Inspire
          </h1>
          <p className="gal-subtext hero-subtext">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
            porttitor faucibus interdum. Quisque at efficitur tellus. Nulla sed
            tortor dolor.
          </p>

          <Button
            type="button"
            variant="marketing-primary"
            className="hero-cta"
            onClick={() => navigate('pricing')}
          >
            Launch Now
          </Button>
        </div>
        <div className="hero-image">
          {/* <img
            src={'/images/landing-hero-illustration.webp'}
            alt="{prod.name}"
            className="product-card-image"
          /> */}
        </div>
      </section>
      <section className="video-section">
        <h1 className="gal-big-header">How It Works</h1>
        <p className="gal-subtext">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          porttitor faucibus interdum. Quisque at efficitur tellus.
        </p>
        <div className="video-container"></div>
      </section>
      <section className="services-section">
        <h1 className="gal-big-header services-header">Our Services</h1>
        <div className="services">
          <div className="service-container">
            <div className="service-icon"></div>
            <h2 className="gal-medium-header service-header">
              Download Package
            </h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
              porttitor faucibus interdum. Quisque at efficitur tellus. Nulla
              sed tortor dolor.
            </p>
          </div>
          <div className="service-container">
            <div className="service-icon"></div>
            <h2 className="gal-medium-header service-header">Course</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
              porttitor faucibus interdum. Quisque at efficitur tellus. Nulla
              sed tortor dolor.
            </p>
          </div>
          <div className="service-container">
            <div className="service-icon"></div>
            <h2 className="gal-medium-header service-header">Consultation</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
              porttitor faucibus interdum. Quisque at efficitur tellus. Nulla
              sed tortor dolor.
            </p>
          </div>
        </div>
      </section>
      <section className="features-section">
        <div className="features-wrapper">
          <h1 className="gal-big-header features-header">
            Some of Our Features
          </h1>
          <div className="features-container">
            <div className="feature-container feature-container__email">
              <div className="feature-icon feature-icon__email"></div>
              <h2 className="gal-medium-header feature-header">
                Email Marketing
              </h2>
              <p>
                Engage your students with automated email campaigns,
                personalized updates, and exclusive offers.
              </p>
            </div>
            <div className="feature-container feature-container__branding">
              <h2 className="gal-medium-header feature-header">
                Branding Tools
              </h2>
              <p>
                Build your own branded storefront to showcase and sell your
                courses, making your platform uniquely yours.
              </p>
              <div className="feature-icon feature-icon__branding"></div>
            </div>
            <div className="feature-container feature-container__analitics">
              <div className="analitics-text">
                <h2 className="gal-medium-header feature-header">
                  Real-Time Analitics
                </h2>
                <p>
                  Track sales, user behavior, and generate custom reports to
                  refine your strategy.
                </p>
              </div>
              <div className="branding-image feature-icon"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h1 className="gal-big-header">Transform Your Passion Into Profit</h1>
        <p className="gal-subtext cta-subtext">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          porttitor faucibus interdum. Quisque at efficitur tellus. Nulla sed
          tortor dolor.
        </p>
        <div className="btns-container">
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate('pricing')}
          >
            Launch Now
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('pricing')}
          >
            Learn More
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Home;
