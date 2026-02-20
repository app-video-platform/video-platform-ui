import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h1>401 - Unauthorized</h1>
    <p>You are not authorized to view this page.</p>
    <Link to="/signin">Login</Link>
  </div>
);

export default UnauthorizedPage;