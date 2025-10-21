import React from 'react';
import { Link } from 'react-router-dom';

import './galactica-home.styles.scss';

const GalacticaHome: React.FC = () => (
  <div className="galactica-home-page">
    <main className="galactica-home-main">
      <h1>Welcome back, dude!</h1>
      <p>NEW CHANGES</p>
      <ul>
        <li>
          Avem Docusaurus (User dropdown -{'>'}{' '}
          <Link target="_blank" to="https://luxury-klepon-a62307.netlify.app/">
            Docusaurus
          </Link>
          )
        </li>
        <li>Avem quiz builder</li>
        <li>
          Avem cart page cu cart items badge icon si local storage persistance
          (ca nu ai vrut cu backend persistance)
        </li>
        <li>
          Avem wishlist functionality cu local storage persistance (ca nu ai
          vrut cu backend persistance)
        </li>
        <li>
          Avem improved library page (cu taburi diferite pentru all prods,
          course, downloads, cosnultations, wishlist)
        </li>
      </ul>
      <h2>Continue your courses</h2>
      <div className="course-cards"></div>
      <h2>What to learn next</h2>
      <h2>New courses you might like</h2>
      <h3>How about joining our content creator team?</h3>
      <span>Button</span>
    </main>
  </div>
);

export default GalacticaHome;
