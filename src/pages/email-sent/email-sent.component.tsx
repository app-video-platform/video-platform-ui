import React from 'react';
import { CiCircleCheck } from 'react-icons/ci';

import './email-sent.styles.scss';

const EmailSent: React.FC = () => (
  <div className='email-sent-message-container'>
    {React.createElement(CiCircleCheck as React.FC<{ color: string; size: number }>, {
      color: 'green',
      size: 100,
    })}
    {/* <CiCircleCheck color='green' size={100} /> */}

    <h2>Check your email</h2>
    <p>We’ve sent a verification email to your address. Please follow the link in the email to verify your account.</p>

  </div>
);

export default EmailSent;