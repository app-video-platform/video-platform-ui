/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { SectionHeader, ButtonMarketing } from '@domains/marketing/shared';

import './cta-section.styles.scss';

gsap.registerPlugin(ScrollTrigger);

interface CTASectionProps {
  title: React.ReactNode;
  subtitle?: string;
  primaryText: string;
  onPrimaryClick: () => void;
  secondaryText?: string;
  onSecondaryClick?: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle = '',
  primaryText,
  onPrimaryClick,
  secondaryText,
  onSecondaryClick,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

    const prefersReduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) {
      return;
    }

    const ctx = gsap.context(() => {
      const section = sectionRef.current!;
      const header = section.querySelector<HTMLElement>('.section-header');
      const btnWrap = section.querySelector<HTMLElement>('.btns-container');
      const btns = gsap.utils.toArray<HTMLElement>('.cta-btn');

      // Initial state
      if (header) {
        gsap.set(header, { autoAlpha: 0, y: 20, filter: 'blur(10px)' });
      }
      if (btnWrap) {
        gsap.set(btnWrap, { autoAlpha: 0, y: 14, filter: 'blur(8px)' });
      }

      // Also “calm” the buttons initially (so they don't pop)
      gsap.set(btns, { scale: 0.985 });

      const tl = gsap.timeline({ paused: true });

      if (header) {
        tl.to(header, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.85,
          ease: 'power3.out',
        });
      }

      if (btnWrap) {
        tl.to(
          btnWrap,
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.75,
            ease: 'power3.out',
          },
          '-=0.35',
        );
      }

      // Buttons “lock in” one-by-one
      tl.to(
        btns,
        {
          scale: 1,
          duration: 0.28,
          ease: 'power2.out',
          stagger: 0.08,
        },
        '-=0.45',
      );

      ScrollTrigger.create({
        trigger: section,
        start: 'top 62%',
        invalidateOnRefresh: true,
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
        onLeaveBack: () => tl.reverse(),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="max-w cta-section" ref={sectionRef}>
      {/* Cinematic background layers (CSS only) */}
      <span className="cta-glow cta-glow--a" aria-hidden="true" />
      <span className="cta-glow cta-glow--b" aria-hidden="true" />
      <span className="cta-orbit" aria-hidden="true" />

      <SectionHeader title={title} subtitle={subtitle} />

      <div className="btns-container">
        <ButtonMarketing
          type="button"
          variant="primary"
          className="cta-btn cta-btn--primary"
          onClick={onPrimaryClick}
        >
          {primaryText}
        </ButtonMarketing>

        {secondaryText && (
          <ButtonMarketing
            type="button"
            variant="neutral"
            className="cta-btn cta-btn--secondary"
            onClick={onSecondaryClick}
          >
            {secondaryText}
          </ButtonMarketing>
        )}
      </div>
    </section>
  );
};

export default CTASection;
