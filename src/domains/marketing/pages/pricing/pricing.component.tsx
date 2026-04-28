import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import gsap from 'gsap';

import { Button } from '@shared/ui';
import { SectionHeader } from '@domains/marketing/shared';

import './pricing.styles.scss';

type PlanId = 'monthly' | 'bi-yearly' | 'yearly';

interface PricingPlan {
  id: PlanId;
  label: string;
  duration: string;
  price: string;
  description: string;
  badge?: string;
}

const PLANS: PricingPlan[] = [
  {
    id: 'monthly',
    label: 'Monthly',
    duration: '1 month',
    price: '$99',
    description: 'Pay monthly, no commitment. Perfect for trying the platform.',
  },
  {
    id: 'bi-yearly',
    label: 'Bi-yearly',
    duration: '6 months',
    price: '$499',
    description: 'Save 10% with a 6 month commitment and build momentum.',
    badge: 'Save 10%',
  },
  {
    id: 'yearly',
    label: 'Yearly',
    duration: '1 year',
    price: '$999',
    description: 'Best value. Save 20% with a yearly subscription.',
    badge: 'Best value',
  },
];

const getRelativePosition = (index: number, activeIndex: number) => {
  const diff = (index - activeIndex + PLANS.length) % PLANS.length;

  if (diff === 0) {
    return 'center';
  }
  if (diff === 1) {
    return 'right';
  }
  return 'left';
};

const POSITION_MAP = {
  left: {
    x: -340,
    y: 42,
    scale: 0.72,
    opacity: 0.48,
    zIndex: 1,
    rotation: -10,
  },
  center: {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    zIndex: 3,
    rotation: 0,
  },
  right: {
    x: 340,
    y: 42,
    scale: 0.72,
    opacity: 0.48,
    zIndex: 1,
    rotation: 10,
  },
};

export const Pricing: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [displayedIndex, setDisplayedIndex] = useState(1);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const planetRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const orbitRef = useRef<HTMLDivElement | null>(null);

  const activePlan = PLANS[displayedIndex];

  const setPlanetRef =
    (index: number) => (element: HTMLButtonElement | null) => {
      planetRefs.current[index] = element;
    };

  const goToPlan = (index: number) => {
    if (index === activeIndex) {
      return;
    }
    setActiveIndex(index);
  };

  const goPrev = () => {
    setActiveIndex((current) => (current - 1 + PLANS.length) % PLANS.length);
  };

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % PLANS.length);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      planetRefs.current.forEach((planet, index) => {
        if (!planet) {
          return;
        }

        const positionKey = getRelativePosition(index, activeIndex);
        const position = POSITION_MAP[positionKey];

        gsap.set(planet, {
          x: position.x,
          y: position.y,
          scale: position.scale,
          opacity: position.opacity,
          zIndex: position.zIndex,
          rotate: position.rotation,
        });
      });

      gsap.from('.orbit-pricing__title', {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      });

      gsap.from('.orbit-pricing__subtitle', {
        y: 18,
        opacity: 0,
        duration: 0.7,
        delay: 0.1,
        ease: 'power3.out',
      });

      gsap.from('.orbit-pricing__stage', {
        scale: 0.94,
        opacity: 0,
        duration: 0.8,
        delay: 0.18,
        ease: 'power3.out',
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          duration: 0.65,
          ease: 'power3.inOut',
        },
      });

      tl.to(detailsRef.current, {
        y: 12,
        opacity: 0,
        duration: 0.22,
        ease: 'power2.out',
        onComplete: () => {
          setDisplayedIndex(activeIndex);
        },
      });

      planetRefs.current.forEach((planet, index) => {
        if (!planet) {
          return;
        }

        const positionKey = getRelativePosition(index, activeIndex);
        const position = POSITION_MAP[positionKey];

        tl.to(
          planet,
          {
            x: position.x,
            y: position.y,
            scale: position.scale,
            opacity: position.opacity,
            rotate: position.rotation,
            zIndex: position.zIndex,
          },
          0,
        );
      });

      tl.to(
        orbitRef.current,
        {
          rotate: '+=18',
          duration: 0.75,
        },
        0,
      );

      tl.to(detailsRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: 'power3.out',
      });
    }, rootRef);

    return () => ctx.revert();
  }, [activeIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goPrev();
      }
      if (event.key === 'ArrowRight') {
        goNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const planets = useMemo(
    () =>
      PLANS.map((plan, index) => {
        const position = getRelativePosition(index, activeIndex);
        const isActive = position === 'center';

        return (
          <button
            key={plan.id}
            ref={setPlanetRef(index)}
            type="button"
            className={`orbit-pricing__planet orbit-pricing__planet--${plan.id} ${
              isActive ? 'orbit-pricing__planet--active' : ''
            }`}
            onClick={() => goToPlan(index)}
            aria-label={`Select ${plan.label} plan`}
          >
            {plan.badge && (
              <span className="orbit-pricing__badge">{plan.badge}</span>
            )}

            <span className="orbit-pricing__planet-price">{plan.price}</span>
            <span className="orbit-pricing__planet-duration">
              {plan.duration}
            </span>
          </button>
        );
      }),
    [activeIndex],
  );

  return (
    <section className="orbit-pricing" ref={rootRef}>
      <SectionHeader
        title={
          <span>
            Choose Your <span className="primary-word">Orbit</span>
          </span>
        }
        subtitle="Pick the subscription path that fits your launch plan."
      />

      <div className="orbit-pricing__stage">
        <div className="orbit-pricing__orbit" ref={orbitRef} />

        <button
          type="button"
          className="orbit-pricing__nav orbit-pricing__nav--left"
          onClick={goPrev}
          aria-label="Previous plan"
        >
          ‹
        </button>

        <div className="orbit-pricing__planets">{planets}</div>

        <button
          type="button"
          className="orbit-pricing__nav orbit-pricing__nav--right"
          onClick={goNext}
          aria-label="Next plan"
        >
          ›
        </button>
      </div>

      <div className="orbit-pricing__details" ref={detailsRef}>
        <span className="orbit-pricing__details-kicker">
          {activePlan.label}
        </span>
        <h2>{activePlan.duration}</h2>
        <p>{activePlan.description}</p>

        <div className="orbit-pricing__details-footer">
          <strong>{activePlan.price}</strong>
          <Button type="button" variant="primary">
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
