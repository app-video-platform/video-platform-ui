/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  SectionHeader,
  DividerMarketing,
  ButtonMarketing,
} from '@domains/marketing/shared';

import './products-section.styles.scss';

gsap.registerPlugin(ScrollTrigger);

interface ProductObject {
  title: string;
  text: string;
  listItems: string[];
  ctaLabel: string;
  imgSrc: string;
}

const ProductsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsWrapRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const PRODUCT_OBJECTS: ProductObject[] = useMemo(
    () => [
      {
        title: 'Video Courses',
        text: 'Structured learning experiences with full control',
        imgSrc: '/images/course_marketing.webp',
        ctaLabel: 'Create a Course',
        listItems: [
          'Modules & Lessons',
          'Drip or full release',
          'Locked/free previews',
          'Progress tracking',
        ],
      },
      {
        title: 'Memberships',
        text: 'Recurring access to evolving content',
        imgSrc: '/images/membership_marketing.webp',
        ctaLabel: 'Launch a Membership',
        listItems: [
          'Ongoing content feed',
          'Exclusive resources',
          'Course access included',
          'Automatic subscription billing',
        ],
      },
      {
        title: '1:1 Consultation',
        text: 'High-touch sessions, simplified',
        imgSrc: '/images/consultation_marketing.webp',
        ctaLabel: 'Offer 1:1 Sessions',
        listItems: [
          'One-time access',
          'Secure payment',
          'Email instructions',
          'Calendar integrations ready',
        ],
      },
    ],
    [],
  );

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
        wrap.querySelectorAll('.product-card'),
      );

      // Initial cinematic state
      gsap.set(cards, {
        autoAlpha: 0,
        y: 28,
        scale: 0.98,
        filter: 'blur(10px)',
        willChange: 'transform, opacity, filter',
      });

      const tl = gsap.timeline({ paused: true });

      tl.to(cards, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.95,
        ease: 'power3.out',
        stagger: 0.14,
        clearProps: 'willChange',
      });

      // Toggle CSS transition lock while animating (prevents “fighting”)
      const setRevealing = (on: boolean): void => {
        wrap.classList.toggle('is-revealing', on);
      };
      tl.eventCallback('onStart', () => {
        setRevealing(true);
      });
      tl.eventCallback('onComplete', () => {
        setRevealing(false);
      });
      tl.eventCallback('onReverseComplete', () => {
        setRevealing(false);
      });

      // Play/reverse scene
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
    <div className="products-section" ref={sectionRef}>
      <SectionHeader
        title={
          <span>
            Build the Right <span className="primary-word">Product</span> for
            Your Universe
          </span>
        }
        subtitle="Course, memberships, and consultations - all under one roof."
      />

      <div
        className="max-w products-section-content"
        ref={cardsWrapRef}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {PRODUCT_OBJECTS.map((prod, index) => (
          <div className="product-col" key={index}>
            <div
              className={clsx('product-card', {
                'is-dimmed': activeIndex !== null && activeIndex !== index,
                'is-active': activeIndex === index,
              })}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {/* cinematic overlays (no background card) */}
              <span className="pc-energy" aria-hidden="true" />
              <span className="pc-sheen" aria-hidden="true" />

              <div className="pc-media">
                <img className="pc-img" src={prod.imgSrc} width={150} alt="" />
              </div>

              <h3 className="card-title">{prod.title}</h3>
              <DividerMarketing big />

              <div className="card-text-wrapper">
                <p className="card-text">{prod.text}</p>
              </div>

              <DividerMarketing />

              <ul className="prod-list">
                {prod.listItems.map((lItem, idx) => (
                  <li key={idx} className="prod-item">
                    {lItem}
                  </li>
                ))}
              </ul>

              <ButtonMarketing variant="secondary" className="pc-btn">
                {prod.ctaLabel}
              </ButtonMarketing>
            </div>

            {index + 1 < PRODUCT_OBJECTS.length && (
              <DividerMarketing vertical />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsSection;
