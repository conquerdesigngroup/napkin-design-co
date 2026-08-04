'use client';

import { useEffect, useRef } from 'react';
import { INTRO_MARK_D } from './logo-paths';

/* Intro: 3.5s at most, skippable, session-gated, honest progress.
   Bypassed entirely by reduced motion and by no-JS (see the noscript block in layout). */

const SESSION_KEY = 'napkin-intro';
let played = false; // survives a StrictMode remount, so the sequence never restarts

export default function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLBaseElement>(null);

  useEffect(() => {
    const doc = document;
    const html = doc.documentElement;
    const intro = root.current;
    const pctEl = pct.current;
    if (!intro || !pctEl) return;

    const nav = doc.getElementById('nav');
    const hero = doc.querySelector<HTMLElement>('.hero');
    const markPath = intro.querySelector<SVGPathElement>('.mark path');
    if (!nav || !hero || !markPath) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = played;
    try {
      seen = seen || sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      /* private mode: fall back to the in-memory flag */
    }

    const mobile = innerWidth < 700;
    const K = mobile ? 0.72 : 1; // mobile: shorter choreography
    let timers: ReturnType<typeof setTimeout>[] = [];
    let done = false;
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

    const remember = () => {
      played = true;
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* in-memory flag already set */
      }
    };

    const skip = (e: Event) => {
      if (e.type === 'keydown' && (e as KeyboardEvent).key === 'Tab') return;
      endState();
    };
    const events = ['pointerdown', 'keydown', 'wheel', 'touchmove'] as const;
    const addSkip = () => events.forEach((t) => addEventListener(t, skip, { passive: true }));
    const removeSkip = () => events.forEach((t) => removeEventListener(t, skip));

    function endState() {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      timers = [];
      html.classList.add('no-anim');
      intro!.classList.add('b1', 'b2', 'b3', 'gone');
      hero!.classList.add('on');
      nav!.style.opacity = '1';
      html.classList.remove('locked');
      remember();
      requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove('no-anim')));
      removeSkip();
    }

    function finishSequence() {
      if (done) return;
      later(() => intro!.classList.add('b2'), 0); // outline fills + sheen
      later(() => intro!.classList.add('b3'), 420 * K); // clip-path wipe
      later(() => hero!.classList.add('on'), (420 + 250) * K); // hero lines up from behind the mask
      later(() => {
        nav!.style.opacity = '1';
        html.classList.remove('locked');
        done = true;
        remember();
        removeSkip();
      }, (420 + 250 + 720) * K);
      later(() => intro!.classList.add('gone'), (420 + 620) * K);
    }

    if (reduce || seen) {
      endState();
      return () => {
        timers.forEach(clearTimeout);
        removeSkip();
      };
    }

    html.classList.add('locked');
    addSkip();
    const drawMs = Math.max(700 * K, 0);
    markPath.style.transitionDuration = drawMs + 'ms';
    intro.classList.add('b1');

    /* Honest progress: the target is the real readiness of what first paint needs, and
       the display chases it. Lazy images below the fold are deliberately excluded, since
       waiting on them would stall the counter on exactly the bytes we chose to defer.
       A watchdog guarantees the intro always completes even if an asset never resolves. */
    const eager = [...doc.images].filter((im) => im.loading !== 'lazy');
    const work: Promise<unknown>[] = eager.map((im) =>
      im.decode ? im.decode().catch(() => {}) : Promise.resolve(),
    );
    work.push(doc.fonts ? doc.fonts.ready.catch(() => {}) : Promise.resolve());

    let loaded = 0;
    const total = work.length;
    work.forEach((p) => p.then(() => loaded++));

    let forced = false;
    later(() => {
      forced = true;
    }, 2200 * K);

    const t0 = performance.now();
    let shown = 0;
    let prev = t0;
    let frame = 0;
    const step = (now: number) => {
      if (done) return;
      const dt = (now - prev) / 1000;
      prev = now;
      const target = forced ? 100 : (loaded / total) * 100;
      shown = Math.min(target, shown + dt * 230);
      pctEl.textContent = String(Math.floor(shown)).padStart(2, '0');
      if (shown >= 100) later(finishSequence, Math.max(0, drawMs - now + t0));
      else frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      removeSkip();
    };
  }, []);

  return (
    <div id="intro" ref={root} aria-hidden="true">
      <div className="wipe t" />
      <div className="wipe b" />
      <span className="counter">
        LOADING&ensp;<b id="pct" ref={pct as React.RefObject<HTMLElement>}>00</b>%
      </span>
      <div className="hairline" />
      <div className="mark">
        <svg viewBox="0 0 175.04 167.29" style={{ overflow: 'visible' }}>
          <path pathLength={1} d={INTRO_MARK_D} />
        </svg>
        <span className="gleam" />
      </div>
    </div>
  );
}
