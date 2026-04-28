/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import './quote-section.styles.scss';

interface QuoteSectionProps {
  imageSrc: string;
}

const QuoteSection: React.FC<QuoteSectionProps> = ({ imageSrc }) => (
  <section className="founder-transmission max-w">
    <div className="founder-visual" aria-hidden="true">
      <div className="founder-orb">
        <span className="founder-glow" />
        <span className="founder-ring founder-ring--a" />
        <span className="founder-ring founder-ring--b" />
        <span className="founder-star founder-star--a" />
        <span className="founder-star founder-star--b" />
        <span className="founder-star founder-star--c" />

        <img src={imageSrc} alt="" className="founder-photo" />
      </div>
    </div>

    <div className="founder-copy">
      <div className="quote-mark">“</div>

      <p className="founder-quote">
        We built Galactica for creators who are done compromising. You shouldn’t
        have to trade ownership for convenience or clarity for complexity. Our
        mission is simple: give creators the foundation they deserve so they can
        build, sell, and grow — on their own terms. This is just the beginning.
      </p>

      <div className="founder-signature">
        <span className="founder-name">TATI, CEO</span>
        <span className="founder-role">FOUNDER OF GALACTICA</span>
      </div>
    </div>
  </section>
);

export default QuoteSection;
