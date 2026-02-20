import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@shared/ui';

import './gal-cta-section.styles.scss';

interface GalCtaSectionProps {
  headerText: string;
  descriptionText: string;
}

const GalCtaSection: React.FC<GalCtaSectionProps> = ({
  headerText,
  descriptionText,
}) => {
  const navigate = useNavigate();

  const handleLaunchNow = () => {
    // Navigate to the launch page
    navigate('/pricing');
  };

  const handleLearnMore = () => {
    // Navigate to the learn more page
    navigate('/about');
  };

  return (
    <section className="cta-section">
      {/* <div className="cta-content"> */}
      <h1>{headerText}</h1>
      <p>{descriptionText}</p>
      <div className="cta-action-buttons">
        <Button type="button" variant="primary" onClick={handleLaunchNow}>
          Launch now
        </Button>
        <Button type="button" variant="secondary" onClick={handleLearnMore}>
          Learn more
        </Button>
      </div>
      {/* </div> */}
    </section>
  );
};

export default GalCtaSection;
