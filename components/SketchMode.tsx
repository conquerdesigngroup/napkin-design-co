'use client';

import { useEffect, useRef } from 'react';

/* Signature: "Sketch it."
   Draw in ballpoint anywhere. Two seconds of stillness and the wobble resolves
   into a smoothed glass stroke: napkin to glass, by your own hand. */

type Pt = { x: number; y: number };
type Stroke = { pts: Pt[]; resolved: boolean; raw?: Pt[]; smooth?: Pt[]; t0?: number };

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

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
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let strokes: Stroke[] = [];
    let drawing: Stroke | null = null;
    let idleT: ReturnType<typeof setTimeout> | undefined;
    let svw = 0;
    let svh = 0;

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
      for (let i = 0; i < n; i++) {
        const f = (i / (n - 1)) * (pts.length - 1);
        const j = Math.floor(f);
        const t = f - j;
        const a = pts[j];
        const b = pts[Math.min(j + 1, pts.length - 1)];
        out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
      return out;
    };

    const path = (p: Pt[]) => {
      ctx.beginPath();
      ctx.moveTo(p[0].x, p[0].y);
      for (let i = 1; i < p.length; i++) ctx.lineTo(p[i].x, p[i].y);
    };

    function render() {
      ctx!.clearRect(0, 0, svw, svh);
      const now = performance.now();
      let live = false;
      for (const s of strokes) {
        let k = 0;
        let p = s.pts;
        if (s.resolved && s.raw && s.smooth) {
          k = easeOut(Math.min(1, (now - s.t0!) / (reduce ? 40 : 600)));
          if (k < 1) live = true;
          p = s.raw.map((r, i) => ({
            x: r.x + (s.smooth![i].x - r.x) * k,
            y: r.y + (s.smooth![i].y - r.y) * k,
          }));
        }
        if (p.length < 2) continue;
        if (k < 1) {
          ctx!.globalAlpha = 1 - k * 0.9;
          ctx!.strokeStyle = '#4A66E8';
          ctx!.lineWidth = 2;
          path(p);
          ctx!.stroke();
        }
        if (k > 0) {
          // glass stroke: glow, tube, specular
          ctx!.globalAlpha = k;
          ctx!.save();
          ctx!.shadowColor = 'rgba(122,147,255,.9)';
          ctx!.shadowBlur = 16;
          ctx!.strokeStyle = 'rgba(122,147,255,.22)';
          ctx!.lineWidth = 9;
          path(p);
          ctx!.stroke();
          ctx!.restore();
          ctx!.strokeStyle = 'rgba(196,209,255,.9)';
          ctx!.lineWidth = 3.2;
          path(p);
          ctx!.stroke();
          ctx!.strokeStyle = 'rgba(255,255,255,.92)';
          ctx!.lineWidth = 1.1;
          ctx!.save();
          ctx!.translate(-0.7, -0.9);
          path(p);
          ctx!.stroke();
          ctx!.restore();
        }
        ctx!.globalAlpha = 1;
      }
      if (live) requestAnimationFrame(render);
    }

    const size = () => {
      const r = cv.getBoundingClientRect();
      svw = r.width;
      svh = r.height;
      cv.width = Math.round(svw * dpr);
      cv.height = Math.round(svh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      render();
    };
    size();

    function resolveAll() {
      let any = false;
      for (const s of strokes) {
        if (s.resolved || s.pts.length < 4) continue;
        const r = resample(s.pts, 5);
        const sm = chaikin(chaikin(r));
        const n = Math.max(r.length, 8);
        s.raw = toN(r, n);
        s.smooth = toN(sm, n);
        s.resolved = true;
        s.t0 = performance.now();
        any = true;
      }
      if (any) {
        statusEl!.textContent = 'Sketch resolved to glass.';
        requestAnimationFrame(render);
      }
    }
    const armIdle = () => {
      clearTimeout(idleT);
      idleT = setTimeout(resolveAll, reduce ? 50 : 2000);
    };

    function setMode(on: boolean) {
      body.classList.toggle('sketching', on);
      toggleEl!.setAttribute('aria-pressed', String(on));
      labelEl!.textContent = on ? 'Put the pen down' : 'Sketch on the site';
      statusEl!.textContent = on ? 'Sketch mode on. Draw anywhere on the page.' : 'Sketch mode off.';
      if (!on) {
        drawing = null;
        resolveAll();
      }
    }

    const onToggle = () => setMode(!body.classList.contains('sketching'));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && body.classList.contains('sketching')) setMode(false);
    };
    const onClear = () => {
      strokes = [];
      body.classList.remove('has-sketch');
      render();
      statusEl.textContent = 'Sketch cleared.';
    };
    const onDown = (e: PointerEvent) => {
      if (!body.classList.contains('sketching')) return;
      cv.setPointerCapture(e.pointerId);
      clearTimeout(idleT);
      drawing = { pts: [{ x: e.clientX, y: e.clientY }], resolved: false };
      strokes.push(drawing);
      render();
    };
    const onMove = (e: PointerEvent) => {
      if (!drawing) return;
      const last = drawing.pts[drawing.pts.length - 1];
      if (Math.hypot(e.clientX - last.x, e.clientY - last.y) > 1.5) {
        drawing.pts.push({ x: e.clientX, y: e.clientY });
        render();
      }
    };
    const up = () => {
      if (!drawing) return;
      drawing = null;
      body.classList.add('has-sketch');
      armIdle();
    };

    addEventListener('resize', size);
    toggleEl.addEventListener('click', onToggle);
    addEventListener('keydown', onKey);
    clearEl.addEventListener('click', onClear);
    cv.addEventListener('pointerdown', onDown);
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);

    return () => {
      clearTimeout(idleT);
      body.classList.remove('sketching', 'has-sketch');
      removeEventListener('resize', size);
      toggleEl.removeEventListener('click', onToggle);
      removeEventListener('keydown', onKey);
      clearEl.removeEventListener('click', onClear);
      cv.removeEventListener('pointerdown', onDown);
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerup', up);
      cv.removeEventListener('pointercancel', up);
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
