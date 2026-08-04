# DESIGN.md - Napkin Design Co.

Recorded from the shipped homepage (the merged build: original chassis and theatrics, skill-pass text). Port these values verbatim into the Next.js build.

## The world
Napkin to glass, played at full volume. Everything important starts as a ballpoint stroke and resolves into a refined glass surface: the intro sketches the logomark before the site appears (once per session, skippable), the hero card resolves it again in glass, services scribble out and refill on hover, work tiles hide their original napkin sketch behind the finished face, a marquee runs the tagline, a pen cursor with an ink trail follows fine pointers, and visitors can sketch on the page themselves. One theme (dark), one hero accent (ballpoint), one display family.

## Tokens (verbatim from :root)
```
--ink-void:#0A0A0B   --ink-soft:#121214
--napkin:#F2EFE6     --napkin-dim:#E7E3D6
--ballpoint:#2B4DE0  --ballpoint-lite:#7A93FF  (lines + text on ink; AA)
--bleed:#FF4A24      (keycap imagery + rare hot moments only)
--smoke:#8A8A94      --smoke-dim:#5A5A62
--glass-tint:rgba(255,255,255,0.06)
--hairline:rgba(242,239,230,0.14)
--ease-reveal:cubic-bezier(0.65,0.05,0,1)
--ease-ui:cubic-bezier(0.22,1,0.36,1)
--gutter:clamp(1.25rem,4vw,4rem)  --section:clamp(5.5rem,12vh,10rem)  --maxw:1440px
```

## Type
Self-hosted, embedded, zero CDN. One family for display AND body: Archivo variable (wght 100-900, wdth 62-125, latin subset). Display runs wdth 110-125 via font-variation-settings; body runs default width. JetBrains Mono 400 + 700 for meta strips, receipts, labels, and anything that is data. Inter is gone.

## Copy rules (the skill pass, kept)
Zero em or en dashes anywhere, source included; commas, periods, colons, or a middle dot do the work. One middle dot max per metadata line. Dates read "Apr 2 to Jul 26, 2026". No "Fig. 01" style plate labels. Single contact-intent label sitewide: "Start a project". Claims stay real: 0 to 29,885 impressions, average position 7, under 4 months, all from Search Console.

## The theatrical layer (deliberate, kept)
- Intro: about 3s, session-gated, click-to-skip, honest progress, reduced-motion and no-JS both bypass it.
- Pen cursor + ink trail: fine pointers only, canvas sized from getBoundingClientRect, never on touch.
- Marquee: one per page, the tagline band.
- Meta strip: local clock + proof bar along the hero's bottom edge.
- Eyebrows: mono section labels, one per section, plain language, no numbering.
- Sketch mode: FAB bottom-right, native crosshair, strokes resolve to glass after a 2s pause, Esc exits, Clear appears once ink exists.

## Component grammar
Hero: three-line lockup (small carries the hand-drawn "actual size" arrow, huge. at 125 width), 13-word sub, two CTAs, receipt line, glass napkin card with self-drawing mark and damped tilt. Receipts: three glass cards of real Search Console data. Work: three equal tiles, sketch layer on hover, tap, and focus. Services: six full-width rows, numbered, scribble sweep plus keycap plate resolve. Process: four numbered steps (a genuine sequence). Guarantee: the rotated paper card, quote plus ownership list. Team: three partners. FAQ: native details/summary. CTA: the LETS GO keycap with press physics.

## Non-negotiables
All copy in real HTML at load; works without JS; one h1; stable anchor ids; AA contrast (ballpoint-lite, never ballpoint, for text on ink); focus states never removed by the custom cursor; reduced motion is a real alternate choreography, not a kill switch.
