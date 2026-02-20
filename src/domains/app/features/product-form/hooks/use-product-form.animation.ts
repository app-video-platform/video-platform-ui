import { useLayoutEffect, RefObject } from 'react';
import gsap from 'gsap';

export const useProductFormAnimation = (
  container: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  onComplete?: () => void,
) => {
  useLayoutEffect(() => {
    if (!enabled || !container.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 0.45 },
        onComplete,
      });

      // 1) header slides left (assuming you add a .product-builder-header wrapper)
      // tl.to(
      //   '.product-builder h1',
      //   {
      //     x: '-25%',
      //     textAlign: 'left',
      //     duration: 0.45,
      //   },
      //   0,
      // );

      // 2) fade out unselected bubbles
      // tl.to(
      //   '.product-type-option:not(.product-type-option__selected)',
      //   { opacity: 0, y: 20, duration: 0.35 },
      //   0,
      // );

      // // 3) shrink + lift selected bubble
      // tl.to(
      //   '.product-type-option__selected',
      //   {
      //     scale: 0.6,
      //     y: -40,
      //     duration: 0.45,
      //   },
      //   0,
      // );

      // // 4) move title input row up
      // tl.to(
      //   '.title-input-row',
      //   {
      //     y: -60,
      //     duration: 0.45,
      //   },
      //   0,
      // );

      // 5) sidebar in
      // tl.from(
      //   '.product-create-sidebar',
      //   { x: -40, opacity: 0, duration: 0.4 },
      //   '-=0.25',
      // );

      // 6) main section fade+stagger
      tl.from(
        '.product-create-section',
        { y: 20, opacity: 0, duration: 0.4 },
        '-=0.2',
      );
    }, container);

    return () => ctx.revert();
  }, [enabled, container, onComplete]);
};
