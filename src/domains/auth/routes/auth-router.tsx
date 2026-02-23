import React from 'react';
import { Routes, Route } from 'react-router-dom';

import {
  EmailSent,
  ForgotPassword,
  SignIn,
  SignUp,
  VerifyEmail,
} from '../pages';

const AuthRouter: React.FC = () => (
  <Routes>
    <Route path="signup" element={<SignUp />} />
    <Route path="login" element={<SignIn />} />
    <Route path="verify-email" element={<VerifyEmail />} />
    <Route path="email-sent" element={<EmailSent />} />
    <Route path="forgot-password" element={<ForgotPassword />} />
  </Routes>
);

export default AuthRouter;
