import React from 'react';
import { FaCheckSquare } from 'react-icons/fa';

import { GalIcon } from '@shared/ui';
import { GalCtaSection } from 'domains/app/components';

import './about.styles.scss';

const About: React.FC = () => (
  <main className="about-page">
    <section className="about-hero">
      <h1>From Idea to Impact</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porttitor
        faucibus interdum. Quisque at efficitur tellus. Nulla sed tortor dolor.
        In aliquam, lacus sed ullamcorper commodo, nisi ipsum dictum magna, ac
        pulvinar diam nisi mattis sapien.{' '}
      </p>
      <div className="about-hero-image"></div>
    </section>
    <section className="mission-section">
      <div className="mission-image"></div>
      <div className="mission-content">
        <h1>Our Space Mission</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          porttitor faucibus interdum. Quisque at efficitur tellus. Nulla sed
          tortor dolor. In aliquam, lacus sed ullamcorper commodo, nisi ipsum
          dictum magna, ac pulvinar diam nisi mattis sapien. Quisque posuere
          posuere ante elementum pulvinar. Suspendisse dignissim lorem id libero
          suscipit, eget ultricies nibh dignissim. Curabitur sed est imperdiet,
          porta ante vel, sollicitudin arcu. Donec vulputate posuere sem quis
          aliquam.
        </p>
      </div>
    </section>
    <section className="values-section">
      <h1>Our Values</h1>
      <ul className="values-list">
        <li>
          <div className="value-planet"></div>
          <p>Value</p>
        </li>
        <li>
          <div className="value-planet"></div>
          <p>Value</p>
        </li>
        <li>
          <div className="value-planet"></div>
          <p>Value</p>
        </li>
        <li>
          <div className="value-planet"></div>
          <p>Value</p>
        </li>
        <li>
          <div className="value-planet"></div>
          <p>Value</p>
        </li>
      </ul>
    </section>
    <section className="different-section">
      <div className="different-heading-container">
        <h1>What Makes Us Different</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          porttitor faucibus interdum.
        </p>
      </div>
      {/* <div className="different-list-container"> */}
      <ul className="different-list">
        <li className="different-item">
          <GalIcon icon={FaCheckSquare} color="green" size={24} />
          Lorem ipsum dolor sit amet senectutem juventus
        </li>
        <li className="different-item">
          <GalIcon icon={FaCheckSquare} color="green" size={24} />
          Lorem ipsum dolor sit amet senectutem juventus
        </li>
        <li className="different-item">
          <GalIcon icon={FaCheckSquare} color="green" size={24} />
          Lorem ipsum dolor sit amet senectutem juventus
        </li>
        <li className="different-item">
          <GalIcon icon={FaCheckSquare} color="green" size={24} />
          Lorem ipsum dolor sit amet senectutem juventus
        </li>
      </ul>
      {/* </div> */}
    </section>

    <section className="tati-section">
      <div className="image-container">
        <div className="tati-image" />
      </div>
      <div className="tati-quote-container">
        <p className="quote">
          “Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          porttitor faucibus interdum. Quisque at efficitur tellus. Nulla sed
          tortor dolor. In aliquam, lacus sed ullamcorper commodo, nisi ipsum
          dictum magna, ac pulvinar diam nisi mattis sapien. Quisque posuere
          posuere ante elementum pulvinar. Suspendisse dignissim lorem id libero
          suscipit, eget ultricies nibh dignissim. Curabitur sed est imperdiet,
          porta ante vel, sollicitudin arcu. Donec vulputate posuere sem quis
          aliquam.”
        </p>
        <span className="author">Tati, CEO</span>
      </div>
    </section>

    <GalCtaSection
      headerText="Start building with us"
      descriptionText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
      Etiam porttitor faucibus interdum. Quisque at efficitur tellus. Nulla sed tortor dolor."
    />
  </main>
);

export default About;
