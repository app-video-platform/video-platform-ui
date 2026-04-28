import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './footer.styles.scss';

gsap.registerPlugin(ScrollTrigger);

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/features' },
      { label: 'Getting Started', to: '/getting-started' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Demo', to: '/demo' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: '/help' },
      { label: 'FAQ', to: '/contact#faq' },
      // { label: 'Tutorials', to: '/help/tutorials' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', to: '/terms' },
      { label: 'Privacy', to: '/privacy' },
      { label: 'Cookies', to: '/cookies' },
    ],
  },
];

const socials = ['f', 'x', 'in', 'ig'];

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement | null>(null);
  const shineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!footerRef.current || !shineRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        shineRef.current,
        { backgroundPosition: '0% 50%' },
        {
          backgroundPosition: '100% 50%',
          ease: 'none',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="vp-footer" ref={footerRef}>
      <div className="vp-footer__shine" ref={shineRef} />
      <div className="vp-footer__bloom" />

      <div className="vp-footer__inner">
        <div className="vp-footer__brand">
          <Link to="/" className="vp-footer__logo">
            <span className="vp-footer__logo-mark" />
            <span>CosmicApp</span>
          </Link>

          {/* <p>
            Build, launch, and grow your creator universe with courses,
            memberships, and consultations.
          </p>

          <Link to="/getting-started" className="vp-footer__cta">
            Launch now
          </Link> */}
        </div>

        <nav className="vp-footer__nav" aria-label="Footer navigation">
          {footerColumns.map((column) => (
            <div className="vp-footer__column" key={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="vp-footer__bottom">
        <p>© Galactica 2025. All rights reserved.</p>

        <ul className="vp-footer__socials" aria-label="Social links">
          {socials.map((social) => (
            <li key={social}>
              <a href="/" aria-label={social}>
                {social}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
