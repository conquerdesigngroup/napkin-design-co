'use client';

import { useEffect } from 'react';

/* Hero object: damped pointer tilt. Fine pointers only, motion allowed only. */
export default function HeroTilt() {
  useEffect(() => {
    const fine = matchMedia('(pointer: fine)').matches;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    const zone = document.querySelector<HTMLElement>('.hero');
    const tiltEl = document.querySelector<HTMLElement>('.tilt');
    if (!zone || !tiltEl) return;

    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      run = false,
      frame = 0;

    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      tiltEl.style.transform = `rotateY(${cx.toFixed(2)}deg) rotateX(${cy.toFixed(2)}deg)`;
      if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.01) frame = requestAnimationFrame(loop);
      else run = false;
    };

    const move = (e: PointerEvent) => {
      const r = zone.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 10;
      ty = -((e.clientY - r.top) / r.height - 0.5) * 8;
      if (!run) {
        run = true;
        frame = requestAnimationFrame(loop);
      }
    };
    const leave = () => {
      tx = 0;
      ty = 0;
    };

    zone.addEventListener('pointermove', move);
    zone.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(frame);
      zone.removeEventListener('pointermove', move);
      zone.removeEventListener('pointerleave', leave);
    };
  }, []);

  return null;
}
