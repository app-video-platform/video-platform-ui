import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h1>404</h1>
    <p>Oops! The page you’re looking for does not exist.</p>
    <Link to="/">Return Home</Link>
  </div>
);

export default NotFoundPage;