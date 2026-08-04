import { WORDMARK_VIEWBOX, LOGOMARK_VIEWBOX, WORDMARK_INNER, LOGOMARK_INNER } from './logo-paths';

/* svg defs: layer 1 refraction filter (Chromium), used via backdrop-filter:url()
   plus the two brand symbols every lockup on the page points at. */
export default function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="glass-refract">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves={2} seed={7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={14} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <symbol id="wordmark" viewBox={WORDMARK_VIEWBOX} dangerouslySetInnerHTML={{ __html: WORDMARK_INNER }} />
        <symbol id="logomark" viewBox={LOGOMARK_VIEWBOX} dangerouslySetInnerHTML={{ __html: LOGOMARK_INNER }} />
      </defs>
    </svg>
  );
}
