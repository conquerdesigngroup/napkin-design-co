'use client';

import { useEffect, useRef } from 'react';

/* Signature: "Sketch it."
   Draw in ballpoint anywhere. Two seconds of stillness and the wobble resolves
   into a smoothed glass stroke: napkin to glass, by your own hand.

   Geometry note that matters: a canvas is a replaced element, so inset:0 alone
   never sizes it. globals.css gives both canvases an explicit 100% box. Here we
   only ever measure with getBoundingClientRect, never innerWidth, so a classic
   scrollbar cannot shift the ink away from the pointer. */

type Pt = { x: number; y: number };
type Stroke = {
  pts: Pt[];
  w: number[];
  resolved: boolean;
  raw?: Pt[];
  smooth?: Pt[];
  t0?: number;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* Ballpoint width band, plus or minus about 25 percent around 2px. Wider reads as
   a brush and breaks the concept. */
const W_BASE = 2.2;
const W_FAST = 1.4;
const W_SLOW = 2.4;

export default function SketchMode() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const clearBtn = useRef<HTMLButtonElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const status = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const doc = document;
    const body = doc.body;
    const cv = canvas.current;
    const toggleEl = toggle.current;
    const clearEl = clearBtn.current;
    const labelEl = label.current;
    const statusEl = status.current;
    if (!cv || !toggleEl || !clearEl || !labelEl || !statusEl) return;
    const ctx2d = cv.getContext('2d');
    if (!ctx2d) return;
    // Bind to a typed const: narrowing does not reach the hoisted paint helpers below.
    const ctx: CanvasRenderingContext2D = ctx2d;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const RESOLVE_MS = reduce ? 40 : 600;
    const IDLE_MS = reduce ? 50 : 2000;

    let strokes: Stroke[] = [];
    let drawing: Stroke | null = null;
    let activeId: number | null = null;
    let idleT: ReturnType<typeof setTimeout> | undefined;
    let svw = 0;
    let svh = 0;

    /* ---------- geometry ---------- */

    const sizeToBox = () => {
      const r = cv.getBoundingClientRect();
      // The box is zero while the element is hidden. Writing 0 would drop the
      // bitmap, so leave the last good size in place and come back later.
      if (r.width < 1 || r.height < 1) return;
      // Re-read every time: browser zoom and a move to another display both
      // change devicePixelRatio, and a stale value misplaces every point.
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(r.width * dpr));
      const h = Math.max(1, Math.round(r.height * dpr));
      svw = r.width;
      svh = r.height;
      // Assigning width or height resets the bitmap and erases the ink, so only
      // write on a real change. This also makes a repeat call a no-op.
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      requestPaint();
    };

    /* ---------- one render loop, driven by a dirty flag ----------
       Input handlers never paint. They mark the frame dirty and return, so a
       120Hz pointer cannot fork extra animation frames or starve the input queue. */

    let rafId = 0;
    let dirty = true;
    let disposed = false;

    function requestPaint() {
      dirty = true;
      if (!rafId && !disposed) rafId = requestAnimationFrame(frame);
    }

    function frame() {
      if (disposed) {
        rafId = 0;
        return;
      }
      dirty = false;
      const animating = paint();
      rafId = animating || dirty ? requestAnimationFrame(frame) : 0;
    }

    /* ---------- stroke geometry helpers ---------- */

    const resample = (pts: Pt[], step: number): Pt[] => {
      if (pts.length < 2) return pts.slice();
      const out = [pts[0]];
      let d = 0;
      for (let i = 1; i < pts.length; i++) {
        let a = pts[i - 1];
        const b = pts[i];
        let seg = Math.hypot(b.x - a.x, b.y - a.y);
        while (d + seg >= step) {
          const t = (step - d) / seg;
          const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
          out.push(p);
          a = p;
          seg = Math.hypot(b.x - a.x, b.y - a.y);
          d = 0;
        }
        d += seg;
      }
      out.push(pts[pts.length - 1]);
      return out;
    };

    const chaikin = (pts: Pt[]): Pt[] => {
      if (pts.length < 3) return pts.slice();
      const out = [pts[0]];
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        out.push(
          { x: a.x * 0.75 + b.x * 0.25, y: a.y * 0.75 + b.y * 0.25 },
          { x: a.x * 0.25 + b.x * 0.75, y: a.y * 0.25 + b.y * 0.75 },
        );
      }
      out.push(pts[pts.length - 1]);
      return out;
    };

    const toN = (pts: Pt[], n: number): Pt[] => {
      const out: Pt[] = [];
      if (!pts.length) return out;
      for (let i = 0; i < n; i++) {
        const f = n === 1 ? 0 : (i / (n - 1)) * (pts.length - 1);
        const j = Math.floor(f);
        const t = f - j;
        const a = pts[j];
        const b = pts[Math.min(j + 1, pts.length - 1)];
        out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
      return out;
    };

    const lengthOf = (pts: Pt[]) => {
      let len = 0;
      for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      return len;
    };

    /* Quadratic through segment midpoints: the same op count as lineTo, with no
       visible corners. This is what stops the wet stroke reading as a polygon. */
    const path = (p: Pt[]) => {
      const n = p.length;
      ctx.beginPath();
      ctx.moveTo(p[0].x, p[0].y);
      if (n === 1 || (p[0].x === p[n - 1].x && p[0].y === p[n - 1].y && n < 3)) {
        // a tap: a hair of length so the round cap paints a dot
        ctx.lineTo(p[0].x + 0.01, p[0].y);
        return;
      }
      if (n < 3) {
        ctx.lineTo(p[n - 1].x, p[n - 1].y);
        return;
      }
      for (let i = 1; i < n - 2; i++) {
        ctx.quadraticCurveTo(p[i].x, p[i].y, (p[i].x + p[i + 1].x) / 2, (p[i].y + p[i + 1].y) / 2);
      }
      ctx.quadraticCurveTo(p[n - 2].x, p[n - 2].y, p[n - 1].x, p[n - 1].y);
    };

    /* Wet ink only. Canvas cannot vary lineWidth inside one path, so each segment
       is its own stroke. Consecutive segments share an exact endpoint and the caps
       are round, so the seams are invisible. */
    const paintVariable = (p: Pt[], w: number[], alpha: number) => {
      const n = p.length;
      ctx.strokeStyle = `rgba(122,147,255,${(0.86 * alpha).toFixed(3)})`;
      if (n < 3) {
        ctx.lineWidth = w[0] ?? W_BASE;
        path(p);
        ctx.stroke();
        return;
      }
      ctx.beginPath();
      ctx.moveTo(p[0].x, p[0].y);
      ctx.quadraticCurveTo(p[0].x, p[0].y, (p[0].x + p[1].x) / 2, (p[0].y + p[1].y) / 2);
      ctx.lineWidth = w[0] ?? W_BASE;
      ctx.stroke();
      for (let i = 1; i < n - 1; i++) {
        const m0 = { x: (p[i - 1].x + p[i].x) / 2, y: (p[i - 1].y + p[i].y) / 2 };
        const m1 = { x: (p[i].x + p[i + 1].x) / 2, y: (p[i].y + p[i + 1].y) / 2 };
        ctx.beginPath();
        ctx.moveTo(m0.x, m0.y);
        ctx.quadraticCurveTo(p[i].x, p[i].y, m1.x, m1.y);
        ctx.lineWidth = w[i] ?? W_BASE;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo((p[n - 2].x + p[n - 1].x) / 2, (p[n - 2].y + p[n - 1].y) / 2);
      ctx.lineTo(p[n - 1].x, p[n - 1].y);
      ctx.lineWidth = w[n - 1] ?? W_BASE;
      ctx.stroke();
    };

    /* Returns true while any stroke is still morphing. */
    function paint(): boolean {
      ctx.clearRect(0, 0, svw, svh);
      const now = performance.now();
      let live = false;

      for (const s of strokes) {
        let k = 0;
        let p = s.pts;
        if (s.resolved && s.raw && s.smooth) {
          k = easeOut(Math.min(1, (now - s.t0!) / RESOLVE_MS));
          if (k < 1) live = true;
          p = s.raw.map((r, i) => ({
            x: r.x + (s.smooth![i].x - r.x) * k,
            y: r.y + (s.smooth![i].y - r.y) * k,
          }));
        }
        if (!p.length) continue;

        if (k < 1) {
          // wet ballpoint: the accent hue at depth, never an off token blue
          paintVariable(p, s.w, 1 - k * 0.9);
        }

        if (k > 0) {
          // glass: glow, tube, specular. The glow is layered strokes rather than
          // shadowBlur, which reads the same at this width and costs far less.
          ctx.globalAlpha = k;
          ctx.strokeStyle = 'rgba(122,147,255,.05)';
          ctx.lineWidth = 22;
          path(p);
          ctx.stroke();
          ctx.strokeStyle = 'rgba(122,147,255,.10)';
          ctx.lineWidth = 14;
          path(p);
          ctx.stroke();
          ctx.strokeStyle = 'rgba(122,147,255,.18)';
          ctx.lineWidth = 8;
          path(p);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(196,209,255,.9)';
          ctx.lineWidth = 3.2;
          path(p);
          ctx.stroke();

          // specular, inset from the caps so it cannot escape the tube at the tips
          ctx.strokeStyle = 'rgba(255,255,255,.92)';
          ctx.lineWidth = 1.1;
          ctx.save();
          ctx.translate(-0.5, -0.65);
          path(p.length > 6 ? p.slice(1, -1) : p);
          ctx.stroke();
          ctx.restore();
          ctx.globalAlpha = 1;
        }
      }
      return live;
    }

    /* ---------- napkin to glass ---------- */

    function resolveAll() {
      let any = false;
      for (const s of strokes) {
        if (s.resolved) continue;
        const r = s.pts.length >= 2 ? resample(s.pts, 5) : s.pts.slice();
        const len = lengthOf(r);
        // Idealize from a coarser skeleton so the resolve is a real straightening,
        // not a rounding. Small marks keep their character, gestures get corrected.
        const step = Math.min(12, Math.max(5, len / 18));
        const coarse = s.pts.length >= 2 ? resample(s.pts, step) : s.pts.slice();
        const sm = coarse.length >= 3 ? chaikin(chaikin(chaikin(coarse))) : coarse;
        const n = Math.max(r.length, 8);
        s.raw = toN(r, n);
        // arc length align the target so every point travels straight to where it belongs
        s.smooth = toN(len > 0 ? resample(sm, Math.max(0.5, len / (n - 1))) : sm, n);
        s.resolved = true;
        s.t0 = performance.now();
        any = true;
      }
      if (any) {
        announce('Sketch resolved to glass.');
        requestPaint();
      }
    }

    const armIdle = () => {
      clearTimeout(idleT);
      idleT = setTimeout(resolveAll, IDLE_MS);
    };

    /* ---------- state projection ---------- */

    let lastSaid = '';
    function announce(msg: string) {
      if (msg === lastSaid) return;
      lastSaid = msg;
      statusEl!.textContent = msg;
    }

    const syncInk = () => {
      body.classList.toggle('has-sketch', strokes.length > 0);
    };

    /* Ends the live stroke wherever it is: pointer up, cancel, Escape, or the toggle.
       Declared as a const so cv stays narrowed. */
    const endStroke = () => {
      if (!drawing) return;
      if (activeId !== null) {
        try {
          cv.releasePointerCapture(activeId);
        } catch {
          /* already released */
        }
      }
      activeId = null;
      drawing = null;
      syncInk();
      armIdle();
    };

    function setMode(on: boolean) {
      body.classList.toggle('sketching', on);
      toggleEl!.setAttribute('aria-pressed', String(on));
      labelEl!.textContent = on ? 'Put the pen down' : 'Sketch on the site';
      announce(on ? 'Sketch mode on. Draw anywhere on the page.' : 'Sketch mode off.');
      if (!on) endStroke();
    }

    /* ---------- input ---------- */

    let lastT = 0;
    let lastW = W_BASE;

    const addPoint = (x: number, y: number, t: number, pressure: number, type: string) => {
      if (!drawing) return;
      const last = drawing.pts[drawing.pts.length - 1];
      const d = Math.hypot(x - last.x, y - last.y);
      if (d <= 1.2) return;
      const dt = Math.max(1, t - lastT);
      lastT = t;
      const v = d / dt; // px per ms
      // A mouse reports a flat 0.5 per spec, so only trust a real stylus.
      const stylus = type === 'pen' && pressure > 0 && pressure !== 0.5;
      const target = stylus ? 1.5 + pressure * 1.5 : W_SLOW - Math.min(1, v / 1.6) * (W_SLOW - W_FAST);
      lastW += (target - lastW) * 0.25; // damped, so the width never flickers
      drawing.pts.push({ x, y });
      drawing.w.push(lastW);
    };

    const onDown = (e: PointerEvent) => {
      if (!body.classList.contains('sketching')) return;
      if (drawing) return; // one stroke at a time
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      try {
        cv.setPointerCapture(e.pointerId);
      } catch {
        /* synthetic or already released pointer */
      }
      activeId = e.pointerId;
      clearTimeout(idleT);
      lastT = e.timeStamp || performance.now();
      lastW = W_BASE;
      drawing = { pts: [{ x: e.clientX, y: e.clientY }], w: [W_BASE], resolved: false };
      strokes.push(drawing);
      syncInk();
      requestPaint();
    };

    const onMove = (e: PointerEvent) => {
      if (!drawing || e.pointerId !== activeId) return;
      // Recover the samples the browser merged into this dispatch, so a fast drag
      // is a curve rather than a few long facets.
      const co = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [];
      const list = co.length ? co : [e];
      for (const s of list) {
        addPoint(s.clientX, s.clientY, s.timeStamp || e.timeStamp, s.pressure, e.pointerType);
      }
      requestPaint();
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== activeId) return;
      endStroke();
    };

    const onToggle = () => setMode(!body.classList.contains('sketching'));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && body.classList.contains('sketching')) setMode(false);
    };
    const onClear = () => {
      strokes = [];
      drawing = null;
      activeId = null;
      clearTimeout(idleT);
      syncInk();
      announce('Sketch cleared.');
      requestPaint();
      // Clear is about to hide itself, so hand focus somewhere real.
      if (doc.activeElement === clearEl) toggleEl.focus();
    };

    /* ---------- wiring ---------- */

    sizeToBox();

    /* A window resize is not the only thing that changes the box: a scrollbar
       appearing or the visual viewport shifting does too, so observe the element.
       Sizing runs straight from the observer rather than through a frame: now that
       CSS owns the box, writing the width attribute no longer feeds back into
       layout, so this cannot re-trigger itself, and a resize while the tab is
       hidden is applied immediately instead of waiting for frames to resume. */
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sizeToBox) : null;
    ro?.observe(cv);
    if (!ro) addEventListener('resize', sizeToBox);
    visualViewport?.addEventListener('resize', sizeToBox);
    doc.addEventListener('visibilitychange', sizeToBox);
    toggleEl.addEventListener('click', onToggle);
    addEventListener('keydown', onKey);
    clearEl.addEventListener('click', onClear);
    cv.addEventListener('pointerdown', onDown);
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerup', onUp);
    cv.addEventListener('pointercancel', onUp);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(idleT);
      ro?.disconnect();
      removeEventListener('resize', sizeToBox);
      visualViewport?.removeEventListener('resize', sizeToBox);
      doc.removeEventListener('visibilitychange', sizeToBox);
      toggleEl.removeEventListener('click', onToggle);
      removeEventListener('keydown', onKey);
      clearEl.removeEventListener('click', onClear);
      cv.removeEventListener('pointerdown', onDown);
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerup', onUp);
      cv.removeEventListener('pointercancel', onUp);
      body.classList.remove('sketching', 'has-sketch');
    };
  }, []);

  return (
    <>
      <canvas id="sketch-canvas" ref={canvas} aria-hidden="true" />
      <p className="sketch-hint mono" aria-hidden="true">
        Draw anywhere. Stop for two seconds and watch it turn to glass. Esc to put the pen down.
      </p>
      <div className="sketch-fab">
        <button id="sketch-toggle" ref={toggle} className="glass" aria-pressed="false" type="button">
          <svg className="pen-ico" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M3,17 L4.2,12.8 L13.5,3.5 C14.4,2.6 15.8,2.6 16.6,3.5 C17.4,4.3 17.4,5.7 16.6,6.5 L7.2,15.8 Z M12.2,4.8 L15.2,7.8" />
          </svg>
          <span id="sketch-label" ref={label}>
            Sketch on the site
          </span>
        </button>
        <button id="sketch-clear" ref={clearBtn} className="glass" aria-label="Clear your sketch" type="button">
          Clear
        </button>
      </div>
      <p className="visually-hidden" role="status" id="sketch-status" ref={status} />
    </>
  );
}
