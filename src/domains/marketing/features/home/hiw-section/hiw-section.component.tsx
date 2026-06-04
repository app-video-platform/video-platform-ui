/* eslint-disable max-len */
import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { HowItWorksProgress } from '../hiw-progress';

import './hiw-section.styles.scss';
import clsx from 'clsx';

gsap.registerPlugin(ScrollTrigger);

type Step = {
  num: string; // "01"
  title: string;
  desc?: { text: string; className?: string }[];
};

const STEPS: Step[] = [
  {
    num: '0',
    title: 'Intro',
  },
  {
    num: '1',
    title: 'Create',
    desc: [
      {
        text: 'Bring your idea to life with a product builder designed for clarity and ease.',
      },
      {
        text: 'Create structured courses or set up consultation schedules in minutes — without complicated tools or technical barriers. The interface is intuitive, flexible, and built for creators at every stage.',
        className: 'hiw-paragraph',
      },
      {
        text: 'Your product is the foundation of your business.',
        className: 'hiw-paragraph',
      },
      {
        text: 'We understand how much care goes into it — so we built a system that treats it with the same attention.',
      },
    ],
  },
  {
    num: '2',
    title: 'Customize',
    desc: [
      {
        text: 'Your product deserves a place that reflects it.',
      },
      {
        text: 'Design your storefront the way you envision it — choose a theme, apply your colors, upload your logo, and shape the experience around your brand.',
        className: 'hiw-paragraph',
      },
      {
        text: 'This is your space to present your work and share it with your audience. Build something that feels intentional and unmistakably yours — without bloated settings or confusing steps.',
        className: 'hiw-paragraph',
      },
    ],
  },
  {
    num: '3',
    title: 'Launch',
    desc: [
      {
        text: 'Share your storefront link and start welcoming customers.',
      },
      {
        text: 'Manage memberships, track revenue, monitor performance, and stay in control of your growing business — all from one place.',
        className: 'hiw-paragraph',
      },
      {
        text: 'You built it. Now let it work for you.',
        className: 'hiw-paragraph',
      },
    ],
  },
];

const INDICATOR_ROW_HEIGHT = 44;

