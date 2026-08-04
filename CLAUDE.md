# Napkin Design Co. - homepage port

## What this repo is
A finished, single-file homepage for Napkin Design Co. (a small web design + SEO studio) that needs to become a production Next.js site. The single file is the **source of truth**: `reference/napkin-design-co.html` opens directly in a browser and contains the final design, copy, motion, and behavior. Your job across sessions is to port it 1:1 into a Next.js App Router project in this repo, then extend it (new pages, contact route) without breaking the world.

Read before building anything: `PRODUCT.md` (product truth, real claims, brand commitments), `DESIGN.md` (tokens, type, motion, component grammar), `docs/napkin-design-co-site-prompt.md` and `docs/site-content-inventory.md` (the original client brief and content).

## Non-negotiables (from the client brief; these beat any refactor preference)
- All copy ships in real HTML at load. The site must be fully readable with JavaScript disabled (the reference has a working no-JS path; keep parity).
- Exactly one `h1` per page. Anchor ids stay stable: `top`, `receipts`, `work`, `services`, `process`, `team`, `faq`.
- One conversion, one label: every contact CTA is "Start a project" and is a `mailto:contact@napkindesign.co` link until a /contact route exists.
- Claims are uninventable. The only numbers allowed are the real ones in PRODUCT.md (0 to 29,885 impressions Apr 2 to Jul 26 2026; average position 7 for "real estate photographer near me"; under 4 months; zero backlink budget). Never add testimonials, client counts, or stats that do not exist.
- Zero em dashes and zero en dashes anywhere in copy, markup, alt text, aria labels, meta tags, or mailto subjects. Commas, periods, colons, or a single middle dot per metadata line. Date ranges read "Apr 2 to Jul 26, 2026". Check with: `grep -rP '[\x{2014}\x{2013}]' app components` (must return nothing).
- WCAG AA: use `--ballpoint-lite` (#7A93FF), never `--ballpoint` (#2B4DE0), for text or thin lines on the ink background.
- Reduced motion is a real alternate choreography (gentler fades, completed draws), never a blank page. Hover-driven motion is gated behind `@media (hover:hover) and (pointer:fine)`.

## The world (see DESIGN.md for full values)
Napkin to glass: everything important starts as a ballpoint stroke and resolves into glass. Dark single theme on `--ink-void:#0A0A0B`, paper type `#F2EFE6`, ballpoint accent. One type family, Archivo variable (wdth axis does display duty, 110 to 125), JetBrains Mono only where real data appears. Easings: `--ease-reveal: cubic-bezier(0.65,0.05,0,1)`, `--ease-ui: cubic-bezier(0.22,1,0.36,1)`. UI feedback under 200ms, `scale(.97)` on press, transform/opacity only, IntersectionObserver only (never scroll listeners).

## Behavior checklist to port (each has acceptance criteria in the reference)
1. Intro: ~3s logomark sketch, session-gated (plays once per session), click to skip, bypassed entirely by reduced-motion and no-JS.
2. Pen cursor + ink trail: fine pointers only; canvases sized from `getBoundingClientRect` (not `innerWidth`, scrollbars break alignment); never replaces focus outlines.
3. Hero: three-line lockup ("We make small / business / look huge.") sized with container queries, hand-drawn "actual size" arrow annotation, glass napkin card with self-drawing logomark and damped pointer tilt.
4. Meta strip: local clock + proof bar along the hero's bottom edge.
5. Receipts: three glass cards of the real Search Console data.
6. Work: three tiles; napkin sketch layer toggles on hover (fine pointers), tap, and focus-visible; `aria-expanded` tracked.
7. Services: six rows; scribble sweep + keycap plate resolve on hover, IntersectionObserver resolve on touch.
8. Marquee: the one tagline band ("sketch it. ship it. rank it."), max one marquee sitewide.
9. Process: four numbered steps (numbering is earned; it is a genuine sequence).
10. Guarantee: rotated paper card with the quote and ownership list.
11. FAQ: native `details/summary`, fast close, slightly slower open.
12. CTA: the LETS GO keycap as the mailto button with press physics (translateY + shadow collapse on `:active`).
13. Sketch mode: FAB bottom-right, native crosshair cursor, draw anywhere, strokes resolve to glass after a 2s pause, Esc exits, Clear appears once ink exists, `aria-pressed` + live status region.

## Porting guidance
- Scaffold: Next.js App Router + TypeScript. Styling: CSS Modules or a single global stylesheet mirroring the reference CSS; do not introduce Tailwind unless asked (the reference is vanilla and the tokens are custom properties).
- Fonts via `next/font/local` using `assets/fonts/ArchivoVariable-latin.woff2` (declare `weight: '100 900'`, the wdth axis is used through `font-variation-settings`) and the two JetBrains Mono files. `assets/fonts/subsets-used-in-reference/` holds the exact subsets embedded in the reference; regenerate with pyftsubset if copy gains new glyphs.
- Assets: `assets/logo/` (standalone SVGs plus the original brand files in `source/`), `assets/keycaps/` (optimized webp, already sized for the site).
- Isolate motion in small client components (intro, cursor/trail, tilt, sketch mode, reveals); sections themselves stay server components with real HTML content.
- Extract copy verbatim from the reference. Do not rewrite it.

## Skills in this repo (use them; they built this design)
Vendored under `.claude/skills/` with upstream licenses: **impeccable** (design direction, critique, polish, audit; agents in `.claude/agents/` including the finish reviewer), **design-taste-frontend** (anti-slop rules and the pre-flight checklist; its em-dash ban and tell list are law here), **emil-design-eng** (easing, duration, and interaction physics), **review-animations** (motion code review).
- Once per session before design work: `node .claude/skills/impeccable/scripts/context.mjs`
- Before shipping any visual change: run the design-taste-frontend Section 14 pre-flight and fix every failing box.
- After writing or changing motion code: invoke the review-animations skill on the diff.
- For new surfaces (a /contact page, blog): follow impeccable new-work; PRODUCT.md and DESIGN.md already exist, keep them updated.

## Definition of done for the port
- Side-by-side with the reference at 1440, 1024, 768, 390 widths: no visual or behavioral drift.
- `grep -rP '[\x{2014}\x{2013}]' app components` returns nothing.
- JS disabled: full content, resolved visuals, no dead UI. Reduced motion: gentle fades, no missing content.
- Keyboard-only pass: every interactive element reachable, visible focus, sketch mode operable and escapable.
- Lighthouse on the built site: LCP under 2.5s (intro is session-gated and skippable; first content paints beneath it), CLS under 0.1, no console errors.
