/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { SectionHeader } from '@domains/marketing/shared';
import './features-section.styles.scss';

gsap.registerPlugin(ScrollTrigger);

interface FeatureObject {
  title: string;
  text: string;
  imgSrc: string;
  // Optional id if you later want deep-linking
  id?: string;
}

interface FeaturesSectionProps {
  // eslint-disable-next-line no-unused-vars
  onFeatureClick?: (feature: FeatureObject, index: number) => void;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  onFeatureClick,
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const FEATURES: FeatureObject[] = useMemo(
    () => [
      {
        title: 'Private Storefronts',
        text: 'Your own branded storefront to showcase your products for full ownership',
        imgSrc: '/images/landing-features/storefront.webp',
        id: 'storefronts',
      },
      {
        title: 'Built-In Email',
        text: 'Send broadcasts or automations to your subscribers from your dashboard',
        imgSrc: '/images/landing-features/mail.webp',
        id: 'email',
      },
      {
        title: 'Client Management',
        text: 'Organize customer data for easy access and simple control',
        imgSrc: '/images/landing-features/client.webp',
        id: 'clients',
      },
      {
        title: 'Analytics',
        text: 'Track revenue, sales trends, and student activity at a glance',
        imgSrc: '/images/landing-features/analytics.webp',
        id: 'analytics',
      },
      {
        title: 'Progress Tracking',
        text: 'Track client progress, quiz results, and course completion',
        imgSrc: '/images/landing-features/progress.webp',
        id: 'progress',
      },
    ],
    [],
  );

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) {
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
      const content = contentRef.current!;
      const img = imgRef.current;

      // Targets
      const header = section.querySelector<HTMLElement>('.section-header');
      const items = gsap.utils.toArray<HTMLElement>(
        content.querySelectorAll('.feature'),
      );

      // Initial states
      if (header) {
        gsap.set(header, { autoAlpha: 0, y: 18, filter: 'blur(10px)' });
      }
      gsap.set(items, {
        autoAlpha: 0,
        y: 14,
        filter: 'blur(8px)',
        willChange: 'transform, opacity, filter',
      });

      if (img) {
        gsap.set(img, {
          autoAlpha: 0,
          y: 18,
          scale: 0.985,
          filter: 'blur(10px)',
          willChange: 'transform, opacity, filter',
        });
      }

      const tl = gsap.timeline({ paused: true });

      // Header reveal
      if (header) {
        tl.to(header, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.75,
          ease: 'power3.out',
        });
      }

      // Items reveal (cinematic, one-by-one)
      tl.to(
        items,
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.65,
          ease: 'power3.out',
          stagger: 0.1,
          clearProps: 'willChange',
        },
        header ? '-=0.25' : 0,
      );

      // Illustration reveal (slightly delayed so it feels “behind” the list)
      if (img) {
        tl.to(
          img,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.95,
            ease: 'power3.out',
            clearProps: 'willChange',
          },
          '-=0.65',
        );
      }

      // Guard CSS transitions while GSAP runs
      const setRevealing = (on: boolean): void => {
        content.classList.toggle('is-revealing', on);
      };
      tl.eventCallback('onStart', () => setRevealing(true));
      tl.eventCallback('onComplete', () => setRevealing(false));
      tl.eventCallback('onReverseComplete', () => setRevealing(false));

      // Play / reverse trigger
      ScrollTrigger.create({
        trigger: section,
        start: 'top 62%',
        invalidateOnRefresh: true,
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
        onLeaveBack: () => tl.reverse(),
      });

      // Cinematic parallax on the illustration (very subtle)
      if (img) {
        gsap.to(img, {
          y: -14,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        // Ambient float while section is in view (slow)
        const floatTween = gsap.to(img, {
          y: '+=10',
          duration: 5.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          paused: true,
        });

        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            if (self.isActive) {
              floatTween.play();
            } else {
              floatTween.pause();
            }
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="features-section-wrapper max-w"
      ref={sectionRef}
      onMouseLeave={() => setActiveIndex(null)}
    >
      <SectionHeader
        position="left"
        title={
          <span>
            <span className="primary-word">Everything</span> you need. Nothing
            you don&apos;t.
          </span>
        }
        subtitle="All the infrastructure behind your universe"
      />

      <div className="features-img-wrapper" aria-hidden="true">
        <img
          ref={imgRef}
          src="/images/landing-features.webp"
          height={600}
          alt=""
        />
      </div>

      <div className="features-content" ref={contentRef}>
        {FEATURES.map((feat, index) => (
          <button
            key={index}
            type="button"
            className={clsx('feature', {
              'is-dimmed': activeIndex !== null && activeIndex !== index,
              'is-active': activeIndex === index,
            })}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onClick={() => onFeatureClick?.(feat, index)}
          >
            <span className="feature-rail" aria-hidden="true" />
            <img src={feat.imgSrc} width={50} className="feature-img" alt="" />
            <div className="feature-content-wrapper">
              <h3 className="feature-title">{feat.title}</h3>
              <p className="feature-text">{feat.text}</p>
            </div>
            <span className="feature-arrow" aria-hidden="true">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
