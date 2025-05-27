import React from 'react';

const About: React.FC = () => (
  <main className='about-page'>
    <section className='about-hero'>
      <h1>From Idea to Impact</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porttitor
        faucibus interdum. Quisque at efficitur tellus. Nulla sed tortor dolor.
        In aliquam, lacus sed ullamcorper commodo, nisi ipsum
        dictum magna, ac pulvinar diam nisi mattis sapien. </p>
      <div className='about-hero-image'></div>
    </section>
    <section>
      <div className='mission-image'></div>
      <div className='mission-content'>
        <h1>Our Space Mission</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porttitor faucibus interdum.
          Quisque at efficitur tellus. Nulla sed tortor dolor. In aliquam, lacus sed ullamcorper commodo,
          nisi ipsum dictum magna, ac pulvinar diam nisi mattis sapien. Quisque posuere posuere ante elementum pulvinar.
          Suspendisse dignissim lorem id libero suscipit, eget ultricies nibh dignissim. Curabitur sed est imperdiet,
          porta ante vel, sollicitudin arcu. Donec vulputate posuere sem quis aliquam.
        </p>
      </div>
    </section>
    <section className='values-section'>
      <h1>Our Values</h1>
      <ul className='values-list'>
        <li>
          <div className='value-planet'></div>
          <p>Value</p>
        </li>
        <li>
          <div className='value-planet'></div>
          <p>Value</p>
        </li>
        <li>
          <div className='value-planet'></div>
          <p>Value</p>
        </li>
        <li>
          <div className='value-planet'></div>
          <p>Value</p>
        </li>
        <li>
          <div className='value-planet'></div>
          <p>Value</p>
        </li>
      </ul>
    </section>
    <section>
      <div className='different-heading-container'>
        <h1>What Makes Us Different</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porttitor faucibus interdum.
        </p>

      </div>
      <div className='different-list-container'>
        <ul className='different-list'>
          <li className='different-item'>

          </li>
        </ul>
      </div>

    </section>
  </main>
);

export default About;