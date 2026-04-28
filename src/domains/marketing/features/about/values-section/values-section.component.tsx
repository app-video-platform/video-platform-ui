/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { SectionHeader, SectionOrbit } from '@domains/marketing/shared';

import './values-section.styles.scss';

const VALUES = [
  {
    title: 'Ownership First',
    desc: 'Your audience and revenue should belong to you.',
  },
  {
    title: 'Clarity Over Chaos',
    desc: 'Fewer tools. Less friction. More focus.',
  },
  {
    title: 'Quality Over Noise',
    desc: 'Build things that last — not what trends.',
  },
  {
    title: 'Creator-Led',
    desc: 'Real creators shape the platform.',
  },
  {
    title: 'Focused Foundation',
    desc: 'One system. Not ten tools duct-taped together.',
  },
];

const ValuesSection: React.FC = () => (
  <section className="values-orbit max-w">
    {/* <div className="values-header">
      <h2>OUR VALUES</h2>
      <p>The principles behind everything we build.</p>
    </div> */}
    <SectionHeader
      title={
        <span>
          our <span className="primary-word">values</span>
        </span>
      }
      subtitle="The principles behind everything we build."
    />

    <div className="orbit-container">
      <SectionOrbit />

      <div className="planets">
        {VALUES.map((value, index) => (
          <div key={value.title} className={`planet planet-${index}`}>
            <div className="planet-orb" />

            <div className="planet-text">
              <h3>{value.title}</h3>
              <p>{value.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ValuesSection;
