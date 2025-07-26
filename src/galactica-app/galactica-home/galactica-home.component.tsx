import React from 'react';

import './galactica-home.styles.scss';

const GalacticaHome: React.FC = () => (
  <div className="galactica-home-page">
    <main className="galactica-home-main">
      <h1>Welcome back, dude!</h1>
      <p>Daca nu am apucat sa iti zic, si nu stii ce se intampla:</p>
      <ul>
        <li>Apasa pe iconita de user</li>
        <li>Schimba rolul pe Creator</li>
        <li>Vezi ca am facut ceva modificari. Trebuie sa le discutam :))</li>
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
