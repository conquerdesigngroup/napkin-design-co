'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

const FINE = '(pointer: fine)';
const REDUCE = '(prefers-reduced-motion: reduce)';

const subscribe = (cb: () => void) => {
  const queries = [matchMedia(FINE), matchMedia(REDUCE)];
  queries.forEach((q) => q.addEventListener('change', cb));
  return () => queries.forEach((q) => q.removeEventListener('change', cb));
};
const penAllowed = () => matchMedia(FINE).matches && !matchMedia(REDUCE).matches;
const serverSnapshot = () => false;

/* The pen cursor and its ballpoint trail. Fine pointers only, motion allowed only,
   so the elements themselves never exist on touch or under reduced motion.
   Canvas is sized from getBoundingClientRect, never innerWidth: scrollbars break alignment.
   Never replaces the focus outline. */
export default function PenCursor() {
  const on = useSyncExternalStore(subscribe, penAllowed, serverSnapshot);
  const cursor = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!on) return;
    const doc = document;
    const html = doc.documentElement;
    const body = doc.body;
    const cur = cursor.current;
    const tc = trail.current;
    if (!cur || !tc) return;
    const tctx = tc.getContext('2d');
    if (!tctx) return;

    html.classList.add('pen');

    let pts: { x: number; y: number; t: number }[] = [];
    let raf = false;
    let trailRaf = 0;
    let tvw = 0;
    let tvh = 0;

    const size = () => {
      const r = tc.getBoundingClientRect();
      // The trail is display:none while sketching. Writing a zero sized backing
      // store there would kill it permanently, so keep the last good size.
      if (r.width < 1 || r.height < 1) return;
      // Re-read: browser zoom and a move to another display both change this.
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const w = Math.round(r.width * dpr);
      const h = Math.round(r.height * dpr);
      tvw = r.width;
      tvh = r.height;
      // Assigning width or height resets the bitmap, so only write on a change.
      if (tc.width !== w || tc.height !== h) {
        tc.width = w;
        tc.height = h;
      }
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tctx.lineCap = 'round';
      tctx.lineJoin = 'round';
    };
    size();

    const drawTrail = () => {
      const now = performance.now();
      pts = pts.filter((p) => now - p.t < 800);
      tctx.clearRect(0, 0, tvw, tvh);
      for (let i = 1; i < pts.length; i++) {
        const a = 1 - (now - pts[i].t) / 800;
        tctx.strokeStyle = `rgba(122,147,255,${(a * 0.85).toFixed(3)})`;
        tctx.lineWidth = 1.6;
        tctx.beginPath();
        tctx.moveTo(pts[i - 1].x, pts[i - 1].y);
        tctx.lineTo(pts[i].x, pts[i].y);
        tctx.stroke();
      }
      if (pts.length > 1) trailRaf = requestAnimationFrame(drawTrail);
      else {
        trailRaf = 0;
        raf = false;
        tctx.clearRect(0, 0, tvw, tvh);
      }
    };

    const move = (e: PointerEvent) => {
      cur.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
      if (body.classList.contains('sketching')) return;
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (!raf) {
        raf = true;
        trailRaf = requestAnimationFrame(drawTrail);
      }
    };
    const over = (e: MouseEvent) => {
      cur.classList.toggle('hot', !!(e.target as Element)?.closest?.('a,button,summary'));
    };

    // Observe the element, not the window: CSS owns the box now, so writing the
    // width attribute cannot feed back into layout and re-trigger this.
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(size) : null;
    ro?.observe(tc);
    if (!ro) addEventListener('resize', size);
    visualViewport?.addEventListener('resize', size);
    doc.addEventListener('visibilitychange', size);
    addEventListener('pointermove', move, { passive: true });
    doc.addEventListener('mouseover', over);

    return () => {
      cancelAnimationFrame(trailRaf);
      html.classList.remove('pen');
      ro?.disconnect();
      removeEventListener('resize', size);
      visualViewport?.removeEventListener('resize', size);
      doc.removeEventListener('visibilitychange', size);
      removeEventListener('pointermove', move);
      doc.removeEventListener('mouseover', over);
    };
  }, [on]);

  if (!on) return null;

  return (
    <>
      <canvas id="trail" ref={trail} aria-hidden="true" />
      <div id="cursor" ref={cursor} aria-hidden="true" />
    </>
  );
}
