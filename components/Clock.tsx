'use client';

import { useEffect, useRef } from 'react';

/* Live local clock in the hero meta strip. Renders the placeholder on the server
   so the markup is real and the value never causes a hydration mismatch. */
export default function Clock() {
  const el = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const fmt = new Intl.DateTimeFormat([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => {
      node.textContent = fmt.format(new Date());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <b id="clock" ref={el as React.RefObject<HTMLElement>}>
      --:--:--
    </b>
  );
}
