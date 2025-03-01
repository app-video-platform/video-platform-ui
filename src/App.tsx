import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navigation from './pages/nav/nav.component';
import About from './pages/about/about.component';
import Home from './pages/home/home.component';
import Contact from './pages/contact/contact.component';
import SignUp from './pages/sign-up/sign-up.component';
import VerifyEmail from './pages/verify-email/verify-email.component';
import EmailSent from './pages/email-sent/email-sent.component';
import SignIn from './pages/sign-in/sign-in.component';

const App: React.FC = () => (
  <div>
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path="signup" element={<SignUp />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/email-sent" element={<EmailSent />} />
    </Routes>
  </div>
);

export default App;
