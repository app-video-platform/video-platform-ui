import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function usePlanetHeroAnimation() {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const host = heroRef.current;
    if (!host) {
      return;
    }

    const prefersReduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    )?.matches;
    if (prefersReduced) {
      return;
    }

    const finePointer =
      window.matchMedia?.('(pointer: fine)')?.matches ?? false;
    const hoverCapable =
      window.matchMedia?.('(hover: hover)')?.matches ?? false;

    const svg = host.querySelector<SVGSVGElement>('.about-hero__planet');
    if (!svg) {
      return;
    }

    const sphere = svg.querySelector<SVGElement>('.planet-sphere');
    const crescent = svg.querySelector<SVGElement>('.planet-crescent');
    const highlight = svg.querySelector<SVGElement>('.planet-highlight');
    const atmos = svg.querySelector<SVGElement>('.planet-atmos'); // optional
    const glow = svg.querySelector<SVGElement>('.planet-glow');
    const rings = svg.querySelectorAll<SVGElement>(
      '.planet-ring--a, .planet-ring--b',
    );
    const sheen = svg.querySelector<SVGElement>('.planet-ring--sheen');

    // Helper: stroke draw prep
    const prepStrokeDraw = (el: SVGElement) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyEl = el as any;
      const len = anyEl.getTotalLength?.();
      if (!len) {
        return 0;
      }
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      return len;
    };

    // --- Initial states ---
    gsap.set([sphere, crescent, highlight, atmos, glow], { autoAlpha: 0 });
    gsap.set(svg, { willChange: 'transform, opacity' });

    rings.forEach((r) => prepStrokeDraw(r));

    // Sheen setup (small dash segment traveling)
    let sheenLen = 0;
    if (sheen) {
      sheenLen = prepStrokeDraw(sheen);
      const seg = Math.max(80, Math.min(220, sheenLen * 0.08));
      gsap.set(sheen, {
        stroke: 'rgba(248, 249, 250, 0.28)',
        strokeDasharray: `${seg} ${Math.max(1, sheenLen - seg)}`,
        strokeDashoffset: sheenLen,
        opacity: 0,
      });
    }

    // --- Entrance timeline ---
    const enter = gsap.timeline({ paused: true });
    enter
      .fromTo(
        svg,
        { autoAlpha: 0, scale: 0.965 },
        { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power2.out' },
      )
      .to(
        rings,
        {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: 'power2.out',
          stagger: 0.08,
        },
        '-=0.55',
      )
      .to(sphere, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, '-=0.7')
      .to(
        crescent,
        { autoAlpha: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.55',
      )
      .to(
        highlight,
        { autoAlpha: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.5',
      )
      .to(atmos, { autoAlpha: 0.3, duration: 0.6, ease: 'power2.out' })
      .to(glow, { autoAlpha: 0.3, duration: 0.6, ease: 'power2.out' });

    // --- Idle loop ---
    const idle = gsap.timeline({ repeat: -1, repeatDelay: 1.4, paused: true });

    idle.to(
      [crescent, highlight],
      {
        opacity: '+=0.08',
        duration: 2.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
      },
      0,
    );

    if (sheen) {
      idle
        .to(sheen, { opacity: 1, duration: 0.35, ease: 'power1.out' }, 0.2)
        .to(
          sheen,
          { strokeDashoffset: 0, duration: 3.4, ease: 'sine.inOut' },
          0.25,
        )
        .to(sheen, { opacity: 0, duration: 0.5, ease: 'power1.out' }, '-=0.4')
        .set(sheen, { strokeDashoffset: sheenLen || 0 });
    }

    // --- ScrollTrigger controls ---
    const st = ScrollTrigger.create({
      trigger: host,
      start: 'top 70%',
      onEnter: () => {
        enter.play(0);
        idle.play(0);
      },
      onEnterBack: () => {
        enter.play(0);
        idle.play(0);
      },
      onLeave: () => idle.pause(),
      onLeaveBack: () => idle.pause(),
    });

    // --- Parallax (desktop only, subtle + inertial) ---
    // We gate parallax by pointer capability so we don't waste work on touch devices.
    let removeParallax: (() => void) | null = null;

    if (finePointer && hoverCapable) {
      // Smooth setters
      const toPlanetX = gsap.quickTo(svg, 'x', {
        duration: 0.9,
        ease: 'power3.out',
      });
      const toPlanetY = gsap.quickTo(svg, 'y', {
        duration: 0.9,
        ease: 'power3.out',
      });

      // Separate layer motion (slightly different depth)
      const toRingsX = gsap.quickTo(rings, 'x', {
        duration: 1.05,
        ease: 'power3.out',
      });
      const toRingsY = gsap.quickTo(rings, 'y', {
        duration: 1.05,
        ease: 'power3.out',
      });

      const toCresX = crescent
        ? gsap.quickTo(crescent, 'x', { duration: 1.1, ease: 'power3.out' })
        : null;
      const toCresY = crescent
        ? gsap.quickTo(crescent, 'y', { duration: 1.1, ease: 'power3.out' })
        : null;

      const toAtmosX = atmos
        ? gsap.quickTo(atmos, 'x', { duration: 1.2, ease: 'power3.out' })
        : null;
      const toAtmosY = atmos
        ? gsap.quickTo(atmos, 'y', { duration: 1.2, ease: 'power3.out' })
        : null;

      // Intensities (keep tiny)
      const MAX_PX = 8; // planet max movement
      const RING_PX = 11; // rings a touch more
      const ATMOS_PX = 14; // atmos/glow most

      const onMove = (e: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // Normalize -1..1
        const nx = (e.clientX - cx) / (rect.width / 2);
        const ny = (e.clientY - cy) / (rect.height / 2);

        // Clamp
        const x = Math.max(-1, Math.min(1, nx));
        const y = Math.max(-1, Math.min(1, ny));

        // Planet moves least
        toPlanetX(x * MAX_PX);
        toPlanetY(y * MAX_PX);

        // Rings slightly more (depth)
        toRingsX(x * RING_PX);
        toRingsY(y * RING_PX);

        // Crescent slightly less than rings (feels attached)
        toCresX?.(x * (MAX_PX * 0.75));
        toCresY?.(y * (MAX_PX * 0.75));

        // Atmos/glow most (if you kept it inside SVG)
        toAtmosX?.(x * ATMOS_PX);
        toAtmosY?.(y * ATMOS_PX);
      };

      const onLeave = () => {
        // Return to neutral gently
        toPlanetX(0);
        toPlanetY(0);
        toRingsX(0);
        toRingsY(0);
        toCresX?.(0);
        toCresY?.(0);
        toAtmosX?.(0);
        toAtmosY?.(0);
      };

      host.addEventListener('pointermove', onMove, { passive: true });
      host.addEventListener('pointerleave', onLeave, { passive: true });

      removeParallax = () => {
        host.removeEventListener('pointermove', onMove);
        host.removeEventListener('pointerleave', onLeave);
      };
    }

    return () => {
      removeParallax?.();
      st.kill();
      enter.kill();
      idle.kill();
    };
  }, []);

  return heroRef;
}
