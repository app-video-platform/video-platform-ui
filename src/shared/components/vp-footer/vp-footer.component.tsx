import React from 'react';
import { Link } from 'react-router-dom';

import './vp-footer.styles.scss';

const VPFooter: React.FC = () => (
  <div className="gal-footer">
    <div className="footer-content">
      <div className="logo-container"></div>
      <div className="main-container">
        <div className="pages-container">
          <h3 className="list-title">Pages</h3>
          <ul className="link-list">
            <li>
              <Link to={'/'}>Home</Link>
            </li>
            <li>
              <Link to={'/pricing'}>Pricing</Link>
            </li>
            <li>
              <Link to={'/products'}>Products</Link>
            </li>
            <li>
              <Link to={'/features'}>Features</Link>
            </li>
          </ul>
        </div>
        <div className="help-container">
          <h3 className="list-title">Get Help</h3>
          <ul className="link-list">
            <li>
              <Link to={'/help'}>Help Center</Link>
            </li>
            <li>
              <Link to={'/faq'}>FAQ</Link>
            </li>
            <li>
              <Link to={'/help/tutorials'}>Tutorials</Link>
            </li>
            <li>
              <Link to={'/contact'}>Contact Us</Link>
            </li>
          </ul>
        </div>
        <div className="company-container">
          <h3 className="list-title">Company</h3>
          <ul className="link-list">
            <li>
              <Link to={'/about'}>About Us</Link>
            </li>
            <li>
              <Link to={'/terms-of-use'}>Terms of Service</Link>
            </li>
            <li>
              <Link to={'/privacy-policy'}>Privacy Policy</Link>
            </li>
            <li>
              <Link to={'/cookie-policy'}>Cookie Policy</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="socials-container">
        <h3>Follow Us On</h3>
        <div className="socials-list">
          <div className="social-icon"></div>
          <div className="social-icon"></div>
          <div className="social-icon"></div>
          <div className="social-icon"></div>
        </div>
      </div>
    </div>
    <div className="footer-rights-container">
      <p>© Galactica 2025. All rights reserved</p>
    </div>
  </div>
);

export default VPFooter;
