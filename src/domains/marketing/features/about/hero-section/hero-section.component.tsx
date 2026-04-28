import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { usePlanetHeroAnimation } from './use-planet-animation.hook';
import AboutHeroPlanet from './hero-planet.component';

import './hero-section.styles.scss';

gsap.registerPlugin(ScrollTrigger);

const HeroSection: React.FC = () => {
  const heroRef = usePlanetHeroAnimation();

  return (
    <section className="about-hero" ref={heroRef}>
      <div className="about-hero__content">
        <h1>
          We&apos;re here to give you the{' '}
          <span className="primary-word">space</span> to create.
        </h1>

        <p className="about-hero__subtext">
          Creators deserve more than rented platforms and borrowed audiences.
          <br />
          CosmicApp gives you structure, clarity, and full ownership — without
          compromise.
        </p>
      </div>

      <div className="about-hero__visual" aria-hidden="true">
        <AboutHeroPlanet className="about-hero__planet" />
      </div>
    </section>
  );
};

export default HeroSection;
