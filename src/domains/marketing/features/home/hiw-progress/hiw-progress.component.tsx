import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import clsx from 'clsx';
import { HowItWorksIgnition } from '../hiw-ignition';
import './hiw-progress.styles.scss';

interface Props {
  progressValue: number;
  className?: string;
}

const NODE_COUNT = 4;

const HowItWorksProgress: React.FC<Props> = ({ progressValue, className }) => {
  const rocketRef = useRef<HTMLDivElement | null>(null);
  const rocketInnerRef = useRef<HTMLDivElement | null>(null);
  const previousProgressRef = useRef(progressValue);

  useEffect(() => {
    if (!rocketRef.current) {
      return;
    }

    const delta = progressValue - previousProgressRef.current;
    const direction =
      delta > 0.001 ? 1 : delta < -0.001 ? -1 : 0;

    gsap.to(rocketRef.current, {
      left: `${(Math.max(0, Math.min(progressValue, NODE_COUNT - 1)) / (NODE_COUNT - 1)) * 100}%`,
      duration: 0.18,
      ease: 'none',
      overwrite: 'auto',
    });

    if (rocketInnerRef.current) {
      gsap.to(rocketInnerRef.current, {
        rotation: direction >= 0 ? 90 : -90,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
        transformOrigin: '50% 50%',
      });
    }

    // subtle ignition pulse
    gsap.fromTo(
      rocketRef.current,
      { scale: 0.92 },
      { scale: 1, duration: 0.2, ease: 'power2.out', overwrite: 'auto' },
    );

    previousProgressRef.current = progressValue;
  }, [progressValue]);

  return (
    <div className={clsx('hiw-progress', className)}>
      <div className="hiw-progress__line" />

      {Array.from({ length: NODE_COUNT }, (_, i) => (
        <div
          key={i}
          className={clsx('hiw-progress__node', {
            'is-active': progressValue >= i,
          })}
          style={{ left: `${(i / (NODE_COUNT - 1)) * 100}%` }}
        />
      ))}

      <div ref={rocketRef} className="hiw-progress__rocket">
        <div ref={rocketInnerRef} className="hiw-progress__rocketInner">
          <HowItWorksIgnition activeIndex={Math.round(progressValue) as 0 | 1 | 2 | 3} />
        </div>
      </div>
    </div>
  );
};

export default HowItWorksProgress;
