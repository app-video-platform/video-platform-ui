import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useWordCarousel(intervalSec = 2.0) {
  const trackRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const items = Array.from(track.children) as HTMLElement[];
    if (items.length <= 1) {
      return;
    }

    const itemHeight = items[0].getBoundingClientRect().height;
    if (!itemHeight) {
      return;
    }

    const tl = gsap.timeline({ repeat: -1 });

    // Start at 0
    gsap.set(track, { y: 0 });

    for (let i = 1; i < items.length; i++) {
      tl.to(
        track,
        {
          y: -itemHeight * i,
          duration: 0.6,
          ease: 'power3.inOut',
        },
        `+=${intervalSec}`,
      );
    }

    // Loop back to first
    tl.to(
      track,
      {
        y: 0,
        duration: 0.6,
        ease: 'power3.inOut',
      },
      `+=${intervalSec}`,
    );

    // ✅ cleanup must return void
    return () => {
      tl.kill();
    };
  }, [intervalSec]);

  return trackRef;
}
