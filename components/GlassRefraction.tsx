'use client';

import { useEffect } from 'react';

/* Layer 1 refraction gate: Chromium gets feDisplacement through backdrop-filter:url().
   Safari and Firefox keep the blur + saturate + edge fallback. */
export default function GlassRefraction() {
  useEffect(() => {
    const ua = navigator.userAgent;
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    const isFF = /firefox/i.test(ua);
    if (!isSafari && !isFF && CSS.supports('backdrop-filter', 'url(#x)')) {
      document.documentElement.classList.add('can-refract');
    }
  }, []);

  return null;
}
