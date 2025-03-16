import React from 'react';

import './step-one.styles.scss';

const StepOne: React.FC = () => (
  <div className='step-one'>
    <h1 className='step-header'>Welcome to Galactica</h1>
    <div className='step-content'>
      <p>Hi there, and welcome to <strong>Galactica</strong>! We’re excited to have you join our community of creators and entrepreneurs.
        Our platform is designed to make it simple and fun for you to create and manage your courses, consultations, and downloadable content. </p>
      <p>Ready to take a tour? Click Next to learn how to make the most out of your new dashboard. If you’d prefer to jump right in,
        just click Skip and start exploring at your own pace.</p>
    </div>
  </div>
);

export default StepOne;