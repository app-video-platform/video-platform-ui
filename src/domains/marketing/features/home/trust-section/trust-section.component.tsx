/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { SectionOrbit, SectionHeader } from '@domains/marketing/shared';
import './trust-section.styles.scss';

gsap.registerPlugin(ScrollTrigger);

interface TrustObject {
  title: string;
  text: string;
  imgSrc: string;
}

const TRUST_OBJECTS: TrustObject[] = [
  {
    title: 'Secure Checkout',
    text: 'Payment managed by Stripe',
    imgSrc: '/images/secure.webp',
  },
  {
    title: 'Instant Access Unlock',
    text: 'Customers access content immediately',
    imgSrc: '/images/access.webp',
  },
  {
    title: 'Revenue Insight',
    text: 'Analytics to grow your business',
    imgSrc: '/images/insight.webp',
  },
  {
    title: 'Creator-Controlled Branding',
    text: 'Your logo, your colors, your decisions',
    imgSrc: '/images/branding.webp',
  },
];

const TrustSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsWrapRef = useRef<HTMLDivElement | null>(null);
  // const floatTweensRef = useRef<gsap.core.Tween[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardsWrapRef.current) {
      return;
    }

    const prefersReduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) {
      return;
    }

    const ctx = gsap.context(() => {
      const wrap = cardsWrapRef.current!;
      const cards = gsap.utils.toArray<HTMLElement>(
        wrap.querySelectorAll('.trust-card'),
      );

      // Initial state: 20px lower, invisible
      gsap.set(cards, {
        autoAlpha: 0,
        y: 28,
        willChange: 'transform, opacity',
      });

      const tl = gsap.timeline({ paused: true });

      // One-by-one reveal
      tl.to(cards, {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.12,
        clearProps: 'willChange',
      });

      // Prevent CSS transition conflicts while GSAP runs
      const setRevealing = (on: boolean): void => {
        wrap.classList.toggle('is-revealing', on);
      };

      tl.eventCallback('onStart', () => setRevealing(true));
      tl.eventCallback('onComplete', () => setRevealing(false));
      tl.eventCallback('onReverseComplete', () => setRevealing(false));

      ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: 'top 45%',
        invalidateOnRefresh: true,
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
        onLeaveBack: () => tl.reverse(),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="max-w trust-content" ref={sectionRef}>
      <SectionOrbit />
      <SectionHeader
        className="trust-header"
        title={
          <span>
            Built for <span className="primary-word">Serious</span> Creators
          </span>
        }
        subtitle="Your business deserves a platform that feels powerful and focused"
      />

      <div
        className="trust-cards"
        ref={cardsWrapRef}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {TRUST_OBJECTS.map((t, index) => (
          <div
            key={index}
            className={clsx('trust-card', {
              'is-dimmed': activeIndex !== null && activeIndex !== index,
              'is-active': activeIndex === index,
            })}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <div className="tc-image-wrap">
              {/* energy field (no card background) */}
              <span className="tc-energy" aria-hidden="true" />
              <img className="tc-image" height={70} src={t.imgSrc} alt="" />
            </div>

            <h4 className="tc-header">{t.title}</h4>
            <p className="tc-text">{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustSection;
