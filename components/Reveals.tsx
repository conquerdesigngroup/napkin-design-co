'use client';

import { useEffect } from 'react';

/* Scroll reveals, the touch fallback for the service rows, and the work tile flip.
   IntersectionObserver only, never a scroll listener. */
export default function Reveals() {
  useEffect(() => {
    const doc = document;
    const coarse = matchMedia('(hover: none)').matches;

    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    );
    doc.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    /* touch devices: service rows resolve on scroll instead of hover */
    let sio: IntersectionObserver | undefined;
    if (coarse) {
      sio = new IntersectionObserver(
        (es) => es.forEach((e) => e.target.classList.toggle('resolved', e.isIntersecting)),
        { threshold: 0.6 },
      );
      doc.querySelectorAll('.svc').forEach((el) => sio!.observe(el));
    }

    const tiles = [...doc.querySelectorAll<HTMLButtonElement>('.tile')];
    const onTile = (e: Event) => {
      const t = e.currentTarget as HTMLButtonElement;
      const open = t.classList.toggle('flip');
      t.setAttribute('aria-expanded', String(open));
    };
    tiles.forEach((t) => t.addEventListener('click', onTile));

    return () => {
      io.disconnect();
      sio?.disconnect();
      tiles.forEach((t) => t.removeEventListener('click', onTile));
    };
  }, []);

  return null;
}
