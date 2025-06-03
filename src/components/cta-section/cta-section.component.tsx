import React from 'react';

import './cta-section.styles.scss';
import Button from '../button/button.component';
import { useNavigate } from 'react-router-dom';

interface CtaSectionProps {
  headerText: string;
  descriptionText: string;
}

const CtaSection: React.FC<CtaSectionProps> = ({
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
        <Button
          htmlType="button"
          type="primary"
          text="Launch now"
          onClick={handleLaunchNow}
        />
        <Button
          htmlType="button"
          type="secondary"
          text="Learn more"
          onClick={handleLearnMore}
        />
      </div>
      {/* </div> */}
    </section>
  );
};

export default CtaSection;
