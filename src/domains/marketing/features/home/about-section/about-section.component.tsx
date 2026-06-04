/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { SectionHeader } from '@domains/marketing/shared';

import './about-section.styles.scss';

gsap.registerPlugin(ScrollTrigger);

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

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
      const lines = gsap.utils.toArray<HTMLElement>('.about-line');

      // initial: hidden
      gsap.set(lines, {
        autoAlpha: 0,
        y: 12,
        filter: 'blur(6px)',
        willChange: 'transform, opacity, filter',
      });

      const tl = gsap.timeline({ paused: true });

      // Reveal lines one-by-one
      tl.to(lines, {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.65,
        ease: 'power3.out',
        stagger: 0.1,
        clearProps: 'willChange',
      });

      // Extra emphasis for “key” lines (only while appearing)
      const keyLines = gsap.utils.toArray<HTMLElement>('.about-line.is-key');
      if (keyLines.length) {
        tl.fromTo(
          keyLines,
          { filter: 'blur(0px) drop-shadow(0 0 0 rgba(255,189,65,0))' },
          {
            filter: 'blur(0px) drop-shadow(0 10px 22px rgba(255,189,65,0.10))',
            duration: 0.25,
            ease: 'power2.out',
            stagger: 0.08,
          },
          '-=0.55',
        );
      }

      // play/reverse scene
      ScrollTrigger.create({
        trigger: sectionRef.current!,
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
    <div ref={sectionRef}>
      <SectionHeader
        title={
          <span>
            Build your <span className="primary-word">Universe</span>. Keep your{' '}
            <span className="primary-word">Control</span>
          </span>
        }
        subtitle=""
      />

      <div className="max-w about-sec-content">
        <p className="about-line">
          CosmicApp was built for creators who want ownership - not algorightms
        </p>

        <p className="about-line is-key asc-nos">No public marketplace</p>
        <p className="about-line">No distractions</p>
        <p className="about-line">No competing voices</p>

        <p className="about-line is-key asc-justs">Just your content</p>
        <p className="about-line">Your storefront</p>
        <p className="about-line">Your clients</p>

        <p className="about-line is-key asc-last">
          All inside one structured, powerful environment. We believe creators
          deserve clarity, control, and the freedom to grow without friction
        </p>
      </div>
    </div>
  );
};

export default AboutSection;