const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [indicatorIndex, setIndicatorIndex] = useState(0);
  const [progressValue, setProgressValue] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) {
      return;
    }

    const intro = section.querySelector<HTMLElement>('[data-hiw-intro]');
    const introInner = section.querySelector<HTMLElement>(
      '[data-hiw-intro-inner]',
    );
    const introHeader = section.querySelector<HTMLElement>(
      '[data-hiw-intro-header]',
    );
    const headerSpike = section.querySelector<HTMLElement>(
      '[data-hiw-intro-header-spike]',
    );
    const introText = section.querySelector<HTMLElement>(
      '[data-hiw-intro-text]',
    );
    const introVisual = section.querySelector<HTMLElement>(
      '[data-hiw-intro-visual]',
    );
    const stage = section.querySelector<HTMLElement>('[data-hiw-stage]');
    const stepIndicator = section.querySelector<HTMLElement>(
      '[data-hiw-step-indicator]',
    );
    const progress = section.querySelector<HTMLElement>('[data-hiw-progress]');
    const steps = gsap.utils.toArray<HTMLElement>(
      section.querySelectorAll('[data-hiw-step]'),
    );

    if (
      !intro ||
      !introInner ||
      !introHeader ||
      !headerSpike ||
      !introText ||
      !introVisual ||
      !stage ||
      !stepIndicator ||
      !progress ||
      steps.length === 0
    ) {
      return;
    }

    // helpers
    const q = (el: Element, sel: string) =>
      el.querySelector(sel) as HTMLElement | null;

    // initial states
    gsap.set(stage, { autoAlpha: 1 });
    gsap.set(intro, { autoAlpha: 1 });
    gsap.set(introInner, { y: 0, scale: 1, transformOrigin: '50% 50%' });
    gsap.set(headerSpike, { width: 100, opacity: 1 });
    gsap.set(introHeader, { xPercent: -50, x: 0, y: 0 });
    gsap.set(introText, { autoAlpha: 0, y: 24 });
    gsap.set(introVisual, { autoAlpha: 0, x: -88, y: 12 });
    gsap.set(stepIndicator, { autoAlpha: 0, y: 18 });
    gsap.set(progress, { autoAlpha: 1, y: 0 });

    // steps start hidden
    steps.forEach((s, i) => {
      const text = q(s, '[data-step-text]');
      const visual = q(s, '[data-step-visual]');
      gsap.set(s, { autoAlpha: i === 0 ? 1 : 0 });
      gsap.set(text, { y: i === 0 ? 0 : 40, autoAlpha: i === 0 ? 1 : 0 });
      gsap.set(visual, {
        x: 0,
        y: i === 0 ? 0 : 24,
        autoAlpha: i === 0 ? 1 : 0,
        scale: i === 0 ? 1 : 0.985,
      });
    });

    const totalSegments = STEPS.length; // intro + each step "moment"

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
      });

      // =====================
      // SEGMENT 0: INTRO
      // =====================
      tl.addLabel('intro-in', 0);

      tl.to(
        introHeader,
        {
          x: -370,
          y: 250,
          duration: 0.3,
          ease: 'power2.out',
        },
        'intro-in',
      );
      tl.to(
        headerSpike,
        {
          width: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        },
        'intro-in',
      );
      tl.to(
        introText,
        {
          autoAlpha: 1,
          y: -80,
          duration: 0.2,
          ease: 'power2.out',
        },
        'intro-in+=0.04',
      );
      tl.to(
        introVisual,
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 0.26,
          ease: 'power3.out',
        },
        'intro-in+=0.02',
      );
      tl.to(
        introInner,
        {
          y: 0,
          scale: 1,
          duration: 0.18,
          ease: 'power3.out',
        },
        'intro-in',
      );

      tl.to({}, { duration: 0.22 });

      // Then fade out intro
      tl.to(
        intro,
        { autoAlpha: 0, duration: 0.18, ease: 'power2.out' },
        '>-0.05',
      );

      // =====================
      // SEGMENT 1: STEP 01 ENTER
      // =====================
      tl.addLabel('step-1', '>');
      tl.addLabel('indicator-show', 'step-1+=0.02');

      tl.to(
        stepIndicator,
        { autoAlpha: 1, y: 0, duration: 0.2, ease: 'power2.out' },
        'indicator-show',
      );

      tl.fromTo(
        steps[0],
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.01 },
        'step-1',
      );

      tl.fromTo(
        q(steps[0], '[data-step-text]'),
        { y: 44, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' },
        'step-1+=0.02',
      );

      tl.fromTo(
        q(steps[0], '[data-step-visual]'),
        { y: 28, autoAlpha: 0, scale: 0.985 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power3.out' },
        'step-1+=0.06',
      );

      // =====================
      // SEGMENT 2: TRANSITION 01 -> 02
      // =====================
      tl.addLabel('step-2', '>');
      animateStepTransition(tl, {
        fromStep: steps[0],
        toStep: steps[1],
        nextIndicatorIndex: 2,
      });

      // =====================
      // SEGMENT 3: TRANSITION 02 -> 03
      // =====================
      tl.addLabel('step-3', '>');
      animateStepTransition(tl, {
        fromStep: steps[1],
        toStep: steps[2],
        nextIndicatorIndex: 3,
      });

      // ScrollTrigger
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * totalSegments}`, // feel free to tune multiplier
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        animation: tl,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const currentTime = tl.time();
          const nextProgressValue = self.progress * (STEPS.length - 1);

          let nextIndicator = 0;
          if (currentTime >= tl.labels['step-3-change']) {
            nextIndicator = 3;
          } else if (currentTime >= tl.labels['step-2-change']) {
            nextIndicator = 2;
          } else if (currentTime >= tl.labels['indicator-show']) {
            nextIndicator = 1;
          }

          setIndicatorIndex((prev) =>
            prev === nextIndicator ? prev : nextIndicator,
          );
          setProgressValue((prev) =>
            prev === nextProgressValue ? prev : nextProgressValue,
          );
        },
      });
    }, section);

    return () => ctx.revert();

    // --------------------------
    // Transition builder
    // --------------------------
    function animateStepTransition(
      timeline: gsap.core.Timeline,
      opts: {
        fromStep: HTMLElement;
        toStep: HTMLElement;
        nextIndicatorIndex: number;
      },
    ) {
      const { fromStep, toStep, nextIndicatorIndex } = opts;

      const fromText = q(fromStep, '[data-step-text]');
      const fromVisual = q(fromStep, '[data-step-visual]');
      const toText = q(toStep, '[data-step-text]');
      const toVisual = q(toStep, '[data-step-visual]');

      // ensure next step is visible for its entrance
      timeline.set(toStep, { autoAlpha: 1 }, '>-0.01');

      // (A) Old content exits with lift first, then fades away.
      if (fromText) {
        timeline.to(
          fromText,
          { y: -72, autoAlpha: 0, duration: 0.4, ease: 'power2.in' },
          '<',
        );
      }
      if (fromVisual) {
        timeline.to(
          fromVisual,
          {
            y: -62,
            autoAlpha: 0,
            scale: 0.982,
            duration: 0.42,
            ease: 'power2.in',
          },
          '<+=0.02',
        );
      }

      timeline.addLabel(`step-${nextIndicatorIndex}-change`, '>-0.02');

      // (B) New content enters in one continuous glide so scrubbed scroll stays stable.
      if (toText) {
        timeline.fromTo(
          toText,
          { y: 68, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' },
          `step-${nextIndicatorIndex}-change`,
        );
      }
      if (toVisual) {
        timeline.fromTo(
          toVisual,
          { y: 76, autoAlpha: 0, scale: 0.965 },
          { y: 0, autoAlpha: 1, scale: 1, duration: 0.56, ease: 'power3.out' },
          `step-${nextIndicatorIndex}-change+=0.03`,
        );
      }

      // hide the old step wrapper (so only one "step stage" is visible)
      timeline.set(fromStep, { autoAlpha: 0 }, '>-0.01');
    }
  }, []);

  return (
    <section className="vp-hiw-section max-w" ref={sectionRef}>
      {/* INTRO: only header + subtext */}
      <div className="hiw-intro" data-hiw-intro>
        <div className="hiw-intro-inner" data-hiw-intro-inner>
          <div className="hiw-intro-content">
            <div className="hiw-intro-copy">
              <div className="hiw-intro-header" data-hiw-intro-header>
                <div
                  className="hiw-title-spike hiw-title-spike__left"
                  data-hiw-intro-header-spike
                />
                <h2 className="hiw-title">
                  From Idea to <span className="primary-word">Income</span>
                </h2>
                <div className="hiw-title-spike hiw-title-spike__right" />
              </div>
              <div className="hiw-subtitle" data-hiw-intro-text>
                <p>Every digital product begins with a few essential steps.</p>
                <p>
                  Below, you’ll see exactly how the platform helps you move from
                  idea to launch — in{' '}
                  <span className="primary-word">three easy steps</span>.
                </p>
                <p>No guesswork.</p>
                <p>
                  Each step builds upward, giving you structure, clarity, and
                  control as your business grows
                </p>
              </div>
            </div>
            <div
              className="hiw-intro-visual"
              data-hiw-intro-visual
              aria-label="How it works intro illustration placeholder"
            >
              <img src="/images/hiw.webp" width={700} />
            </div>
          </div>
        </div>
      </div>

      {/* STAGE: steps appear here */}
      <div className="hiw-stage" data-hiw-stage>
        <div className="hiw-fixed-ui">
          <div
            className="hiw-step-indicator"
            data-hiw-step-indicator
            aria-live="polite"
          >
            <span className="hiw-step-label">Step</span>
            <span className="hiw-step-label-0">0</span>
            <div className="hiw-num-mask">
              <div
                className="hiw-num-track"
                style={{
                  transform: `translateY(-${indicatorIndex * INDICATOR_ROW_HEIGHT}px)`,
                }}
              >
                {STEPS.map((step) => (
                  <span className="hiw-num-val" key={step.num}>
                    {step.num}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="hiw-progress-wrap" data-hiw-progress>
            <HowItWorksProgress
              progressValue={progressValue}
              className="hiw-progress"
            />
          </div>
        </div>

        {STEPS.filter((step) => step.num !== '0').map((s) => (
          <div className="hiw-step" key={s.num} data-hiw-step>
            <div className="hiw-inner">
              {/* LEFT */}
              <div className="hiw-left" data-step-text>
                <h3 className="hiw-step-title">{s.title}</h3>
                <div className="hiw-step-desc">
                  {s.desc &&
                    s.desc.map((d, index) => (
                      <p key={index} className={clsx(d.className)}>
                        {d.text}
                      </p>
                    ))}
                </div>
              </div>

              {/* RIGHT */}
              <div className="hiw-right" data-step-visual>
                <div
                  className="hiw-visual-card"
                  aria-label={`${s.title} visual placeholder`}
                >
                  <div className="hiw-visual-hint">Visual / UI container</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
