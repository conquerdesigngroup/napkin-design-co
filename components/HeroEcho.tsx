'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import HeadlineLockup from './HeadlineLockup';

/* Hero scroll-away echo.
   The headline leaves repeated ghosts behind as the hero scrolls out. The real
   h1 is never touched: it stays the single accessible heading, it paints at load
   with no layout shift, and the intro's line reveal is untouched. The ghosts are
   aria-hidden decoration, driven by transform and opacity only, gated by an
   IntersectionObserver so nothing runs once the hero is gone.

   Adapted from the Codrops Text Repetition Scroll Effect (MIT), rebuilt without
   GSAP and re-aimed at scroll-out rather than scroll-in, since the hero is
   already on screen at load and never enters the viewport from below. */

const REDUCE = '(prefers-reduced-motion: reduce)';
const subscribe = (cb: () => void) => {
  const q = matchMedia(REDUCE);
  q.addEventListener('change', cb);
  return () => q.removeEventListener('change', cb);
};
const motionOk = () => !matchMedia(REDUCE).matches;
const serverSnapshot = () => false;

const COPIES = 5;
const STEP = 0.22; // em of headline size that each ghost trails, at full spread
const PEAK = 0.5; // fraction of the hero scrolled out when the spread saturates
const MAX_ALPHA = 0.38; // nearest ghost; the rest ramp down from here

export default function HeroEcho() {
  const on = useSyncExternalStore(subscribe, motionOk, serverSnapshot);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!on) return;
    const layer = root.current;
    if (!layer) return;
    const hero = layer.closest<HTMLElement>('.hero');
    if (!hero) return;
    const copies = [...layer.querySelectorAll<HTMLElement>('.echo-copy')];
    if (!copies.length) return;

    let raf = 0;
    let running = false;
    let last = -1;

    const paint = () => {
      const r = hero.getBoundingClientRect();
      // 0 while the hero owns the viewport, 1 once it is PEAK of its own height out
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height * PEAK)));
      if (p !== last) {
        last = p;
        for (let i = 0; i < copies.length; i++) {
          const c = copies[i];
          c.style.transform = `translate3d(0,${(p * (i + 1) * STEP).toFixed(4)}em,0)`;
          c.style.opacity = (p * MAX_ALPHA * (1 - i / COPIES)).toFixed(3);
        }
      }
      raf = running ? requestAnimationFrame(paint) : 0;
    };

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0].isIntersecting;
        if (visible && !running) {
          running = true;
          raf = requestAnimationFrame(paint);
        } else if (!visible && running) {
          running = false;
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(hero);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [on]);

  // Pure motion decoration: under reduced motion there is nothing static worth showing.
  if (!on) return null;

  return (
    <div className="hero-echo display" aria-hidden="true" ref={root}>
      {Array.from({ length: COPIES }, (_, i) => (
        <span className="echo-copy" key={i}>
          <HeadlineLockup
            wrap={(line, j) => (
              <span className="echo-line" key={j}>
                {line}
              </span>
            )}
          />
        </span>
      ))}
    </div>
  );
}
