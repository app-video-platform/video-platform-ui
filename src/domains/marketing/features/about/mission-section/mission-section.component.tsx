import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import MissionConstellation from './mission-constelation.component';

import './mission-section.styles.scss';
import { SectionHeader } from '@domains/marketing/shared';

gsap.registerPlugin(ScrollTrigger);

const MissionSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const host = sectionRef.current;
    if (!host) {
      return;
    }

    const prefersReduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    )?.matches;
    if (prefersReduced) {
      return;
    }

    const ctx = gsap.context(() => {
      const svg = host.querySelector<SVGSVGElement>('.mission-constellation');
      const wrap = host.querySelector<HTMLElement>('.mission-visual');

      if (!svg || !wrap) {
        return;
      }

      const lines = gsap.utils.toArray<SVGLineElement>('.mc-line', svg);
      const nodes = gsap.utils.toArray<SVGCircleElement>('.mc-node', svg);
      const haze = svg.querySelector<SVGGElement>('.mc-haze');

      // Prep: draw lines (line length computed from endpoints)
      lines.forEach((l) => {
        const x1 = Number(l.getAttribute('x1'));
        const y1 = Number(l.getAttribute('y1'));
        const x2 = Number(l.getAttribute('x2'));
        const y2 = Number(l.getAttribute('y2'));
        const len = Math.hypot(x2 - x1, y2 - y1);

        gsap.set(l, {
          strokeDasharray: len,
          strokeDashoffset: len,
          opacity: 0.0,
        });
      });

      gsap.set(nodes, {
        autoAlpha: 0,
        scale: 0.86,
        transformOrigin: '50% 50%',
      });
      if (haze) {
        gsap.set(haze, { autoAlpha: 0 });
      }

      gsap.set(wrap, { autoAlpha: 0, y: 16, filter: 'blur(10px)' });

      const tl = gsap.timeline({ paused: true });

      tl.to(wrap, {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.85,
        ease: 'power3.out',
      });

      if (haze) {
        tl.to(
          haze,
          { autoAlpha: 1, duration: 0.7, ease: 'power2.out' },
          '-=0.65',
        );
      }

      tl.to(
        lines,
        {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 1.05,
          ease: 'power2.out',
          stagger: 0.05,
        },
        '-=0.55',
      );

      tl.to(
        nodes,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.02,
        },
        '-=0.75',
      );

      // Gentle idle pulse (subtle)
      const center = svg.querySelector<SVGCircleElement>('.mc-node--center');
      const accent = svg.querySelector<SVGCircleElement>('.mc-node--accent');
      const idle = gsap.timeline({ repeat: -1, yoyo: true, paused: true });

      if (center) {
        idle.to(
          center,
          { opacity: 0.92, duration: 2.4, ease: 'sine.inOut' },
          0,
        );
      }
      if (accent) {
        idle.to(
          accent,
          { opacity: 0.95, duration: 2.2, ease: 'sine.inOut' },
          0.2,
        );
      }

      ScrollTrigger.create({
        trigger: host,
        start: 'top 72%',
        invalidateOnRefresh: true,
        onEnter: () => {
          tl.play(0);
          idle.play(0);
        },
        onEnterBack: () => {
          tl.play(0);
          idle.play(0);
        },
        onLeave: () => idle.pause(),
        onLeaveBack: () => idle.pause(),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="mission-section max-w" ref={sectionRef}>
      <div className="mission-visual" aria-hidden="true">
        <MissionConstellation className="mission-constellation" />
      </div>

      <div className="mission-content">
        <SectionHeader
          title={
            <span>
              our space <span className="primary-word">mission</span>
            </span>
          }
          subtitle=""
          position="left"
        />

        <p className="mission-copy">
          <span className="mission-lead">
            We’re building for creators who are done playing by someone else’s
            rules.
          </span>
          <br />
          We don’t believe your audience should belong to a feed. We don’t
          believe your income should depend on reach you can’t control. And we
          definitely don’t believe you should duct-tape your business together
          just to make it work.
          <br />
          So we’re building something different: a place where your products
          live under your name, your audience isn’t rented, and your growth
          isn’t dictated by a platform that can change overnight.
          <br />
          <br />
          No marketplaces. No competing on the same shelf. No building on
          borrowed land. Just a focused foundation for creators who want control
          — and plan to keep it.
        </p>
      </div>
    </section>
  );
};

export default MissionSection;
