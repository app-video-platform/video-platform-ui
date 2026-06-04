/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { SectionHeader } from '@domains/marketing/shared';

import './different-section.styles.scss';

const DIFFERENT_ITEMS = [
  {
    title: 'No marketplace noise',
    desc: 'Your products aren’t placed beside competitors or ranked by an algorithm.',
  },
  {
    title: 'Your audience stays yours',
    desc: 'Build direct relationships without renting attention from someone else’s feed.',
  },
  {
    title: 'Built for focused selling',
    desc: 'Courses, downloads, and consultations live inside one clear creator system.',
  },
  {
    title: 'Less tool sprawl',
    desc: 'Replace disconnected workflows with a foundation that feels intentional.',
  },
];

const DifferentSection: React.FC = () => (
  <section className="different-section max-w">
    {/* <div className="different-heading-container">
      <h2>
        WHAT MAKES US <span>DIFFERENT</span>
      </h2>
      <p>
        We’re not building another marketplace or a pile of tools. Galactica is
        built for creators who want ownership, focus, and a cleaner way to sell
        their work.
      </p>
    </div> */}

    <SectionHeader
      title={
        <span>
          WHAT MAKES US <span className="primary-word">DIFFERENT</span>
        </span>
      }
      position="left"
      subtitle="We’re not building another marketplace or a pile of tools. Galactica is
        built for creators who want ownership, focus, and a cleaner way to sell
        their work."
    />

    <ul className="different-list">
      {DIFFERENT_ITEMS.map((item, index) => (
        <li className="different-item" key={item.title}>
          <div className="different-item__marker">
            {String(index + 1).padStart(2, '0')}
          </div>

          <div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

export default DifferentSection;
