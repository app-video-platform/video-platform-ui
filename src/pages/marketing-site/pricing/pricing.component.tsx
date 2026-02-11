import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@shared/ui';

import './pricing.styles.scss';

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  const handleContactUs = () => {
    navigate('/contact');
  };

  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1>Choose your orbit</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          porttitor faucibus interdum. Quisque at efficitur tellus.
        </p>
      </div>
      <div className="pricing-plans">
        <div className="pricing-plan">
          <div className="plan-planet-wrapper">
            <div className="plan-planet plan-planet__monthly">
              <span>$99</span>
            </div>
          </div>
          <div className="pricing-plan-description">
            <div className="pricing-plan-info">
              <h3>Monthly</h3>
              <p>Pay monthly, no commitment</p>
            </div>
            <Button type="button" variant="primary">
              Get Started
            </Button>
          </div>
        </div>

        <div className="pricing-plan">
          <div className="plan-planet-wrapper">
            <div className="plan-planet plan-planet__bi-yearly">
              <span>$499</span>
            </div>
          </div>
          <div className="pricing-plan-description">
            <div className="pricing-plan-info">
              <h3>Bi-yearly</h3>
              <p>Save 10% on a 6 month commitment</p>
            </div>

            <Button type="button" variant="primary">
              Get Started
            </Button>
          </div>
        </div>

        <div className="pricing-plan">
          <div className="plan-planet-wrapper">
            <div className="plan-planet plan-planet__yearly">
              <span>$999</span>
            </div>
          </div>
          <div className="pricing-plan-description">
            <div className="pricing-plan-info">
              <h3>Yearly</h3>
              <p>Best value! Save 20% with a yearly subscription</p>
            </div>

            <Button type="button" variant="primary">
              Get Started
            </Button>
          </div>
        </div>
      </div>

      <div className="cta-container">
        <h1>Have any questions?</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          porttitor faucibus interdum. Quisque at efficitur tellus. Nulla sed
          tortor dolor.
        </p>
        <div className="cta-action-buttons">
          <Button type="button" variant="primary" onClick={handleContactUs}>
            Contact Us
          </Button>
          <Button type="button" variant="secondary">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
