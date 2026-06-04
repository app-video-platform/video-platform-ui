import React from 'react';

import { useWordCarousel } from './use-prefers-reduced-motion.hook';

import './word-carousel.styles.scss';

const WordCarousel: React.FC = () => {
  const trackRef = useWordCarousel(1.5);

  return (
    <span className="word-slot">
      <span className="word-track" ref={trackRef}>
        <span>Inspire</span>
        <span>Scale</span>
        <span>Transform</span>
        <span>Lead</span>
        <span>Convert</span>
      </span>
    </span>
  );
};

export default WordCarousel;
