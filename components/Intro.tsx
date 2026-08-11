'use client';

import { useEffect, useRef } from 'react';
import { INTRO_MARK_D } from './logo-paths';

/* Intro: 3.5s at most, skippable, session-gated, honest progress.
   Bypassed entirely by reduced motion and by no-JS (see the noscript block in layout). */

const SESSION_KEY = 'napkin-intro';
let played = false; // survives a StrictMode remount, so the sequence never restarts

/* Beat 4, the keycap rain. Deterministic scatter, no randomness: position in
   viewport units, size in px (CSS scales it down under 700px), a falling and a
   landed rotation, and the stagger. The SEO cap is largest, lands last, and sits
   near the zoom origin, since it is the hero's own object. */
const RAIN = [
  { src: '/keycaps/cta.webp', left: '7vw', top: '12vh', w: '96px', r0: '-32deg', r1: '-18deg', delay: 0 },
  { src: '/keycaps/photo.webp', left: '76vw', top: '9vh', w: '104px', r0: '26deg', r1: '13deg', delay: 70 },
  { src: '/keycaps/brand.webp', left: '14vw', top: '56vh', w: '126px', r0: '-16deg', r1: '-8deg', delay: 140 },
  { src: '/keycaps/design.webp', left: '36vw', top: '16vh', w: '86px', r0: '38deg', r1: '22deg', delay: 210 },
  { src: '/keycaps/social.webp', left: '67vw', top: '52vh', w: '110px', r0: '-26deg', r1: '-12deg', delay: 280 },
  { src: '/keycaps/ai.webp', left: '87vw', top: '30vh', w: '90px', r0: '14deg', r1: '6deg', delay: 350 },
  { src: '/keycaps/seo.webp', left: '41vw', top: '36vh', w: '158px', r0: '18deg', r1: '5deg', delay: 460 },
];

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
      intro!.classList.add('b1', 'b2', 'b3', 'b4', 'b5', 'gone');
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
      later(() => intro!.classList.add('b3'), 420 * K); // clip-path wipe opens onto the page

      /* b4: the keycaps rain onto the page. JS owns duration and delay so the
         mobile K factor compresses the whole choreography coherently; CSS owns
         the curve and the geometry, same split as the mark draw above. */
      later(() => {
        intro!.querySelectorAll<HTMLElement>('.stage img').forEach((c, i) => {
          c.style.transitionDuration = `${Math.round(620 * K)}ms`;
          c.style.transitionDelay = `${Math.round(RAIN[i].delay * K)}ms`;
        });
        intro!.classList.add('b4');
      }, 460 * K);

      /* b5: the camera pushes through the caps. Last cap lands at ~1540, the
         180ms breath before this is deliberate. */
      later(() => {
        const stage = intro!.querySelector<HTMLElement>('.stage');
        if (stage) {
          stage.style.transitionDuration = `${Math.round(850 * K)}ms, ${Math.round(320 * K)}ms`;
          stage.style.transitionDelay = `0ms, ${Math.round(400 * K)}ms`;
        }
        intro!.classList.add('b5');
      }, 1720 * K);

      later(() => hero!.classList.add('on'), 1940 * K); // headline rises mid-zoom
      later(() => {
        nav!.style.opacity = '1';
        html.classList.remove('locked');
        done = true;
        remember();
        removeSkip();
      }, 2570 * K);
      later(() => intro!.classList.add('gone'), 2600 * K);
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
      {/* b4/b5 stage: eager on purpose, so the honest progress counter above
          genuinely waits for the caps it is about to drop */}
      <div className="stage">
        {RAIN.map((k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={k.src}
            src={k.src}
            alt=""
            style={
              {
                left: k.left,
                top: k.top,
                '--w': k.w,
                '--r0': k.r0,
                '--r1': k.r1,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
